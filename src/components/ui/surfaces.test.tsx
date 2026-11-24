import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";
import { Card } from "./card";
import { SectionHeading } from "./section-heading";

describe("Badge", () => {
  it("est une petite étiquette sur fond accent-soft", () => {
    const html = renderToStaticMarkup(<Badge>Master IA</Badge>);
    expect(html).toMatch(/^<span [^>]*class="[^"]*\bbg-accent-soft\b/);
    expect(html).toContain(">Master IA</span>");
  });
});

describe("Card", () => {
  it("a un fond surface, une bordure line, des coins arrondis et un halo au survol et au focus", () => {
    const html = renderToStaticMarkup(<Card>contenu</Card>);
    expect(html).toMatch(/^<div /);
    for (const cls of [
      "bg-surface",
      "border-line",
      "rounded-card",
      "hover:shadow-glow",
      "focus-within:shadow-glow",
      "hover:-translate-y-1",
    ]) {
      expect(html).toContain(cls);
    }
  });

  it("peut être rendue comme un autre élément (article, li)", () => {
    expect(renderToStaticMarkup(<Card as="article">x</Card>)).toMatch(/^<article /);
    expect(renderToStaticMarkup(<Card as="li">x</Card>)).toMatch(/^<li /);
  });
});

describe("SectionHeading", () => {
  it("place une petite étiquette en JetBrains Mono au-dessus du titre", () => {
    const html = renderToStaticMarkup(
      <SectionHeading id="titre-services" eyebrow="Services">
        Ce que je propose
      </SectionHeading>,
    );
    const eyebrow = html.indexOf(">Services<");
    const heading = html.indexOf('<h2 id="titre-services"');
    expect(eyebrow).toBeGreaterThan(-1);
    expect(heading).toBeGreaterThan(eyebrow);
    expect(html).toMatch(/<p [^>]*class="[^"]*\bfont-mono\b[^"]*">Services<\/p>/);
    expect(html).toContain(">Ce que je propose</h2>");
  });

  it("peut se passer d'étiquette quand le cahier n'en donne pas", () => {
    const html = renderToStaticMarkup(<SectionHeading id="t">Vous venez pour…</SectionHeading>);
    expect(html).not.toContain("font-mono");
    expect(html).toContain('<h2 id="t" class="text-2xl md:text-3xl">Vous venez pour…</h2>');
  });

  it("transmet les attributs d'une carte (apparition décalée)", () => {
    const html = renderToStaticMarkup(
      <Card as="li" data-reveal-item="" style={{ "--i": 2 } as React.CSSProperties}>
        x
      </Card>,
    );
    expect(html).toMatch(/^<li [^>]*data-reveal-item=""/);
    expect(html).toContain("--i:2");
  });

  it("peut produire un h3", () => {
    const html = renderToStaticMarkup(
      <SectionHeading id="t" eyebrow="e" level={3}>
        Titre
      </SectionHeading>,
    );
    expect(html).toContain('<h3 id="t"');
  });
});

describe("Card immobile (panneaux de réglages, figures)", () => {
  it("garde le fond, la bordure et les coins, sans soulèvement ni halo au survol", () => {
    const html = renderToStaticMarkup(
      <Card as="figure" lift={false}>
        x
      </Card>,
    );
    expect(html).toMatch(/^<figure /);
    for (const cls of ["bg-surface", "border-line", "rounded-card"]) expect(html).toContain(cls);
    expect(html).not.toContain("hover:-translate-y-1");
    expect(html).not.toContain("hover:shadow-glow");
  });
});
