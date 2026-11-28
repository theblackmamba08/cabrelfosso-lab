"use client";

import { useRef, useState } from "react";
import { PageSection } from "@/components/page-section";
import { panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { ActionButton } from "../three-sat/action-button";
import { parseSeed } from "../three-sat/puzzle";
import { addPoints, emptyRun, maxPoints, type Run } from "./monte-carlo";
import { PiFigure, PiLegend } from "./pi-figure";
import { announcement, resultValues, runSummary } from "./view";

type Texts = Messages["demos"]["estimating-pi"];

const fieldClassName = "mt-1 block min-h-11 w-full rounded-control border border-ink-muted bg-paper px-3 text-ink";

export default function EstimatingPiDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<Texts, "buttons" | "seed" | "results" | "empty" | "maximum" | "note" | "legend" | "summary">;
}) {
  const { buttons, seed: seedTexts, results } = texts;
  const [seedText, setSeedText] = useState("2026");
  const [run, setRun] = useState<Run>(() => emptyRun(2026));
  const [spoken, setSpoken] = useState("");
  const seedInput = useRef<HTMLInputElement>(null);

  const seed = parseSeed(seedText);
  const full = run.total >= maxPoints;
  const values = resultValues(run, locale);

  /** Une graine valide commence une nouvelle série. */
  function changeSeed(text: string) {
    setSeedText(text);
    const valid = parseSeed(text);
    if (valid !== null && valid !== run.seed) setRun(emptyRun(valid));
  }

  function add(count: number) {
    if (seed === null) {
      seedInput.current?.focus();
      return;
    }
    const next = addPoints(run, count);
    setRun(next);
    setSpoken(announcement(next, texts, locale));
  }

  function restart() {
    const next = emptyRun(seed ?? run.seed);
    setRun(next);
    setSpoken(announcement(next, texts, locale));
  }

  return (
    <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-14">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className={`${panel} self-start`}>
          <label htmlFor="pi-graine" className="block font-semibold">
            {seedTexts.label}
          </label>
          {/* Champ de texte au clavier numérique, comme pour 3-SAT. */}
          <input
            ref={seedInput}
            id="pi-graine"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={seedText}
            aria-invalid={seed === null || undefined}
            aria-describedby={seed === null ? "pi-erreur pi-aide" : "pi-aide"}
            onChange={(event) => changeSeed(event.currentTarget.value)}
            className={fieldClassName}
          />
          {seed === null && (
            <p id="pi-erreur" className="mt-1 text-sm font-semibold">
              {seedTexts.error}
            </p>
          )}
          <p id="pi-aide" className="mt-1 text-sm text-ink-muted">
            {seedTexts.help}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {(
              [
                [100, buttons.add100],
                [1000, buttons.add1000],
                [10_000, buttons.add10000],
              ] as const
            ).map(([count, label]) => (
              <ActionButton key={count} variant="primary" unavailable={full} onPress={() => add(count)}>
                {label}
              </ActionButton>
            ))}
            <ActionButton onPress={restart}>{buttons.restart}</ActionButton>
          </div>
          {full && <p className="mt-4 font-semibold">{texts.maximum}</p>}
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {spoken}
          </p>
        </div>

        <figure className={`${panel} order-first m-0 lg:order-last`}>
          <PiFigure points={run.points} summary={runSummary(run, texts, locale)} />
          <figcaption>
            <PiLegend legend={texts.legend} />
            <p className="mt-2 text-sm text-ink-muted">{texts.note}</p>
          </figcaption>
        </figure>
      </div>

      <PageSection id="resultats" title={results.title}>
        {values === null ? (
          <p>{texts.empty}</p>
        ) : (
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [results.total, values.total],
                [results.inside, values.inside],
                [results.estimate, values.estimate],
                [results.difference, values.difference],
              ] as const
            ).map(([term, value]) => (
              <div key={term}>
                <dt className="text-sm text-ink-muted">{term}</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageSection>
    </div>
  );
}
