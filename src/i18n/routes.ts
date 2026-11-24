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

const routeKeys = Object.keys(routes) as RouteKey[];

/** Adresse d'une page dans une langue, par exemple `/fr/confidentialite`. */
export function localizedPath(key: RouteKey, locale: Locale): string {
  const segment = routes[key][locale];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

/** Adresse d'une page dans chaque langue (pour hreflang et le sitemap). */
export function alternatePaths(key: RouteKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, localizedPath(key, locale)])) as Record<Locale, string>;
}

/** Page correspondant à une adresse ; l'accueil si l'adresse est inconnue dans cette langue. */
export function routeKeyFromPath(pathname: string, locale: Locale): RouteKey {
  return routeKeys.find((key) => localizedPath(key, locale) === pathname) ?? "home";
}

/** La même page dans une autre langue, pour le sélecteur. */
export function pathInLocale(pathname: string, locale: Locale, target: Locale): string {
  return localizedPath(routeKeyFromPath(pathname, locale), target);
}
