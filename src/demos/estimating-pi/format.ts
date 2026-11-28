import type { Locale } from "@/i18n/config";

const fixed = {
  fr: new Intl.NumberFormat("fr", { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
  en: new Intl.NumberFormat("en", { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
};

/** Estimation et écart, avec 4 décimales. */
export function formatFixed(value: number, locale: Locale): string {
  return fixed[locale].format(value);
}

/** Nombre de points, avec séparateur de milliers. */
export function formatCount(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}
