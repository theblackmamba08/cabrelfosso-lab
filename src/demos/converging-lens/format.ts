import type { Locale } from "@/i18n/config";
import { formatNumber } from "../projectile/format";

/** Nombre à 3 chiffres significatifs, avec le signe moins typographique (« −0,500 »). */
export function formatRatio(value: number, locale: Locale): string {
  return formatNumber(value, locale).replace("-", "−");
}

/** Longueur en cm, une espace insécable avant l'unité (« −1,00 cm »). */
export function formatLength(value: number, locale: Locale): string {
  return `${formatRatio(value, locale)} cm`;
}
