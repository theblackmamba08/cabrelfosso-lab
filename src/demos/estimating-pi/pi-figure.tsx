import type { Messages } from "@/i18n/messages/fr";
import type { PiPoint } from "./monte-carlo";

const margin = 16;
const side = 320;
const size = side + 2 * margin;
const at = (value: number) => margin + value * side;
const atY = (value: number) => margin + (1 - value) * side;

/** Points du carré : disques pleins dans le quart de disque, petites croix dehors (pas la couleur seule). */
export function PiFigure({ points, summary }: { points: readonly PiPoint[]; summary: string }) {
  const discs = points
    .filter((point) => point.inside)
    .map(({ x, y }) => `M${(at(x) - 1.8).toFixed(1)} ${atY(y).toFixed(1)}a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0`)
    .join("");
  const crosses = points
    .filter((point) => !point.inside)
    .map(({ x, y }) => {
      const [cx, cy] = [at(x), atY(y)];
      return `M${(cx - 2).toFixed(1)} ${(cy - 2).toFixed(1)}l4 4M${(cx + 2).toFixed(1)} ${(cy - 2).toFixed(1)}l-4 4`;
    })
    .join("");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={summary} className="mx-auto h-auto w-full max-w-md">
      <path
        d={`M${margin} ${margin + side}L${margin} ${margin}A${side} ${side} 0 0 1 ${margin + side} ${margin + side}Z`}
        fill="var(--accent-soft)"
      />
      <rect x={margin} y={margin} width={side} height={side} fill="none" stroke="var(--ink-muted)" strokeWidth="1.5" />
      <path
        d={`M${margin} ${margin}A${side} ${side} 0 0 1 ${margin + side} ${margin + side}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <path data-pi-points="inside" d={discs} fill="var(--accent)" />
      <path data-pi-points="outside" d={crosses} fill="none" stroke="var(--ink)" strokeWidth="1.2" />
    </svg>
  );
}

/** Légende : un disque plein, une croix. */
export function PiLegend({ legend }: { legend: Messages["demos"]["estimating-pi"]["legend"] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
      <li className="flex items-center gap-2">
        <svg width="12" height="12" aria-hidden="true" className="shrink-0">
          <circle cx="6" cy="6" r="4" fill="var(--accent)" />
        </svg>
        <span>{legend.inside}</span>
      </li>
      <li className="flex items-center gap-2">
        <svg width="12" height="12" aria-hidden="true" className="shrink-0">
          <path d="M2 2L10 10M10 2L2 10" stroke="var(--ink)" strokeWidth="1.5" />
        </svg>
        <span>{legend.outside}</span>
      </li>
    </ul>
  );
}
