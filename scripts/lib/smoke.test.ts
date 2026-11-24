import { describe, expect, it } from "vitest";
import { webAnalyticsToken } from "../../src/lib/analytics";
import { securityHeaders } from "../../src/lib/security-headers";
import { normalizeBase, readAnalyticsToken, runSmoke } from "./smoke.mjs";

const PROD = "https://lab.cabrelfosso.com";
const secure = Object.fromEntries(securityHeaders.map(({ key, value }) => [key.toLowerCase(), value]));
const sitemap = `<?xml version="1.0"?><urlset>
<url><loc>${PROD}/fr</loc></url>
<url><loc>${PROD}/en/privacy</loc></url>
</urlset>`;

type Reply = { status?: number; headers?: Record<string, string>; body?: string };

const redirect = (location: string): Reply => ({
  status: 302,
  headers: { ...secure, location, vary: "Accept-Language", "cache-control": "no-store" },
});

/** Faux site : réponses par « MÉTHODE url » (avec la langue demandée pour la racine). */
function fakeSite(overrides: Record<string, Reply>, base: string) {
  const page: Reply = { headers: { ...secure, "content-type": "text/html" }, body: "<html></html>" };
  const png: Reply = { headers: { ...secure, "content-type": "image/png" } };
  const replies: Record<string, Reply> = {
    "GET /sitemap.xml": { headers: { ...secure, "content-type": "application/xml" }, body: sitemap },
    "GET /robots.txt": { headers: secure, body: `User-Agent: *\nAllow: /\nSitemap: ${PROD}/sitemap.xml\n` },
    "GET /fr": page,
    "GET /en/privacy": page,
    "GET /og/fr.png": png,
    "GET /og/en/privacy.png": png,
    "GET /?a=1 [en-US,en;q=0.9]": redirect("/en?a=1"),
    "GET /?a=1 [fr-CM]": redirect("/fr?a=1"),
    "GET /?a=1 []": redirect("/fr?a=1"),
    "HEAD /?a=1 [en-US,en;q=0.9]": redirect("/en?a=1"),
    "POST /": { status: 405, headers: { ...secure, allow: "GET, HEAD" } },
    "GET /adresse-inconnue": {
      status: 404,
      headers: { ...secure, "content-type": "text/html" },
      body: '<meta name="robots" content="noindex"/><h1>Page introuvable</h1><h2>Page not found</h2>',
    },
    ...overrides,
  };
  const requests: Array<{ method: string; url: string; agent: string; accept: string }> = [];
  const fetchFn = async (url: RequestInfo | URL, init: RequestInit = {}) => {
    const method = init.method ?? "GET";
    const { pathname, search, origin } = new URL(String(url));
    expect(origin).toBe(base);
    const language = new Headers(init.headers).get("accept-language");
    const key = `${method} ${pathname}${search}`;
    const headers = new Headers(init.headers);
    requests.push({
      method,
      url: String(url),
      agent: headers.get("user-agent") ?? "",
      accept: headers.get("accept") ?? "",
    });
    const reply = replies[pathname === "/" && method !== "POST" ? `${key} [${language ?? ""}]` : key] ?? { status: 404 };
    return new Response(method === "HEAD" ? null : (reply.body ?? ""), {
      status: reply.status ?? 200,
      headers: reply.headers,
    });
  };
  return { fetchFn, requests };
}

async function run(overrides: Record<string, Reply> = {}, base = PROD, analyticsToken: string | null = null) {
  const site = fakeSite(overrides, base);
  const result = await runSmoke({ baseUrl: base, fetchFn: site.fetchFn, analyticsToken });
  return { ...result, requests: site.requests };
}

describe("normalizeBase", () => {
  it("accepte une adresse http(s) et retire la barre finale", () => {
    expect(normalizeBase("http://localhost:8787/")).toBe("http://localhost:8787");
    expect(normalizeBase(PROD)).toBe(PROD);
  });

  it.each([undefined, "", "lab.cabrelfosso.com", "ftp://x.y"])("refuse %j", (value) => {
    expect(() => normalizeBase(value)).toThrow(/Adresse/);
  });
});

describe("vérification d'un site servi", () => {
  it.each([PROD, "http://localhost:8787"])("réussit sur un site conforme (%s)", async (base) => {
    const { failures, requests } = await run({}, base);
    expect(failures).toEqual([]);
    expect(requests.map((r) => r.url)).toContain(`${base}/en/privacy`);
  });

  it("n'envoie que des GET et des HEAD, plus un seul POST sur /", async () => {
    const { requests } = await run();
    const others = requests.filter((r) => !["GET", "HEAD"].includes(r.method));
    expect(others).toMatchObject([{ method: "POST", url: `${PROD}/` }]);
  });

  it.each<[string, Record<string, Reply>, RegExp]>([
    ["une page du sitemap en erreur", { "GET /en/privacy": { status: 500 } }, /\/en\/privacy.*500/],
    ["un sitemap vide", { "GET /sitemap.xml": { body: "" } }, /sitemap/],
    ["une URL du sitemap hors HTTPS", { "GET /sitemap.xml": { body: "<loc>http://x.y/fr</loc>" } }, /HTTPS/],
    ["robots.txt sans sitemap", { "GET /robots.txt": { body: "User-Agent: *" } }, /robots/],
    ["une page sans CSP", { "GET /fr": { headers: { ...secure, "content-security-policy": "" } } }, /\/fr.*content-security-policy/],
    ["une racine qui ignore la langue", { "GET /?a=1 [en-US,en;q=0.9]": redirect("/fr?a=1") }, /en-US.*\/fr/],
    ["une racine qui perd la requête", { "GET /?a=1 []": redirect("/fr") }, /sans langue/],
    ["une racine mise en cache", { "GET /?a=1 []": { status: 302, headers: { ...secure, location: "/fr?a=1", vary: "Accept-Language" } } }, /cache-control/],
    ["une racine sans en-têtes de sécurité", { "GET /?a=1 []": { status: 302, headers: { location: "/fr?a=1", vary: "Accept-Language", "cache-control": "no-store" } } }, /x-frame-options/],
    ["un POST accepté sur /", { "POST /": { status: 200 } }, /POST.*200/],
    ["une 404 sans anglais", { "GET /adresse-inconnue": { status: 404, body: "Page introuvable" } }, /404/],
    ["une adresse inconnue en 200", { "GET /adresse-inconnue": { body: "noindex Page introuvable Page not found" } }, /404/],
    ["une image de partage absente", { "GET /og/en/privacy.png": { status: 404 } }, /og\/en\/privacy/],
  ])("signale %s", async (_name, overrides, message) => {
    expect((await run(overrides)).failures.join("\n")).toMatch(message);
  });
});

describe("mesure d'audience (cahier, section 6)", () => {
  const beacon = (token: string) =>
    `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${token}"}'></script>`;
  const page = (body: string): Reply => ({ headers: { ...secure, "content-type": "text/html" }, body });
  const all = (body: string) => ({ "GET /fr": page(body), "GET /en/privacy": page(body) });

  it("demande les pages comme un navigateur : Cloudflare n'injecte son script que dans ce cas", async () => {
    const { requests } = await run();
    for (const path of ["/fr", "/en/privacy"]) {
      const request = requests.find((r) => r.url === PROD + path);
      expect(request?.agent).toMatch(/^Mozilla\/5\.0 .*Chrome\//);
      expect(request?.accept).toContain("text/html");
    }
  });

  it("sans jeton : échoue si une page contient un script de mesure", async () => {
    const { failures } = await run({ "GET /en/privacy": page(beacon("autre")) });
    expect(failures.join("\n")).toMatch(/\/en\/privacy.*cloudflareinsights/);
    expect((await run()).failures).toEqual([]);
  });

  it("avec un jeton : exactement un extrait par page", async () => {
    expect((await run(all(beacon("jeton")), PROD, "jeton")).failures).toEqual([]);
    expect((await run({}, PROD, "jeton")).failures.join("\n")).toMatch(/0 extrait/);
    expect((await run(all(beacon("jeton") + beacon("autre")), PROD, "jeton")).failures.join("\n")).toMatch(/2 extraits/);
    expect((await run(all(beacon("autre")), PROD, "jeton")).failures.join("\n")).toMatch(/jeton/);
  });

  it("lit le jeton dans src/lib/analytics.ts", () => {
    expect(readAnalyticsToken('export const webAnalyticsToken: string | null = null;')).toBeNull();
    expect(readAnalyticsToken('export const webAnalyticsToken: string | null = "abc123";')).toBe("abc123");
    expect(() => readAnalyticsToken("rien")).toThrow(/webAnalyticsToken/);
    expect(readAnalyticsToken()).toBe(webAnalyticsToken);
  });
});
