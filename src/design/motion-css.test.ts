import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Règles du mouvement (docs/design-system.md),
 * vérifiées sur la feuille de style elle-même.
 */
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

/** Fin (accolade fermante) du bloc qui commence à `start`. */
function blockEnd(start: number): number {
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return i;
  }
  throw new Error("Bloc non fermé");
}

/** Contenu d'un bloc à accolades qui commence à `start`. */
function blockAt(start: number): string {
  return css.slice(css.indexOf("{", start) + 1, blockEnd(start));
}

const keyframes = [...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => ({
  name: m[1],
  body: blockAt(m.index),
}));

const motionOkStarts = [...css.matchAll(/@media \(prefers-reduced-motion: no-preference\)/g)].map(
  (m) => m.index,
);
const motionOk = motionOkStarts.map(blockAt).join("\n");

/** Feuille de style sans les blocs « mouvement accepté » ni les @keyframes. */
const outside = [...motionOkStarts, ...[...css.matchAll(/@keyframes /g)].map((m) => m.index)]
  .sort((a, b) => b - a)
  .reduce((rest, start) => rest.slice(0, start) + rest.slice(blockEnd(start) + 1), css);

describe("animations CSS", () => {
  it("se limitent à l'arrivée des en-têtes de page", () => {
    expect(keyframes.map((k) => k.name)).toEqual(["rise"]);
  });

  it.each(keyframes.map((k) => [k.name, k.body]))("@keyframes %s n'anime que transform et opacity", (_name, body) => {
    const properties = [...body.matchAll(/([\w-]+)\s*:/g)].map((m) => m[1]);
    for (const property of properties) {
      expect(["transform", "opacity", "animation-timing-function"]).toContain(property);
    }
  });

  it("ne sont lancées que dans le bloc « mouvement accepté »", () => {
    expect(outside).not.toMatch(/(^|[;{\s])animation(-name)?\s*:\s*(?!none)[\w-]/m);
    for (const { name } of keyframes) expect(motionOk).toContain(name);
  });

  it("ne bouclent jamais : pas de bouton Pause général (WCAG 2.2, critère 2.2.2)", () => {
    expect(css).not.toMatch(/infinite|data-loop|data-motion/);
  });

  it("s'arrêtent, transitions comprises, avec prefers-reduced-motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transition-duration: 0\.01ms !important/);
  });
});
