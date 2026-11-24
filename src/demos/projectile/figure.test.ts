import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import fr from "@/i18n/messages/fr";
import en from "@/i18n/messages/en";
import { figureSummary } from "./figure-summary";
import { MathText } from "./math-text";
import type { Launch } from "./physics";
import { FigureLegend, ProjectileFigure } from "./projectile-figure";

const current: Launch = { speed: 10, angle: 45, height: 0, gravity: 9.8 };
const kept: Launch = { speed: 10, angle: 45, height: 0, gravity: 1.6 };
const { summary, legend } = fr.demos.projectile;

function figure(props: { kept?: Launch | null; progress?: number } = {}) {
  return renderToStaticMarkup(
    createElement(ProjectileFigure, {
      launch: current,
      kept: props.kept ?? null,
      progress: props.progress ?? 0,
      locale: "fr",
      summary: "Résumé",
    }),
  );
}

describe("figureSummary", () => {
  it("décrit le tir actuel", () => {
    expect(figureSummary(current, null, summary, "fr")).toBe(
      "Tir actuel : portée 10,2 m, flèche 2,55 m.",
    );
  });

  it("ajoute le tir gardé s'il existe", () => {
    expect(figureSummary(current, kept, summary, "fr")).toBe(
      "Tir actuel : portée 10,2 m, flèche 2,55 m. Tir gardé : portée 62,5 m, flèche 15,6 m.",
    );
  });

  it("s'écrit aussi en anglais", () => {
    expect(figureSummary(current, null, en.demos.projectile.summary, "en")).toBe(
      "Current throw: range 10.2 m, maximum height 2.55 m.",
    );
  });
});

describe("ProjectileFigure", () => {
  it("est une image décrite par le résumé textuel", () => {
    expect(figure()).toMatch(/<svg[^>]*role="img"[^>]*aria-label="Résumé"/);
  });

  it("gradue les axes en mètres", () => {
    const html = figure();
    expect(html).toContain("x (m)");
    expect(html).toContain("y (m)");
    expect(html).toMatch(/>10<\/text>/);
  });

  it("utilise les couleurs du design system, pas de valeur en dur", () => {
    expect(figure()).toContain('stroke="var(--accent)"');
    expect(figure()).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });

  it("ne trace le tir gardé, en pointillé, que s'il existe", () => {
    expect(figure()).not.toContain("stroke-dasharray");
    expect(figure({ kept })).toContain("stroke-dasharray");
  });

  it("place le projectile sur la trajectoire selon l'avancement du vol", () => {
    const circle = (html: string) => html.match(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"/);
    const start = circle(figure({ progress: 0 }));
    const end = circle(figure({ progress: 1 }));
    expect(start?.slice(1)).not.toEqual(end?.slice(1));
    expect(Number(end?.[1])).toBeGreaterThan(Number(start?.[1]));
  });
});

describe("FigureLegend", () => {
  const render = (hasKept: boolean) =>
    renderToStaticMarkup(createElement(FigureLegend, { legend, hasKept }));

  it("montre le tir gardé seulement après l'avoir gardé", () => {
    expect(render(false)).toContain("Tir actuel");
    expect(render(false)).not.toContain("Tir gardé");
    expect(render(true)).toContain("Tir gardé");
  });
});

describe("MathText", () => {
  it("met les variables en italique, les indices et exposants en HTML", () => {
    expect(renderToStaticMarkup(createElement(MathText, { source: "*v*_{0}^{2} sin *α*" }))).toBe(
      "<i>v</i><sub>0</sub><sup>2</sup> sin <i>α</i>",
    );
  });
});
