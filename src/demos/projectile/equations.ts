import type { Locale } from "@/i18n/config";
import { formatNumber, formatQuantity } from "./format";
import {
  apexHeight,
  flightTime,
  horizontalSpeed,
  impactSpeed,
  launchRange,
  verticalSpeed,
  type Launch,
} from "./physics";

/**
 * Formules écrites dans une notation courte : *x* pour une variable (italique),
 * _{0} pour un indice, ^{2} pour un exposant. `MathText` en fait du HTML.
 */
export type MathToken = {
  kind: "text" | "variable" | "sub" | "sup";
  value: string;
};

const tokenPattern = /\*([^*]+)\*|_\{([^}]+)\}|\^\{([^}]+)\}|([^*_^]+)/g;

export function parseMath(source: string): MathToken[] {
  return Array.from(source.matchAll(tokenPattern), ([, variable, sub, sup, text]) => {
    if (variable) return { kind: "variable", value: variable };
    if (sub) return { kind: "sub", value: sub };
    if (sup) return { kind: "sup", value: sup };
    return { kind: "text", value: text };
  });
}

const subscripts: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", v: "_v" };
const superscripts: Record<string, string> = { "2": "²" };

/** Forme en texte simple, celle de l'annexe C.2. */
export function plainMath(source: string): string {
  return parseMath(source)
    .map(({ kind, value }) => {
      if (kind === "sub") return subscripts[value] ?? value;
      if (kind === "sup") return superscripts[value] ?? value;
      return value;
    })
    .join("");
}

/** Somme de termes (coefficient, partie littérale) ; un coefficient nul disparaît. */
function polynomial(terms: Array<[number, string]>, locale: Locale): string {
  const kept = terms.filter(([coefficient]) => coefficient !== 0);
  if (kept.length === 0) return "0";
  return kept
    .map(([coefficient, variable], index) => {
      const magnitude = formatNumber(Math.abs(coefficient), locale);
      const body = variable ? `${magnitude} ${variable}` : magnitude;
      if (index === 0) return coefficient < 0 ? `−${body}` : body;
      return `${coefficient < 0 ? "−" : "+"} ${body}`;
    })
    .join(" ");
}

function motionLines(launch: Launch, locale: Locale): string[] {
  const x = polynomial([[horizontalSpeed(launch), "*t*"]], locale);
  const y = polynomial(
    [
      [-launch.gravity / 2, "*t*^{2}"],
      [verticalSpeed(launch), "*t*"],
      [launch.height, ""],
    ],
    locale,
  );
  return [`*x*(*t*) = ${x}`, `*y*(*t*) = ${y}`];
}

/** Lettre de la portée : D en français, R en anglais (annexe C.2). */
const rangeSymbol: Record<Locale, string> = { fr: "D", en: "R" };

export type Equation = {
  id: "motion" | "trajectory" | "apex" | "flightTime" | "range" | "impactSpeed";
  /** Formes littérales. */
  literal: readonly string[];
  /** Formes avec les valeurs réglées. */
  values: readonly string[];
};

/** Les équations de l'annexe C.2 ; un tir vertical n'a pas d'équation de trajectoire. */
export function equations(launch: Launch, locale: Locale): Equation[] {
  const symbol = rangeSymbol[locale];
  const vx = horizontalSpeed(launch);
  const trajectory =
    vx === 0
      ? { literal: [], values: [] }
      : {
          literal: ["*y* = −*g* *x*^{2} / (2 *v*_{0}^{2} cos^{2} *α*) + *x* tan *α* + *h*_{0}"],
          values: [
            `*y* = ${polynomial(
              [
                [-launch.gravity / (2 * vx * vx), "*x*^{2}"],
                [verticalSpeed(launch) / vx, "*x*"],
                [launch.height, ""],
              ],
              locale,
            )}`,
          ],
        };

  return [
    {
      id: "motion",
      literal: [
        "*x*(*t*) = *v*_{0} cos *α* · *t*",
        "*y*(*t*) = −½ *g* *t*^{2} + *v*_{0} sin *α* · *t* + *h*_{0}",
      ],
      values: motionLines(launch, locale),
    },
    { id: "trajectory", ...trajectory },
    {
      id: "apex",
      literal: ["*H* = *h*_{0} + *v*_{0}^{2} sin^{2} *α* / (2*g*)"],
      values: [`*H* = ${formatQuantity(apexHeight(launch), "m", locale)}`],
    },
    {
      id: "flightTime",
      literal: ["*t*_{v} = [*v*_{0} sin *α* + √(*v*_{0}^{2} sin^{2} *α* + 2 *g* *h*_{0})] / *g*"],
      values: [`*t*_{v} = ${formatQuantity(flightTime(launch), "s", locale)}`],
    },
    {
      id: "range",
      literal: [
        `*${symbol}* = *v*_{0} cos *α* · *t*_{v}`,
        `*${symbol}* = *v*_{0}^{2} sin 2*α* / *g*`,
      ],
      values: [`*${symbol}* = ${formatQuantity(launchRange(launch), "m", locale)}`],
    },
    {
      id: "impactSpeed",
      literal: ["*v* = √(*v*_{0}^{2} + 2 *g* *h*_{0})"],
      values: [`*v* = ${formatQuantity(impactSpeed(launch), "m/s", locale)}`],
    },
  ];
}

/** Ce qu'affiche la démo vedette : équations horaires avec valeurs, et portée. */
export function motionEquations(launch: Launch, locale: Locale) {
  return {
    motion: motionLines(launch, locale),
    range: formatQuantity(launchRange(launch), "m", locale),
  };
}
