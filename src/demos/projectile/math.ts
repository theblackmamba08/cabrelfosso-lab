/**
 * Formules écrites dans une notation courte : *x* pour une variable (italique),
 * _{0} pour un indice, ^{2} pour un exposant. `MathText` en fait du HTML.
 */
export type MathToken = {
  kind: "text" | "variable" | "sub" | "sup";
  value: string;
};

const tokenPattern = /\*([^*]+)\*|_\{([^}]+)\}|\^\{([^}]+)\}|([^*_^]+)/g;

export function parseMath(source: string): MathToken[] {
  return Array.from(source.matchAll(tokenPattern), ([, variable, sub, sup, text]) => {
    if (variable) return { kind: "variable", value: variable };
    if (sub) return { kind: "sub", value: sub };
    if (sup) return { kind: "sup", value: sup };
    return { kind: "text", value: text };
  });
}

const subscripts: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", v: "_v", lim: "_lim", o: "_o", i: "_i" };
const superscripts: Record<string, string> = { "2": "²", "20": "²⁰" };

/** Forme en texte simple, celle de l'annexe C.2. */
export function plainMath(source: string): string {
  return parseMath(source)
    .map(({ kind, value }) => {
      if (kind === "sub") return subscripts[value] ?? value;
      if (kind === "sup") return superscripts[value] ?? value;
      return value;
    })
    .join("");
}
