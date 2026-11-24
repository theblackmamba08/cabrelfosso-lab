/** Résultat de la construction (out/), avant toute mise en ligne. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { webAnalyticsToken } from "../../src/lib/analytics";

const out = new URL("../../out/", import.meta.url);
const file = (path: string) => new URL(path, out);
const read = (path: string) => readFileSync(file(path), "utf8");

describe("pages exportées", () => {
  it.each(["fr.html", "en.html", "fr/confidentialite.html", "en/privacy.html", "404.html"])("%s existe", (path) => {
    expect(existsSync(file(path))).toBe(true);
  });

  it.each([
    "en/confidentialite.html",
    "fr/privacy.html",
    "fr/physique.html",
    "en/physics.html",
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
    const pages = readdirSync(out, { recursive: true, encoding: "utf8" }).filter((name) => /\.(html|txt|xml)$/.test(name));
    expect(pages.length).toBeGreaterThanOrEqual(5);
    for (const page of pages) expect(read(page.replaceAll("\\", "/")), page).not.toContain("TODO");
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

  it.each(["fr.html", "en.html", "fr/confidentialite.html", "en/privacy.html", "404.html"])(
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
    for (const path of ["fr.html", "en.html", "fr/confidentialite.html", "en/privacy.html"]) {
      expect(read(path), path).not.toMatch(/href="[^"]*_not-found/);
    }
  });
});

describe("images de partage", () => {
  it.each(["og/fr.png", "og/en.png", "og/fr/confidentialite.png", "og/en/privacy.png"])(
    "%s est un PNG de 1200 × 630",
    (path) => {
      const bytes = readFileSync(file(path));
      expect(bytes.subarray(1, 4).toString("latin1")).toBe("PNG");
      expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
    },
  );

  it("il n’y en a pas d’autre", () => {
    const images = readdirSync(file("og/"), { recursive: true, encoding: "utf8" }).filter((name) => name.endsWith(".png"));
    expect(images).toHaveLength(4);
  });
});

describe("sitemap.xml et robots.txt", () => {
  it("le sitemap liste les quatre adresses, avec leurs équivalents", () => {
    const xml = read("sitemap.xml");
    expect([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual([
      "https://lab.cabrelfosso.com/fr",
      "https://lab.cabrelfosso.com/en",
      "https://lab.cabrelfosso.com/fr/confidentialite",
      "https://lab.cabrelfosso.com/en/privacy",
    ]);
    expect(xml.match(/<xhtml:link /g)).toHaveLength(12);
    expect(xml).toContain('hreflang="x-default" href="https://lab.cabrelfosso.com/fr/confidentialite"');
  });

  it("robots.txt autorise tout et donne le sitemap", () => {
    const robots = read("robots.txt");
    expect(robots).toMatch(/User-Agent: \*\nAllow: \/\n/i);
    expect(robots).not.toMatch(/Disallow/i);
    expect(robots).toContain("Sitemap: https://lab.cabrelfosso.com/sitemap.xml");
  });
});
