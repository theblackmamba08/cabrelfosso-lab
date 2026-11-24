import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function block(selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Bloc introuvable : ${selector}`);
  return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

/** Déclarations de toutes les règles dont la liste de sélecteurs contient `selector`. */
function rulesFor(selector: string): string {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1].split(",").some((s) => s.trim() === selector))
    .map((m) => m[2])
    .join("\n");
}

function value(source: string, name: string): string {
  const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(source);
  if (!match) throw new Error(`Jeton introuvable : --${name}`);
  return match[1].trim();
}

/** Couleur obtenue en posant `top` à `share` (0 à 1) sur `bottom`, en #RRGGBB. */
function mix(bottom: string, top: string, share: number): string {
  const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map((i) => Math.round(channel(bottom, i) + (channel(top, i) - channel(bottom, i)) * share))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

const themes = [
  ["sombre", ":root {"],
  ["clair", '[data-theme="light"] {'],
] as const;

describe("motif de fond (CSS seulement)", () => {
  it("se place sous le contenu, sans capter les clics", () => {
    for (const selector of ["body::before", "body::after"]) {
      const rules = rulesFor(selector);
      expect(rules).toMatch(/z-index:\s*-1/);
      expect(rules).toMatch(/pointer-events:\s*none/);
    }
    expect(rulesFor("body")).toMatch(/isolation:\s*isolate/);
  });

  it("papier millimétré fixe à l'écran : une couche fixe qui couvre la fenêtre, sans fondu", () => {
    const grid = rulesFor("body::before");
    expect(grid).toMatch(/position:\s*fixed/);
    expect(grid).toMatch(/inset:\s*0\s*;/);
    expect(grid).not.toMatch(/mask-image/);
    expect(grid).not.toMatch(/height:/);
    // Couche composée à part : le défilement ne la repeint pas.
    expect(grid).toMatch(/will-change:\s*transform/);
  });

  it("lignes fines tous les 10 px et lignes marquées tous les 50 px, dans les deux sens", () => {
    const grid = rulesFor("body::before");
    const lines = grid.match(/linear-gradient\([^;]*?1px, transparent 1px\)/g) ?? [];
    expect(lines).toHaveLength(4);
    expect(lines.filter((l) => l.includes("var(--motif-grid-major)"))).toHaveLength(2);
    expect(lines.filter((l) => l.includes("var(--motif-grid-minor)"))).toHaveLength(2);
    expect(grid).toMatch(/background-size:\s*50px 50px,\s*50px 50px,\s*10px 10px,\s*10px 10px;/);
  });

  it("un seul quadrillage : l'ancien jeton --motif-grid a disparu", () => {
    expect(css).not.toMatch(/--motif-grid[:)]/);
  });

  it("halo en haut de page et trajectoires restent attachés à la page (ils défilent avec elle)", () => {
    const body = rulesFor("body");
    expect(body).toMatch(/radial-gradient\([^;]*var\(--motif-halo\)/);
    expect(body).toMatch(/background-repeat:\s*no-repeat/);
    expect(rulesFor("body::before")).not.toContain("radial-gradient");
    const traces = rulesFor("body::after");
    expect(traces).toMatch(/position:\s*absolute/);
    const svg = /mask-image:\s*url\("data:image\/svg\+xml,([^"]+)"\)/.exec(traces);
    expect(svg).not.toBeNull();
    expect(decodeURIComponent(svg![1])).toMatch(/<path d="M[^"]*Q/);
  });

  it("n'utilise pas background-attachment: fixed (coûteux sur mobile)", () => {
    expect(css).not.toMatch(/background-attachment:\s*fixed/);
  });

  it("thème sombre : opacités de l'aperçu validé par Jospin (13 % et 5,5 %)", () => {
    const theme = block(":root {");
    expect(value(theme, "motif-grid-major")).toBe("13%");
    expect(value(theme, "motif-grid-minor")).toBe("5.5%");
  });

  it.each(themes)("thème %s : lignes marquées plus visibles que les lignes fines", (_name, selector) => {
    const theme = block(selector);
    expect(parseFloat(value(theme, "motif-grid-major"))).toBeGreaterThan(
      parseFloat(value(theme, "motif-grid-minor")),
    );
  });

  it.each(themes)(
    "thème %s : texte secondaire et accent restent à 4,5:1 au point le plus marqué du motif",
    (_name, selector) => {
      const theme = block(selector);
      const share = (name: string) => parseFloat(value(theme, name)) / 100;
      const [paper, accent, muted] = ["paper", "accent", "ink-muted"].map((n) => value(theme, n));
      // Croisement d'une ligne marquée et d'une ligne fine, sous le halo et une trajectoire :
      // parts additionnées (plus sévère que la composition réelle des couches).
      const strongest = mix(
        paper,
        accent,
        share("motif-halo") + share("motif-grid-major") + share("motif-grid-minor") + share("motif-trace"),
      );
      expect(contrastRatio(muted, strongest)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(accent, strongest)).toBeGreaterThanOrEqual(4.5);
    },
  );
});
