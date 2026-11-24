import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageHero } from "./page-hero";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

describe("PageHero (en-tête des pages intérieures, section 14.8)", () => {
  const html = renderToStaticMarkup(
    <PageHero eyebrow="Espace enseignant" title="Enseignement" intro="J’enseigne la physique.">
      <p>Boutons</p>
    </PageHero>,
  );

  it("place la petite étiquette, puis le grand titre (h1), puis l'introduction", () => {
    expect(html).toMatch(/^<header/);
    const eyebrow = html.indexOf(">Espace enseignant</p>");
    const title = html.indexOf(">Enseignement</h1>");
    const intro = html.indexOf(">J’enseigne la physique.</p>");
    expect(eyebrow).toBeGreaterThan(-1);
    expect(title).toBeGreaterThan(eyebrow);
    expect(intro).toBeGreaterThan(title);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toMatch(/<p [^>]*class="[^"]*\bfont-mono\b[^"]*">Espace enseignant<\/p>/);
  });

  it("donne au titre la grande taille des pages intérieures (Space Grotesk, via h1)", () => {
    expect(html).toMatch(/<h1 [^>]*class="[^"]*\btext-page-title\b/);
    expect(css).toMatch(/--text-page-title:\s*clamp\(/);
    expect(css).toMatch(/h1,\s*h2,\s*h3\s*\{\s*font-family:\s*var\(--font-display\)/);
  });

  it("fait arriver les éléments l'un après l'autre, comme l'en-tête de l'accueil", () => {
    const ranks = [...html.matchAll(/<[a-z0-9]+ style="--i:(\d+)" class="hero-rise[^"]*"/g)].map((m) => Number(m[1]));
    expect(ranks).toEqual([0, 1, 2, 3]);
  });

  it("se passe d'étiquette et d'introduction quand le cahier n'en donne pas", () => {
    const bare = renderToStaticMarkup(<PageHero title="Confidentialité" />);
    expect(bare).not.toContain("font-mono");
    expect(bare).toContain(">Confidentialité</h1>");
    expect(bare.match(/<p[\s>]/g)).toBeNull();
    expect(bare).toMatch(/<h1 style="--i:0"/);
  });

  it("n'anime l'arrivée qu'une fois, et pas avec prefers-reduced-motion", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference)"));
    expect(block).toMatch(/\.hero-rise\s*\{\s*animation:\s*rise 0\.6s[^;]*both;/);
    expect(css.slice(0, css.indexOf("@media (prefers-reduced-motion: no-preference)"))).not.toContain(".hero-rise");
  });

  it("peut prendre la très grande taille de l'accueil, avec des mots mis en valeur", () => {
    const home = renderToStaticMarkup(
      <PageHero size="display" title={<>Comprendre <span className="text-highlight">en manipulant</span></>} />,
    );
    expect(home).toMatch(/<h1 [^>]*class="[^"]*\btext-display\b/);
    expect(home).not.toContain("text-page-title");
    expect(home).toContain('<span class="text-highlight">en manipulant</span></h1>');
  });
});
