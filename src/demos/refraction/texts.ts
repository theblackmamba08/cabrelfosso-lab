import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { fill } from "../fill";
import { formatNumber } from "../projectile/format";
import { formatAngle } from "./format";
import { criticalAngle, reflectionAngle, refract, sineOfRefraction, type Setup } from "./optics";

type Texts = Messages["demos"]["refraction"];

/** Résumé textuel de la figure. */
export function figureSummary(setup: Setup, texts: Texts["summary"], locale: Locale): string {
  const i2 = refract(setup);
  const values: Record<string, string> = { "i₁": `${setup.angle}°` };
  if (i2 === null) return fill(texts.total, values);
  return fill(texts.refracted, { ...values, "i₂": formatAngle(i2, locale) });
}

/** Angles de réflexion, de réfraction et limite, ou ce qui les remplace. */
export function resultValues(setup: Setup, texts: Texts["results"], locale: Locale): [string, string, string] {
  const [i2, limit] = [refract(setup), criticalAngle(setup)];
  return [
    `${reflectionAngle(setup)}°`,
    i2 === null ? texts.total : formatAngle(i2, locale),
    limit === null ? texts.noCritical : formatAngle(limit, locale),
  ];
}

/** Les lois, avec la valeur de sin i₂ pour les réglages. */
export function lawsWithValues(setup: Setup, items: Texts["laws"]["items"], locale: Locale): string[] {
  const s = formatNumber(sineOfRefraction(setup), locale);
  return items.map((item) => item.replace("{s}", s));
}
