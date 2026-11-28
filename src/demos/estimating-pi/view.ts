import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { fill } from "../fill";
import { formatCount, formatFixed } from "./format";
import { difference, estimate, maxPoints, type Run } from "./monte-carlo";

type Texts = Messages["demos"]["estimating-pi"];

/** Résultats d'une série ; `null` avant le premier point. */
export function resultValues(run: Run, locale: Locale) {
  const value = estimate(run);
  const gap = difference(run);
  if (value === null || gap === null) return null;
  return {
    total: formatCount(run.total, locale),
    inside: formatCount(run.inside, locale),
    estimate: formatFixed(value, locale),
    difference: formatFixed(gap, locale),
  };
}

/** Résumé de la figure ; il est aussi annoncé après chaque clic. */
export function runSummary(run: Run, texts: Pick<Texts, "summary" | "empty">, locale: Locale): string {
  const values = resultValues(run, locale);
  if (values === null) return texts.empty;
  return fill(texts.summary, {
    N: values.total,
    n: values.inside,
    estimation: values.estimate,
    estimate: values.estimate,
  });
}

/** Annonce après un clic : le résumé, et le message du maximum quand il est atteint. */
export function announcement(run: Run, texts: Pick<Texts, "summary" | "empty" | "maximum">, locale: Locale): string {
  const summary = runSummary(run, texts, locale);
  return run.total >= maxPoints ? `${summary} ${texts.maximum}` : summary;
}
