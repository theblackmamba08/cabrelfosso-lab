"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClassName } from "@/components/ui/button";
import { panelClassName as panel } from "@/components/ui/card";
import { PageSection } from "@/components/page-section";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { animationDuration, launchProgress } from "./animation";
import { equations } from "./equations";
import { figureSummary } from "./figure-summary";
import { formatQuantity } from "./format";
import { MathText } from "./math-text";
import {
  apexHeight,
  flightTime,
  gravities,
  impactSpeed,
  launchRange,
  type Launch,
} from "./physics";
import { FigureLegend, ProjectileFigure } from "./projectile-figure";
import { RangeControl } from "./range-control";

type Texts = Messages["demos"]["projectile"];
type Planet = keyof typeof gravities;

const planets = Object.keys(gravities) as Planet[];

function EquationList({
  launch,
  locale,
  labels,
}: {
  launch: Launch;
  locale: Locale;
  labels: Texts["equations"];
}) {
  return (
    <dl className="mt-6 grid gap-6">
      {equations(launch, locale).map(({ id, literal, values }) => (
        <div key={id}>
          <dt className="font-semibold">{labels[id]}</dt>
          <dd className="mt-1 font-mono text-sm">
            {literal.length === 0 && <p className="font-sans text-base">{labels.vertical}</p>}
            {literal.map((line, index) => (
              <p key={line}>
                {id === "range" && index === 1 && (
                  <span className="font-sans">{labels.rangeNoHeight}, </span>
                )}
                <MathText source={line} />
              </p>
            ))}
            {values.map((line) => (
              <p key={line} className="text-accent">
                <MathText source={line} />
              </p>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectileDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<
    Texts,
    "controls" | "buttons" | "results" | "legend" | "summary" | "equations"
  >;
}) {
  const { controls, buttons, results, legend, summary } = texts;
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(10);
  const [height, setHeight] = useState(0);
  const [planet, setPlanet] = useState<Planet>("earth");
  const [kept, setKept] = useState<Launch | null>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);
  const keepButton = useRef<HTMLButtonElement>(null);

  const launch: Launch = { speed, angle, height, gravity: gravities[planet] };

  function stopAnimation() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }

  useEffect(() => stopAnimation, []);

  /** Un réglage change : le projectile revient au point de lancement. */
  function adjust<T>(setter: (value: T) => void) {
    return (value: T) => {
      stopAnimation();
      setProgress(0);
      setter(value);
    };
  }

  function launchProjectile() {
    stopAnimation();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const duration = animationDuration(launch);
    const start = performance.now();
    const step = (now: number) => {
      const current = launchProgress(now - start, duration);
      setProgress(current);
      frame.current = current < 1 ? requestAnimationFrame(step) : null;
    };
    setProgress(0);
    frame.current = requestAnimationFrame(step);
  }

  function clearComparison() {
    setKept(null);
    // Le bouton cliqué disparaît : le focus clavier ne doit pas se perdre avec lui.
    keepButton.current?.focus();
  }

  return (
    <div className="mt-12 grid gap-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section aria-labelledby="reglages" className={panel}>
          <h2 id="reglages" className="text-xl md:text-2xl">
            {controls.title}
          </h2>
          <div className="mt-6 grid gap-5">
            <RangeControl
              label={controls.angle}
              value={angle}
              min={0}
              max={90}
              step={1}
              unit="°"
              locale={locale}
              onChange={adjust(setAngle)}
            />
            <RangeControl
              label={controls.speed}
              value={speed}
              min={1}
              max={30}
              step={0.5}
              unit={" m/s"}
              locale={locale}
              onChange={adjust(setSpeed)}
            />
            <RangeControl
              label={controls.height}
              value={height}
              min={0}
              max={20}
              step={0.5}
              unit={" m"}
              locale={locale}
              onChange={adjust(setHeight)}
            />
            <label className="block">
              <span className="block font-semibold">{controls.gravity}</span>
              <select
                value={planet}
                onChange={(event) => adjust(setPlanet)(event.currentTarget.value as Planet)}
                className="mt-1 block min-h-11 w-full rounded-control border border-ink-muted bg-paper px-3 text-ink"
              >
                {planets.map((key) => (
                  <option key={key} value={key}>
                    {controls[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={launchProjectile} className={buttonClassName("primary")}>
              {buttons.launch}
            </button>
            <button
              ref={keepButton}
              type="button"
              onClick={() => setKept(launch)}
              className={buttonClassName("outline")}
            >
              {buttons.keep}
            </button>
            {kept && (
              <button
                type="button"
                onClick={clearComparison}
                className={buttonClassName("outline")}
              >
                {buttons.clear}
              </button>
            )}
          </div>
        </section>

        {/* Sur mobile, la figure passe au-dessus des réglages : on la voit réagir au curseur. */}
        <figure className={`${panel} order-first m-0 max-w-2xl lg:order-last`}>
          <ProjectileFigure
            launch={launch}
            kept={kept}
            progress={progress}
            locale={locale}
            summary={figureSummary(launch, kept, summary, locale)}
          />
          <figcaption>
            <FigureLegend legend={legend} hasKept={kept !== null} />
          </figcaption>
        </figure>
      </div>

      <PageSection id="resultats" title={results.title}>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [results.flightTime, formatQuantity(flightTime(launch), "s", locale)],
              [results.range, formatQuantity(launchRange(launch), "m", locale)],
              [results.apex, formatQuantity(apexHeight(launch), "m", locale)],
              [results.impactSpeed, formatQuantity(impactSpeed(launch), "m/s", locale)],
            ] as const
          ).map(([term, value]) => (
            <div key={term}>
              <dt className="text-sm text-ink-muted">{term}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection id="equations" title={texts.equations.title}>
        <p className="max-w-prose">{texts.equations.frame}</p>
        <EquationList launch={launch} locale={locale} labels={texts.equations} />
      </PageSection>
    </div>
  );
}
