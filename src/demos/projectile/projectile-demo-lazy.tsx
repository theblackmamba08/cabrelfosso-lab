"use client";

import dynamic from "next/dynamic";

/**
 * Enveloppe cliente : next/dynamic ne découpe le code d'un composant client que s'il est
 * appelé depuis un composant client. La démo reste rendue côté serveur (réglages, résultats
 * et équations sont dans le HTML), son code est dans un fichier à part.
 */
export const ProjectileDemoLazy = dynamic(() => import("./projectile-demo"));
