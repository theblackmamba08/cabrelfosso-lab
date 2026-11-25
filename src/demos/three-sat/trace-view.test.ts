import { describe, expect, it } from "vitest";
import { stepPuzzle, type Puzzle } from "./puzzle";
import { solveWithTrace } from "./solve-trace";
import { choicesAfter, clauseState, replay, satisfies } from "./trace-view";

describe("état d'une clause", () => {
  const T = true;
  const F = false;
  const N = null;
  it.each([
    [[N, N, N], "pending"],
    [[F, N, N], "pending"],
    [[F, F, N], "unit"],
    [[F, F, F], "false"],
    [[T, N, N], "satisfied"],
    [[F, F, T], "satisfied"],
  ] as const)("(1, 2, 3) avec %o : %s", (assignment, state) => {
    expect(clauseState([1, 2, 3], assignment)).toBe(state);
  });

  it("tient compte de la négation", () => {
    expect(clauseState([-1, 2, -3], [T, F, N])).toBe("unit");
    expect(clauseState([-1, 2, -3], [F, N, N])).toBe("satisfied");
  });

  it("une clause à 3 littéraux n'interdit qu'une des 8 combinaisons", () => {
    for (const clause of [[1, 2, 3], [-1, 2, -3], [-1, -2, -3]] as const) {
      const states = Array.from({ length: 8 }, (_, bits) =>
        clauseState(clause, [0, 1, 2].map((i) => ((bits >> i) & 1) === 1)),
      );
      expect(states.filter((state) => state === "false")).toHaveLength(1);
      expect(states.filter((state) => state === "satisfied")).toHaveLength(7);
    }
  });
});

describe("déroulé de l'énigme n° 2 (graine 2026)", () => {
  const puzzle: Puzzle = stepPuzzle(2026, 2);
  const { events, assignment } = solveWithTrace(puzzle);

  it("affectation après chaque étape ; le retour annule le choix et sa suite", () => {
    const N = null;
    expect(replay(6, events, 0)).toEqual([N, N, N, N, N, N]);
    expect(replay(6, events, 3)).toEqual([true, true, N, false, N, N]);
    expect(replay(6, events, 4)).toEqual([true, true, N, false, N, N]); // conflit c5
    expect(replay(6, events, 5)).toEqual([true, N, N, N, N, N]); // retour x2
    expect(replay(6, events, 6)).toEqual([true, false, N, N, N, N]);
    expect(replay(6, events, events.length)).toEqual(assignment);
  });

  it("au conflit, la clause 5 est fausse ; à la fin, toutes sont satisfaites", () => {
    const states = (count: number) => puzzle.clauses.map((clause) => clauseState(clause, replay(6, events, count)));
    expect(states(4)[4]).toBe("false");
    expect(states(events.length).every((state) => state === "satisfied")).toBe(true);
    expect(states(0).every((state) => state === "pending")).toBe(true);
  });

  it("compte les choix faits", () => {
    expect([0, 1, 2, 5, 6, 7, 11].map((count) => choicesAfter(events, count))).toEqual([0, 1, 2, 2, 3, 4, 4]);
  });
});

it("satisfies : une affectation partielle suffit si chaque clause a un littéral vrai", () => {
  const puzzle: Puzzle = { n: 3, clauses: [[1, 2, 3], [1, -2, -3]] };
  expect(satisfies(puzzle, [true, null, null])).toBe(true);
  expect(satisfies(puzzle, [null, true, null])).toBe(false);
});
