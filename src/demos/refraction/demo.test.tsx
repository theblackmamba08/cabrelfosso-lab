import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import type { Setup } from "./optics";
import RefractionDemo from "./refraction-demo";
import { RefractionFigure, RefractionLegend } from "./refraction-figure";
import { figureSummary, lawsWithValues, resultValues } from "./texts";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");
const airWater: Setup = { from: "air", to: "water", angle: 40 };
const trapped: Setup = { from: "water", to: "air", angle: 49 };

describe("textes qui suivent les réglages", () => {
  it("résumé de la figure, avec ou sans rayon réfracté", () => {
    expect(figureSummary(airWater, fr.demos.refraction.summary, "fr")).toBe(
      "Rayon incident à 40° ; rayon réfracté à 28,9°.",
    );
    expect(figureSummary(trapped, en.demos.refraction.summary, "en")).toBe(
      "Incident ray at 49°; total internal reflection: no refracted ray.",
    );
  });

  it("résultats", () => {
    const { results } = fr.demos.refraction;
    expect(resultValues(airWater, results, "fr")).toEqual(["40°", "28,9°", results.noCritical]);
    expect(resultValues({ ...trapped, angle: 48 }, results, "fr")).toEqual(["48°", "81,3°", "48,8°"]);
    expect(resultValues(trapped, results, "fr")).toEqual(["49°", results.total, "48,8°"]);
    expect(resultValues({ from: "water", to: "water", angle: 0 }, results, "fr")).toEqual(["0°", "0°", results.noCritical]);
  });

  it("sin i₂ avec les valeurs réglées, à 3 chiffres significatifs, même au-delà de 1", () => {
    const shown = (setup: Setup) => lawsWithValues(setup, fr.demos.refraction.laws.items, "fr").join("\n");
    expect(shown(airWater)).toContain("= 0,483$");
    expect(shown({ ...airWater, angle: 0 })).toContain("= 0$");
    expect(shown(trapped)).toContain("= 1,00$");
    expect(shown({ from: "diamond", to: "air", angle: 25 })).toContain("= 1,02$");
    expect(shown(trapped)).not.toContain("{s}");
  });
});

describe("figure", () => {
  const draw = (setup: Setup) =>
    renderToStaticMarkup(<RefractionFigure setup={setup} media={fr.demos.refraction.controls.media} summary="Résumé" />);

  it("rayons incident, réfléchi (fin) et réfracté, deux arcs, normale en pointillés, résumé", () => {
    const html = draw(airWater);
    expect(html).toMatch(/<svg[^>]*role="img"[^>]*aria-label="Résumé"/);
    expect(html.match(/data-ray="/g)).toHaveLength(3);
    expect(html).toMatch(/data-ray="reflected"[^>]*data-thick="false"/);
    expect(html.match(/data-arc/g)).toHaveLength(2);
    expect(html).toMatch(/stroke-dasharray/);
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it("réflexion totale : pas de rayon réfracté, rayon réfléchi épais", () => {
    const html = draw(trapped);
    expect(html).not.toContain('data-ray="refracted"');
    expect(html).toMatch(/data-ray="reflected"[^>]*data-thick="true"/);
    expect(html.match(/data-arc/g)).toHaveLength(1);
  });

  it("à 0°, aucun arc", () => {
    expect(draw({ ...airWater, angle: 0 })).not.toContain("data-arc");
  });

  it("légende : le rayon réfracté n'y figure que s'il existe", () => {
    const { legend } = fr.demos.refraction;
    const items = (total: boolean) => text(renderToStaticMarkup(<RefractionLegend legend={legend} total={total} />));
    expect(items(false)).toContain(legend.refracted);
    expect(items(true)).not.toContain(legend.refracted);
  });
});

describe.each([
  ["fr", fr.demos.refraction, "28,9°", "0,483"],
  ["en", en.demos.refraction, "28.9°", "0.483"],
] as const)("au chargement (%s)", (locale, t, angle, sine) => {
  const html = renderToStaticMarkup(<RefractionDemo locale={locale} texts={t} />);

  it("deux listes natives (Air, Eau) et un curseur de 0 à 89 à 40", () => {
    const selects = [...html.matchAll(/<select[^>]*>(.*?)<\/select>/g)].map((m) => m[1]);
    const options = selects.map((select) => [...select.matchAll(/<option[^>]*>(.*?)<\/option>/g)].map((m) => m[1]));
    const media = Object.values(t.controls.media);
    expect(options).toEqual([media, media]);
    expect(selects.map((select) => select.match(/selected=""[^>]*>(.*?)</)?.[1])).toEqual([media[0], media[1]]);
    expect(html).toMatch(/<input type="range" min="0" max="89" step="1"[^>]*aria-valuetext="40°"[^>]*value="40"/);
    for (const label of [t.controls.from, t.controls.to, t.controls.angle]) expect(text(html)).toContain(label);
  });

  it("résultats en liste de définitions, lois avec les valeurs, aucune annonce", () => {
    expect([...html.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => m[1])).toEqual([
      t.results.reflection,
      t.results.refraction,
      t.results.critical,
    ]);
    expect(html).toContain(`>${angle}</dd>`);
    expect(text(html)).toContain(`= ${sine}`);
    expect(text(html)).not.toMatch(/[$*{}]/);
    expect(html).not.toContain("aria-live");
  });
});
