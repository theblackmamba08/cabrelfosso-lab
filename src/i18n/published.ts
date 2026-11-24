import { locales, type Locale } from "./config";
import { localizedPath, routes, type RouteKey } from "./routes";

/**
 * Pages qui ont du vrai contenu (cahier, section 2) : elles seules existent sur le site, dans le
 * sitemap et dans les images de partage. Une page de catégorie entre ici avec sa première expérience.
 */
export const publishedPages = ["home", "privacy"] as const satisfies readonly RouteKey[];

export type PublishedPage = (typeof publishedPages)[number];

/** Pages publiées qui ont leur propre nom d'adresse (toutes sauf l'accueil). */
export type PublishedSection = Exclude<PublishedPage, "home">;

const publishedSections = publishedPages.filter((key): key is PublishedSection => key !== "home");

/** Adresse de chaque page publiée, dans chaque langue. */
export function publishedPaths(): string[] {
  return publishedPages.flatMap((key) => locales.map((locale) => localizedPath(key, locale)));
}

/** Paramètres statiques du segment [section] pour une langue. */
export function sectionParams(locale: Locale): Array<{ section: string }> {
  return publishedSections.map((key) => ({ section: routes[key][locale] }));
}

/** Page publiée d'après son nom d'adresse dans une langue. */
export function publishedSection(locale: Locale, section: string): PublishedSection | undefined {
  return publishedSections.find((key) => routes[key][locale] === section);
}
