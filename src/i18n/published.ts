import { categories, demosOf, type Category, type PublishedDemo } from "../demos/registry";
import { locales, type Locale } from "./config";
import { localizedPath, routes, type RouteKey } from "./routes";

/**
 * Pages qui ont du vrai contenu (cahier, section 2) : elles seules existent sur le site, dans le
 * sitemap et dans les images de partage. Une catégorie entre ici avec sa première expérience ; ses
 * expériences viennent du registre (`src/demos/registry.ts`).
 */
const publishedKeys = ["home", "privacy", "physics", "computing"] as const satisfies readonly RouteKey[];

export type PublishedKey = (typeof publishedKeys)[number];
export type PublishedCategory = Extract<PublishedKey, Category>;

/** Page publiée : une page de `routes.ts`, ou une expérience de sa catégorie. */
export type PublishedPage = { key: PublishedKey; demo?: undefined } | { key: PublishedCategory; demo: PublishedDemo };

/** Catégories publiées, dans l'ordre du menu. */
export const publishedCategories = publishedKeys.filter((key): key is PublishedCategory =>
  (categories as readonly string[]).includes(key),
);

export const publishedPages: readonly PublishedPage[] = [
  ...publishedKeys.map((key) => ({ key })),
  ...publishedCategories.flatMap((key) => demosOf(key).map((demo) => ({ key, demo }))),
];

/** Adresse d'une page publiée dans une langue. */
export function pagePath({ key, demo }: PublishedPage, locale: Locale): string {
  return localizedPath(key, locale, demo?.slugs);
}

/** Adresse de chaque page publiée, dans chaque langue. */
export function publishedPaths(): string[] {
  return publishedPages.flatMap((page) => locales.map((locale) => pagePath(page, locale)));
}

/** Paramètres statiques du segment [section] pour une langue. */
export function sectionParams(locale: Locale): Array<{ section: string }> {
  return publishedKeys.filter((key) => key !== "home").map((key) => ({ section: routes[key][locale] }));
}

/** Paramètres statiques des expériences publiées, chacune dans sa catégorie, pour une langue. */
export function experimentParams(locale: Locale): Array<{ section: string; experiment: string }> {
  return publishedPages.flatMap(({ key, demo }) =>
    demo ? [{ section: routes[key][locale], experiment: demo.slugs[locale] }] : [],
  );
}

/** Page publiée d'après ses noms d'adresse dans une langue. */
export function findPage(locale: Locale, section: string, experiment?: string): PublishedPage | undefined {
  return publishedPages.find(
    ({ key, demo }) =>
      key !== "home" && routes[key][locale] === section && demo?.slugs[locale] === experiment,
  );
}
