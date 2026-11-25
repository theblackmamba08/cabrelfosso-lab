import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { chartLines, logTicks, shareTicks, yLog, yShare } from "./chart";
import { ChartFigure, ChartLegend } from "./chart-figure";
import { fill, formatAlpha, formatCount, formatPercent, summaryText, tableRowsOf, type CurveData } from "./format";
import { alphaCount } from "./puzzle";
import { RichText } from "./rich-text";

type Texts = Pick<Messages["demos"]["three-sat"], "charts" | "summaries" | "table">;

/** Deux graphiques, leur légende, un résumé par courbe complète et le tableau des valeurs. */
export function CurveResults({
  locale,
  texts,
  curves,
}: {
  locale: Locale;
  texts: Texts;
  curves: readonly CurveData[];
}) {
  const { charts, summaries, table } = texts;
  const { share, choices, top } = chartLines(curves);
  const complete = curves.filter(({ points }) => points.length === alphaCount);
  const summaryLines = complete.map(({ n, points }) => ({ n, text: summaryText(n, points, summaries, locale) }));
  const label = (title: string) => [title, ...summaryLines.map(({ text }) => text)].join(". ");
  const common = { axis: charts.axis, xTick: (alpha: number) => formatAlpha(alpha, locale) };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <figure className="m-0">
        <figcaption className="font-semibold">{charts.share}</figcaption>
        <ChartFigure
          {...common}
          label={label(charts.share)}
          yTicks={shareTicks.map((tick) => ({ y: yShare(tick), text: formatPercent(tick, locale) }))}
          lines={share}
        />
      </figure>
      <figure className="m-0">
        <figcaption className="font-semibold">{charts.choices}</figcaption>
        <ChartFigure
          {...common}
          label={label(charts.choices)}
          yTicks={logTicks(top).map((tick) => ({ y: yLog(tick, top), text: formatCount(tick, locale) }))}
          lines={choices}
        />
      </figure>
      <ChartLegend
        curves={curves.map(({ n }) => ({ n, label: fill(charts.curve, { n: String(n) }) }))}
        prediction={charts.prediction}
      />
      {summaryLines.length > 0 && (
        <ul className="grid gap-2">
          {summaryLines.map(({ n, text }) => (
            <li key={n} data-summary="">
              <RichText text={text} />
            </li>
          ))}
        </ul>
      )}
      {curves.length > 0 && (
        <details>
          <summary className="cursor-pointer text-accent">{table.show}</summary>
          {/* Le tableau défile dans son cadre, au clavier aussi : la page, elle, ne défile pas. */}
          <div role="region" aria-label={table.show} tabIndex={0} className="mt-3 max-w-full overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm tabular-nums">
              <thead>
                <tr>
                  <th scope="col" className="border-b border-line px-3 py-2 font-semibold">
                    <RichText text={table.alpha} />
                  </th>
                  {curves.flatMap(({ n }) =>
                    [table.share, table.choices].map((text) => (
                      <th key={`${n} ${text}`} scope="col" className="border-b border-line px-3 py-2 font-semibold">
                        {fill(text, { n: String(n) })}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {tableRowsOf(curves, locale).map(([alpha, ...cells]) => (
                  <tr key={alpha}>
                    <th scope="row" className="border-b border-line px-3 py-1 font-normal">
                      {alpha}
                    </th>
                    {cells.map((cell, index) => (
                      <td key={index} className="border-b border-line px-3 py-1">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
