import type { Locale } from "@/i18n/config";
import { formatTick } from "./format";

/** Curseur natif, avec son étiquette et sa valeur visible (un <span> : <output> serait annoncé). */
export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  locale,
  describedBy,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Unité lue par les lecteurs d'écran, avec son espace éventuelle. */
  unit: string;
  locale: Locale;
  /** Identifiant d'un texte d'aide lié au curseur. */
  describedBy?: string;
  onChange: (value: number) => void;
}) {
  const shown = formatTick(value, locale);
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums">{shown}</span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-valuetext={`${shown}${unit}`}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        className="mt-1 block h-6 w-full accent-accent"
      />
    </label>
  );
}
