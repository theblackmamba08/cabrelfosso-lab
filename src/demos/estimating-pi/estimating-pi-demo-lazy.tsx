"use client";

import dynamic from "next/dynamic";

/** Enveloppe cliente : le code de l'expérience est dans un fichier à part, chargé sur sa page seulement. */
export const EstimatingPiDemoLazy = dynamic(() => import("./estimating-pi-demo"));
