import { apexHeight, launchRange, type Launch, type Point } from "./physics";

/** Zone de tracé dans le repère du SVG. */
export type PlotArea = { left: number; top: number; width: number; height: number };

/** Plus petite valeur de la forme m × 10ⁿ qui atteint `value`. */
function roundUp(value: number, mantissas: readonly number[]): number {
  const power = 10 ** Math.floor(Math.log10(value));
  return (mantissas.find((mantissa) => mantissa * power >= value) ?? 10) * power;
}

/** Graduations multiples de `step`, de 0 à `max`. */
function ticks(max: number, step: number): number[] {
  const count = Math.floor(max / step + 1e-9);
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

/**
 * Échelle commune à tous les tirs affichés.
 * Repère orthonormé : un mètre a la même longueur sur les deux axes, donc l'angle de tir
 * et la forme de la parabole sont vrais. L'étendue avance par paliers : entre deux paliers,
 * la courbe grandit avec les réglages au lieu de garder la même taille à l'écran.
 */
export function figureScale(launches: readonly Launch[], plot: PlotArea) {
  const needed = Math.max(
    ...launches.map((launch) =>
      Math.max(launchRange(launch), (apexHeight(launch) * plot.width) / plot.height),
    ),
  );
  const xMax = roundUp(needed || 1, [1, 1.5, 2, 3, 5, 7.5, 10]);
  const yMax = (xMax * plot.height) / plot.width;
  const step = roundUp(xMax / 5, [1, 2, 5, 10]);
  const pixelsPerMetre = plot.width / xMax;

  return {
    xMax,
    yMax,
    xTicks: ticks(xMax, step),
    yTicks: ticks(yMax, step),
    toSvg: ({ x, y }: Point): Point => ({
      x: plot.left + x * pixelsPerMetre,
      y: plot.top + plot.height - y * pixelsPerMetre,
    }),
  };
}
