import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { fill } from "../fill";
import { guess, history, maxQuestions, questionNumber, remaining, type Game } from "./game";

type Texts = Messages["demos"]["think-of-a-number"];

/** Textes du jeu, sans ceux du reste de la page. */
export type GameTexts = Pick<
  Texts,
  | "controls"
  | "instruction"
  | "buttons"
  | "question"
  | "counter"
  | "possibilities"
  | "history"
  | "end"
  | "contradiction"
  | "bar"
>;

/** Entier avec séparateur de milliers (français : espace insécable ; anglais : virgule). */
export function formatInteger(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Ce qu'affiche le jeu ; `null` : rien. */
export function view(game: Game, texts: GameTexts, locale: Locale) {
  const number = (value: number) => formatInteger(value, locale);
  const { status } = game;
  const k = questionNumber(game);
  const left = remaining(game);
  const values = {
    N: number(game.n),
    Q: number(maxQuestions(game.n)),
    a: number(game.low),
    b: number(game.high),
    g: number(guess(game)),
    k: number(k),
    r: number(left),
  };

  const announcements: Record<Game["status"], string | null> = {
    ready: null,
    asking: texts.question,
    found: k === 1 ? texts.end.one : texts.end.many,
    contradiction: texts.contradiction,
  };
  const shown = (text: string | null) => (text === null ? null : fill(text, values));

  return {
    instruction: shown(status === "ready" ? texts.instruction : null),
    /** Question en cours ou issue de la partie : seul texte annoncé, une fois par réponse. */
    announcement: shown(announcements[status]),
    counter: shown(status === "asking" ? texts.counter : null),
    possibilities: shown(left === 0 ? null : left === 1 ? texts.possibilities.one : texts.possibilities.many),
    bar: shown(left === 0 ? null : texts.bar),
    history: history(game).map((step) => fill(texts.history[step.answer], { g: number(step.guess) })),
  };
}

/** Largeur minimale de la partie pleine de la barre, pour qu'elle reste visible. */
const minimum = 4;

/** Place de l'intervalle [low, high] dans une barre qui représente [1, N]. */
export function barSpan({ n, low, high }: Game, width: number): { x: number; width: number } {
  const span = Math.max(minimum, ((high - low + 1) * width) / n);
  return { x: Math.min(((low - 1) * width) / n, width - span), width: span };
}
