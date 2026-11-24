import { describe, expect, it } from "vitest";
import { apexHeight, launchRange, type Launch } from "./physics";
import { figureScale, type PlotArea } from "./figure-scale";

const plot: PlotArea = { left: 60, top: 16, width: 480, height: 260 };
const base: Launch = { speed: 10, angle: 45, height: 0, gravity: 9.8 };

describe("figureScale", () => {
  it("fait tenir toute la trajectoire dans la figure", () => {
    const launch = { ...base, speed: 30, height: 20, gravity: 1.6 };
    const scale = figureScale([launch], plot);
    expect(scale.xMax).toBeGreaterThanOrEqual(launchRange(launch));
    expect(scale.yMax).toBeGreaterThanOrEqual(apexHeight(launch));
  });

  it("fait aussi tenir un tir vertical", () => {
    const launch = { ...base, angle: 90, speed: 30, gravity: 1.6 };
    expect(figureScale([launch], plot).yMax).toBeGreaterThanOrEqual(apexHeight(launch));
  });

  it("utilise la même échelle sur les deux axes : un angle garde sa vraie valeur", () => {
    const scale = figureScale([base], plot);
    const horizontal = scale.toSvg({ x: 1, y: 0 }).x - scale.toSvg({ x: 0, y: 0 }).x;
    const vertical = scale.toSvg({ x: 0, y: 0 }).y - scale.toSvg({ x: 0, y: 1 }).y;
    expect(horizontal).toBeCloseTo(vertical, 6);
  });

  it("donne à deux tirs une échelle commune, fixée par le plus grand", () => {
    const small = { ...base, speed: 5 };
    const large = { ...base, speed: 30 };
    expect(figureScale([small, large], plot).xMax).toBe(figureScale([large], plot).xMax);
    expect(figureScale([large, small], plot).xMax).toBe(figureScale([large], plot).xMax);
  });

  it("change par paliers, pour que la courbe bouge avec les réglages", () => {
    const xMax = figureScale([base], plot).xMax;
    expect(figureScale([{ ...base, speed: 10.5 }], plot).xMax).toBe(xMax);
    expect(figureScale([{ ...base, speed: 30 }], plot).xMax).toBeGreaterThan(xMax);
  });

  it("place l'origine en bas à gauche de la zone de tracé", () => {
    expect(figureScale([base], plot).toSvg({ x: 0, y: 0 })).toEqual({ x: 60, y: 276 });
  });

  it("gradue les axes à partir de zéro, sans dépasser la figure", () => {
    const { xTicks, yTicks, xMax, yMax } = figureScale([base], plot);
    expect(xTicks[0]).toBe(0);
    expect(yTicks[0]).toBe(0);
    expect(Math.max(...xTicks)).toBeLessThanOrEqual(xMax * 1.000001);
    expect(Math.max(...yTicks)).toBeLessThanOrEqual(yMax * 1.000001);
    expect(xTicks.length).toBeGreaterThanOrEqual(3);
    expect(xTicks.length).toBeLessThanOrEqual(8);
  });

  it("garde une échelle valable quand le vol est nul", () => {
    const scale = figureScale([{ ...base, angle: 0 }], plot);
    expect(scale.xMax).toBeGreaterThan(0);
    expect(Number.isFinite(scale.toSvg({ x: 1, y: 1 }).x)).toBe(true);
  });

  it("s'adapte aux très petits tirs", () => {
    const launch = { ...base, speed: 1 };
    const { xMax } = figureScale([launch], plot);
    expect(xMax).toBeGreaterThanOrEqual(launchRange(launch));
    expect(xMax).toBeLessThan(1);
  });
});
