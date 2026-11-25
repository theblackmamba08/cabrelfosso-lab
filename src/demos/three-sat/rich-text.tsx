import { Fragment } from "react";

const digits = "₀₁₂₃₄₅₆₇₈₉";

/**
 * Texte du cahier mis en forme : `**gras**`, indices Unicode en indices HTML, et symboles dans la
 * police des formules (son sous-ensemble grec contient α ; ∨ et ∧ viennent d'une police de repli).
 */
export function RichText({ text }: { text: string }): React.ReactNode {
  return text.split(/(\*\*.+?\*\*|[₀-₉]+|[α¬∨∧]+)/).map((part, index) => {
    if (part.startsWith("**")) {
      return (
        <strong key={index}>
          <RichText text={part.slice(2, -2)} />
        </strong>
      );
    }
    if (/^[₀-₉]/.test(part)) return <sub key={index}>{[...part].map((digit) => digits.indexOf(digit)).join("")}</sub>;
    if (/^[α¬∨∧]/.test(part)) {
      return (
        <span key={index} className="font-mono">
          {part}
        </span>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
