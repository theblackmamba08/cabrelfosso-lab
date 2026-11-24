import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CradleFigure } from "./cradle-figure";
import { LawText } from "./cradle-laws";
import { releaseState } from "./motion";

function figure(angles: readonly number[]) {
  return renderToStaticMarkup(createElement(CradleFigure, { angles, summary: "Résumé" }));
}

const centres = (svg: string) =>
  [...svg.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)"/g)].map(([, x, y]) => ({
    x: Number(x),
    y: Number(y),
  }));

describe("CradleFigure", () => {
  const { angles } = releaseState(1, 30);

  it("est une image décrite par le résumé textuel", () => {
    expect(figure(angles)).toMatch(/<svg[^>]*role="img"[^>]*aria-label="Résumé"/);
  });

  it("dessine la barre de support, 5 fils et 5 billes", () => {
    const svg = figure(angles);
    expect(svg.match(/<rect/g)).toHaveLength(1);
    expect(svg.match(/<line/g)).toHaveLength(5);
    expect(svg.match(/<circle/g)).toHaveLength(5);
  });

  it("n'utilise que les couleurs du design system", () => {
    const colors = [...figure(angles).matchAll(/(?:fill|stroke)="([^"]+)"/g)].map(([, c]) => c);
    expect(colors.length).toBeGreaterThan(0);
    for (const color of colors) expect(color).toMatch(/^var\(--[a-z-]+\)$/);
  });

  it("dessine une bille écartée à son angle de départ, plus haut que les autres", () => {
    const [first, second] = centres(figure(angles));
    expect(first.x).toBeLessThan(second.x);
    expect(first.y).toBeLessThan(second.y);
  });

  it("aligne les billes au repos, en contact", () => {
    const balls = centres(figure([0, 0, 0, 0, 0]));
    expect(new Set(balls.map(({ y }) => y)).size).toBe(1);
    const spacing = balls[1].x - balls[0].x;
    balls.slice(1).forEach(({ x }, index) => {
      expect(x - balls[index].x).toBeCloseTo(spacing, 1);
    });
  });

  it("garde les billes dans le cadre, à l'angle le plus grand", () => {
    const svg = figure(releaseState(4, 45).angles);
    const [, , width, height] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? "").split(" ").map(Number);
    for (const { x, y } of centres(svg)) {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(width);
      expect(y).toBeLessThan(height);
    }
    const mirrored = figure(releaseState(4, 45).angles.map((angle) => -angle));
    for (const { x } of centres(mirrored)) expect(x).toBeLessThan(width);
  });
});

describe("LawText : phrases et formules", () => {
  const html = (source: string) => renderToStaticMarkup(createElement(LawText, { source }));

  it("laisse le texte tel quel", () => {
    expect(html("Elle est conservée")).toBe("Elle est conservée");
  });

  it("met en police à chasse fixe, sans coupure, ce qui est entre $", () => {
    expect(html("soit $*p* = *m* *v*$.")).toBe(
      'soit <span class="font-mono text-sm whitespace-nowrap"><i>p</i> = <i>m</i> <i>v</i></span>.',
    );
  });

  it("garde indices et exposants", () => {
    expect(html("$*v*_{1}′$")).toContain("<i>v</i><sub>1</sub>′");
    expect(html("$*v*^{2}$")).toContain("<i>v</i><sup>2</sup>");
  });
});
