import type { Locale } from "@/i18n/config";
import { ActionButton } from "../three-sat/action-button";
import type { Answer, Game } from "./game";
import { barSpan, view, type GameTexts } from "./view";

const barWidth = 560;
const barHeight = 28;

/** Intervalle encore possible, dans [1, N]. */
function IntervalBar({ game, summary }: { game: Game; summary: string }) {
  const { x, width } = barSpan(game, barWidth);
  return (
    <svg viewBox={`0 0 ${barWidth} ${barHeight}`} role="img" aria-label={summary} className="h-auto w-full">
      <rect
        x="1"
        y="1"
        width={barWidth - 2}
        height={barHeight - 2}
        rx="4"
        fill="var(--paper)"
        stroke="var(--ink-muted)"
        strokeWidth="1.5"
      />
      <rect
        x={x.toFixed(2)}
        y="0"
        width={width.toFixed(2)}
        height={barHeight}
        rx={Math.min(4, width / 2)}
        fill="var(--accent)"
      />
    </svg>
  );
}

/** Le jeu, sans état : la question, les boutons, la barre et l'historique. */
export function GamePanel({
  game,
  locale,
  texts,
  start,
  answer,
  undo,
  replay,
}: {
  game: Game;
  locale: Locale;
  texts: GameTexts;
  start: () => void;
  answer: (given: Answer) => void;
  undo: () => void;
  replay: () => void;
}) {
  const { buttons } = texts;
  const shown = view(game, texts, locale);
  const over = game.status !== "asking";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div className="min-h-20">
        {shown.instruction && <p>{shown.instruction}</p>}
        {shown.counter && <p className="text-sm text-ink-muted tabular-nums">{shown.counter}</p>}
        <p aria-live="polite" aria-atomic="true" className="text-lg font-semibold">
          {shown.announcement}
        </p>
      </div>

      <div data-number-answers="" className="flex flex-wrap gap-3">
        {game.status === "ready" ? (
          <ActionButton variant="primary" onPress={start}>
            {buttons.ready}
          </ActionButton>
        ) : (
          <>
            {(["higher", "lower", "found"] as const).map((given) => (
              <ActionButton key={given} variant="primary" unavailable={over} onPress={() => answer(given)}>
                {buttons[given]}
              </ActionButton>
            ))}
            <ActionButton unavailable={game.last === null} onPress={undo}>
              {buttons.undo}
            </ActionButton>
            <ActionButton onPress={replay}>{buttons.replay}</ActionButton>
          </>
        )}
      </div>

      {shown.bar && (
        <div>
          <IntervalBar game={game} summary={shown.bar} />
          <p className="mt-2 tabular-nums">{shown.possibilities}</p>
        </div>
      )}

      {shown.history.length > 0 && (
        <section aria-labelledby="questions-posees">
          <h2 id="questions-posees" className="text-xl">
            {texts.history.title}
          </h2>
          <ol className="mt-3 grid list-decimal gap-x-6 gap-y-1 pl-8 tabular-nums marker:text-ink-muted">
            {shown.history.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
