import type { Locale } from "@/i18n/config";
import { formatNumber } from "../projectile/format";

/** Angle calculé, en degrés, à 3 chiffres significatifs (« 28,9° »). */
export function formatAngle(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)}°`;
}
