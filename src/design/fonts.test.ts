import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const fontsDir = new URL("../fonts/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const css = read("../app/globals.css");
const fontsModule = read("./fonts.ts");

describe("Space Grotesk, police des titres (section 7 du cahier du portfolio)", () => {
  it("est hébergée avec le site, en WOFF2, avec sa licence SIL OFL 1.1", () => {
    expect(existsSync(new URL("space-grotesk-latin-wght-normal.woff2", fontsDir))).toBe(true);
    const license = readFileSync(new URL("LICENSE-space-grotesk.txt", fontsDir), "utf8");
    expect(license).toContain("Space Grotesk");
    expect(license).toContain("SIL Open Font License, Version 1.1");
  });

  it("est chargée sous la variable --font-display, graisses 300 à 700, préchargée", () => {
    const block = fontsModule.slice(fontsModule.indexOf("export const spaceGrotesk"));
    const call = block.slice(0, block.indexOf("});"));
    expect(call).toContain("space-grotesk-latin-wght-normal.woff2");
    expect(call).toContain('weight: "300 700"');
    expect(call).toContain('variable: "--font-display"');
    expect(call).not.toContain("preload: false");
  });

  it("sert aux titres h1 à h3", () => {
    const headings = css.slice(css.indexOf("h1,\n  h2,\n  h3 {"));
    expect(headings.slice(0, headings.indexOf("}"))).toContain("var(--font-display)");
  });
});

describe("Source Serif 4", () => {
  it("est retirée : fichier, licence, variable et références", () => {
    expect(readdirSync(fontsDir).filter((f) => /source-serif/i.test(f))).toEqual([]);
    expect(fontsModule).not.toMatch(/source.?serif/i);
    expect(css).not.toMatch(/source.?serif/i);
  });
});

describe("échelle typographique", () => {
  it("a un niveau d'affichage pour les très grands titres (3 rem sur mobile, 4,5 rem sur ordinateur)", () => {
    expect(css).toMatch(/--text-display:\s*clamp\(3rem,[^;]+,\s*4\.5rem\);/);
    expect(css).toMatch(/--text-display--line-height:\s*[\d.]+;/);
  });
});

describe("Inter, police du texte", () => {
  it("n'est chargée qu'en romain : aucun texte du site n'est en italique, rien à précharger de plus", () => {
    const block = fontsModule.slice(fontsModule.indexOf("export const inter"));
    const call = block.slice(0, block.indexOf("});"));
    expect(call).toContain("inter-latin-wght-normal.woff2");
    expect(call).not.toMatch(/italic/);
    expect(existsSync(new URL("inter-latin-wght-italic.woff2", fontsDir))).toBe(false);
  });
});
