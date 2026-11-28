import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import EstimatingPiDemo from "./estimating-pi-demo";
import { addPoints, emptyRun, maxPoints } from "./monte-carlo";
import { PiFigure } from "./pi-figure";
import { announcement, resultValues, runSummary } from "./view";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");
const spaced = (value: string | undefined) => value?.replace(/[  ]/g, " ");
const tf = fr.demos["estimating-pi"];
const te = en.demos["estimating-pi"];

describe("résultats et résumé", () => {
  const run = addPoints(emptyRun(2026), 10_000);

  it("valeurs de l'annexe F.2, avec séparateur de milliers", () => {
    const values = resultValues(run, "fr")!;
    expect([spaced(values.total), spaced(values.inside), values.estimate, values.difference]).toEqual([
      "10 000",
      "7 908",
      "3,1632",
      "0,0216",
    ]);
    expect(resultValues(emptyRun(1), "en")).toBeNull();
  });

  it("résumé de la figure, dans les deux langues", () => {
    expect(spaced(runSummary(run, tf, "fr"))).toBe("10 000 points lancés, dont 7 908 dans le quart de disque : π ≈ 3,1632.");
    expect(runSummary(run, te, "en")).toBe("10,000 points thrown, 7,908 of them in the quarter disc: π ≈ 3.1632.");
    expect(runSummary(emptyRun(1), te, "en")).toBe(te.empty);
  });

  it("l'annonce ajoute le message du maximum quand il est atteint", () => {
    let full = emptyRun(2026);
    while (full.total < maxPoints) full = addPoints(full, 10_000);
    expect(announcement(full, te, "en")).toBe(
      "100,000 points thrown, 78,554 of them in the quarter disc: π ≈ 3.1422. Maximum reached: 100,000 points. Start over for a new run.",
    );
    expect(announcement(run, te, "en")).toBe(runSummary(run, te, "en"));
  });
});

describe("figure", () => {
  it("disques pleins dedans, croix dehors, résumé", () => {
    const run = addPoints(emptyRun(2026), 100);
    const html = renderToStaticMarkup(<PiFigure points={run.points} summary="Résumé" />);
    expect(html).toMatch(/<svg[^>]*role="img"[^>]*aria-label="Résumé"/);
    const inside = html.match(/data-pi-points="inside" d="([^"]*)"/)?.[1] ?? "";
    const outside = html.match(/data-pi-points="outside" d="([^"]*)"/)?.[1] ?? "";
    expect(inside.match(/a1\.8 1\.8 0 1 0 3\.6 0/g)).toHaveLength(80);
    expect(outside.match(/l4 4/g)).toHaveLength(20);
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });
});

describe.each([
  ["fr", tf],
  ["en", te],
] as const)("au chargement (%s)", (locale, t) => {
  const html = renderToStaticMarkup(<EstimatingPiDemo locale={locale} texts={t} />);

  it("la graine 2026, son aide reliée, aucune erreur", () => {
    const input = html.match(/<input[^>]*>/)?.[0] ?? "";
    expect(input).toContain('value="2026"');
    expect(input).toContain('inputMode="numeric"');
    expect(input).toContain('aria-describedby="pi-aide"');
    expect(text(html)).toContain(t.seed.label);
    expect(text(html)).not.toContain(t.seed.error);
  });

  it("quatre boutons, l'invitation, une figure vide, une seule zone d'annonce vide", () => {
    const buttons = [...html.matchAll(/<button[^>]*>(.*?)<\/button>/g)].map((m) => m[1]);
    expect(buttons).toEqual(Object.values(t.buttons));
    expect(text(html)).toContain(t.empty);
    expect(html).toMatch(/<svg[^>]*role="img"/);
    expect(html.match(/aria-live/g)).toHaveLength(1);
    expect(html).toMatch(/<p aria-live="polite"[^>]*><\/p>/);
    expect(html).not.toContain("<dl");
  });
});
