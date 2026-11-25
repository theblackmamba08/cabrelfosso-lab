import { describe, expect, it } from "vitest";
import { alphaCount, drawPuzzle, sizes, stepPuzzle, type Clause, type Puzzle } from "./puzzle";
import { solveFast } from "./solve-fast";
import { solveWithTrace, type TraceEvent } from "./solve-trace";
import { satisfies } from "./trace-view";

/** Trace dans l'écriture de l'annexe D.3. */
function written(events: readonly TraceEvent[]): string {
  const value = (v: boolean) => (v ? "vrai" : "faux");
  return events
    .map((event) => {
      switch (event.type) {
        case "choice":
          return `choix x${event.variable} = ${value(event.value)}`;
        case "propagation":
          return `propagation c${event.clause} : x${event.variable} = ${value(event.value)}`;
        case "conflict":
          return `conflit c${event.clause}`;
        case "backtrack":
          return `retour x${event.variable}`;
        case "solution":
          return "solution";
        case "none":
          return "aucune solution";
      }
    })
    .join(" ; ");
}

const T = true;
const F = false;
const N = null;

const cases: Array<[string, Puzzle, boolean, number, Array<boolean | null> | null, string]> = [
  ["H1", { n: 3, clauses: [[1, 2, 3]] }, T, 1, [T, N, N], "choix x1 = vrai ; solution"],
  [
    "H2",
    {
      n: 3,
      clauses: [[1, 2, 3], [1, 2, -3], [1, -2, 3], [1, -2, -3], [-1, 2, 3], [-1, 2, -3], [-1, -2, 3], [-1, -2, -3]],
    },
    F,
    6,
    null,
    "choix x1 = vrai ; choix x2 = vrai ; propagation c7 : x3 = vrai ; conflit c8 ; retour x2 ; choix x2 = faux ; propagation c5 : x3 = vrai ; conflit c6 ; retour x2 ; retour x1 ; choix x1 = faux ; choix x2 = vrai ; propagation c3 : x3 = vrai ; conflit c4 ; retour x2 ; choix x2 = faux ; propagation c1 : x3 = vrai ; conflit c2 ; retour x2 ; retour x1 ; aucune solution",
  ],
  [
    "H3",
    { n: 3, clauses: [[-1, 2, 3], [-1, -2, 3], [-1, 2, -3], [-1, -2, -3]] },
    T,
    4,
    [F, N, N],
    "choix x1 = vrai ; choix x2 = vrai ; propagation c2 : x3 = vrai ; conflit c4 ; retour x2 ; choix x2 = faux ; propagation c1 : x3 = vrai ; conflit c3 ; retour x2 ; retour x1 ; choix x1 = faux ; solution",
  ],
  [
    "H4",
    { n: 4, clauses: [[1, 2, 3], [-1, 2, 4], [-2, -3, 4], [-4, 1, -3], [-4, -1, 3]] },
    T,
    3,
    [T, T, T, T],
    "choix x1 = vrai ; choix x2 = vrai ; choix x3 = vrai ; propagation c3 : x4 = vrai ; solution",
  ],
  [
    "pas à pas, graine 2026, n° 2",
    stepPuzzle(2026, 2),
    T,
    4,
    [T, F, T, T, T, T],
    "choix x1 = vrai ; choix x2 = vrai ; propagation c3 : x4 = faux ; conflit c5 ; retour x2 ; choix x2 = faux ; choix x3 = vrai ; propagation c6 : x5 = vrai ; propagation c1 : x4 = vrai ; propagation c2 : x6 = vrai ; solution",
  ],
];

describe.each(cases)("%s (annexe D.3)", (_name, puzzle, satisfiable, choices, assignment, trace) => {
  it("solveur avec trace : résultat, choix, affectation, trace complète", () => {
    const result = solveWithTrace(puzzle);
    expect(result.satisfiable).toBe(satisfiable);
    expect(result.choices).toBe(choices);
    expect(result.assignment).toEqual(assignment);
    expect(written(result.events)).toBe(trace);
  });

  it("solveur rapide : même résultat, mêmes choix, même affectation", () => {
    expect(solveFast(puzzle)).toEqual({ satisfiable, choices, assignment });
  });
});

describe("énigmes du mode pas à pas, graine 2026", () => {
  it("n° 1 : 3 choix sans conflit ; n° 3 : 5 choix ; n° 4 : 2 choix", () => {
    const solve = (number: number) => solveWithTrace(stepPuzzle(2026, number));
    expect(solve(1).choices).toBe(3);
    expect(solve(1).events.some((event) => event.type === "conflict")).toBe(false);
    expect(solve(3).choices).toBe(5);
    expect(solve(4).choices).toBe(2);
  });
});

/** Petites énigmes au hasard, avec un générateur indépendant de celui du site. */
function smallPuzzles(count: number): Puzzle[] {
  let state = 12345;
  const random = (below: number) => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return (state >>> 12) % below;
  };
  return Array.from({ length: count }, () => {
    const n = 6 + random(7);
    const m = n * 2 + random(n * 4);
    const clauses = Array.from({ length: m }, () => {
      const variables = new Set<number>();
      while (variables.size < 3) variables.add(1 + random(n));
      return [...variables].map((v) => (random(2) === 1 ? -v : v)) as unknown as Clause;
    });
    return { n, clauses };
  });
}

function exhaustive({ n, clauses }: Puzzle): boolean {
  for (let bits = 0; bits < 2 ** n; bits++) {
    if (clauses.every((c) => c.some((l) => ((bits >> (Math.abs(l) - 1)) & 1) === (l > 0 ? 1 : 0)))) return true;
  }
  return false;
}

it("500 petites énigmes : résultat de la recherche exhaustive ; toute solution satisfait toutes les clauses", () => {
  let satisfiable = 0;
  for (const puzzle of smallPuzzles(500)) {
    const expected = exhaustive(puzzle);
    const { events, ...result } = solveWithTrace(puzzle);
    expect(result.satisfiable).toBe(expected);
    expect(solveFast(puzzle)).toEqual(result);
    expect(events.at(-1)?.type).toBe(expected ? "solution" : "none");
    if (result.assignment) expect(satisfies(puzzle, result.assignment)).toBe(true);
    satisfiable += Number(expected);
  }
  // L'échantillon contient les deux sortes d'énigmes.
  expect(satisfiable).toBeGreaterThan(50);
  expect(satisfiable).toBeLessThan(450);
});

// Les 2 080 énigmes de l'annexe D.3 (20 par α) sont dans tests/integration/three-sat.test.ts : trop long ici.
describe("échantillon de la graine 2026 : les deux solveurs concordent", () => {
  it.each(sizes)("n = %i : même résultat, mêmes choix, même affectation", (n) => {
    for (let k = 0; k < alphaCount; k++) {
      for (let j = 0; j < 2; j++) {
        const puzzle = drawPuzzle({ seed: 2026, n, k, j });
        const { events, ...result } = solveWithTrace(puzzle);
        expect(solveFast(puzzle)).toEqual(result);
        expect(events[0].type).toBe("choice");
      }
    }
  });
});
