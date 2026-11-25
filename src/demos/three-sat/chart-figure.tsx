import { axisTicks, plot, predictedThreshold, xAt, type Line } from "./chart";
import type { Size } from "./puzzle";

type Marker = "circle" | "square" | "triangle" | "diamond";

/** Un trait et un marqueur par n : la couleur n'est jamais seule à les distinguer. */
export const curveStyles: Record<Size, { color: string; dash?: string; marker: Marker }> = {
  20: { color: "var(--ink-muted)", dash: "3 5", marker: "circle" },
  30: { color: "var(--ink)", dash: "12 5", marker: "square" },
  40: { color: "var(--accent)", marker: "triangle" },
  50: { color: "var(--ink)", dash: "12 4 3 4", marker: "diamond" },
};

const markerPaths: Record<Exclude<Marker, "circle">, string> = {
  square: "M-4 -4H4V4H-4Z",
  triangle: "M0 -5.5L5 4H-5Z",
  diamond: "M0 -6L5 0L0 6L-5 0Z",
};

function CurveMarker({ n, x, y }: { n: Size; x: number; y: number }) {
  const { color, marker } = curveStyles[n];
  // Le losange est creux, pour se distinguer du carré de même couleur.
  const fill = marker === "diamond" ? "var(--surface)" : color;
  const common = { fill, stroke: color, strokeWidth: 1.5 };
  return marker === "circle" ? (
    <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="4" {...common} />
  ) : (
    <path d={markerPaths[marker]} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`} {...common} />
  );
}

const bottom = plot.top + plot.height;
const right = plot.left + plot.width;

/**
 * Graphique sans état : axe α commun, graduations verticales et courbes reçues. Le SVG s'étire avec
 * la colonne : la taille du texte compense, pour qu'il reste lisible à 360 px.
 */
export function ChartFigure({
  label,
  axis,
  yTicks,
  xTick,
  lines,
}: {
  /** Nom accessible : titre et résumés. */
  label: string;
  axis: string;
  yTicks: ReadonlyArray<{ y: number; text: string }>;
  xTick: (alpha: number) => string;
  lines: readonly Line[];
}) {
  const threshold = xAt(predictedThreshold).toFixed(2);
  return (
    <svg
      viewBox="0 0 560 300"
      role="img"
      aria-label={label}
      className="h-auto w-full fill-ink-muted text-[22px] min-[480px]:text-[16px] lg:text-[13px]"
    >
      {yTicks.map(({ y, text }) => (
        <g key={text}>
          <line x1={plot.left} y1={y.toFixed(2)} x2={right} y2={y.toFixed(2)} stroke="var(--line)" />
          <text x={plot.left - 8} y={y.toFixed(2)} dy="0.35em" textAnchor="end">
            {text}
          </text>
        </g>
      ))}
      {axisTicks.map((alpha) => (
        <g key={alpha}>
          <line x1={xAt(alpha)} y1={plot.top} x2={xAt(alpha)} y2={bottom} stroke="var(--line)" />
          <text x={xAt(alpha)} y={bottom} dy="1.3em" textAnchor="middle">
            {xTick(alpha)}
          </text>
        </g>
      ))}
      <line x1={plot.left} y1={bottom} x2={right} y2={bottom} stroke="var(--ink-muted)" />
      <line x1={plot.left} y1={plot.top} x2={plot.left} y2={bottom} stroke="var(--ink-muted)" />
      <text x={right} y={bottom} dy="2.6em" textAnchor="end" className="font-mono">
        {axis}
      </text>
      <line
        x1={threshold}
        y1={plot.top}
        x2={threshold}
        y2={bottom}
        stroke="var(--ink-muted)"
        strokeWidth="2"
        strokeDasharray="2 4"
      />
      {lines.map(({ n, points }) => {
        const size = n as Size;
        const { color, dash } = curveStyles[size];
        return (
          <g key={n}>
            <polyline
              points={points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={dash}
            />
            {points.map(({ x, y }) => (
              <CurveMarker key={x} n={size} x={x} y={y} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** Légende : une entrée par courbe, puis la ligne pointillée. */
export function ChartLegend({
  curves,
  prediction,
}: {
  curves: ReadonlyArray<{ n: number; label: string }>;
  prediction: string;
}) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
      {curves.map(({ n, label }) => (
        <li key={n} className="flex items-center gap-2">
          <svg width="44" height="14" aria-hidden="true" className="shrink-0">
            <line
              x1="0"
              y1="7"
              x2="44"
              y2="7"
              stroke={curveStyles[n as Size].color}
              strokeWidth="2"
              strokeDasharray={curveStyles[n as Size].dash}
            />
            <CurveMarker n={n as Size} x={22} y={7} />
          </svg>
          {label}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <svg width="44" height="14" aria-hidden="true" className="shrink-0">
          <line x1="0" y1="7" x2="44" y2="7" stroke="var(--ink-muted)" strokeWidth="2" strokeDasharray="2 4" />
        </svg>
        {prediction}
      </li>
    </ul>
  );
}
