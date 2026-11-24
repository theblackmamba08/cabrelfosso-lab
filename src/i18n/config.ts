export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Libellé de chaque langue dans sa propre langue, pour le sélecteur. */
export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Valeur de l'attribut lang et de og:locale. */
export const htmlLang: Record<Locale, string> = {
  fr: "fr",
  en: "en",
};

export const ogLocale: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};
