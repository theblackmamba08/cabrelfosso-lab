"use client";

import { useMemo, useState } from "react";
import { PageSection } from "@/components/page-section";
import { panelClassName as panel } from "@/components/ui/card";
import type { Messages } from "@/i18n/messages/fr";
import { ActionButton } from "./action-button";
import { fill } from "./format";
import { stepPuzzle } from "./puzzle";
import { RichText } from "./rich-text";
import { solveWithTrace } from "./solve-trace";
import { nextNumber, startNumber } from "./statistics";
import { clauseSymbols, clauseWords, stepMessage } from "./step-text";
import { choicesAfter, clauseState, replay, type ClauseState } from "./trace-view";

const icons: Record<ClauseState, { path: string; color: string }> = {
  satisfied: { path: "M3 8.5L6.5 12L13 4.5", color: "var(--accent)" },
  false: { path: "M4 4L12 12M12 4L4 12", color: "var(--ink)" },
  unit: { path: "M8 3V9M8 12.5V13", color: "var(--ink)" },
  pending: { path: "M3.5 8H12.5", color: "var(--ink-muted)" },
};

function StateIcon({ state }: { state: ClauseState }) {
  const { path, color } = icons[state];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Le solveur sur une petite énigme, une étape par clic. Le composant est remonté (`key`) quand la
 * graine change : l'énigme de départ est alors recalculée.
 */
export function StepByStep({ seed, texts }: { seed: number; texts: Messages["demos"]["three-sat"]["steps"] }) {
  const [number, setNumber] = useState(() => startNumber(seed));
  const [count, setCount] = useState(0);
  const { puzzle, solution } = useMemo(() => {
    const puzzle = stepPuzzle(seed, number);
    return { puzzle, solution: solveWithTrace(puzzle) };
  }, [seed, number]);

  const { events } = solution;
  const assignment = replay(puzzle.n, events, count);
  const event = count > 0 ? events[count - 1] : null;
  const concerned = event && "clause" in event ? event.clause : 0;

  return (
    <PageSection id="pas-a-pas" title={texts.title}>
      <p className="max-w-prose">
        <RichText text={texts.intro} />
      </p>
      <div className={`${panel} mt-6`}>
        <p className="flex flex-wrap gap-x-8 gap-y-1 font-semibold">
          <span>{fill(texts.number, { numéro: String(number), number: String(number) })}</span>
          <span className="tabular-nums">{fill(texts.counter, { k: String(choicesAfter(events, count)) })}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="primary"
            unavailable={count === events.length}
            onPress={() => setCount((value) => Math.min(value + 1, events.length))}
          >
            {texts.buttons.next}
          </ActionButton>
          <ActionButton onPress={() => setCount(0)}>{texts.buttons.restart}</ActionButton>
          <ActionButton
            onPress={() => {
              setNumber(nextNumber(number));
              setCount(0);
            }}
          >
            {texts.buttons.another}
          </ActionButton>
        </div>
        <p aria-live="polite" aria-atomic="true" className="mt-4 min-h-14">
          {event && <RichText text={stepMessage(event, solution, texts)} />}
        </p>
        <ol className="mt-4 grid list-decimal gap-x-6 gap-y-2 marker:text-ink-muted sm:grid-cols-2 lg:grid-cols-3">
          {puzzle.clauses.map((clause, index) => {
            const state = clauseState(clause, assignment);
            return (
              <li key={index} className="ml-8">
                <div
                  className={`h-full rounded-box border px-3 py-2 ${
                    index + 1 === concerned ? "border-accent bg-accent-soft" : "border-line"
                  }`}
                >
                  <span aria-hidden="true" className="font-mono whitespace-nowrap">
                    <RichText text={clauseSymbols(clause)} />
                  </span>
                  <span className="sr-only">
                    <RichText text={clauseWords(clause, texts.words)} />
                  </span>{" "}
                  <span className="flex items-center gap-2 text-sm">
                    <StateIcon state={state} />
                    {texts.states[state]}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </PageSection>
  );
}
