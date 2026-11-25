export type Answer = "higher" | "lower" | "found";

/**
 * Partie (annexe E.3) : nombres encore possibles, de `low` à `high`. Chaque état garde le
 * précédent : annuler le rend tel quel, et l'historique se lit en remontant.
 */
export type Game = {
  n: number;
  low: number;
  high: number;
  status: "ready" | "asking" | "found" | "contradiction";
  /** Nombre de réponses données. */
  answers: number;
  /** Dernière réponse, et l'état d'avant. */
  last: { answer: Answer; before: Game } | null;
};

/** Nouvelle partie : elle attend que le nombre soit choisi. */
export function newGame(n: number): Game {
  return { n, low: 1, high: n, status: "ready", answers: 0, last: null };
}

export function start(game: Game): Game {
  return { ...newGame(game.n), status: "asking" };
}

/** Nombre proposé : celui du milieu, arrondi à l'entier inférieur. */
export function guess({ low, high }: Game): number {
  return Math.floor((low + high) / 2);
}

export function remaining({ low, high }: Game): number {
  return high - low + 1;
}

export function answer(game: Game, given: Answer): Game {
  if (game.status !== "asking") return game;
  const proposed = guess(game);
  const low = given === "higher" ? proposed + 1 : given === "found" ? proposed : game.low;
  const high = given === "lower" ? proposed - 1 : given === "found" ? proposed : game.high;
  return {
    n: game.n,
    low,
    high,
    status: given === "found" ? "found" : low > high ? "contradiction" : "asking",
    answers: game.answers + 1,
    last: { answer: given, before: game },
  };
}

/** État d'avant la dernière réponse. */
export function undo(game: Game): Game {
  return game.last?.before ?? game;
}

/** Rang de la question en cours ; une fois la partie finie, nombre de questions posées. */
export function questionNumber(game: Game): number {
  return game.status === "asking" ? game.answers + 1 : game.answers;
}

/** Questions posées et réponses, dans l'ordre. */
export function history(game: Game): Array<{ guess: number; answer: Answer }> {
  const steps: Array<{ guess: number; answer: Answer }> = [];
  for (let { last } = game; last; last = last.before.last) {
    steps.unshift({ guess: guess(last.before), answer: last.answer });
  }
  return steps;
}

/** Q(N) = ⌊log₂ N⌋ + 1 : nombre de fois qu'on peut couper N en deux, plus un (calcul entier). */
export function maxQuestions(n: number): number {
  let questions = 0;
  for (let left = n; left > 0; left = Math.floor(left / 2)) questions++;
  return questions;
}
