import { describe, expect, it } from "vitest";
import { between, tableRows } from "@/test/cahier";
import { alphaCount } from "./puzzle";
import { alphaPoint, curveSummary, median, nextNumber, startNumber } from "./statistics";

describe("médiane", () => {
  it("valeur du milieu, ou moyenne des deux valeurs centrales", () => {
    expect(median([9, 1, 10])).toBe(9);
    expect(median([10, 2, 1, 9])).toBe(5.5);
    expect(median([100, 20, 3, 100])).toBe(60);
  });
});

/** Courbes de référence, lues dans le cahier (annexe D.3). */
const reference = tableRows(between("**Courbes de référence, graine 2026", "Résumés attendus")).map((row) =>
  row.map((cell) => Number(cell.replace(",", "."))),
);

const curve = (n: number, puzzles: number) =>
  Array.from({ length: alphaCount }, (_, k) => alphaPoint({ seed: 2026, n, k, puzzles }));

describe("courbes de référence, graine 2026, 20 énigmes par α", () => {
  it("le tableau du cahier a 26 lignes", () => {
    expect(reference).toHaveLength(26);
    expect(reference[25]).toEqual([7, 0, 20, 0, 74]);
  });

  it.each([
    [20, 1, { kind: "crossing", a: 4.6, b: 4.8, c: 5, d: 36.5 }],
    [40, 3, { kind: "crossing", a: 4.4, b: 4.6, c: 4.4, d: 242.5 }],
  ])("n = %i", (n, column, summary) => {
    const points = curve(n, 20);
    expect(points.map(({ satisfiable, median: choices }) => [satisfiable, choices])).toEqual(
      reference.map((row) => [row[column], row[column + 1]]),
    );
    expect(points.map((point) => point.share)).toEqual(reference.map((row) => row[column] * 5));
    expect(curveSummary(points)).toEqual(summary);
  });
});

it("F = 50 garde les 20 premières énigmes de F = 20", () => {
  const address = { seed: 2026, n: 20, k: 12 };
  const fifty = alphaPoint({ ...address, puzzles: 50 });
  const twenty = alphaPoint({ ...address, puzzles: 20 });
  expect(fifty.choices.slice(0, 20)).toEqual(twenty.choices);
  expect(fifty.choices).toHaveLength(50);
  expect(twenty.total).toBe(20);
});

describe("résumé d'une courbe", () => {
  const points = (satisfiable: number[], medians: number[], total = 20) =>
    satisfiable.map((value, k) => ({ k, satisfiable: value, total, median: medians[k] }));

  it("exactement 50 % n'est pas « sous » 50 %", () => {
    expect(curveSummary(points([20, 10, 9], [1, 2, 3]))).toEqual({ kind: "crossing", a: 2.2, b: 2.4, c: 2.4, d: 3 });
  });

  it("retient le premier passage sous 50 %, même si la part remonte ensuite", () => {
    expect(curveSummary(points([20, 9, 12, 3], [1, 1, 1, 1]))).toMatchObject({ a: 2, b: 2.2 });
  });

  it("variante : au moins 50 % sur toute la plage", () => {
    expect(curveSummary(points([20, 10], [4, 4]))).toEqual({ kind: "above", c: 2, d: 4 });
  });

  it("variante : sous 50 % dès la première valeur", () => {
    expect(curveSummary(points([9, 20], [4, 5.5]))).toEqual({ kind: "below", a: 2, c: 2.2, d: 5.5 });
  });

  it("prend le plus petit α en cas d'égalité des médianes", () => {
    expect(curveSummary(points([20, 5, 0], [7, 9, 9]))).toMatchObject({ c: 2.2, d: 9 });
  });
});

describe("numéro de l'énigme du mode pas à pas", () => {
  it("départ : la première qui a un conflit, n° 2 pour la graine 2026", () => {
    expect(startNumber(2026)).toBe(2);
  });

  it("départ : la n° 1 si aucune des 256 n'a de conflit", () => {
    const tried: number[] = [];
    const start = startNumber(1, (_seed, number) => {
      tried.push(number);
      return false;
    });
    expect([start, tried[0], tried.at(-1), tried.length]).toEqual([1, 1, 256, 256]);
  });

  it("autre énigme : le numéro suivant ; après 256, retour à 1", () => {
    expect([1, 2, 255, 256].map(nextNumber)).toEqual([2, 3, 256, 1]);
  });
});
