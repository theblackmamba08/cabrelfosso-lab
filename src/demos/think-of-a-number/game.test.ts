import { describe, expect, it } from "vitest";
import { between, tableRows } from "@/test/cahier";
import {
  answer,
  guess,
  history,
  maxQuestions,
  newGame,
  questionNumber,
  remaining,
  start,
  undo,
  type Answer,
  type Game,
} from "./game";

const section = between("#### Valeurs de contrôle du nombre mystère", "Calcul exhaustif");
const integer = (text: string) => Number(text.replace(/\s/g, ""));
const honest = (target: number, proposed: number): Answer =>
  target > proposed ? "higher" : target < proposed ? "lower" : "found";

/** Partie honnête, jusqu'à la fin. */
function play(n: number, target: number): Game {
  let game = start(newGame(n));
  while (game.status === "asking") game = answer(game, honest(target, guess(game)));
  return game;
}

describe("début et nouvelle partie", () => {
  it("une nouvelle partie attend « J'ai choisi », tous les nombres étant possibles", () => {
    const game = newGame(1000);
    expect(game).toMatchObject({ n: 1000, low: 1, high: 1000, status: "ready" });
    expect([remaining(game), history(game)]).toEqual([1000, []]);
  });

  it("commence par la question du milieu", () => {
    const game = start(newGame(1000));
    expect([game.status, guess(game), questionNumber(game)]).toEqual(["asking", 500, 1]);
  });
});

describe("Q(N) = ⌊log₂ N⌋ + 1", () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 2],
    [4, 3],
    [20, 5],
    [100, 7],
    [1000, 10],
    [1023, 10],
    [1024, 11],
    [1_000_000, 20],
  ])("Q(%i) = %i", (n, q) => {
    expect(maxQuestions(n)).toBe(q);
  });
});

describe("valeurs de contrôle de l'annexe E.3", () => {
  const rows = tableRows(section);

  it("le tableau a neuf lignes", () => {
    expect(rows).toHaveLength(9);
  });

  it.each(rows)("N = %s, nombre %s", (n, target, questions, count) => {
    const game = play(integer(n), integer(target));
    const asked = history(game);
    expect(asked.map((step) => step.guess)).toEqual(questions.split(",").map(integer));
    expect(asked).toHaveLength(integer(count));
    expect(questionNumber(game)).toBe(integer(count));
    expect(game).toMatchObject({ status: "found", low: integer(target), high: integer(target) });
    expect(guess(game)).toBe(integer(target));
  });
});

describe("contradiction (N = 100)", () => {
  it("les intervalles de l'annexe, puis la contradiction après 7 réponses", () => {
    let game = start(newGame(100));
    const intervals: number[][] = [];
    for (const given of ["higher", "lower", "higher", "higher", "higher", "higher", "higher"] as const) {
      expect(game.status).toBe("asking");
      game = answer(game, given);
      intervals.push([game.low, game.high]);
    }
    expect(intervals).toEqual([
      [51, 100],
      [51, 74],
      [63, 74],
      [69, 74],
      [72, 74],
      [74, 74],
      [75, 74],
    ]);
    expect(history(game).map((step) => step.guess)).toEqual([50, 75, 62, 68, 71, 73, 74]);
    expect(game.status).toBe("contradiction");
    expect(remaining(game)).toBe(0);
  });

  it("vient aussi de « Plus petit »", () => {
    let game = start(newGame(100));
    while (game.status === "asking") game = answer(game, "lower");
    expect(game).toMatchObject({ status: "contradiction", low: 1, high: 0 });
  });
});

describe("annulation", () => {
  it("rend exactement l'état précédent, plusieurs fois de suite", () => {
    const states = [start(newGame(100))];
    for (const given of ["higher", "lower", "found"] as const) states.push(answer(states[states.length - 1], given));
    let game = states[3];
    for (const before of [states[2], states[1], states[0]]) {
      game = undo(game);
      expect(game).toEqual(before);
    }
    expect(history(game)).toEqual([]);
    expect(undo(game)).toBe(game);
  });

  it("annule aussi une contradiction", () => {
    let game = start(newGame(100));
    for (let i = 0; i < 6; i++) game = answer(game, "higher");
    const before = game;
    game = answer(game, "higher");
    expect(game.status).toBe("contradiction");
    expect(undo(game)).toEqual(before);
  });
});

describe("réponses hors d'une question", () => {
  it("ne changent rien", () => {
    const ready = newGame(100);
    expect(answer(ready, "higher")).toBe(ready);
    const found = play(100, 37);
    expect(answer(found, "lower")).toBe(found);
  });
});

describe("calcul exhaustif : toutes les parties honnêtes", () => {
  it.each([
    [20, 5, 5, 3.7, 1],
    [100, 7, 37, 5.8, 1],
    [1000, 10, 489, 8.987, 3],
    [1_000_000, 20, 475_713, 18.9514, 4],
  ])("N = %i : %i questions au plus, pour %i nombres", (n, maximum, reached, mean, digits) => {
    let most = 0;
    let count = 0;
    let total = 0;
    for (let target = 1; target <= n; target++) {
      const questions = questionNumber(play(n, target));
      total += questions;
      if (questions > most) [most, count] = [questions, 0];
      if (questions === most) count++;
    }
    expect([most, count]).toEqual([maximum, reached]);
    expect(most).toBe(maxQuestions(n));
    expect(Number((total / n).toFixed(digits))).toBe(mean);
  }, 30_000);
});
