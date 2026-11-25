import { Fragment } from "react";
import { parseMath } from "./math";

/** Formule en HTML : variables en italique, indices et exposants ; aucune bibliothèque. */
export function MathText({ source }: { source: string }) {
  return parseMath(source).map(({ kind, value }, index) => {
    if (kind === "variable") return <i key={index}>{value}</i>;
    if (kind === "sub") return <sub key={index}>{value}</sub>;
    if (kind === "sup") return <sup key={index}>{value}</sup>;
    return <Fragment key={index}>{value}</Fragment>;
  });
}
