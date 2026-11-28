import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { fill } from "../fill";
import { plainMath } from "../projectile/math";
import { formatLength, formatRatio } from "./format";
import { imageDistance, imageHeight, magnification, nature, type Setup } from "./lens";

type Texts = Messages["demos"]["converging-lens"];

/** Valeurs affichées : position, grandissement, taille et nature de l'image. */
export function resultValues(setup: Setup, texts: Pick<Texts, "results" | "natures">, locale: Locale) {
  const [position, ratio, height] = [imageDistance(setup), magnification(setup), imageHeight(setup)];
  return {
    position: position === null ? texts.results.none : formatLength(position, locale),
    magnification: ratio === null ? texts.results.noMagnification : formatRatio(ratio, locale),
    height: height === null ? texts.results.none : formatLength(height, locale),
    nature: texts.natures[nature(setup)],
  };
}

/** Champs des textes, dans la notation de chaque langue (cahier, annexe F.1). */
function fields(setup: Setup, texts: Pick<Texts, "results" | "natures">, locale: Locale): Record<string, string> {
  const values = resultValues(setup, texts, locale);
  const d = formatLength(setup.distance, locale);
  const f = formatLength(setup.focal, locale);
  const sentence = values.nature.replace(/\s*[.:].*$/, "");
  return {
    d,
    // Français : la nature entière ; anglais : ses deux premiers mots (« real, inverted »).
    nature: sentence.charAt(0).toLowerCase() + sentence.slice(1),
    type: sentence.split(", ").slice(0, 2).join(", ").toLowerCase(),
    OA: formatLength(-setup.distance, locale),
    "f′": f,
    "OA′": values.position,
    "A′B′": values.height,
    γ: values.magnification,
    do: d,
    f,
    di: values.position,
    hi: values.height,
    m: values.magnification,
  };
}

/** Résumé textuel de la figure. */
export function figureSummary(setup: Setup, texts: Pick<Texts, "results" | "natures" | "summary">, locale: Locale) {
  if (nature(setup) === "none") return texts.summary.none;
  return plainMath(fill(texts.summary.image, fields(setup, texts, locale)).replaceAll("$", ""));
}

/** Les lois, avec les valeurs réglées. */
export function lawsWithValues(setup: Setup, texts: Pick<Texts, "results" | "natures" | "laws">, locale: Locale) {
  const values = fields(setup, texts, locale);
  return texts.laws.items.map((item) => fill(item, values));
}
