import { puzzleStream, type PuzzleAddress } from "./random";

/** Réglages et tirage des énigmes (cahier, annexe D.2). */
export const sizes = [20, 30, 40, 50] as const;
export const puzzleCounts = [10, 20, 50, 100] as const;

export type Size = (typeof sizes)[number];

/** Nombre de valeurs de α : (10 + k) / 5 pour k = 0 à 25. */
export const alphaCount = 26;

export const alphaOf = (k: number) => (10 + k) / 5;

export const clauseCount = (n: number, k: number) => (n * (10 + k)) / 5;

/** Littéral : numéro de la variable, négatif si elle est niée. */
export type Clause = readonly [number, number, number];

export type Puzzle = { n: number; clauses: readonly Clause[] };

/** Trois variables différentes, dans l'ordre du tirage, puis leurs signes (bit de poids fort). */
function drawClause(n: number, next: () => number): Clause {
  const variables: number[] = [];
  while (variables.length < 3) {
    const variable = 1 + Math.floor((next() * n) / 2 ** 32);
    if (!variables.includes(variable)) variables.push(variable);
  }
  const [a, b, c] = variables.map((variable) => (next() >= 2 ** 31 ? -variable : variable));
  return [a, b, c];
}

function draw(address: PuzzleAddress, count: number): Puzzle {
  const next = puzzleStream(address);
  return { n: address.n, clauses: Array.from({ length: count }, () => drawClause(address.n, next)) };
}

/** Énigme d'une courbe : j de 0 à F − 1. */
export function drawPuzzle(address: Omit<PuzzleAddress, "tag">): Puzzle {
  return draw({ ...address, tag: 0 }, clauseCount(address.n, address.k));
}

/** Nombre d'énigmes du mode pas à pas pour une graine. */
export const stepPuzzleCount = 256;

/** Énigme du mode pas à pas : 6 variables, 24 clauses, numéro de 1 à 256. */
export function stepPuzzle(seed: number, number: number): Puzzle {
  return draw({ seed, tag: 1, n: 6, k: 0, j: number - 1 }, 24);
}

export const seedRange = { min: 1, max: 999_999 } as const;

/** Graine saisie, ou null si ce n'est pas un entier de 1 à 999 999. */
export function parseSeed(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const seed = Number(trimmed);
  return seed >= seedRange.min && seed <= seedRange.max ? seed : null;
}
