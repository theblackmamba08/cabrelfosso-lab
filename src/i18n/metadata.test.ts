import { describe, expect, it } from "vitest";
import { locales } from "./config";
import en from "./messages/en";
import fr from "./messages/fr";
import { pageMetadata, pageTexts, shareImagePath } from "./metadata";
import { demos } from "../demos/registry";
import { publishedPages } from "./published";
import { localizedPath } from "./routes";

const messages = { fr, en };
const site = "https://lab.cabrelfosso.com";
const cases = locales.flatMap((locale) => publishedPages.map((page) => ({ locale, page })));

describe("titres et descriptions des pages publiées", () => {
  it.each(locales)("sont tous renseignés et tous différents (%s)", (locale) => {
    const texts = publishedPages.map((page) => pageTexts(page, messages[locale]));
    for (const { title, description } of texts) {
      expect(title).not.toBe("");
      expect(description).not.toBe("");
    }
    expect(new Set(texts.map((t) => t.title)).size).toBe(texts.length);
    expect(new Set(texts.map((t) => t.description)).size).toBe(texts.length);
  });

  it("reprennent ceux de l’annexe C", () => {
    expect(pageTexts({ key: "physics" }, fr).title).toBe("Physique — Le Labo");
    expect(pageTexts({ key: "physics", demo: demos[0] }, fr)).toEqual({
      title: "Le mouvement d’un projectile — Le Labo",
      description: fr.demos.projectile.metaDescription,
      heading: "Le mouvement d’un projectile",
    });
    expect(pageTexts({ key: "physics", demo: demos[1] }, en).title).toBe("Newton’s cradle — The Lab");
  });

  it("reprennent ceux de l’annexe D", () => {
    expect(pageTexts({ key: "computing" }, fr).title).toBe("Informatique — Le Labo");
    expect(pageTexts({ key: "computing" }, en).title).toBe("Computing — The Lab");
    expect(pageTexts({ key: "computing", demo: demos[2] }, fr)).toEqual({
      title: "Où se cachent les problèmes difficiles\u00a0? — Le Labo",
      description: fr.demos["three-sat"].metaDescription,
      heading: "Où se cachent les problèmes difficiles\u00a0?",
    });
    expect(pageTexts({ key: "computing", demo: demos[2] }, en).title).toBe("Where are the hard problems? — The Lab");
  });

  it("reprennent ceux de l’annexe B", () => {
    expect(pageTexts({ key: "privacy" }, fr).title).toBe("Confidentialité — Le Labo");
    expect(pageTexts({ key: "home" }, en).title).toBe("The Lab — Cabrel FOSSO");
  });

  it("donnent à l’image de partage le grand titre de la page", () => {
    expect(pageTexts({ key: "home" }, fr).heading).toBe("Comprendre la physique et l’informatique en manipulant");
    expect(pageTexts({ key: "privacy" }, en).heading).toBe("Privacy");
  });
});

describe("pageMetadata", () => {
  it.each(cases)("$locale $page.key $page.demo.id : URL canonique et hreflang absolues", ({ locale, page }) => {
    const meta = pageMetadata(page, locale, messages[locale]);
    expect(meta.alternates?.canonical).toBe(site + localizedPath(page.key, locale, page.demo?.slugs));
    expect(meta.alternates?.languages).toEqual({
      fr: site + localizedPath(page.key, "fr", page.demo?.slugs),
      en: site + localizedPath(page.key, "en", page.demo?.slugs),
      "x-default": site + localizedPath(page.key, "fr", page.demo?.slugs),
    });
  });

  it.each(cases)("$locale $page.key $page.demo.id : Open Graph et Twitter complets", ({ locale, page }) => {
    const t = messages[locale];
    const meta = pageMetadata(page, locale, t);
    const { title, description } = pageTexts(page, t);
    const image = {
      url: site + shareImagePath(page, locale),
      width: 1200,
      height: 630,
      alt: title,
      type: "image/png",
    };
    expect(meta.title).toBe(title);
    expect(meta.description).toBe(description);
    expect(meta.openGraph).toEqual({
      type: "website",
      title,
      description,
      url: site + localizedPath(page.key, locale, page.demo?.slugs),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: locale === "fr" ? "Le Labo — Cabrel FOSSO" : "The Lab — Cabrel FOSSO",
      images: [image],
    });
    expect(meta.twitter).toEqual({ card: "summary_large_image", title, description, images: [image] });
  });
});

describe("chemin de l’image de partage", () => {
  it("suit l’adresse publique de la page, sous /og, en PNG", () => {
    expect(shareImagePath({ key: "home" }, "fr")).toBe("/og/fr.png");
    expect(shareImagePath({ key: "privacy" }, "fr")).toBe("/og/fr/confidentialite.png");
    expect(shareImagePath({ key: "physics", demo: demos[1] }, "en")).toBe("/og/en/physics/newtons-cradle.png");
    expect(shareImagePath({ key: "privacy" }, "en")).toBe("/og/en/privacy.png");
  });
});
