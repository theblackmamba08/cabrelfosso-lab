/** Les deux solveurs de 3-SAT sur les 2 080 énigmes de la graine 2026 (cahier, annexe D.3). */
import { describe, expect, it } from "vitest";
import { alphaCount, drawPuzzle, sizes } from "../../src/demos/three-sat/puzzle";
import { solveFast } from "../../src/demos/three-sat/solve-fast";
import { solveWithTrace } from "../../src/demos/three-sat/solve-trace";
import { satisfies } from "../../src/demos/three-sat/trace-view";

describe("2 080 énigmes de la graine 2026 : les deux solveurs concordent", () => {
  it.each(sizes)(
    "n = %i : même résultat, mêmes choix (au moins 1), solutions valides",
    (n) => {
      let checked = 0;
      for (let k = 0; k < alphaCount; k++) {
        for (let j = 0; j < 20; j++) {
          const puzzle = drawPuzzle({ seed: 2026, n, k, j });
          const { satisfiable, choices, assignment } = solveWithTrace(puzzle);
          expect(solveFast(puzzle), `k = ${k}, j = ${j}`).toEqual({ satisfiable, choices, assignment });
          expect(choices).toBeGreaterThanOrEqual(1);
          if (assignment) expect(satisfies(puzzle, assignment)).toBe(true);
          checked++;
        }
      }
      expect(checked).toBe(520);
    },
    120_000,
  );
});
