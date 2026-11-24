import { PageSection } from "@/components/page-section";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import type { Impact } from "./physics";
import { impactReadings } from "./readings";

type Texts = Messages["demos"]["newtons-cradle"]["readings"];
type Bars = ReturnType<typeof impactReadings>["momentum"];

/** Barre et valeur : le libellé écrit dit ce qu'elle mesure, pas sa couleur. */
function Bar({
  label,
  value,
  share,
  color,
}: {
  label: string;
  value: string;
  share: number;
  color: string;
}) {
  return (
    <dd className="mt-2">
      <span className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </span>
      <span aria-hidden="true" className="mt-1 block h-3 rounded-control bg-surface">
        <span
          className={`block h-full rounded-control ${color}`}
          style={{ width: `${(share * 100).toFixed(1)}%` }}
        />
      </span>
    </dd>
  );
}

function BarPair({ term, bars, texts }: { term: string; bars: Bars; texts: Texts }) {
  return (
    <div>
      <dt className="text-sm text-ink-muted">{term}</dt>
      <Bar label={texts.before} {...bars.before} color="bg-ink-muted" />
      <Bar label={texts.after} {...bars.after} color="bg-accent" />
    </div>
  );
}

/** Mesures du premier choc : elles ne changent qu'avec les réglages, pas à chaque image. */
export function CradleReadings({
  impact,
  locale,
  texts,
}: {
  impact: Impact;
  locale: Locale;
  texts: Texts;
}) {
  const { speed, balls, momentum, energy } = impactReadings(impact, locale);
  return (
    <PageSection id="au-moment-du-choc" title={texts.title}>
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-ink-muted">{texts.speedBefore}</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">{speed}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">{texts.speedsAfter}</dt>
          {balls.map(({ ball, speed: ballSpeed }) => (
            <dd key={ball} className="mt-1 flex items-baseline justify-between gap-4">
              <span>
                {texts.ball} {ball}
              </span>
              <span className="font-semibold tabular-nums">{ballSpeed}</span>
            </dd>
          ))}
        </div>
        <BarPair term={texts.momentum} bars={momentum} texts={texts} />
        <BarPair term={texts.energy} bars={energy} texts={texts} />
      </dl>
    </PageSection>
  );
}
