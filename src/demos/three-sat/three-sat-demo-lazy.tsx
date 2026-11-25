"use client";

import dynamic from "next/dynamic";

/** Enveloppe cliente : le code de l'expérience est dans un fichier à part (voir projectile-demo-lazy). */
export const ThreeSatDemoLazy = dynamic(() => import("./three-sat-demo"));
