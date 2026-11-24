import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { formatQuantity, formatTick } from "../projectile/format";
import { ballMass, gravity, stringLength, type Impact } from "./physics";

type Texts = Messages["demos"]["newtons-cradle"];

/** Sous cette vitesse, une bille est immobile : seuls les arrondis de calcul la font bouger. */
const atRest = 1e-9;

/** Les deux barres d'une grandeur partagent une échelle : la plus grande des deux est pleine. */
function bars(before: number, after: number, unit: string, locale: Locale) {
  const largest = Math.max(before, after);
  return {
    before: { value: formatQuantity(before, unit, locale), share: before / largest },
    after: { value: formatQuantity(after, unit, locale), share: after / largest },
  };
}

/** Mesures affichées, en unités SI : une ligne par bille qui bouge, de gauche à droite. */
export function impactReadings({ speed, velocities, before, after }: Impact, locale: Locale) {
  return {
    speed: formatQuantity(speed, "m/s", locale),
    balls: velocities.flatMap((velocity, index) =>
      Math.abs(velocity) > atRest
        ? [{ ball: index + 1, speed: formatQuantity(velocity, "m/s", locale) }]
        : [],
    ),
    momentum: bars(before.momentum, after.momentum, "kg·m/s", locale),
    energy: bars(before.energy, after.energy, "J", locale),
  };
}

/** Données fixes de l'annexe C.3, écrites à partir des valeurs utilisées par les calculs. */
export function fixedValues({ mass, length, gravity: weight }: Texts["fixed"], locale: Locale) {
  return [
    mass.replace("{mass}", `${formatTick(ballMass * 1000, locale)} g`),
    length.replace("{length}", `${formatTick(stringLength * 100, locale)} cm`),
    weight.replace("{gravity}", `${formatTick(gravity, locale)} m/s²`),
  ];
}

/** Résumé textuel de la figure, pour les lecteurs d'écran (annexe C.3). */
export function cradleSummary({ before, after }: Impact, template: string, locale: Locale) {
  const energy = /\{(?:Ec|KE)\}/;
  return template
    .replace("{p}", formatQuantity(before.momentum, "kg·m/s", locale))
    .replace(energy, formatQuantity(before.energy, "J", locale))
    .replace("{p}", formatQuantity(after.momentum, "kg·m/s", locale))
    .replace(energy, formatQuantity(after.energy, "J", locale));
}
