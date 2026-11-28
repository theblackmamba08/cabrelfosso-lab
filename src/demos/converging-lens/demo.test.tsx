import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import ConvergingLensDemo from "./converging-lens-demo";
import type { Setup } from "./lens";
import { LensFigure } from "./lens-figure";
import { LensText } from "./lens-text";
import { figureSummary, lawsWithValues, resultValues } from "./texts";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");
const spaced = (value: string) => value.replace(/ /g, " ");
const tf = fr.demos["converging-lens"];
const te = en.demos["converging-lens"];
const start: Setup = { focal: 5, distance: 15 };

describe("textes qui suivent les réglages", () => {
  it("résultats, ou « aucune » quand l'objet est au foyer", () => {
    expect(resultValues(start, tf, "fr")).toEqual({
      position: "7,50 cm",
      magnification: "−0,500",
      height: "−1,00 cm",
      nature: tf.natures.smaller,
    });
    expect(resultValues({ focal: 5, distance: 5 }, tf, "fr")).toEqual({
      position: "aucune",
      magnification: "aucun",
      height: "aucune",
      nature: tf.natures.none,
    });
    expect(resultValues({ focal: 2, distance: 1 }, te, "en").nature).toBe(te.natures.virtual);
  });

  it("résumé de la figure, dans les deux langues", () => {
    expect(spaced(figureSummary(start, tf, "fr"))).toBe(
      "Objet à 15,0 cm de la lentille ; image réelle, renversée, plus petite que l’objet, à 7,50 cm de la lentille, de taille −1,00 cm.",
    );
    expect(spaced(figureSummary({ focal: 5, distance: 2.5 }, te, "en"))).toBe(
      "Object 2.50 cm from the lens; virtual, upright image, at d_i = −5.00 cm, height 4.00 cm.",
    );
    expect(figureSummary({ focal: 5, distance: 5 }, tf, "fr")).toBe(tf.summary.none);
  });

  it("les lois, avec les valeurs réglées", () => {
    expect(spaced(lawsWithValues(start, tf, "fr")[3])).toBe(
      "Avec les valeurs réglées : $OA$ = −15,0 cm ; $OF′$ = 5,00 cm ; $OA′$ = 7,50 cm ; $γ$ = −0,500",
    );
    expect(spaced(lawsWithValues({ focal: 10, distance: 20 }, te, "en")[2])).toBe(
      "With the current settings: $*d*_{o}$ = 20.0 cm; $*f*$ = 10.0 cm; $*d*_{i}$ = 20.0 cm; $*m*$ = −1.00",
    );
  });
});

describe("mesures algébriques", () => {
  it("en français : surmontées d'une barre, sans caractère ajouté", () => {
    const html = renderToStaticMarkup(<LensText source={tf.laws.items[2]} bars />);
    expect(html.match(/<span class="overline">/g)).toHaveLength(4);
    expect(html).toContain('<span class="overline">A′B′</span>');
    expect(text(html)).toBe("Grandissement : γ = A′B′ / AB = OA′ / OA");
  });

  it("en anglais : indices", () => {
    const html = renderToStaticMarkup(<LensText source={te.results.position} bars={false} />);
    expect(html).toContain("<i>d</i><sub>i</sub>");
    expect(html).not.toContain("overline");
  });
});

describe("figure", () => {
  const draw = (setup: Setup) => renderToStaticMarkup(<LensFigure setup={setup} summary="Résumé" />);

  it("trois rayons, l'objet et l'image réelle, en trait plein", () => {
    const html = draw(start);
    expect(html).toMatch(/<svg[^>]*role="img"[^>]*aria-label="Résumé"/);
    expect(html.match(/data-ray="/g)).toHaveLength(3);
    expect(html).toContain('data-arrow="object"');
    expect(html).toMatch(/data-arrow="image"><line[^>]*(?!stroke-dasharray)/);
    expect(html).not.toContain("data-extension");
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it("objet au foyer : deux rayons, pas d'image", () => {
    const html = draw({ focal: 5, distance: 5 });
    expect(html.match(/data-ray="/g)).toHaveLength(2);
    expect(html).not.toContain('data-arrow="image"');
  });

  it("image virtuelle : en pointillés, avec les prolongements", () => {
    const html = draw({ focal: 5, distance: 2.5 });
    expect(html).toMatch(/data-arrow="image"><line[^>]*stroke-dasharray/);
    expect(html.match(/data-extension/g)).toHaveLength(4);
  });

  it("image hors du cadre : non dessinée", () => {
    expect(draw({ focal: 5, distance: 5.5 })).not.toContain('data-arrow="image"');
  });
});

describe.each([
  ["fr", tf, "7,50 cm"],
  ["en", te, "7.50 cm"],
] as const)("au chargement (%s)", (locale, t, position) => {
  const html = renderToStaticMarkup(<ConvergingLensDemo locale={locale} texts={t} />);

  it("deux curseurs natifs : f′ de 2 à 10 à 5, d de 1 à 40 à 15, par pas de 0,5", () => {
    const inputs = html.match(/<input[^>]*>/g) ?? [];
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toMatch(/min="2" max="10" step="0.5"[^>]*value="5"/);
    expect(inputs[1]).toMatch(/min="1" max="40" step="0.5"[^>]*value="15"/);
    for (const label of [t.controls.focal, t.controls.distance, t.fixed]) expect(text(html)).toContain(label);
  });

  it("résultats en liste de définitions, aucune annonce, aucun message hors cadre", () => {
    expect(html.match(/<dt/g)).toHaveLength(4);
    expect(html).toContain(`>${position}</dd>`);
    expect(text(html)).toContain(t.natures.smaller);
    expect(text(html)).not.toContain(t.outside);
    expect(text(html)).not.toMatch(/[$*{}]/);
    expect(html).not.toContain("aria-live");
  });
});
