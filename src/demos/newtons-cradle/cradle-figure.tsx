import { ballDiameter, ballPositions } from "./motion";

/** Pixels SVG par mètre : à 45°, une bille reste dans le cadre, des deux côtés. */
const scale = 1300;
const width = 560;
const height = 316;
const barY = 26;
const barWidth = 7 * ballDiameter * scale;

const toSvgX = (x: number) => width / 2 + x * scale;
const toSvgY = (y: number) => barY - y * scale;

/** Figure du pendule, sans état : elle sert au rendu serveur comme à l'animation. */
export function CradleFigure({
  angles,
  summary,
}: {
  /** Angle de chaque bille, en radians. */
  angles: readonly number[];
  summary: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={summary} className="h-auto w-full">
      <rect
        x={(width - barWidth) / 2}
        y={barY - 8}
        width={barWidth}
        height="8"
        rx="4"
        fill="var(--ink-muted)"
      />
      {ballPositions(angles).map(({ anchor, x, y }, ball) => (
        <line
          key={ball}
          x1={toSvgX(anchor).toFixed(2)}
          y1={barY}
          x2={toSvgX(x).toFixed(2)}
          y2={toSvgY(y).toFixed(2)}
          stroke="var(--ink-muted)"
          strokeWidth="1.5"
        />
      ))}
      {ballPositions(angles).map(({ x, y }, ball) => (
        <circle
          key={ball}
          cx={toSvgX(x).toFixed(2)}
          cy={toSvgY(y).toFixed(2)}
          r={(ballDiameter * scale) / 2}
          fill="var(--accent)"
          stroke="var(--paper)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
