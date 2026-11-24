import { publishedDemos } from "../demos/registry";
import { locales, type Locale } from "./config";

/**
 * Table unique des pages : nom d'adresse de chaque page dans chaque langue (cahier, section 2).
 * Ces adresses ne changent plus une fois publiées. Une page n'existe sur le site que si
 * `published.ts` la publie. Chemins relatifs : les tests d'intégration chargent ce fichier sans
 * l'alias `@/`.
 */
export const routes = {
  home: { fr: "", en: "" },
  privacy: { fr: "confidentialite", en: "privacy" },
  physics: { fr: "physique", en: "physics" },
  computing: { fr: "informatique", en: "computing" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Nom d'une expérience dans chaque langue. */
export type SubPage = Record<Locale, string>;

const routeKeys = Object.keys(routes) as RouteKey[];

/** Toutes les adresses connues : les pages, puis les expériences publiées. */
const places: ReadonlyArray<{ key: RouteKey; subPage?: SubPage }> = [
  ...routeKeys.map((key) => ({ key })),
  ...publishedDemos.map((demo) => ({ key: demo.category, subPage: demo.slugs })),
];

/** Adresse d'une page dans une langue, par exemple `/fr/physique/projectile`. */
export function localizedPath(key: RouteKey, locale: Locale, subPage?: SubPage): string {
  const segment = routes[key][locale];
  const path = segment ? `/${locale}/${segment}` : `/${locale}`;
  return subPage ? `${path}/${subPage[locale]}` : path;
}

/** Adresse d'une page dans chaque langue (pour hreflang et le sitemap). */
export function alternatePaths(key: RouteKey, subPage?: SubPage): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, localizedPath(key, locale, subPage)]),
  ) as Record<Locale, string>;
}

/** Page ou expérience d'une adresse ; l'accueil si l'adresse est inconnue dans cette langue. */
function placeOf(pathname: string, locale: Locale) {
  return places.find(({ key, subPage }) => localizedPath(key, locale, subPage) === pathname) ?? places[0];
}

/** Page d'une adresse, ou catégorie d'une expérience (menu). */
export function routeKeyFromPath(pathname: string, locale: Locale): RouteKey {
  return placeOf(pathname, locale).key;
}

/** La même page dans une autre langue, pour le sélecteur. */
export function pathInLocale(pathname: string, locale: Locale, target: Locale): string {
  const { key, subPage } = placeOf(pathname, locale);
  return localizedPath(key, target, subPage);
}
