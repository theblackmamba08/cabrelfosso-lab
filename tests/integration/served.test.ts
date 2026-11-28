/** Site servi par `wrangler dev` : le vrai Worker et les fichiers statiques. */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { webAnalyticsToken } from "../../src/lib/analytics";
import { securityHeaders } from "../../src/lib/security-headers";

const baseUrl = process.env.TEST_SITE_URL ?? "http://localhost:8787";
const site = "https://lab.cabrelfosso.com";

function request(path: string, init: RequestInit = {}) {
  return fetch(new URL(path, baseUrl), { redirect: "manual", ...init });
}

function location(response: Response) {
  const { pathname, search } = new URL(response.headers.get("location") ?? "", baseUrl);
  return pathname + search;
}

function expectSecurity(response: Response) {
  for (const { key, value } of securityHeaders) expect(response.headers.get(key), key).toBe(value);
}

const pages = [
  ["/fr", "fr", "Comprendre la physique"],
  ["/en", "en", "Understand physics"],
  ["/fr/confidentialite", "fr", "Confidentialité"],
  ["/en/privacy", "en", "Privacy"],
  ["/fr/physique", "fr", "Physique"],
  ["/en/physics", "en", "Physics"],
  ["/fr/physique/projectile", "fr", "Le mouvement d’un projectile"],
  ["/en/physics/projectile", "en", "Projectile motion"],
  ["/fr/physique/pendule-de-newton", "fr", "Le pendule de Newton"],
  ["/en/physics/newtons-cradle", "en", "Newton’s cradle"],
  ["/fr/informatique", "fr", "Informatique"],
  ["/en/computing", "en", "Computing"],
  ["/fr/informatique/transition-de-phase-3-sat", "fr", "La transition de phase de 3-SAT"],
  ["/en/computing/3-sat-phase-transition", "en", "The 3-SAT phase transition"],
  ["/fr/physique/refraction", "fr", "La réfraction de la lumière"],
  ["/en/physics/refraction", "en", "Refraction of light"],
  ["/fr/informatique/pensez-a-un-nombre", "fr", "Pensez à un nombre"],
  ["/en/computing/think-of-a-number", "en", "Think of a number"],
  ["/fr/physique/lentille-convergente", "fr", "La lentille convergente"],
  ["/en/physics/converging-lens", "en", "The converging lens"],
  ["/fr/informatique/calculer-pi", "fr", "Calculer π avec le hasard"],
  ["/en/computing/estimating-pi", "en", "Estimating π by chance"],
] as const;

describe("racine", () => {
  it.each([
    ["en-US,en;q=0.9", "/en"],
    ["fr-CM", "/fr"],
    // Le client HTTP de Node.js envoie « * » quand on ne donne pas l'en-tête : vide, ici.
    ["", "/fr"],
  ])("Accept-Language « %s » → %s", async (language, target) => {
    const response = await request("/", { headers: { "accept-language": language } });
    expect(response.status).toBe(302);
    expect(location(response)).toBe(target);
    expect(response.headers.get("vary")).toContain("Accept-Language");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expectSecurity(response);
  });

  it("sans en-tête Accept-Language → /fr", async () => {
    const response = await request("/");
    expect(response.status).toBe(302);
    expect(location(response)).toBe("/fr");
  });

  it("conserve la chaîne de requête, en GET comme en HEAD", async () => {
    for (const method of ["GET", "HEAD"]) {
      const response = await request("/?a=1", { method });
      expect(response.status).toBe(302);
      expect(location(response)).toBe("/fr?a=1");
    }
  });

  it("refuse POST", async () => {
    const response = await request("/", { method: "POST", body: "" });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
    expectSecurity(response);
  });
});

describe.each(pages)("%s", (path, lang, words) => {
  it("répond 200 dans sa langue, avec les en-têtes de sécurité de public/_headers", async () => {
    const response = await request(path);
    expect(response.status).toBe(200);
    expectSecurity(response);
    expect(response.headers.get("content-type")).toMatch(/text\/html/);
    const html = await response.text();
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toContain(words);
    expect(html).not.toContain("TODO");
  });

  it("a une URL canonique, ses équivalents, son image de partage et le nom du site", async () => {
    const html = await (await request(path)).text();
    expect(html).toContain(`<link rel="canonical" href="${site}${path}"/>`);
    for (const hreflang of ["fr", "en", "x-default"]) {
      expect(html).toMatch(new RegExp(`<link rel="alternate" hrefLang="${hreflang}" href="${site}/(fr|en)`));
    }
    expect(html).toContain(`<meta property="og:image" content="${site}/og${path}.png"/>`);
    expect(html).toContain(`<meta property="og:locale" content="${lang === "fr" ? "fr_FR" : "en_US"}"/>`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"/>');
    expect((await request(`/og${path}.png`)).headers.get("content-type")).toBe("image/png");
  });

  it("aucun lien interne mort ; lien d’évitement vers le contenu", async () => {
    const html = await (await request(path)).text();
    const links = new Set([...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((m) => m[1]));
    expect(links.size).toBeGreaterThan(1);
    for (const link of links) expect((await request(link)).status, link).toBe(200);
    expect(html).toMatch(/<a\b[^>]*href="#contenu"/);
    expect(html).toMatch(/<main\b[^>]*id="contenu"/);
  });

  it("applique le thème depuis <head>, sans police externe ; l’extrait de mesure suit le jeton", async () => {
    const html = await (await request(path)).text();
    expect(html.slice(0, html.indexOf("</head>"))).toContain("dataset.theme");
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html.includes("data-cf-beacon")).toBe(webAnalyticsToken !== null);
  });

  it("répond aussi avec une barre finale, par une redirection", async () => {
    const response = await request(`${path}/`);
    expect([301, 302, 307, 308]).toContain(response.status);
    expect(location(response)).toBe(path);
  });
});

it("le sélecteur de langue mène à la même page dans l’autre langue", async () => {
  const html = await (await request("/fr/confidentialite")).text();
  expect(html).toMatch(/<a [^>]*href="\/en\/privacy"[^>]*hrefLang="en"/);
});

it("le sélecteur de langue mène à la même expérience dans l’autre langue", async () => {
  const html = await (await request("/fr/physique/pendule-de-newton")).text();
  expect(html).toMatch(/<a [^>]*href="\/en\/physics\/newtons-cradle"[^>]*hrefLang="en"/);
  const threeSat = await (await request("/fr/informatique/transition-de-phase-3-sat")).text();
  expect(threeSat).toMatch(/<a [^>]*href="\/en\/computing\/3-sat-phase-transition"[^>]*hrefLang="en"/);
});

it("le menu signale la page Physique, et elle seule (aria-current)", async () => {
  const menu = async (path: string) =>
    (await (await request(path)).text()).match(/<nav aria-label="Menu principal"[\s\S]*?<\/nav>/)?.[0] ?? "";
  expect(await menu("/fr/physique")).toContain('aria-current="page"');
  expect(await menu("/fr/physique/projectile")).not.toContain("aria-current");
  expect(await menu("/fr")).toContain('href="/fr/physique"');
});

describe("adresses inconnues ou non publiées", () => {
  it.each([
    "/n-importe-quoi",
    "/en/informatique",
    "/fr/computing",
    "/en/computing/transition-de-phase-3-sat",
    "/fr/informatique/3-sat-phase-transition",
    "/fr/informatique/projectile",
    "/en/computing/pensez-a-un-nombre",
    "/fr/informatique/think-of-a-number",
    "/fr/informatique/refraction",
    "/en/computing/calculer-pi",
    "/fr/physique/converging-lens",
    "/en/physics/pendule-de-newton",
    "/fr/physique/newtons-cradle",
    "/fr/physique/inconnu",
    "/fr/confidentialite/projectile",
    "/en/confidentialite",
    "/fr/privacy",
    "/de",
    "/fr/confidentialite/x",
    "/og/fr/informatique/inconnu.png",
  ])("%s : 404 bilingue", async (path) => {
    const response = await request(path);
    expect(response.status).toBe(404);
    expectSecurity(response);
    const html = await response.text();
    expect(html).toContain("Page introuvable");
    expect(html).toContain("Page not found");
    expect(html).toContain("noindex");
  });

  it("une navigation vers une adresse inconnue répond aussi 404", async () => {
    const response = await request("/n-importe-quoi", { headers: { "sec-fetch-mode": "navigate" } });
    expect(response.status).toBe(404);
  });
});

it("/_not-found, fichier technique de Next.js, répond avec noindex", async () => {
  expect(await (await request("/_not-found")).text()).toContain('<meta name="robots" content="noindex"/>');
});

describe("autres fichiers", () => {
  it.each([
    ["/sitemap.xml", /xml/],
    ["/robots.txt", /text\/plain/],
    ["/og/fr.png", /image\/png/],
    ["/icon.svg", /image\/svg\+xml/],
    ["/favicon.ico", /image/],
    ["/apple-touch-icon.png", /image\/png/],
  ])("%s", async (path, type) => {
    const response = await request(path);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(type);
    expectSecurity(response);
  });

  it("fichiers de construction : en-têtes de sécurité et cache long", async () => {
    const html = readFileSync(new URL("../../out/fr.html", import.meta.url), "utf8");
    const chunk = html.match(/\/_next\/static\/[^"]+\.js/)?.[0];
    const response = await request(chunk ?? "");
    expect(response.status).toBe(200);
    expectSecurity(response);
    expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
  });

  it("Web Worker de 3-SAT : servi par le site, en JavaScript, avec les en-têtes de sécurité", async () => {
    const chunks = new URL("../../out/_next/static/chunks/", import.meta.url);
    const workers = readdirSync(chunks).filter((name) => name.startsWith("turbopack-worker-"));
    expect(workers).toHaveLength(1);
    const response = await request(`/_next/static/chunks/${workers[0]}`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/javascript/);
    expectSecurity(response);
  });

  it("_headers n’est pas servi", async () => {
    expect((await request("/_headers")).status).toBe(404);
  });
});

// Adresses que le navigateur précharge (next/link) : mal nommées par un export fait sous Windows.
describe("fichiers de préchargement", () => {
  it.each([
    "/fr/__next.%24d%24lang.__PAGE__.txt",
    "/en/privacy/__next.%24d%24lang.%24d%24section.__PAGE__.txt",
    "/fr/physique/projectile/__next.%24d%24lang.%24d%24section.%24d%24experiment.__PAGE__.txt",
    "/fr/__next._tree.txt",
    "/fr.txt",
  ])("%s répond 200", async (path) => {
    expect((await request(path)).status).toBe(200);
  });
});
