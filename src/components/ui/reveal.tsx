"use client";

import { useEffect, useRef } from "react";
import { observeReveal } from "./reveal-observer";

/**
 * Apparition douce au défilement. Le rendu serveur ne masque rien : seul un bloc encore sous la
 * ligne de flottaison est masqué, par JavaScript (reveal-observer.ts), et jamais avec
 * prefers-reduced-motion (globals.css).
 */
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return observeReveal(ref.current, window.IntersectionObserver, window.innerHeight);
  }, []);

  return (
    <div ref={ref} data-reveal="">
      {children}
    </div>
  );
}
