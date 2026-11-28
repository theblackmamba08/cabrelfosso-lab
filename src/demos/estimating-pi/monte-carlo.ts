import { xoshiro128pp, xoshiroState } from "../three-sat/random";

/** Au plus 100 000 points ; la figure montre les 2 000 premiers (annexe F.2). */
export const maxPoints = 100_000;
export const shownLimit = 2000;

/** Clé de 64 bits : graine × 2³² + 2 × 2²⁴ (tag 2, n = k = j = 0 ; annexe D.2). */
export function piKey(seed: number): bigint {
  return (BigInt(seed) << BigInt(32)) + BigInt(2 * 2 ** 24);
}

export type PiPoint = { x: number; y: number; inside: boolean };

/** Points de la graine : deux sorties successives, x = r₁ / 2³², y = r₂ / 2³². */
export function pointStream(seed: number): () => PiPoint {
  const next = xoshiro128pp(xoshiroState(piKey(seed)));
  return () => {
    const x = next() / 2 ** 32;
    const y = next() / 2 ** 32;
    return { x, y, inside: x * x + y * y <= 1 };
  };
}

/** Série de points : total N, nombre n dans le quart de disque, premiers points pour la figure. */
export type Run = { seed: number; total: number; inside: number; points: readonly PiPoint[] };

export function emptyRun(seed: number): Run {
  return { seed, total: 0, inside: 0, points: [] };
}

/** Ajoute des points sans dépasser le maximum : la suite reprend là où elle s'était arrêtée. */
export function addPoints(run: Run, count: number): Run {
  const target = Math.min(run.total + count, maxPoints);
  const next = pointStream(run.seed);
  for (let i = 0; i < run.total; i++) next();
  let inside = run.inside;
  const points = [...run.points];
  for (let i = run.total; i < target; i++) {
    const point = next();
    if (point.inside) inside++;
    if (points.length < shownLimit) points.push(point);
  }
  return { seed: run.seed, total: target, inside, points };
}

/** π ≈ 4 n / N ; `null` tant qu'aucun point n'est lancé. */
export function estimate({ total, inside }: Run): number | null {
  return total === 0 ? null : (4 * inside) / total;
}

/** Écart |4 n / N − π|. */
export function difference(run: Run): number | null {
  const value = estimate(run);
  return value === null ? null : Math.abs(value - Math.PI);
}
