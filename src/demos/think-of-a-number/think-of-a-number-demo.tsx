"use client";

import { useEffect, useRef, useState } from "react";
import { panelClassName as panel } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import { answer, newGame, start, undo, type Game } from "./game";
import { GamePanel } from "./game-panel";
import { formatInteger, type GameTexts } from "./view";

const ranges = [100, 1000, 1_000_000] as const;

export default function ThinkOfANumberDemo({ locale, texts }: { locale: Locale; texts: GameTexts }) {
  const [game, setGame] = useState<Game>(() => newGame(1000));
  const panelRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  // « J'ai choisi » et « Rejouer » disparaissent au clic : le focus passe au premier bouton qui suit.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    panelRef.current?.querySelector("button")?.focus();
  }, [game]);

  function changeScreen(next: Game) {
    moveFocus.current = true;
    setGame(next);
  }

  return (
    <div className={`${panel} mt-12 max-w-3xl md:p-8`}>
      <label className="block max-w-xs">
        <span className="block font-semibold">{texts.controls.range}</span>
        {/* Changer N commence une nouvelle partie. */}
        <select
          value={game.n}
          onChange={(event) => setGame(newGame(Number(event.currentTarget.value)))}
          className="mt-1 block min-h-11 w-full rounded-control border border-ink-muted bg-paper px-3 text-ink"
        >
          {ranges.map((n) => (
            <option key={n} value={n}>
              {formatInteger(n, locale)}
            </option>
          ))}
        </select>
      </label>
      <div ref={panelRef} className="mt-6">
        <GamePanel
          game={game}
          locale={locale}
          texts={texts}
          start={() => changeScreen(start(game))}
          answer={(given) => setGame((current) => answer(current, given))}
          undo={() => setGame(undo)}
          replay={() => changeScreen(newGame(game.n))}
        />
      </div>
    </div>
  );
}
