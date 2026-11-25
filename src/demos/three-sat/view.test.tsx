import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { cahier, plain } from "@/test/cahier";
import { axisTicks, chartLines, logTicks, logTop, plot, xAt, yLog, yShare } from "./chart";
import { curveStyles } from "./chart-figure";
import { fill, formatAlpha, formatCount, formatMedian, formatPercent, summaryText, tableRowsOf } from "./format";
import { alphaCount, sizes, stepPuzzle } from "./puzzle";
import { RichText } from "./rich-text";
import { solveWithTrace } from "./solve-trace";
import { alphaPoint } from "./statistics";
import { clauseSymbols, clauseWords, stepMessage } from "./step-text";

const tf = fr.demos["three-sat"];
const te = en.demos["three-sat"];

describe("nombres", () => {
  it("α avec une décimale, virgule ou point", () => {
    expect([2, 4.6, 5].map((value) => formatAlpha(value, "fr"))).toEqual(["2,0", "4,6", "5,0"]);
    expect([2, 4.6, 5].map((value) => formatAlpha(value, "en"))).toEqual(["2.0", "4.6", "5.0"]);
  });

  it("médiane : entière, ou avec « ,5 »", () => {
    expect([74, 36.5].map((value) => formatMedian(value, "fr"))).toEqual(["74", "36,5"]);
    expect([74, 1234.5].map((value) => formatMedian(value, "en"))).toEqual(["74", "1,234.5"]);
  });

  it("pourcentage : espace insécable en français, rien en anglais", () => {
    expect(formatPercent(55, "fr")).toBe("55 %");
    expect(formatPercent(55, "en")).toBe("55%");
  });

  it("grands nombres groupés selon la langue", () => {
    expect(formatCount(520, "fr")).toBe("520");
    expect(formatCount(2600, "en")).toBe("2,600");
    expect(formatCount(2600, "fr")).toMatch(/^2\s600$/);
  });

  it("remplit les champs d'un texte", () => {
    expect(fill("n = {n} : α = {α} ({i} / 26)", { n: "40", α: "4,2", i: "12" })).toBe("n = 40 : α = 4,2 (12 / 26)");
  });
});

describe("résumés (annexe D.3)", () => {
  const curve = (n: number) => Array.from({ length: alphaCount }, (_, k) => alphaPoint({ seed: 2026, n, k, puzzles: 20 }));

  it.each([20, 40])("n = %i : la phrase du cahier, mot pour mot", (n) => {
    const text = summaryText(n, curve(n), tf.summaries, "fr");
    expect(text).toMatch(new RegExp(`^n = ${n} : la part`));
    expect(cahier).toContain(`« ${plain(text)} »`);
  });

  it("en anglais, avec le point décimal", () => {
    expect(summaryText(20, curve(20), te.summaries, "en")).toBe(
      "n = 20: the share of puzzles with a solution drops below 50% between α = 4.6 and α = 4.8; the solver makes the most decisions at α = 5.0 (median 36.5).",
    );
  });

  it("variantes", () => {
    const points = (satisfiable: number) => [{ k: 0, satisfiable, total: 10, median: 3 }];
    expect(summaryText(50, points(10), te.summaries, "en")).toContain("stays at 50% or more");
    expect(summaryText(50, points(1), tf.summaries, "fr")).toContain("sous 50 % dès α = 2,0 ;");
  });
});

describe("tableau des valeurs", () => {
  it("une ligne par α, une case vide tant que la valeur n'est pas calculée", () => {
    const rows = tableRowsOf(
      [
        { n: 20, points: [{ k: 0, satisfiable: 20, total: 20, median: 9 }] },
        { n: 40, points: [{ k: 0, satisfiable: 11, total: 20, median: 18.5 }, { k: 1, satisfiable: 1, total: 20, median: 2 }] },
      ],
      "fr",
    );
    expect(rows).toHaveLength(26);
    expect(rows[0]).toEqual(["2,0", "100 %", "9", "55 %", "18,5"]);
    expect(rows[1]).toEqual(["2,2", "", "", "5 %", "2"]);
    expect(rows[25][0]).toBe("7,0");
  });
});

describe("échelles des graphiques", () => {
  it("α de 2 à 7 sur toute la largeur", () => {
    expect(xAt(2)).toBe(plot.left);
    expect(xAt(7)).toBe(plot.left + plot.width);
    expect(xAt(4.5)).toBeCloseTo(plot.left + plot.width / 2, 9);
    expect(axisTicks).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it("part de 0 à 100 %, linéaire, vers le haut", () => {
    expect(yShare(0)).toBe(plot.top + plot.height);
    expect(yShare(100)).toBe(plot.top);
    expect(yShare(50)).toBeCloseTo(plot.top + plot.height / 2, 9);
  });

  it.each([
    [1, 10],
    [9.5, 10],
    [10, 100],
    [242.5, 1000],
    [1000, 10_000],
  ])("maximum %d : graduations jusqu'à %d, première puissance de 10 au-dessus", (max, top) => {
    expect(logTop(max)).toBe(top);
  });

  it("une graduation par puissance de 10, à intervalles égaux", () => {
    expect(logTicks(1000)).toEqual([1, 10, 100, 1000]);
    const positions = logTicks(1000).map((tick) => yLog(tick, 1000));
    expect(positions[0]).toBe(plot.top + plot.height);
    expect(positions[3]).toBeCloseTo(plot.top, 9);
    expect(positions[0] - positions[1]).toBeCloseTo(positions[2] - positions[3], 9);
    expect(yLog(Math.sqrt(1000), 1000)).toBeCloseTo(plot.top + plot.height / 2, 9);
  });

  it("place les points des deux graphiques", () => {
    const { share, choices, top } = chartLines([{ n: 20, points: [{ k: 0, satisfiable: 5, total: 10, median: 10 }] }]);
    expect(top).toBe(100);
    expect(share[0].points).toEqual([{ x: plot.left, y: yShare(50) }]);
    expect(choices[0].points).toEqual([{ x: plot.left, y: yLog(10, 100) }]);
    expect(chartLines([]).top).toBe(10);
  });

  it("un trait et un marqueur propres à chaque n ; cercle, carré, triangle, losange", () => {
    expect(sizes.map((n) => curveStyles[n].marker)).toEqual(["circle", "square", "triangle", "diamond"]);
    expect(new Set(sizes.map((n) => curveStyles[n].dash ?? "plein")).size).toBe(4);
    for (const n of sizes) expect(curveStyles[n].color).toMatch(/^var\(--/);
  });
});

describe("clauses du mode pas à pas", () => {
  it("affichées en symboles, lues en mots, comme dans le cahier", () => {
    expect(clauseSymbols([1, -3, 5])).toBe("x₁ ∨ ¬x₃ ∨ x₅");
    expect(clauseWords([1, -3, 5], tf.steps.words)).toBe("x₁ ou non x₃ ou x₅");
    expect(clauseWords([1, -3, 5], te.steps.words)).toBe("x₁ or not x₃ or x₅");
    expect(cahier).toContain("« x₁ ou non x₃ ou x₅ » (affichée x₁ ∨ ¬x₃ ∨ x₅)");
    expect(cahier).toContain("“x₁ or not x₃ or x₅”");
  });
});

describe("messages du mode pas à pas", () => {
  const messages = (number: number, t: typeof tf) => {
    const { events, assignment, choices } = solveWithTrace(stepPuzzle(2026, number));
    return events.map((event) => plain(stepMessage(event, { assignment, choices }, t.steps)));
  };

  it("énigme n° 2, en français", () => {
    expect(messages(2, tf)).toEqual([
      "Choix : x₁ = vrai.",
      "Choix : x₂ = vrai.",
      "Propagation : la clause 3 n'a plus qu'un littéral possible, donc x₄ = faux.",
      "Conflit : la clause 5 est fausse.",
      "Retour en arrière : on annule le choix de x₂ et tout ce qui l'a suivi.",
      "Choix : x₂ = faux (on essaie l'autre valeur).",
      "Choix : x₃ = vrai.",
      "Propagation : la clause 6 n'a plus qu'un littéral possible, donc x₅ = vrai.",
      "Propagation : la clause 1 n'a plus qu'un littéral possible, donc x₄ = vrai.",
      "Propagation : la clause 2 n'a plus qu'un littéral possible, donc x₆ = vrai.",
      "Solution trouvée après 4 choix : x₁ = vrai, x₂ = faux, x₃ = vrai, x₄ = vrai, x₅ = vrai, x₆ = vrai.",
    ]);
  });

  it("énigme n° 2, en anglais", () => {
    expect(messages(2, te).slice(2, 5)).toEqual([
      "Propagation: clause 3 has only one literal left, so x₄ = false.",
      "Conflict: clause 5 is false.",
      "Backtrack: undo the decision on x₂ and everything after it.",
    ]);
  });

  it("variables libres, et énigme sans solution", () => {
    const free = stepMessage({ type: "solution" }, { assignment: [true, null], choices: 1 }, tf.steps);
    expect(plain(free)).toBe("Solution trouvée après 1 choix : x₁ = vrai, x₂ libre (n'importe quelle valeur convient).");
    expect(plain(stepMessage({ type: "none" }, { assignment: null, choices: 6 }, tf.steps))).toBe(
      "Aucune solution : toutes les possibilités ont été éliminées, après 6 choix.",
    );
  });
});

describe("texte mis en forme", () => {
  const html = (text: string) => renderToStaticMarkup(<RichText text={text} />);

  it("gras et indices HTML", () => {
    expect(html("**Exemple** : x₁₂")).toBe("<strong>Exemple</strong> : x<sub>12</sub>");
  });

  it("α, ¬, ∨ et ∧ dans la police des formules, qui contient α", () => {
    expect(html("**Le réglage α** ∨")).toBe(
      '<strong>Le réglage <span class="font-mono">α</span></strong> <span class="font-mono">∨</span>',
    );
  });
});
