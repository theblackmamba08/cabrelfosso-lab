import type { CurveData } from "./format";
import { alphaOf } from "./puzzle";
import { sharePercent, type AlphaPoint } from "./statistics";

/** Zone de tracé, dans le repère du SVG (viewBox 0 0 560 300). */
export const plot = { left: 84, top: 16, width: 456, height: 216 } as const;

/** Seuil prédit (cahier, annexe D.2) : ligne pointillée. */
export const predictedThreshold = 4.27;

export const axisTicks = [2, 3, 4, 5, 6, 7];
export const shareTicks = [0, 25, 50, 75, 100];

const [alphaMin, alphaMax] = [2, 7];
const bottom = plot.top + plot.height;

export const xAt = (alpha: number) => plot.left + ((alpha - alphaMin) / (alphaMax - alphaMin)) * plot.width;

export const yShare = (percent: number) => bottom - (percent / 100) * plot.height;

/** Première puissance de 10 strictement au-dessus du maximum affiché. */
export function logTop(max: number): number {
  let top = 10;
  while (top <= max) top *= 10;
  return top;
}

export function logTicks(top: number): number[] {
  const ticks = [];
  for (let tick = 1; tick <= top; tick *= 10) ticks.push(tick);
  return ticks;
}

export const yLog = (value: number, top: number) => bottom - (Math.log10(value) / Math.log10(top)) * plot.height;

export type Line = { n: number; points: Array<{ x: number; y: number }> };

/** Points des deux graphiques, à partir des courbes affichées. */
export function chartLines(curves: readonly CurveData[]): { share: Line[]; choices: Line[]; top: number } {
  const top = logTop(Math.max(1, ...curves.flatMap(({ points }) => points.map((point) => point.median))));
  const lines = (y: (point: AlphaPoint) => number): Line[] =>
    curves.map(({ n, points }) => ({ n, points: points.map((point) => ({ x: xAt(alphaOf(point.k)), y: y(point) })) }));
  return {
    share: lines((point) => yShare(sharePercent(point))),
    choices: lines((point) => yLog(point.median, top)),
    top,
  };
}
