import type { Puzzle } from "./puzzle";
import { clauseState, type Assignment } from "./trace-view";

export type TraceEvent =
  | { type: "choice"; variable: number; value: boolean }
  | { type: "propagation"; clause: number; variable: number; value: boolean }
  | { type: "conflict"; clause: number }
  | { type: "backtrack"; variable: number }
  | { type: "solution" }
  | { type: "none" };

export type Solution = { satisfiable: boolean; choices: number; assignment: Assignment | null };

/**
 * Solveur DPLL avec trace, à la lettre de l'annexe D.2. Les clauses sont relues depuis la première
 * à chaque propagation : il est lent, et ne sert qu'au mode pas à pas et aux tests.
 */
export function solveWithTrace({ n, clauses }: Puzzle): Solution & { events: TraceEvent[] } {
  const assignment: Array<boolean | null> = Array.from({ length: n }, () => null);
  const events: TraceEvent[] = [];
  /** Variables affectées, dans l'ordre. */
  const trail: number[] = [];
  /** Choix en cours : sa variable, sa valeur, et la longueur de la piste avant lui. */
  const decisions: Array<{ variable: number; value: boolean; start: number }> = [];
  let choices = 0;

  const assign = (variable: number, value: boolean) => {
    assignment[variable - 1] = value;
    trail.push(variable);
  };
  const choose = (variable: number, value: boolean) => {
    decisions.push({ variable, value, start: trail.length });
    assign(variable, value);
    choices++;
    events.push({ type: "choice", variable, value });
  };

  /** Étape 1 : vrai si la propagation se termine sans conflit. */
  const propagate = (): boolean => {
    for (;;) {
      const states = clauses.map((clause) => clauseState(clause, assignment));
      const conflict = states.indexOf("false");
      if (conflict >= 0) {
        events.push({ type: "conflict", clause: conflict + 1 });
        return false;
      }
      const unit = states.indexOf("unit");
      if (unit < 0) return true;
      const literal = clauses[unit].find((l) => assignment[Math.abs(l) - 1] === null)!;
      const variable = Math.abs(literal);
      assign(variable, literal > 0);
      events.push({ type: "propagation", clause: unit + 1, variable, value: literal > 0 });
    }
  };

  /** Étape 4 : vrai si un choix avait encore une valeur à essayer. */
  const backtrack = (): boolean => {
    for (let last = decisions.pop(); last; last = decisions.pop()) {
      for (const variable of trail.splice(last.start)) assignment[variable - 1] = null;
      events.push({ type: "backtrack", variable: last.variable });
      if (last.value) {
        choose(last.variable, false);
        return true;
      }
    }
    return false;
  };

  for (;;) {
    if (!propagate()) {
      if (backtrack()) continue;
      events.push({ type: "none" });
      return { satisfiable: false, choices, assignment: null, events };
    }
    const open = clauses.filter((clause) => clauseState(clause, assignment) !== "satisfied");
    if (open.length === 0) {
      events.push({ type: "solution" });
      return { satisfiable: true, choices, assignment, events };
    }
    const free = open.flat().map(Math.abs).filter((variable) => assignment[variable - 1] === null);
    choose(Math.min(...free), true);
  }
}
