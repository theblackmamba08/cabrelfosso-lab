"use client";

import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { buttonClassName } from "@/components/ui/button";
import { panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { RangeControl } from "../projectile/range-control";
import { CradleFigure } from "./cradle-figure";
import { CradleReadings } from "./cradle-readings";
import { demoReducer, frameSeconds, initialDemo } from "./demo-state";
import { firstImpact } from "./physics";
import { cradleSummary, fixedValues } from "./readings";

type Texts = Messages["demos"]["newtons-cradle"];

const reducedMotion = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(reducedMotion);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const prefersReducedMotion = () => window.matchMedia(reducedMotion).matches;
const noPreferenceOnServer = () => false;

export default function NewtonsCradleDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<Texts, "controls" | "fixed" | "buttons" | "readings" | "summary">;
}) {
  const { controls, fixed, buttons, readings, summary } = texts;
  const [demo, dispatch] = useReducer(demoReducer, initialDemo);
  const { phase, pulled, angle, restitution, cradle } = demo;

  // Tant que le visiteur n'a pas touché à la case, elle suit sa préférence système.
  const [slowChoice, setSlowChoice] = useState<boolean | null>(null);
  const reduced = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    noPreferenceOnServer,
  );
  const slow = slowChoice ?? reduced;

  useEffect(() => {
    if (phase !== "running") return;
    let frame: number | null = null;
    let last: number | null = null;

    const tick = (now: number) => {
      if (last !== null) dispatch({ type: "frame", seconds: frameSeconds(now - last, slow) });
      last = now;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      last = null;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };
    // Onglet masqué : plus aucune image ; au retour, le temps repart de l'état gardé.
    const followVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", followVisibility);
    return () => {
      document.removeEventListener("visibilitychange", followVisibility);
      stop();
    };
  }, [phase, slow]);

  const impact = firstImpact(pulled, angle, restitution);

  return (
    <div className="mt-12 grid gap-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section aria-labelledby="reglages" className={panel}>
          <h2 id="reglages" className="text-xl md:text-2xl">
            {controls.title}
          </h2>
          <div className="mt-6 grid gap-5">
            <RangeControl
              label={controls.pulled}
              value={pulled}
              min={1}
              max={4}
              step={1}
              unit=""
              locale={locale}
              onChange={(value) =>
                dispatch({ type: "adjust", settings: { pulled: value } })
              }
            />
            <RangeControl
              label={controls.angle}
              value={angle}
              min={10}
              max={45}
              step={1}
              unit="°"
              locale={locale}
              onChange={(value) => dispatch({ type: "adjust", settings: { angle: value } })}
            />
            <div>
              <RangeControl
                label={controls.restitution}
                value={restitution}
                min={0.5}
                max={1}
                step={0.05}
                unit=""
                locale={locale}
                describedBy="aide-restitution"
                onChange={(value) =>
                  dispatch({ type: "adjust", settings: { restitution: value } })
                }
              />
              <p id="aide-restitution" className="mt-1 text-sm text-ink-muted">
                {controls.restitutionHelp}
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-1 text-sm text-ink-muted">
            {fixedValues(fixed, locale).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "release" })}
              className={buttonClassName("primary")}
            >
              {buttons.release}
            </button>
            <button
              type="button"
              disabled={phase === "ready"}
              onClick={() => dispatch({ type: "togglePause" })}
              className={`${buttonClassName("outline")} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {phase === "paused" ? buttons.resume : buttons.pause}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className={buttonClassName("outline")}
            >
              {buttons.reset}
            </button>
          </div>
          <label className="mt-4 flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              checked={slow}
              onChange={(event) => setSlowChoice(event.currentTarget.checked)}
              className="h-5 w-5 accent-accent"
            />
            {buttons.slow}
          </label>
        </section>

        {/* Sur mobile, la figure passe au-dessus des réglages : on la voit réagir au curseur. */}
        <figure className={`${panel} order-first m-0 max-w-2xl lg:order-last`}>
          <CradleFigure
            angles={cradle.angles}
            summary={cradleSummary(impact, summary, locale)}
          />
        </figure>
      </div>

      <CradleReadings impact={impact} locale={locale} texts={readings} />
    </div>
  );
}
