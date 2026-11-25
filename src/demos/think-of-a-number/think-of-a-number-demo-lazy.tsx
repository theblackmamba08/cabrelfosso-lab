"use client";

import dynamic from "next/dynamic";

/** Enveloppe cliente : le code du jeu est dans un fichier à part, chargé sur sa page seulement. */
export const ThinkOfANumberDemoLazy = dynamic(() => import("./think-of-a-number-demo"));
