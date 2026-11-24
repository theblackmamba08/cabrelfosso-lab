import type { Locale } from "@/i18n/config";

const significant = {
  fr: new Intl.NumberFormat("fr", { minimumSignificantDigits: 3, maximumSignificantDigits: 3 }),
  en: new Intl.NumberFormat("en", { minimumSignificantDigits: 3, maximumSignificantDigits: 3 }),
};

const plain = {
  fr: new Intl.NumberFormat("fr", { maximumSignificantDigits: 3 }),
  en: new Intl.NumberFormat("en", { maximumSignificantDigits: 3 }),
};

/** Nombre à 3 chiffres significatifs ; zéro reste « 0 », il n'en a aucun. */
export function formatNumber(value: number, locale: Locale): string {
  return value === 0 ? "0" : significant[locale].format(value);
}

/** Nombre suivi de son unité, séparés par une espace insécable. */
export function formatQuantity(value: number, unit: string, locale: Locale): string {
  return `${formatNumber(value, locale)} ${unit}`;
}

/** Valeur d'un réglage ou d'une graduation : pas de zéro inutile (« 20 », « 0,05 »). */
export function formatTick(value: number, locale: Locale): string {
  return plain[locale].format(value);
}
