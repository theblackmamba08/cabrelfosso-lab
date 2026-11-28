"use client";

import dynamic from "next/dynamic";

/** Enveloppe cliente : le code de la démo est dans un fichier à part, chargé sur sa page seulement. */
export const ConvergingLensDemoLazy = dynamic(() => import("./converging-lens-demo"));
