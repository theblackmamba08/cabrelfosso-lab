"use client";

import { useState } from "react";
import { PageSection } from "@/components/page-section";
import { Card, panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { LawText } from "../newtons-cradle/cradle-laws";
import { RangeControl } from "../projectile/range-control";
import { indices, refract, type Medium } from "./optics";
import { RefractionFigure, RefractionLegend } from "./refraction-figure";
import { figureSummary, lawsWithValues, resultValues } from "./texts";

type Texts = Messages["demos"]["refraction"];

const mediumKeys = Object.keys(indices) as Medium[];

function MediumSelect({
  label,
  value,
  names,
  onChange,
}: {
  label: string;
  value: Medium;
  names: Texts["controls"]["media"];
  onChange: (value: Medium) => void;
}) {
  return (
    <label className="block">
      <span className="block font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as Medium)}
        className="mt-1 block min-h-11 w-full rounded-control border border-ink-muted bg-paper px-3 text-ink"
      >
        {mediumKeys.map((key) => (
          <option key={key} value={key}>
            {names[key]}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function RefractionDemo({
  locale,
  texts,
}: {
  locale: Locale;
  texts: Pick<Texts, "controls" | "results" | "legend" | "summary" | "laws">;
}) {
  const { controls, results, legend, summary, laws } = texts;
  const [from, setFrom] = useState<Medium>("air");
  const [to, setTo] = useState<Medium>("water");
  const [angle, setAngle] = useState(40);

  const setup = { from, to, angle };
  const values = resultValues(setup, results, locale);
  const terms = [results.reflection, results.refraction, results.critical];

  return (
    <div className="mt-12 grid gap-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section aria-labelledby="reglages" className={panel}>
          <h2 id="reglages" className="text-xl md:text-2xl">
            {controls.title}
          </h2>
          <div className="mt-6 grid gap-5">
            <MediumSelect label={controls.from} value={from} names={controls.media} onChange={setFrom} />
            <MediumSelect label={controls.to} value={to} names={controls.media} onChange={setTo} />
            <RangeControl
              label={controls.angle}
              value={angle}
              min={0}
              max={89}
              step={1}
              unit="°"
              locale={locale}
              onChange={setAngle}
            />
          </div>
        </section>

        {/* Sur mobile, la figure passe au-dessus des réglages : on la voit réagir au curseur. */}
        <figure className={`${panel} order-first m-0 max-w-2xl lg:order-last`}>
          <RefractionFigure setup={setup} media={controls.media} summary={figureSummary(setup, summary, locale)} />
          <figcaption>
            <RefractionLegend legend={legend} total={refract(setup) === null} />
          </figcaption>
        </figure>
      </div>

      <PageSection id="resultats" title={results.title}>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
          {terms.map((term, index) => (
            <div key={term}>
              <dt className="text-sm text-ink-muted">{term}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums first-letter:uppercase">{values[index]}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection id="lois" title={laws.title}>
        <Card lift={false} className="max-w-3xl md:p-8">
          <p>{laws.intro}</p>
          <ul className="mt-5 grid list-disc gap-3 pl-5 marker:text-ink-muted">
            {lawsWithValues(setup, laws.items, locale).map((item, index) => (
              <li key={index}>
                <LawText source={item} />
              </li>
            ))}
          </ul>
        </Card>
      </PageSection>
    </div>
  );
}
