import type { Messages } from "@/i18n/messages/fr";
import { fill } from "./format";
import type { Clause } from "./puzzle";
import type { Solution, TraceEvent } from "./solve-trace";

type Texts = Pick<Messages["demos"]["three-sat"]["steps"], "messages" | "values">;

/** Nom d'une variable ; l'indice Unicode devient un indice HTML dans RichText. */
const subscript = (index: number) => [...String(index)].map((digit) => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)]).join("");
const variableName = (index: number) => `x${subscript(index)}`;

/** Clause affichée : « x₁ ∨ ¬x₃ ∨ x₅ ». */
export function clauseSymbols(clause: Clause): string {
  return clause.map((literal) => (literal < 0 ? "¬" : "") + variableName(Math.abs(literal))).join(" ∨ ");
}

/** Clause lue à voix haute : « x₁ ou non x₃ ou x₅ ». */
export function clauseWords(clause: Clause, words: { or: string; not: string }): string {
  return clause
    .map((literal) => (literal < 0 ? `${words.not} ` : "") + variableName(Math.abs(literal)))
    .join(` ${words.or} `);
}

/** Message d'une étape de la trace (annexe D.3). */
export function stepMessage(
  event: TraceEvent,
  { assignment, choices }: Pick<Solution, "assignment" | "choices">,
  { messages, values }: Texts,
): string {
  const valueOf = (value: boolean) => (value ? values.true : values.false);
  switch (event.type) {
    case "choice":
      return fill(event.value ? messages.choiceTrue : messages.choiceFalse, { i: subscript(event.variable) });
    case "propagation": {
      const value = valueOf(event.value);
      return fill(messages.propagation, {
        c: String(event.clause),
        i: subscript(event.variable),
        valeur: value,
        value,
      });
    }
    case "conflict":
      return fill(messages.conflict, { c: String(event.clause) });
    case "backtrack":
      return fill(messages.backtrack, { i: subscript(event.variable) });
    case "solution": {
      const list = (assignment ?? [])
        .map((value, index) => {
          const name = variableName(index + 1);
          return value === null ? `${name} ${values.free}` : `${name} = ${valueOf(value)}`;
        })
        .join(", ");
      return fill(messages.solution, { k: String(choices), affectation: list, assignment: list });
    }
    case "none":
      return fill(messages.none, { k: String(choices) });
  }
}
