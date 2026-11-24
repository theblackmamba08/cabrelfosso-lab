import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "../../i18n/config";
import { publishedPages } from "../../i18n/published";
import { alternatePaths } from "../../i18n/routes";
import { absolute } from "../site";

/**
 * Entrées du sitemap : chaque page publiée dans chaque langue, avec ses équivalents FR, EN et
 * x-default. Pas de date de modification : aucune n'est connue de façon fiable.
 */
export function sitemapEntries(): MetadataRoute.Sitemap {
  return publishedPages.flatMap((page) => {
    const paths = alternatePaths(page);
    const languages = {
      fr: absolute(paths.fr),
      en: absolute(paths.en),
      "x-default": absolute(paths[defaultLocale]),
    };
    return locales.map((locale) => ({ url: absolute(paths[locale]), alternates: { languages } }));
  });
}

/** robots.txt : tout est autorisé ; lien vers le sitemap absolu. */
export function robotsRules(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absolute("/sitemap.xml"),
  };
}
