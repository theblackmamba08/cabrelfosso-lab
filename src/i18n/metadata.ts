import type { Metadata } from "next";
import { absolute } from "../lib/site";
import { defaultLocale, ogLocale, type Locale } from "./config";
import type { Messages } from "./messages/fr";
import type { PublishedPage } from "./published";
import { alternatePaths, localizedPath } from "./routes";

/** Dimensions des images de partage (format recommandé par Open Graph). */
export const shareImageSize = { width: 1200, height: 630 } as const;

/** Titre de l'onglet, description et grand titre d'une page publiée (annexe B). */
export function pageTexts(
  page: PublishedPage,
  t: Messages,
): { title: string; description: string; heading: string } {
  const { title, metaTitle, metaDescription } = t[page];
  return {
    title: metaTitle,
    description: metaDescription,
    heading: typeof title === "string" ? title : title.before + title.highlight,
  };
}

/** Adresse de l'image de partage d'une page : son adresse publique, sous /og, en PNG. */
export function shareImagePath(page: PublishedPage, locale: Locale): string {
  return `/og${localizedPath(page, locale)}.png`;
}

/**
 * Métadonnées complètes d'une page publiée : titre, description, URL canonique et hreflang
 * (une par langue + x-default), Open Graph et Twitter avec l'image de partage de la page.
 * Toutes les URL sont absolues, construites sur `siteUrl`.
 */
export function pageMetadata(page: PublishedPage, locale: Locale, t: Messages): Metadata {
  const { title, description } = pageTexts(page, t);
  const alternates = alternatePaths(page);
  const url = absolute(localizedPath(page, locale));
  const image = {
    url: absolute(shareImagePath(page, locale)),
    ...shareImageSize,
    alt: title,
    type: "image/png",
  };
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: absolute(alternates.fr),
        en: absolute(alternates.en),
        "x-default": absolute(alternates[defaultLocale]),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      locale: ogLocale[locale],
      siteName: t.site.ogName,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
