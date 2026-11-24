import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { figureScale, type PlotArea } from "./figure-scale";
import { formatTick } from "./format";
import { flightTime, position, trajectoryPoints, type Launch } from "./physics";

const plot: PlotArea = { left: 64, top: 36, width: 480, height: 260 };
const axisY = plot.top + plot.height;

type Scale = ReturnType<typeof figureScale>;

function curve(launch: Launch, { toSvg }: Scale) {
  return trajectoryPoints(launch)
    .map(toSvg)
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
}

/**
 * Figure du tir, sans état : elle sert au rendu serveur comme à la démo interactive.
 * Le SVG s'étire avec la colonne : la taille du texte compense, pour qu'il reste lisible à 320 px.
 */
export function ProjectileFigure({
  launch,
  kept,
  progress,
  locale,
  summary,
}: {
  launch: Launch;
  kept: Launch | null;
  /** Part du vol parcourue par le projectile, de 0 à 1. */
  progress: number;
  locale: Locale;
  summary: string;
}) {
  const scale = figureScale(kept ? [launch, kept] : [launch], plot);
  const projectile = scale.toSvg(position(launch, progress * flightTime(launch)));

  return (
    <svg
      viewBox="0 0 560 360"
      role="img"
      aria-label={summary}
      className="h-auto w-full fill-ink-muted text-[22px] min-[480px]:text-[16px] lg:text-[13px]"
    >
      {scale.xTicks.map((tick) => {
        const { x } = scale.toSvg({ x: tick, y: 0 });
        return (
          <g key={tick}>
            <line x1={x} y1={plot.top} x2={x} y2={axisY} stroke="var(--line)" />
            <text x={x} y={axisY} dy="1.3em" textAnchor="middle">
              {formatTick(tick, locale)}
            </text>
          </g>
        );
      })}
      {scale.yTicks.map((tick) => {
        const { y } = scale.toSvg({ x: 0, y: tick });
        return (
          <g key={tick}>
            <line x1={plot.left} y1={y} x2={plot.left + plot.width} y2={y} stroke="var(--line)" />
            <text x={plot.left - 8} y={y} dy="0.35em" textAnchor="end">
              {formatTick(tick, locale)}
            </text>
          </g>
        );
      })}
      <line x1={plot.left} y1={axisY} x2={plot.left + plot.width} y2={axisY} stroke="var(--ink-muted)" />
      <line x1={plot.left} y1={plot.top} x2={plot.left} y2={axisY} stroke="var(--ink-muted)" />
      <text x={plot.left + plot.width} y={axisY} dy="2.6em" textAnchor="end">
        x (m)
      </text>
      <text x={plot.left} y={plot.top} dy="-0.6em" textAnchor="middle">
        y (m)
      </text>

      {kept && (
        <path
          d={curve(kept, scale)}
          fill="none"
          stroke="var(--ink-muted)"
          strokeWidth="2"
          strokeDasharray="7 6"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path
        d={curve(launch, scale)}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={projectile.x.toFixed(2)}
        cy={projectile.y.toFixed(2)}
        r="7"
        fill="var(--accent)"
        stroke="var(--paper)"
        strokeWidth="2"
      />
    </svg>
  );
}

function Swatch({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg width="28" height="8" aria-hidden="true" className="shrink-0">
      <line
        x1="0"
        y1="4"
        x2="28"
        y2="4"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={dashed ? "7 6" : undefined}
      />
    </svg>
  );
}

/** Légende : le tir gardé n'y figure qu'après « Garder ce tir pour comparer ». */
export function FigureLegend({
  legend,
  hasKept,
}: {
  legend: Messages["demos"]["projectile"]["legend"];
  hasKept: boolean;
}) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
      <li className="flex items-center gap-2">
        <Swatch color="var(--accent)" />
        {legend.current}
      </li>
      {hasKept && (
        <li className="flex items-center gap-2">
          <Swatch color="var(--ink-muted)" dashed />
          {legend.kept}
        </li>
      )}
    </ul>
  );
}
