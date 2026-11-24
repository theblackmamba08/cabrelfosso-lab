import type { Locale } from "../i18n/config";

/** Adresse publique du site : URL canoniques, hreflang, Open Graph (cahier, section 2). */
export const siteUrl = new URL("https://lab.cabrelfosso.com");

/** URL absolue d'une adresse du site. */
export const absolute = (path: string) => new URL(path, siteUrl).href;

/** Adresse du portfolio, sans langue. */
export const portfolioUrl = "https://cabrelfosso.com";

/** Adresse d'une page du portfolio dans une langue (l'accueil par défaut). */
export const portfolioPage = (locale: Locale, path = "") => `${portfolioUrl}/${locale}${path}`;

/** Dépôt public du code. */
export const repositoryUrl = "https://github.com/theblackmamba08/cabrelfosso-lab";

/** Licence des textes et des figures, dans la langue de la page. */
export const contentLicenseUrl = (locale: Locale) => `https://creativecommons.org/licenses/by/4.0/deed.${locale}`;
