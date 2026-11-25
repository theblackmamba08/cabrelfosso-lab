import type { Messages } from "@/i18n/messages/fr";
import { arcPath, labelAngle, pointAt, rays, type Point } from "./geometry";
import { refract, type Setup } from "./optics";

const width = 560;
const height = 360;
const center: Point = { x: width / 2, y: height / 2 };
const rayLength = 165;
const arcRadius = 46;
const labelRadius = 68;

const along = ({ x, y }: Point, distance: number): Point => ({ x: center.x + x * distance, y: center.y + y * distance });
const fixed = ({ x, y }: Point) => `${x.toFixed(2)} ${y.toFixed(2)}`;

/** Rayon de `from` à `to` (distances au point d'incidence, le long de sa direction), avec sa flèche. */
function Ray({
  name,
  direction,
  from,
  to,
  color,
  thick = true,
}: {
  name: string;
  direction: Point;
  from: number;
  to: number;
  color: string;
  thick?: boolean;
}) {
  const size = thick ? 8 : 6;
  // Flèche au-delà de l'arc et du nom de l'angle.
  const tip = along(direction, from < 0 ? -105 : 125);
  const base = { x: tip.x - 2 * size * direction.x, y: tip.y - 2 * size * direction.y };
  const side = { x: -direction.y * size * 0.8, y: direction.x * size * 0.8 };
  const corners = [1, -1].map((sign) => fixed({ x: base.x + sign * side.x, y: base.y + sign * side.y }));
  return (
    <g data-ray={name} data-thick={thick}>
      <path
        d={`M${fixed(along(direction, from))}L${fixed(along(direction, to))}`}
        fill="none"
        stroke={color}
        strokeWidth={thick ? 3.5 : 1.5}
      />
      <path d={`M${fixed(tip)}L${corners.join("L")}Z`} fill={color} />
    </g>
  );
}

/** Arc d'un angle et son nom, i₁ ou i₂. */
function Angle({ angle, ray, index }: { angle: number; ray: "incident" | "refracted"; index: 1 | 2 }) {
  const label = pointAt(center, labelRadius, labelAngle(angle), ray);
  return (
    <>
      <path data-arc="" d={arcPath(center, arcRadius, angle, ray)} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={label.x.toFixed(2)} y={label.y.toFixed(2)} dy="0.35em" textAnchor="middle" className="font-mono">
        <tspan className="italic">i</tspan>
        <tspan dy="0.3em" fontSize="0.75em">
          {index}
        </tspan>
      </text>
    </>
  );
}

/**
 * Figure de la réfraction, sans état ni animation : elle suit les réglages. Comme celle du
 * projectile, elle s'étire avec la colonne et la taille du texte compense.
 */
export function RefractionFigure({
  setup,
  media,
  summary,
}: {
  setup: Setup;
  media: Messages["demos"]["refraction"]["controls"]["media"];
  summary: string;
}) {
  const i2 = refract(setup);
  const { incident, reflected, refracted } = rays(setup.angle, i2);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={summary}
      className="h-auto w-full fill-ink text-[22px] min-[480px]:text-[16px] lg:text-[14px]"
    >
      <rect width={width} height={center.y} fill="var(--paper)" />
      <rect y={center.y} width={width} height={center.y} fill="var(--accent-soft)" />
      <line x1="0" y1={center.y} x2={width} y2={center.y} stroke="var(--ink-muted)" strokeWidth="1.5" />
      <line
        x1={center.x}
        y1="8"
        x2={center.x}
        y2={height - 8}
        stroke="var(--ink-muted)"
        strokeWidth="1.5"
        strokeDasharray="7 6"
      />
      <text x="14" y="14" dy="0.8em">
        {media[setup.from]}
      </text>
      <text x="14" y={height - 14}>
        {media[setup.to]}
      </text>
      {setup.angle > 0 && <Angle angle={setup.angle} ray="incident" index={1} />}
      {i2 !== null && i2 > 0 && <Angle angle={i2} ray="refracted" index={2} />}
      <Ray name="reflected" direction={reflected} from={0} to={rayLength} color="var(--accent)" thick={i2 === null} />
      <Ray name="incident" direction={incident} from={-rayLength} to={0} color="var(--accent)" />
      {refracted && <Ray name="refracted" direction={refracted} from={0} to={rayLength} color="var(--ink)" />}
    </svg>
  );
}

function Swatch({ color, width, dashed }: { color: string; width: number; dashed?: boolean }) {
  return (
    <svg width="28" height="8" aria-hidden="true" className="shrink-0">
      <line x1="0" y1="4" x2="28" y2="4" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "7 6" : undefined} />
    </svg>
  );
}

/** Légende : en réflexion totale, le rayon réfléchi est épais et il n'y a pas de rayon réfracté. */
export function RefractionLegend({
  legend,
  total,
}: {
  legend: Messages["demos"]["refraction"]["legend"];
  total: boolean;
}) {
  const items = [
    { text: legend.incident, color: "var(--accent)", width: 3.5 },
    { text: legend.reflected, color: "var(--accent)", width: total ? 3.5 : 1.5 },
    ...(total ? [] : [{ text: legend.refracted, color: "var(--ink)", width: 3.5 }]),
    { text: legend.normal, color: "var(--ink-muted)", width: 1.5, dashed: true },
  ];
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
      {items.map(({ text, ...swatch }) => (
        <li key={text} className="flex items-center gap-2">
          <Swatch {...swatch} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
