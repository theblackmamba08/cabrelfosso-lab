import type { Messages } from "@/i18n/messages/fr";
import { frame, lensDiagram, type Point } from "./geometry";
import { objectHeight, type Setup } from "./lens";

/** Unités SVG par cm : le repère est orthonormé. */
const scale = 12;
const width = (frame.right - frame.left) * scale;
const height = (frame.top - frame.bottom) * scale;

const toSvg = ({ x, y }: Point) => ({ x: (x - frame.left) * scale, y: (frame.top - y) * scale });
const path = (points: readonly Point[]) =>
  points
    .map(toSvg)
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join("");

/** Flèche verticale du pied (x, 0) à la tête (x, top), en cm. */
function Arrow({ x, top, color, dashed, name }: { x: number; top: number; color: string; dashed?: boolean; name: string }) {
  const foot = toSvg({ x, y: 0 });
  const head = toSvg({ x, y: top });
  const side = top >= 0 ? 1 : -1;
  return (
    <g data-arrow={name}>
      <line
        x1={foot.x.toFixed(2)}
        y1={foot.y.toFixed(2)}
        x2={head.x.toFixed(2)}
        y2={head.y.toFixed(2)}
        stroke={color}
        strokeWidth="4"
        strokeDasharray={dashed ? "9 7" : undefined}
      />
      <path
        d={`M${(head.x - 8).toFixed(2)} ${(head.y + 12 * side).toFixed(2)}L${head.x.toFixed(2)} ${head.y.toFixed(2)}L${(head.x + 8).toFixed(2)} ${(head.y + 12 * side).toFixed(2)}`}
        fill="none"
        stroke={color}
        strokeWidth="4"
      />
    </g>
  );
}

/**
 * Figure de la lentille, sans état ni animation : elle suit les réglages (annexe F.1). Comme
 * celle du projectile, elle s'étire avec la colonne et la taille du texte compense.
 */
export function LensFigure({ setup, summary }: { setup: Setup; summary: string }) {
  const { rays, extensions, image } = lensDiagram(setup);
  const center = toSvg({ x: 0, y: 0 });
  const lensTop = toSvg({ x: 0, y: 13 });
  const lensBottom = toSvg({ x: 0, y: -13 });
  const foci = [
    { x: -setup.focal, label: "F" },
    { x: setup.focal, label: "F′" },
  ];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={summary}
      className="h-auto w-full fill-ink text-[40px] min-[480px]:text-[30px] lg:text-[24px]"
    >
      <line x1="0" y1={center.y} x2={width} y2={center.y} stroke="var(--ink-muted)" strokeWidth="1.5" />
      <line x1={center.x} y1={lensTop.y} x2={center.x} y2={lensBottom.y} stroke="var(--ink)" strokeWidth="3" />
      <path
        d={`M${center.x - 10} ${lensTop.y + 14}L${center.x} ${lensTop.y}L${center.x + 10} ${lensTop.y + 14}M${center.x - 10} ${lensBottom.y - 14}L${center.x} ${lensBottom.y}L${center.x + 10} ${lensBottom.y - 14}`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      {foci.map(({ x, label }) => {
        const point = toSvg({ x, y: 0 });
        return (
          <g key={label}>
            <line x1={point.x} y1={point.y - 8} x2={point.x} y2={point.y + 8} stroke="var(--ink)" strokeWidth="3" />
            <text x={point.x} y={point.y} dy="1.2em" textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}
      <g data-lens-rays="" fill="none" stroke="var(--accent)" strokeWidth="2">
        {rays.map((ray) => (
          <path key={ray.id} data-ray={ray.id} d={path(ray.points)} />
        ))}
      </g>
      <g fill="none" stroke="var(--ink-muted)" strokeWidth="2" strokeDasharray="9 7">
        {extensions.map((segment, index) => (
          <path key={index} data-extension="" d={path(segment)} />
        ))}
      </g>
      <Arrow name="object" x={-setup.distance} top={objectHeight} color="var(--ink)" />
      {image?.inFrame && (
        <Arrow name="image" x={image.x} top={image.top} color="var(--highlight)" dashed={image.x < 0} />
      )}
    </svg>
  );
}

type Legend = Messages["demos"]["converging-lens"]["legend"];

function Swatch({ color, width: stroke, dashed }: { color: string; width: number; dashed?: boolean }) {
  return (
    <svg width="28" height="8" aria-hidden="true" className="shrink-0">
      <line x1="0" y1="4" x2="28" y2="4" stroke={color} strokeWidth={stroke} strokeDasharray={dashed ? "6 4" : undefined} />
    </svg>
  );
}

/** Légende de la figure. */
export function LensLegend({ legend }: { legend: Legend }) {
  const items = [
    { text: legend.object, color: "var(--ink)", width: 4 },
    { text: legend.image, color: "var(--highlight)", width: 4 },
    { text: legend.rays, color: "var(--accent)", width: 2 },
    { text: legend.extensions, color: "var(--ink-muted)", width: 2, dashed: true },
  ];
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
      {items.map(({ text, ...swatch }) => (
        <li key={text} className="flex items-center gap-2">
          <Swatch {...swatch} />
          <span>{text}</span>
        </li>
      ))}
      <li className="flex items-center gap-2">
        <svg width="28" height="8" aria-hidden="true" className="shrink-0">
          <line x1="14" y1="0" x2="14" y2="8" stroke="var(--ink)" strokeWidth="2" />
        </svg>
        <span>{legend.foci}</span>
      </li>
    </ul>
  );
}
