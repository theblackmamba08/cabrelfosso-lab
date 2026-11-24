import { describe, expect, it } from "vitest";
import { classify, extractIds, extractLinks, runLinkcheck } from "./linkcheck.mjs";

const PAGE = "https://lab.cabrelfosso.com/fr/recherche";

describe("extractLinks", () => {
  const urls = (html: string) => extractLinks(html, PAGE).map((link: { url: string }) => link.url);

  it("relève les liens, images, scripts et feuilles de style, en adresses absolues", () => {
    const html = `<html><head>
      <link rel="stylesheet" href="/_next/static/chunks/a.css" data-precedence="next"/>
      <script src="/_next/static/chunks/b.js" async=""></script>
    </head><body>
      <a href="/fr/parcours">Parcours</a>
      <a class="x" href="contact">Contact</a>
      <img alt="" src="/photo.png"/>
    </body></html>`;
    expect(urls(html)).toEqual([
      "https://lab.cabrelfosso.com/_next/static/chunks/a.css",
      "https://lab.cabrelfosso.com/_next/static/chunks/b.js",
      "https://lab.cabrelfosso.com/fr/parcours",
      "https://lab.cabrelfosso.com/fr/contact",
      "https://lab.cabrelfosso.com/photo.png",
    ]);
  });

  it("indique la nature de chaque lien", () => {
    const html = `<link rel="canonical" href="https://lab.cabrelfosso.com/fr"/>
      <link rel="alternate" hrefLang="en" href="https://lab.cabrelfosso.com/en"/>
      <link rel="icon" href="/icon.svg" type="image/svg+xml"/>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
      <meta property="og:image" content="https://lab.cabrelfosso.com/og/fr.png"/>
      <meta name="twitter:image" content="https://lab.cabrelfosso.com/og/fr.png"/>
      <link rel="stylesheet" href="/a.css"/><script src="/b.js"></script>
      <a href="/fr">Accueil</a><img src="/c.png" srcset="/c-1x.png 1x, /c-2x.png 2x"/>`;
    expect(extractLinks(html, PAGE).map((link: { kind: string }) => link.kind)).toEqual([
      "canonical",
      "alternate",
      "icon",
      "icon",
      "og:image",
      "twitter:image",
      "stylesheet",
      "script",
      "a",
      "img",
      "srcset",
      "srcset",
    ]);
  });

  it("décode les entités et découpe srcset (images de next/image)", () => {
    const html = `<img srcset="/_next/image?url=%2Fa.png&amp;w=640&amp;q=75 640w, /_next/image?url=%2Fa.png&amp;w=1080&amp;q=75 1080w" src="/_next/image?url=%2Fa.png&amp;w=1080&amp;q=75"/>
      <source srcset="/b.webp 1x"/>`;
    expect(urls(html)).toEqual([
      "https://lab.cabrelfosso.com/_next/image?url=%2Fa.png&w=1080&q=75",
      "https://lab.cabrelfosso.com/_next/image?url=%2Fa.png&w=640&q=75",
      "https://lab.cabrelfosso.com/_next/image?url=%2Fa.png&w=1080&q=75",
      "https://lab.cabrelfosso.com/b.webp",
    ]);
  });

  it("garde les ancres, mailto et tel, et rattache #id à la page", () => {
    const html = `<a href="#contenu">Aller au contenu</a><a href="/fr#services">Services</a>
      <a href="mailto:contact@cabrelfosso.com">E-mail</a><a href="tel:+33100000000">Tél.</a>`;
    expect(urls(html)).toEqual([
      "https://lab.cabrelfosso.com/fr/recherche#contenu",
      "https://lab.cabrelfosso.com/fr#services",
      "mailto:contact@cabrelfosso.com",
      "tel:+33100000000",
    ]);
  });

  it("ignore le contenu des scripts, des styles et des commentaires", () => {
    const html = `<script>self.__next_f.push([1,"<a href=\\"/faux\\">"])</script>
      <style>a[href="/faux-css"]{}</style><!-- <a href="/commentaire">x</a> -->
      <a href="/vrai">vrai</a>`;
    expect(urls(html)).toEqual(["https://lab.cabrelfosso.com/vrai"]);
  });

  it("ignore les liens sans adresse, javascript: et data:", () => {
    const html = `<a>vide</a><a href="">rien</a><a href="javascript:void(0)">js</a><img src="data:image/png;base64,AAAA"/>`;
    expect(urls(html)).toEqual([]);
  });

  it("ne relève pas les autres balises link (preload)", () => {
    const html = `<link rel="preload" href="/font.woff2" as="font"/>`;
    expect(urls(html)).toEqual([]);
  });
});

describe("extractIds", () => {
  it("relève les id des éléments, hors scripts et commentaires", () => {
    const html = `<main id="contenu"><section id='services' class="x"></section>
      <div data-id="pas-ceci"></div><!-- <p id="commentaire"></p> -->
      <script>document.getElementById("dans-script")</script><h2 id="a-propos">À propos</h2></main>`;
    expect([...extractIds(html)]).toEqual(["contenu", "services", "a-propos"]);
  });

  it("décode les entités des id", () => {
    expect([...extractIds(`<p id="a&amp;b"></p>`)]).toEqual(["a&b"]);
  });
});

describe("classify", () => {
  const base = "https://lab.cabrelfosso.com";
  it("sépare liens internes, externes (dont le portfolio), mailto et tel", () => {
    expect(classify("https://lab.cabrelfosso.com/fr", base)).toBe("internal");
    expect(classify("https://cabrelfosso.com/fr", base)).toBe("external");
    expect(classify("https://www.linkedin.com/in/x", base)).toBe("external");
    expect(classify("mailto:contact@cabrelfosso.com", base)).toBe("mailto");
    expect(classify("tel:+237", base)).toBe("tel");
  });

  it("hors production, les adresses du domaine de production restent internes", () => {
    expect(classify("http://localhost:8787/fr", "http://localhost:8787")).toBe("internal");
    expect(classify("https://lab.cabrelfosso.com/fr", "http://localhost:8787")).toBe("internal");
  });
});

type Reply = { status?: number; headers?: Record<string, string>; body?: string };

const html = (body: string): Reply => ({ headers: { "content-type": "text/html; charset=utf-8" }, body });
const sitemap = (...paths: string[]): Reply => ({
  headers: { "content-type": "application/xml" },
  body: `<?xml version="1.0"?><urlset>${paths.map((p) => `<url><loc>https://lab.cabrelfosso.com${p}</loc></url>`).join("")}</urlset>`,
});

function fakeSite(replies: Record<string, Reply>) {
  const requests: Array<{ url: string; headers: Record<string, string> }> = [];
  const fetchFn = async (url: RequestInfo | URL, init: RequestInit = {}) => {
    requests.push({ url: String(url), headers: (init.headers ?? {}) as Record<string, string> });
    const reply = replies[String(url)];
    if (!reply) throw new Error("getaddrinfo ENOTFOUND");
    // Objet simple plutôt que Response : LinkedIn répond 999, hors de la plage admise par Response.
    return {
      status: reply.status ?? 200,
      headers: new Headers(reply.headers),
      text: async () => reply.body ?? "",
      body: null,
    } as unknown as Response;
  };
  return { fetchFn, requests };
}

async function run(replies: Record<string, Reply>, baseUrl = "https://lab.cabrelfosso.com") {
  const site = fakeSite(replies);
  const result = await runLinkcheck({ baseUrl, fetchFn: site.fetchFn, sleep: async () => {} });
  return { ...result, requests: site.requests };
}

describe("runLinkcheck", () => {
  const healthy = {
    "https://lab.cabrelfosso.com/sitemap.xml": sitemap("/fr", "/fr/contact"),
    "https://lab.cabrelfosso.com/fr": html(
      `<main id="contenu"><a href="#contenu">Aller</a><a href="/fr/contact">Contact</a>
       <a href="/fr/contact?subject=phd#formulaire">Thèse</a><img src="/og/fr.png"/>
       <a href="https://www.linkedin.com/in/x">LinkedIn</a><a href="mailto:contact@cabrelfosso.com">E-mail</a></main>`,
    ),
    "https://lab.cabrelfosso.com/fr/contact": html(
      `<form id="formulaire"></form><a href="/fr">Accueil</a><a href="https://www.linkedin.com/in/x">LinkedIn</a>`,
    ),
    "https://lab.cabrelfosso.com/fr/contact?subject=phd": html(`<form id="formulaire"></form>`),
    "https://lab.cabrelfosso.com/og/fr.png": { headers: { "content-type": "image/png" } },
    "https://www.linkedin.com/in/x": { status: 999 },
  };

  it("réussit sur un site sain : liens externes listés sans faire échouer", async () => {
    const result = await run(healthy);
    expect(result.failures).toEqual([]);
    expect(result.pages).toBe(2);
    expect(result.external).toEqual([{ url: "https://www.linkedin.com/in/x", status: 999, ok: false, from: ["/fr", "/fr/contact"] }]);
    expect(result.mailto).toEqual(["mailto:contact@cabrelfosso.com"]);
  });

  it("demande chaque adresse une seule fois, avec un User-Agent qui identifie le script", async () => {
    const { requests } = await run(healthy);
    const urls = requests.map((r) => r.url);
    expect(urls.length).toBe(new Set(urls).size);
    expect(urls).not.toContain("mailto:contact@cabrelfosso.com");
    for (const request of requests) expect(request.headers["user-agent"]).toMatch(/cabrelfosso-lab-linkcheck/);
  });

  it("échoue sur un lien interne qui ne répond pas 200", async () => {
    const result = await run({ ...healthy, "https://lab.cabrelfosso.com/og/fr.png": { status: 404 } });
    expect(result.failures).toEqual([
      { url: "https://lab.cabrelfosso.com/og/fr.png", reason: "statut 404", from: ["/fr"] },
    ]);
  });

  it("échoue sur une redirection interne", async () => {
    const result = await run({
      ...healthy,
      "https://lab.cabrelfosso.com/fr/contact?subject=phd": { status: 307, headers: { location: "/fr/contact" } },
    });
    expect(result.failures.map((f: { reason: string }) => f.reason)).toEqual(["statut 307 vers /fr/contact"]);
  });

  it("échoue sur une page du sitemap absente", async () => {
    const result = await run({ ...healthy, "https://lab.cabrelfosso.com/fr/contact": { status: 500 } });
    expect(result.failures).toContainEqual({ url: "https://lab.cabrelfosso.com/fr/contact", reason: "statut 500", from: ["sitemap.xml", "/fr"] });
  });

  it("échoue sur une ancre dont l'élément n'existe pas dans la page cible", async () => {
    const result = await run({
      ...healthy,
      "https://lab.cabrelfosso.com/fr/contact?subject=phd": html(`<form id="autre"></form>`),
    });
    expect(result.failures).toEqual([
      { url: "https://lab.cabrelfosso.com/fr/contact?subject=phd#formulaire", reason: "ancre #formulaire absente", from: ["/fr"] },
    ]);
  });

  it("signale les pages internes hors sitemap sans échouer", async () => {
    const result = await run({
      ...healthy,
      "https://lab.cabrelfosso.com/fr/contact": html(`<form id="formulaire"></form><a href="/fr/cache">Cachée</a>`),
      "https://lab.cabrelfosso.com/fr/cache": html(`<p>page</p>`),
    });
    expect(result.failures).toEqual([]);
    expect(result.outOfSitemap).toEqual([{ url: "https://lab.cabrelfosso.com/fr/cache", from: ["/fr/contact"] }]);
  });

  it("note l'erreur réseau d'un lien externe sans échouer", async () => {
    const result = await run({
      ...healthy,
      "https://www.linkedin.com/in/x": undefined as unknown as Reply,
    });
    expect(result.failures).toEqual([]);
    expect(result.external[0]).toMatchObject({ status: "getaddrinfo ENOTFOUND", ok: false });
  });

  it("hors production, ramène les adresses du domaine de production vers l'adresse testée", async () => {
    const local = Object.fromEntries(
      Object.entries(healthy).map(([url, reply]) => [url.replace("https://lab.cabrelfosso.com", "http://localhost:8787"), reply]),
    );
    const result = await run(local, "http://localhost:8787");
    expect(result.failures).toEqual([]);
    expect(result.pages).toBe(2);
  });

  it("échoue clairement si le sitemap est absent ou vide", async () => {
    await expect(run({})).rejects.toThrow(/sitemap/);
  });
});
