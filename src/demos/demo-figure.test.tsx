import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DemoFigure } from "./demo-figure";
import { publishedDemos } from "./registry";

describe("DemoFigure (cartes des expériences)", () => {
  it.each(publishedDemos.map((demo) => demo.id))("%s : une figure SVG décorative, cachée aux lecteurs d'écran", (id) => {
    const html = renderToStaticMarkup(<DemoFigure id={id} />);
    expect(html).toMatch(new RegExp(`^<svg [^>]*data-demo-figure="${id}"`));
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).not.toMatch(/<(title|text)\b/);
  });

  it.each(publishedDemos.map((demo) => demo.id))("%s : couleurs des jetons seulement, aucune couleur en dur", (id) => {
    const html = renderToStaticMarkup(<DemoFigure id={id} />);
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(html).toMatch(/var\(--accent\)/);
  });

  it("dessine une figure propre à chaque démo", () => {
    const [projectile, cradle] = ["projectile", "newtons-cradle"].map((id) =>
      renderToStaticMarkup(<DemoFigure id={id as "projectile" | "newtons-cradle"} />),
    );
    expect(projectile).not.toBe(cradle);
    // Le pendule : cinq billes, cinq fils.
    expect(cradle.match(/<circle /g)).toHaveLength(5);
    expect(cradle.match(/<line /g)!.length).toBeGreaterThanOrEqual(5);
    // Le projectile : une trajectoire parabolique (courbe de Bézier quadratique).
    expect(projectile).toMatch(/<path [^>]*d="M[^"]*Q/);
  });
});
