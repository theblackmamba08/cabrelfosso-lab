import type { Puzzle } from "./puzzle";
import type { Solution } from "./solve-trace";

/**
 * Solveur DPLL rapide, pour les courbes : listes d'occurrences et compteurs, sans trace.
 * Une propagation menée à son terme donne la même affectation, ou le même échec, quel que soit
 * l'ordre des clauses : le nombre de choix est celui du solveur avec trace (annexe D.2).
 */
export function solveFast({ n, clauses }: Puzzle): Solution {
  const m = clauses.length;
  const literals = new Int8Array(3 * m);
  /** Clauses où figure chaque littéral ; le littéral l est à l'indice l + n. */
  const occurrences: number[][] = Array.from({ length: 2 * n + 1 }, () => []);
  clauses.forEach((clause, c) =>
    clause.forEach((literal, i) => {
      literals[3 * c + i] = literal;
      occurrences[literal + n].push(c);
    }),
  );
  /** Valeur de chaque variable : 1 vrai, −1 faux, 0 libre. */
  const values = new Int8Array(n + 1);
  const trueCount = new Uint8Array(m);
  const falseCount = new Uint8Array(m);
  const trail: number[] = [];
  /** Indice de la piste avant chaque choix en cours. */
  const starts: number[] = [];
  let choices = 0;

  /** Rend un littéral vrai. Faux si une clause devient fausse (les compteurs restent complets). */
  const assign = (literal: number): boolean => {
    values[Math.abs(literal)] = literal > 0 ? 1 : -1;
    trail.push(literal);
    for (const c of occurrences[literal + n]) trueCount[c]++;
    let ok = true;
    for (const c of occurrences[n - literal]) {
      if (++falseCount[c] === 3) ok = false;
    }
    return ok;
  };

  /** Propage les littéraux de la piste à partir de l'indice `from`. Faux en cas de conflit. */
  const propagate = (from: number): boolean => {
    for (let head = from; head < trail.length; head++) {
      for (const c of occurrences[n - trail[head]]) {
        if (trueCount[c] !== 0 || falseCount[c] !== 2) continue;
        for (let i = 3 * c; i < 3 * c + 3; i++) {
          const literal = literals[i];
          if (values[Math.abs(literal)] !== 0) continue;
          if (!assign(literal)) return false;
          break;
        }
      }
    }
    return true;
  };

  const undo = (start: number) => {
    while (trail.length > start) {
      const literal = trail.pop()!;
      values[Math.abs(literal)] = 0;
      for (const c of occurrences[literal + n]) trueCount[c]--;
      for (const c of occurrences[n - literal]) falseCount[c]--;
    }
  };

  /** Plus petite variable libre d'une clause pas encore vraie ; 0 s'il n'y en a pas. */
  const nextVariable = (): number => {
    for (let variable = 1; variable <= n; variable++) {
      if (values[variable] !== 0) continue;
      for (const c of occurrences[n + variable]) if (trueCount[c] === 0) return variable;
      for (const c of occurrences[n - variable]) if (trueCount[c] === 0) return variable;
    }
    return 0;
  };

  const choose = (literal: number): boolean => {
    choices++;
    const start = trail.length;
    starts.push(start);
    return assign(literal) && propagate(start);
  };

  // Une clause a toujours trois littéraux : rien à propager avant le premier choix.
  for (;;) {
    const variable = nextVariable();
    if (variable === 0) {
      const assignment = Array.from(values.subarray(1), (value) => (value === 0 ? null : value === 1));
      return { satisfiable: true, choices, assignment };
    }
    let ok = choose(variable);
    while (!ok) {
      const start = starts.pop();
      if (start === undefined) return { satisfiable: false, choices, assignment: null };
      const decision = trail[start];
      undo(start);
      if (decision > 0) ok = choose(-decision);
    }
  }
}
