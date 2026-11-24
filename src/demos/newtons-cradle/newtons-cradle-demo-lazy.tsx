"use client";

import dynamic from "next/dynamic";

/** Même enveloppe que le projectile : voir `projectile-demo-lazy.tsx`. */
export const NewtonsCradleDemoLazy = dynamic(() => import("./newtons-cradle-demo"));
