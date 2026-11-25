import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { alphaCount, alphaOf } from "./puzzle";
import { curveSummary, sharePercent, type AlphaPoint } from "./statistics";

export type CurveData = { n: number; points: readonly AlphaPoint[] };

/** α, toujours avec une décimale. */
export function formatAlpha(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
}

/** Médiane : entière, ou avec une décimale (,5). */
export function formatMedian(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}

export const formatCount = formatMedian;

/** « 55 % » avec une espace insécable en français, « 55% » en anglais. */
export function formatPercent(value: number, locale: Locale): string {
  return locale === "fr" ? `${value} %` : `${value}%`;
}

/** Remplace les champs {nom} d'un texte. */
export function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{([^}]+)\}/g, (field, name: string) => values[name] ?? field);
}

/** Résumé d'une courbe complète (annexe D.3). */
export function summaryText(
  n: number,
  points: readonly AlphaPoint[],
  texts: Messages["demos"]["three-sat"]["summaries"],
  locale: Locale,
): string {
  const summary = curveSummary(points);
  return fill(texts[summary.kind], {
    n: String(n),
    ...("a" in summary && { a: formatAlpha(summary.a, locale) }),
    ...("b" in summary && { b: formatAlpha(summary.b, locale) }),
    c: formatAlpha(summary.c, locale),
    d: formatMedian(summary.d, locale),
  });
}

/** Lignes du tableau des valeurs : α, puis la part et la médiane de chaque courbe. */
export function tableRowsOf(curves: readonly CurveData[], locale: Locale): string[][] {
  return Array.from({ length: alphaCount }, (_, k) => [
    formatAlpha(alphaOf(k), locale),
    ...curves.flatMap(({ points }) => {
      const point = points[k];
      return point ? [formatPercent(sharePercent(point), locale), formatMedian(point.median, locale)] : ["", ""];
    }),
  ]);
}
