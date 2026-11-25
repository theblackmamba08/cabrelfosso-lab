import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { CurveResults } from "./curve-results";
import { StepByStep } from "./step-by-step";
import ThreeSatDemo from "./three-sat-demo";
import { alphaPoint } from "./statistics";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");

describe.each([
  ["fr", fr.demos["three-sat"]],
  ["en", en.demos["three-sat"]],
] as const)("réglages et boutons au chargement (%s)", (locale, t) => {
  const html = renderToStaticMarkup(<ThreeSatDemo locale={locale} texts={t} />);

  it("deux listes natives, avec étiquette, et leurs valeurs de départ", () => {
    const selects = [...html.matchAll(/<select[^>]*>(.*?)<\/select>/g)].map((m) => m[1]);
    const options = selects.map((select) => [...select.matchAll(/<option[^>]*>(.*?)<\/option>/g)].map((m) => m[1]));
    expect(options).toEqual([
      ["20", "30", "40", "50"],
      ["10", "20", "50", "100"],
    ]);
    expect(selects.map((select) => select.match(/<option[^>]*selected=""[^>]*>(\d+)</)?.[1])).toEqual(["40", "20"]);
    expect(text(html)).toContain(t.controls.variables);
    expect(text(html)).toContain(t.controls.puzzles);
  });

  it("la graine : étiquette, aide reliée, aucune erreur", () => {
    const input = html.match(/<input[^>]*>/)?.[0] ?? "";
    expect(input).toContain('value="2026"');
    expect(input).toContain('inputMode="numeric"');
    const described = input.match(/aria-describedby="([^"]*)"/)?.[1].split(" ") ?? [];
    expect(described).toHaveLength(1);
    expect(html).toMatch(new RegExp(`id="${described[0]}"[^>]*>${t.controls.seedHelp}<`));
    expect(html).not.toContain(t.controls.seedError);
  });

  it("Lancer est disponible ; Pause, Arrêter et Effacer attendent un calcul", () => {
    const button = (label: string) => html.match(new RegExp(`<button[^>]*>${label}</button>`))?.[0] ?? "";
    expect(button(t.buttons.run)).not.toContain('aria-disabled="true"');
    for (const label of [t.buttons.pause, t.buttons.stop, t.buttons.clear]) {
      expect(button(label)).toContain('aria-disabled="true"');
    }
  });

  it("rien n’est calculé : deux graphiques vides, l’invitation, pas de résumé ni de tableau", () => {
    expect(html.match(/<svg[^>]*role="img"/g)).toHaveLength(2);
    expect(text(html)).toContain(t.status.empty);
    expect(html).not.toContain("<polyline");
    expect(html).not.toContain("<table");
    expect(text(html)).toContain(t.charts.prediction);
    expect(html).toMatch(/<p[^>]*aria-live="polite"[^>]*><\/p>/);
  });
});

describe("résultats", () => {
  const t = fr.demos["three-sat"];
  const curve = (n: number, count: number) => ({
    n,
    points: Array.from({ length: count }, (_, k) => alphaPoint({ seed: 2026, n, k, puzzles: 10 })),
  });
  const html = renderToStaticMarkup(
    <CurveResults locale="fr" texts={t} curves={[curve(20, 26), curve(40, 3)]} />,
  );

  it("une courbe par n dans chaque graphique, avec ses marqueurs, et sa légende", () => {
    expect(html.match(/<polyline/g)).toHaveLength(4);
    expect(text(html)).toContain("n = 20");
    expect(text(html)).toContain("n = 40");
  });

  it("un résumé pour la courbe complète seulement", () => {
    expect(text(html).match(/le solveur fait le plus de choix/g)?.length).toBeGreaterThanOrEqual(1);
    expect(html.match(/<li[^>]*data-summary/g)).toHaveLength(1);
  });

  it("un tableau repliable de 26 lignes, aux en-têtes reliés", () => {
    expect(html).toContain(`>${t.table.show}</summary>`);
    expect(html.match(/<th[^>]*scope="col"/g)).toHaveLength(5);
    expect(html.match(/<th[^>]*scope="row"/g)).toHaveLength(26);
    expect(text(html)).toContain("n = 40 : choix (médiane)");
  });
});

describe.each([
  ["fr", fr.demos["three-sat"].steps],
  ["en", en.demos["three-sat"].steps],
] as const)("pas à pas au chargement (%s)", (_locale, t) => {
  const html = renderToStaticMarkup(<StepByStep seed={2026} texts={t} />);

  it("l’énigme de départ est la n° 2, à zéro choix, sans message", () => {
    expect(text(html)).toMatch(/n° 2|no\. 2/);
    expect(text(html)).toMatch(/(Choix |Decisions): 0/);
    expect(html).toMatch(/<p[^>]*aria-live="polite"[^>]*><\/p>/);
  });

  it("24 clauses dans une liste ordonnée, avec leurs symboles, leur nom en mots et leur état", () => {
    const list = html.match(/<ol[^>]*>(.*)<\/ol>/)?.[1] ?? "";
    expect(list.match(/<li/g)).toHaveLength(24);
    expect(text(list).split(t.states.pending)).toHaveLength(25);
    expect(list.match(/<svg[^>]*aria-hidden="true"/g)).toHaveLength(24);
    // Clause 1 : (4, −5, −1).
    expect(list).toMatch(/aria-hidden="true"[^>]*>x<sub>4<\/sub>/);
    expect(text(list)).toContain(`x4 ${t.words.or} ${t.words.not} x5 ${t.words.or} ${t.words.not} x1`);
  });

  it("trois boutons", () => {
    for (const label of Object.values(t.buttons)) expect(html).toContain(`>${label}</button>`);
  });
});
