/** Résultat de la construction (out/), avant toute mise en ligne. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { publishedPaths } from "../../src/i18n/published";
import { webAnalyticsToken } from "../../src/lib/analytics";

const out = new URL("../../out/", import.meta.url);
const file = (path: string) => new URL(path, out);
const read = (path: string) => readFileSync(file(path), "utf8");
/** Fichiers des pages publiées. */
const pages = publishedPaths().map((path) => `${path.slice(1)}.html`);
const experiments = [
  "fr/physique/projectile.html",
  "en/physics/projectile.html",
  "fr/physique/pendule-de-newton.html",
  "en/physics/newtons-cradle.html",
];

describe("pages exportées", () => {
  it.each([
    "fr.html",
    "en.html",
    "fr/confidentialite.html",
    "en/privacy.html",
    "fr/physique.html",
    "en/physics.html",
    ...experiments,
    "404.html",
  ])("%s existe", (path) => {
    expect(existsSync(file(path))).toBe(true);
  });

  it.each([
    "en/confidentialite.html",
    "fr/privacy.html",
    "en/physics/pendule-de-newton.html",
    "fr/physique/newtons-cradle.html",
    "en/physique.html",
    "fr/physics.html",
    "fr/informatique.html",
    "en/computing.html",
    "index.html",
  ])("%s n’existe pas", (path) => {
    expect(existsSync(file(path))).toBe(false);
  });

  it("chaque page annonce sa langue", () => {
    expect(read("fr/confidentialite.html")).toMatch(/<html lang="fr"/);
    expect(read("en/privacy.html")).toMatch(/<html lang="en"/);
  });

  it("aucun marqueur TODO dans les pages", () => {
    const files = readdirSync(out, { recursive: true, encoding: "utf8" }).filter((name) => /\.(html|txt|xml)$/.test(name));
    expect(files.length).toBeGreaterThanOrEqual(11);
    for (const page of files) expect(read(page.replaceAll("\\", "/")), page).not.toContain("TODO");
  });
});

describe("page 404", () => {
  const html = read("404.html");

  it("est bilingue, avec un lien vers chaque accueil", () => {
    expect(html).toContain("Page introuvable");
    expect(html).toContain("Cette page n’existe pas ou a été déplacée.");
    expect(html).toMatch(/<a [^>]*href="\/fr"[^>]*>Retour à l’accueil du Labo<\/a>/);
    expect(html).toMatch(/<div lang="en"/);
    expect(html).toContain("This page doesn’t exist or has moved.");
    expect(html).toMatch(/<a [^>]*href="\/en"[^>]*>Back to the Lab’s home page<\/a>/);
  });

  it("est noindex, une seule fois, au design du site", () => {
    const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map((m) => m[1]);
    expect(robots).toEqual(["noindex"]);
    expect(html).toContain("dataset.theme");
    expect(html).toMatch(/rel="stylesheet"/);
  });
});

describe("mesure d’audience : l’extrait et son paragraphe vont ensemble", () => {
  const active = webAnalyticsToken !== null;

  it.each(["fr/confidentialite.html", "en/privacy.html"])("%s ne la décrit que si elle est active", (path) => {
    expect(read(path).includes("Cloudflare Web Analytics")).toBe(active);
  });

  it.each([...pages, "404.html"])(
    "%s ne charge l’extrait que si elle est active",
    (path) => {
      expect(read(path).includes("static.cloudflareinsights.com")).toBe(active);
    },
  );
});

describe("fichier technique /_not-found de Next.js (cahier, section 4)", () => {
  it("est gardé, en noindex", () => {
    expect(read("_not-found.html")).toContain('<meta name="robots" content="noindex"/>');
  });

  it("n’est ni dans le sitemap, ni lié depuis une page publiée", () => {
    expect(read("sitemap.xml")).not.toContain("_not-found");
    for (const path of pages) {
      expect(read(path), path).not.toMatch(/href="[^"]*_not-found/);
    }
  });
});

/** Code JavaScript cité par une page (balises et données de Next.js). */
const scripts = (path: string) =>
  [...new Set([...read(path).matchAll(/_next\/static\/chunks\/[\w.~-]+\.js/g)].map((m) => m[0]))].map(read).join("\n");

describe("code des simulations, chargé seulement sur sa page", () => {
  // Chaînes propres à projectile/physics.ts et à newtons-cradle/newtons-cradle-demo.tsx.
  const projectile = "earth:9.8,moon:1.6,mars:3.7";
  const cradle = "aide-restitution";

  it.each(["fr.html", "en.html", "fr/physique.html", "en/physics.html", "fr/confidentialite.html"])("%s : aucun", (path) => {
    expect(scripts(path).length).toBeGreaterThan(1000);
    expect(scripts(path)).not.toContain(projectile);
    expect(scripts(path)).not.toContain(cradle);
  });

  it.each(experiments)("%s : le sien seulement", (path) => {
    expect(scripts(path).includes(projectile)).toBe(path.includes("projectile"));
    expect(scripts(path).includes(cradle)).toBe(!path.includes("projectile"));
  });

  it.each(experiments)("%s : réglages et résultats déjà dans le HTML, sans JavaScript", (path) => {
    expect(read(path)).toMatch(/<input[^>]*type="range"/);
    expect(read(path)).toMatch(/<svg[^>]*role="img"/);
  });
});

describe("sous-ensemble grec de JetBrains Mono", () => {
  const greek = /[α-ωΑ-Ω]/;
  const body = (path: string) => read(path).replace(/<script[\s\S]*?<\/script>/g, "");

  it("est publié, jamais préchargé", () => {
    const media = readdirSync(file("_next/static/media/")).filter((name) => /greek.*\.woff2$/.test(name));
    expect(media).toHaveLength(1);
    for (const path of pages) expect(read(path), path).not.toMatch(/<link[^>]*rel="preload"[^>]*greek/);
  });

  // Le navigateur ne télécharge une police que pour un caractère qu'elle seule contient.
  it("ne sert que sur les pages d’expérience : aucune lettre grecque ailleurs", () => {
    for (const path of pages) expect(greek.test(body(path)), path).toBe(experiments.includes(path));
  });
});

describe("images de partage", () => {
  it.each(publishedPaths().map((path) => `og${path}.png`))(
    "%s est un PNG de 1200 × 630",
    (path) => {
      const bytes = readFileSync(file(path));
      expect(bytes.subarray(1, 4).toString("latin1")).toBe("PNG");
      expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
    },
  );

  it("il n’y en a pas d’autre", () => {
    const images = readdirSync(file("og/"), { recursive: true, encoding: "utf8" }).filter((name) => name.endsWith(".png"));
    expect(images).toHaveLength(10);
  });
});

describe("sitemap.xml et robots.txt", () => {
  it("le sitemap liste les dix adresses, avec leurs équivalents", () => {
    const xml = read("sitemap.xml");
    expect([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual([
      "https://lab.cabrelfosso.com/fr",
      "https://lab.cabrelfosso.com/en",
      "https://lab.cabrelfosso.com/fr/confidentialite",
      "https://lab.cabrelfosso.com/en/privacy",
      "https://lab.cabrelfosso.com/fr/physique",
      "https://lab.cabrelfosso.com/en/physics",
      "https://lab.cabrelfosso.com/fr/physique/projectile",
      "https://lab.cabrelfosso.com/en/physics/projectile",
      "https://lab.cabrelfosso.com/fr/physique/pendule-de-newton",
      "https://lab.cabrelfosso.com/en/physics/newtons-cradle",
    ]);
    expect(xml.match(/<xhtml:link /g)).toHaveLength(30);
    expect(xml).toContain('hreflang="x-default" href="https://lab.cabrelfosso.com/fr/confidentialite"');
  });

  it("robots.txt autorise tout et donne le sitemap", () => {
    const robots = read("robots.txt");
    expect(robots).toMatch(/User-Agent: \*\nAllow: \/\n/i);
    expect(robots).not.toMatch(/Disallow/i);
    expect(robots).toContain("Sitemap: https://lab.cabrelfosso.com/sitemap.xml");
  });
});
