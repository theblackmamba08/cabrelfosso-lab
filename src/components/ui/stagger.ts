import type { CSSProperties } from "react";

/** Rang d'une carte dans sa grille : apparition décalée de 70 ms dans une section Reveal (globals.css). */
export const stagger = (i: number) => ({ "data-reveal-item": "", style: { "--i": i } as CSSProperties });
