"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { ActionButton } from "./action-button";
import { CurveResults } from "./curve-results";
import { CurveRunner, type WorkerLike } from "./curve-runner";
import { fill, formatAlpha, formatCount } from "./format";
import { alphaOf, parseSeed, puzzleCounts, sizes } from "./puzzle";
import { RichText } from "./rich-text";
import { initialRun, runReducer, shownCurves } from "./run-state";
import { StepByStep } from "./step-by-step";

type Texts = Messages["demos"]["three-sat"];

const fieldClassName =
  "mt-1 block min-h-11 w-full rounded-control border border-ink-muted bg-paper px-3 text-ink disabled:cursor-not-allowed disabled:opacity-60";

const createWorker = (): WorkerLike => new Worker(new URL("./curves.worker.ts", import.meta.url), { type: "module" });

function NumberSelect({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  options: readonly number[];
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block font-semibold">
        <RichText text={label} />
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className={fieldClassName}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ThreeSatDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<Texts, "controls" | "buttons" | "status" | "charts" | "summaries" | "table" | "steps">;
}) {
  const { controls, buttons, status } = texts;
  const [n, setN] = useState<number>(40);
  const [puzzles, setPuzzles] = useState<number>(20);
  const [seedText, setSeedText] = useState("2026");
  /** Dernière graine valide : celle du pas à pas. */
  const [stepSeed, setStepSeed] = useState(2026);
  const [state, dispatch] = useReducer(runReducer, initialRun);
  const runner = useRef<CurveRunner | null>(null);
  const seedInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => runner.current?.stop(), []);

  const seed = parseSeed(seedText);
  const { run, notice } = state;
  const busy = run !== null;
  const curves = shownCurves(state);

  function changeSeed(text: string) {
    setSeedText(text);
    const valid = parseSeed(text);
    if (valid !== null) setStepSeed(valid);
  }

  function start() {
    if (seed === null) {
      seedInput.current?.focus();
      return;
    }
    runner.current ??= new CurveRunner(createWorker, {
      onPoint: (point) => dispatch({ type: "point", point }),
      onError: () => dispatch({ type: "stop" }),
    });
    const settings = { seed, n, puzzles };
    dispatch({ type: "start", settings });
    runner.current.start(settings);
  }

  function togglePause() {
    if (state.status === "paused") {
      runner.current?.resume();
      dispatch({ type: "resume" });
    } else {
      runner.current?.pause();
      dispatch({ type: "pause" });
    }
  }

  function stop() {
    runner.current?.stop();
    dispatch({ type: "stop" });
  }

  return (
    <div className="mt-12 grid gap-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section aria-labelledby="experience" className={`${panel} self-start`}>
          <h2 id="experience" className="text-xl md:text-2xl">
            {controls.title}
          </h2>
          <div className="mt-6 grid gap-5">
            <NumberSelect label={controls.variables} value={n} options={sizes} disabled={busy} onChange={setN} />
            <NumberSelect
              label={controls.puzzles}
              value={puzzles}
              options={puzzleCounts}
              disabled={busy}
              onChange={setPuzzles}
            />
            <div>
              <label htmlFor="graine" className="block font-semibold">
                {controls.seed}
              </label>
              {/* Champ de texte au clavier numérique : un champ « number » viderait une saisie comme « abc ». */}
              <input
                ref={seedInput}
                id="graine"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={seedText}
                disabled={busy}
                aria-invalid={seed === null || undefined}
                aria-describedby={seed === null ? "erreur-graine aide-graine" : "aide-graine"}
                onChange={(event) => changeSeed(event.currentTarget.value)}
                className={fieldClassName}
              />
              {seed === null && (
                <p id="erreur-graine" className="mt-1 text-sm font-semibold">
                  {controls.seedError}
                </p>
              )}
              <p id="aide-graine" className="mt-1 text-sm text-ink-muted">
                {controls.seedHelp}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton variant="primary" unavailable={busy} onPress={start}>
              {buttons.run}
            </ActionButton>
            <ActionButton unavailable={!busy} onPress={togglePause}>
              {state.status === "paused" ? buttons.resume : buttons.pause}
            </ActionButton>
            <ActionButton unavailable={!busy} onPress={stop}>
              {buttons.stop}
            </ActionButton>
            <ActionButton unavailable={busy || curves.length === 0} onPress={() => dispatch({ type: "clear" })}>
              {buttons.clear}
            </ActionButton>
          </div>
          <div className="mt-6 min-h-14">
            {run ? (
              <p className="tabular-nums">
                <RichText
                  text={fill(status.progress, {
                    n: String(run.n),
                    α: formatAlpha(alphaOf(run.points.length), locale),
                    i: String(run.points.length + 1),
                  })}
                />
              </p>
            ) : (
              curves.length === 0 && !notice && <p className="text-ink-muted">{status.empty}</p>
            )}
            {/* Annonce à la fin ou à l'arrêt seulement : la progression est en dehors. */}
            <p aria-live="polite">
              {notice?.kind === "done" &&
                fill(status.done, { n: String(notice.n), total: formatCount(notice.total, locale) })}
              {notice?.kind === "stopped" && status.stopped}
            </p>
          </div>
        </section>

        <div className={`${panel} min-w-0`}>
          <CurveResults locale={locale} texts={texts} curves={curves} />
        </div>
      </div>

      <StepByStep key={stepSeed} seed={stepSeed} texts={texts.steps} />
    </div>
  );
}
