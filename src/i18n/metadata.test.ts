import { describe, expect, it } from "vitest";
import { locales } from "./config";
import en from "./messages/en";
import fr from "./messages/fr";
import { pageMetadata, pageTexts, shareImagePath } from "./metadata";
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

  it("reprennent ceux de l’annexe B", () => {
    expect(pageTexts("privacy", fr).title).toBe("Confidentialité — Le Labo");
    expect(pageTexts("home", en).title).toBe("The Lab — Cabrel FOSSO");
  });

  it("donnent à l’image de partage le grand titre de la page", () => {
    expect(pageTexts("home", fr).heading).toBe("Comprendre la physique et l’informatique en manipulant");
    expect(pageTexts("privacy", en).heading).toBe("Privacy");
  });
});

describe("pageMetadata", () => {
  it.each(cases)("$locale $page : URL canonique et hreflang absolues", ({ locale, page }) => {
    const meta = pageMetadata(page, locale, messages[locale]);
    expect(meta.alternates?.canonical).toBe(site + localizedPath(page, locale));
    expect(meta.alternates?.languages).toEqual({
      fr: site + localizedPath(page, "fr"),
      en: site + localizedPath(page, "en"),
      "x-default": site + localizedPath(page, "fr"),
    });
  });

  it.each(cases)("$locale $page : Open Graph et Twitter complets", ({ locale, page }) => {
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
      url: site + localizedPath(page, locale),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: locale === "fr" ? "Le Labo — Cabrel FOSSO" : "The Lab — Cabrel FOSSO",
      images: [image],
    });
    expect(meta.twitter).toEqual({ card: "summary_large_image", title, description, images: [image] });
  });
});

describe("chemin de l’image de partage", () => {
  it("suit l’adresse publique de la page, sous /og, en PNG", () => {
    expect(shareImagePath("home", "fr")).toBe("/og/fr.png");
    expect(shareImagePath("privacy", "fr")).toBe("/og/fr/confidentialite.png");
    expect(shareImagePath("privacy", "en")).toBe("/og/en/privacy.png");
  });
});
