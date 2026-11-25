import type { Clause, Puzzle } from "./puzzle";
import type { TraceEvent } from "./solve-trace";

/** Valeur de chaque variable (indice = numéro − 1) ; null : libre. */
export type Assignment = ReadonlyArray<boolean | null>;

export type ClauseState = "satisfied" | "false" | "unit" | "pending";

/** État d'une clause ; unitaire : aucun littéral vrai, un seul littéral libre. */
export function clauseState(clause: Clause, assignment: Assignment): ClauseState {
  let free = 0;
  for (const literal of clause) {
    const value = assignment[Math.abs(literal) - 1];
    if (value === null) free++;
    else if (value === literal > 0) return "satisfied";
  }
  return free === 0 ? "false" : free === 1 ? "unit" : "pending";
}

/** Toutes les clauses sont vraies. */
export function satisfies({ clauses }: Puzzle, assignment: Assignment): boolean {
  return clauses.every((clause) => clauseState(clause, assignment) === "satisfied");
}

/** Affectation après les premières étapes d'une trace. */
export function replay(n: number, events: readonly TraceEvent[], count: number): Assignment {
  const assignment: Array<boolean | null> = Array.from({ length: n }, () => null);
  const trail: number[] = [];
  for (const event of events.slice(0, count)) {
    if (event.type === "choice" || event.type === "propagation") {
      assignment[event.variable - 1] = event.value;
      trail.push(event.variable);
    } else if (event.type === "backtrack") {
      // Le choix annulé est sur la piste : lui et tout ce qui l'a suivi redeviennent libres.
      for (const variable of trail.splice(trail.lastIndexOf(event.variable))) assignment[variable - 1] = null;
    }
  }
  return assignment;
}

/** Nombre de choix faits après les premières étapes d'une trace. */
export function choicesAfter(events: readonly TraceEvent[], count: number): number {
  return events.slice(0, count).filter((event) => event.type === "choice").length;
}
