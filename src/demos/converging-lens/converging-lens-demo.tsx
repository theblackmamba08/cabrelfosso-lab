"use client";

import { useState } from "react";
import { PageSection } from "@/components/page-section";
import { Card, panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { RangeControl } from "../projectile/range-control";
import { lensDiagram } from "./geometry";
import { LensFigure, LensLegend } from "./lens-figure";
import { LensText } from "./lens-text";
import { figureSummary, lawsWithValues, resultValues } from "./texts";

type Texts = Messages["demos"]["converging-lens"];

export default function ConvergingLensDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<Texts, "controls" | "fixed" | "results" | "natures" | "outside" | "legend" | "summary" | "laws">;
}) {
  const { controls, results, legend } = texts;
  const [focal, setFocal] = useState(5);
  const [distance, setDistance] = useState(15);
  const setup = { focal, distance };
  const values = resultValues(setup, texts, locale);
  const { image } = lensDiagram(setup);
  const bars = locale === "fr";
  const rows = [
    [results.position, values.position],
    [results.magnification, values.magnification],
    [results.height, values.height],
    [results.nature, values.nature],
  ];

  return (
    <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-14">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section aria-labelledby="reglages" className={`${panel} self-start`}>
          <h2 id="reglages" className="text-xl md:text-2xl">
            {controls.title}
          </h2>
          <div className="mt-6 grid gap-5">
            <RangeControl
              label={controls.focal}
              value={focal}
              min={2}
              max={10}
              step={0.5}
              unit=" cm"
              locale={locale}
              onChange={setFocal}
            />
            <RangeControl
              label={controls.distance}
              value={distance}
              min={1}
              max={40}
              step={0.5}
              unit=" cm"
              locale={locale}
              onChange={setDistance}
            />
          </div>
          <p className="mt-6 text-sm text-ink-muted">{texts.fixed}</p>
        </section>

        {/* Sur mobile, la figure passe au-dessus des réglages : on la voit réagir au curseur. */}
        <figure className={`${panel} order-first m-0 lg:order-last`}>
          <LensFigure setup={setup} summary={figureSummary(setup, texts, locale)} />
          <figcaption>
            {image && !image.inFrame && <p className="mt-3 font-semibold">{texts.outside}</p>}
            <LensLegend legend={legend} />
          </figcaption>
        </figure>
      </div>

      <PageSection id="resultats" title={results.title}>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map(([term, value]) => (
            <div key={term}>
              <dt className="text-sm text-ink-muted">
                <LensText source={term} bars={bars} />
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums first-letter:uppercase">{value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection id="lois" title={texts.laws.title}>
        <Card lift={false} className="max-w-3xl md:p-8">
          <ul className="grid list-disc gap-3 pl-5 marker:text-ink-muted">
            {lawsWithValues(setup, texts, locale).map((item, index) => (
              <li key={index}>
                <LensText source={item} bars={bars} />
              </li>
            ))}
          </ul>
        </Card>
      </PageSection>
    </div>
  );
}
