import { alphaOf, drawPuzzle, stepPuzzle, stepPuzzleCount } from "./puzzle";
import { solveFast } from "./solve-fast";
import { solveWithTrace } from "./solve-trace";

/** Médiane ; moyenne des deux valeurs centrales si leur nombre est pair. */
export function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/** Mesures pour une valeur de α ; `k` : son indice. */
export type AlphaPoint = { k: number; satisfiable: number; total: number; median: number };

/** Tire et résout les énigmes d'une valeur de α. `share` : part satisfiable en %, à l'entier. */
export function alphaPoint({ seed, n, k, puzzles }: { seed: number; n: number; k: number; puzzles: number }) {
  const choices: number[] = [];
  let satisfiable = 0;
  for (let j = 0; j < puzzles; j++) {
    const solution = solveFast(drawPuzzle({ seed, n, k, j }));
    choices.push(solution.choices);
    if (solution.satisfiable) satisfiable++;
  }
  const point = { k, satisfiable, total: puzzles, median: median(choices), choices };
  return { ...point, share: sharePercent(point) };
}

/** Part des énigmes satisfiables, en %, arrondie à l'entier. */
export function sharePercent({ satisfiable, total }: Pick<AlphaPoint, "satisfiable" | "total">): number {
  return Math.round((100 * satisfiable) / total);
}

export type CurveSummary =
  | { kind: "crossing"; a: number; b: number; c: number; d: number }
  | { kind: "above"; c: number; d: number }
  | { kind: "below"; a: number; c: number; d: number };

/** Résumé d'une courbe complète (annexe D.2, Mesure). */
export function curveSummary(points: readonly AlphaPoint[]): CurveSummary {
  const peak = points.reduce((best, point) => (point.median > best.median ? point : best));
  const [c, d] = [alphaOf(peak.k), peak.median];
  const first = points.findIndex((point) => 2 * point.satisfiable < point.total);
  if (first === -1) return { kind: "above", c, d };
  const alpha = alphaOf(points[first].k);
  if (first === 0) return { kind: "below", a: alpha, c, d };
  return { kind: "crossing", a: alphaOf(points[first - 1].k), b: alpha, c, d };
}

function hasConflict(seed: number, number: number): boolean {
  return solveWithTrace(stepPuzzle(seed, number)).events.some((event) => event.type === "conflict");
}

/** Énigme de départ du mode pas à pas : la première qui a un conflit, sinon la n° 1. */
export function startNumber(seed: number, test: (seed: number, number: number) => boolean = hasConflict): number {
  for (let number = 1; number <= stepPuzzleCount; number++) if (test(seed, number)) return number;
  return 1;
}

export function nextNumber(number: number): number {
  return number === stepPuzzleCount ? 1 : number + 1;
}
