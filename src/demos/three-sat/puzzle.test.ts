import { describe, expect, it } from "vitest";
import { alphaCount, alphaOf, clauseCount, drawPuzzle, parseSeed, sizes, stepPuzzle } from "./puzzle";

const step2 = [
  [4, -5, -1], [6, -5, -4], [-2, -1, -4], [6, 3, 5], [-1, -2, 4], [5, -1, -3], [-5, 4, 1], [-2, 6, -1],
  [-4, -6, 1], [3, 4, 1], [3, 6, 2], [4, -6, 3], [-4, 3, -1], [3, -5, 2], [-2, 4, 3], [-4, -3, 6],
  [4, -2, -3], [-3, 4, 2], [-6, 4, 1], [3, -2, 5], [6, 4, -2], [4, -2, -1], [4, 3, 2], [5, 3, 2],
];

describe("réglages", () => {
  it("26 valeurs de α, de 2 à 7 par pas de 0,2 ; un nombre entier de clauses", () => {
    expect(alphaCount).toBe(26);
    expect([0, 1, 11, 25].map(alphaOf)).toEqual([2, 2.2, 4.2, 7]);
    expect(clauseCount(40, 11)).toBe(168);
    for (const n of sizes) {
      for (let k = 0; k < alphaCount; k++) {
        expect(Number.isInteger(clauseCount(n, k))).toBe(true);
        expect(clauseCount(n, k)).toBeCloseTo(n * alphaOf(k), 9);
      }
    }
  });
});

describe("tirage (annexe D.3)", () => {
  it("graine 2026, n = 20, k = 0, j = 0 : cinq premières clauses", () => {
    const { clauses } = drawPuzzle({ seed: 2026, n: 20, k: 0, j: 0 });
    expect(clauses).toHaveLength(40);
    expect(clauses.slice(0, 5)).toEqual([
      [-10, -7, 4],
      [7, -10, 4],
      [-11, 3, 18],
      [20, -8, -1],
      [-6, -13, 18],
    ]);
  });

  it("pas à pas, graine 2026, énigme n° 2 : les 24 clauses", () => {
    expect(stepPuzzle(2026, 2)).toEqual({ n: 6, clauses: step2 });
  });

  it("chaque clause a trois variables différentes, de 1 à n", () => {
    for (const { n, clauses } of [drawPuzzle({ seed: 7, n: 20, k: 25, j: 3 }), stepPuzzle(7, 256)]) {
      for (const clause of clauses) {
        const variables = clause.map(Math.abs);
        expect(new Set(variables).size).toBe(3);
        for (const v of variables) expect(v >= 1 && v <= n).toBe(true);
      }
    }
  });

  it("une énigme ne dépend que de son adresse", () => {
    const draw = (seed: number, j: number) => drawPuzzle({ seed, n: 30, k: 10, j });
    expect(draw(5, 4)).toEqual(draw(5, 4));
    expect(draw(5, 4)).not.toEqual(draw(5, 5));
    expect(draw(5, 4)).not.toEqual(draw(6, 4));
  });
});

describe("graine saisie", () => {
  it.each([
    ["2026", 2026],
    ["1", 1],
    ["999999", 999_999],
    [" 42 ", 42],
  ])("« %s » : %i", (text, seed) => expect(parseSeed(text)).toBe(seed));

  it.each(["", "0", "1000000", "abc", "-5", "1.5", "1,5", "1e3", "12 3"])("« %s » : invalide", (text) => {
    expect(parseSeed(text)).toBeNull();
  });
});
