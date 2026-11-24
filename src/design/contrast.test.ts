import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** Lit les jetons de couleur d'un bloc CSS repéré par son sélecteur. */
function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Bloc introuvable : ${selector}`);
  const block = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
  );
}

/** Valeurs de la section 7 du cahier du portfolio (identité visuelle v2). */
const specified = {
  dark: {
    paper: "#060A14",
    surface: "#0D1426",
    "surface-raised": "#131D35",
    ink: "#E8EDF7",
    "ink-muted": "#9AA8C2",
    line: "#22304D",
    accent: "#6EA2FF",
    "on-accent": "#060A14",
    "accent-soft": "#14254A",
    highlight: "#F5C866",
  },
  light: {
    paper: "#FFFFFF",
    surface: "#F5F7FA",
    "surface-raised": "#FFFFFF",
    ink: "#0F172A",
    "ink-muted": "#475569",
    line: "#CBD5E1",
    accent: "#1E3A8A",
    "on-accent": "#FFFFFF",
    "accent-soft": "#E8EEFB",
    highlight: "#8A5000",
  },
};

describe("contrastRatio", () => {
  it("vaut 21 pour le noir sur le blanc et 1 pour une couleur sur elle-même", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
    expect(contrastRatio("#1E3A8A", "#1E3A8A")).toBeCloseTo(1, 5);
  });
});

describe("thème sombre par défaut", () => {
  it("porte les valeurs sombres sur :root, même sans JavaScript", () => {
    expect(tokens(":root {")).toEqual(specified.dark);
  });

  it("porte les valeurs claires sur [data-theme=\"light\"]", () => {
    expect(tokens('[data-theme="light"] {')).toEqual(specified.light);
  });

  it("ne lit plus la préférence du système", () => {
    expect(css).not.toContain("prefers-color-scheme");
  });

  it("expose les nouveaux jetons à Tailwind", () => {
    expect(css).toMatch(/--color-surface-raised:\s*var\(--surface-raised\)/);
    expect(css).toMatch(/--color-highlight:\s*var\(--highlight\)/);
  });
});

describe.each([
  ["sombre", ":root {"],
  ["clair", '[data-theme="light"] {'],
])("contrastes du thème %s (section 7 du cahier du portfolio)", (_name, selector) => {
  const t = tokens(selector);

  it("texte principal, texte secondaire et accent atteignent 7:1 sur le fond et les sections", () => {
    for (const fg of [t.ink, t["ink-muted"], t.accent]) {
      for (const bg of [t.paper, t.surface]) {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(7);
      }
    }
  });

  it("texte sur l'accent atteint 7:1", () => {
    expect(contrastRatio(t["on-accent"], t.accent)).toBeGreaterThanOrEqual(7);
  });

  it("la couleur « craie » des grands titres atteint 4,5:1 sur le fond", () => {
    expect(contrastRatio(t.highlight, t.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("la bordure des champs (ink-muted) atteint 3:1 sur le fond, les sections et les cartes", () => {
    for (const bg of [t.paper, t.surface, t["surface-raised"]]) {
      expect(contrastRatio(t["ink-muted"], bg)).toBeGreaterThanOrEqual(3);
    }
  });

  it("texte des badges et de la barre flottante atteint 4,5:1 (WCAG AA)", () => {
    expect(contrastRatio(t.accent, t["accent-soft"])).toBeGreaterThanOrEqual(4.5);
    for (const fg of [t.ink, t["ink-muted"], t.accent]) {
      expect(contrastRatio(fg, t["surface-raised"])).toBeGreaterThanOrEqual(4.5);
    }
  });
});
