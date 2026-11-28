import { Fragment } from "react";
import { parseMath } from "../projectile/math";

/** Mesures algébriques de la page française : surmontées d'une barre, sans caractère ajouté. */
const measures = /(A′B′|OA′|OF′|OA|AB)/;

function Measured({ text, bars }: { text: string; bars: boolean }) {
  if (!bars) return text;
  return text.split(measures).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="overline">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/**
 * Texte de la lentille : ce qui est entre deux `$` est une formule (notation de MathText) ;
 * en français, les mesures algébriques sont surmontées d'une barre.
 */
export function LensText({ source, bars }: { source: string; bars: boolean }) {
  return source.split("$").map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-mono text-sm whitespace-nowrap">
        {parseMath(part).map(({ kind, value }, token) => {
          if (kind === "variable") return <i key={token}>{value}</i>;
          if (kind === "sub") return <sub key={token}>{value}</sub>;
          if (kind === "sup") return <sup key={token}>{value}</sup>;
          return <Measured key={token} text={value} bars={bars} />;
        })}
      </span>
    ) : (
      <Measured key={index} text={part} bars={bars} />
    ),
  );
}
