import { describe, expect, it } from "vitest";
import { between, tableRows } from "@/test/cahier";
import { addPoints, difference, emptyRun, estimate, maxPoints, piKey, pointStream, shownLimit } from "./monte-carlo";
import { formatFixed } from "./format";

const section = between("#### Valeurs de contrôle de π", "#### Pour aller plus loin — π");
const integer = (text: string) => Number(text.replace(/\s/g, ""));

describe("clé et premiers points (annexe F.2)", () => {
  it("graine 2026", () => {
    expect(piKey(2026).toString(16).padStart(16, "0")).toBe("000007ea02000000");
    const next = pointStream(2026);
    const points = [next(), next(), next()].map(({ x, y }) => [x.toFixed(10), y.toFixed(10)]);
    expect(points).toEqual([
      ["0.6832870045", "0.5017964535"],
      ["0.4433471586", "0.0882721562"],
      ["0.9030095774", "0.5688651365"],
    ]);
  });

  it("graine 1", () => {
    expect(piKey(1).toString(16).padStart(16, "0")).toBe("0000000102000000");
    const { x, y } = pointStream(1)();
    expect([x.toFixed(10), y.toFixed(10)]).toEqual(["0.6193879198", "0.5703130444"]);
  });
});

describe("tableau de l'annexe F.2", () => {
  const rows = tableRows(section);

  it("a huit lignes", () => {
    expect(rows).toHaveLength(8);
  });

  it.each(rows)("graine %s, N = %s", (seed, total, inside, shown, gap) => {
    let run = emptyRun(integer(seed));
    while (run.total < integer(total)) run = addPoints(run, 10_000 > integer(total) ? integer(total) : 10_000);
    expect(run.total).toBe(integer(total));
    expect(run.inside).toBe(integer(inside));
    expect(formatFixed(estimate(run)!, "fr")).toBe(shown);
    expect(formatFixed(difference(run)!, "fr")).toBe(gap);
  });
});

describe("séries de points", () => {
  it("ajouter 100 puis 900 points donne le même état qu'ajouter 1 000 points", () => {
    expect(addPoints(addPoints(emptyRun(2026), 100), 900)).toEqual(addPoints(emptyRun(2026), 1000));
  });

  it("au plus 100 000 points", () => {
    expect(maxPoints).toBe(100_000);
    let run = emptyRun(7);
    for (let i = 0; i < 12; i++) run = addPoints(run, 10_000);
    expect(run.total).toBe(100_000);
  });

  it("ne garde pour la figure que les 2 000 premiers points", () => {
    expect(shownLimit).toBe(2000);
    const run = addPoints(emptyRun(2026), 10_000);
    expect(run.points).toHaveLength(2000);
    expect(addPoints(emptyRun(2026), 2000).points).toEqual(run.points);
    expect(run.points.filter((point) => point.inside)).toHaveLength(
      run.points.filter(({ x, y }) => x * x + y * y <= 1).length,
    );
  });

  it("une série vide n'a pas d'estimation", () => {
    expect([emptyRun(2026).total, estimate(emptyRun(2026)), difference(emptyRun(2026))]).toEqual([0, null, null]);
  });

  it("4 décimales, virgule ou point", () => {
    expect(formatFixed(3.2, "fr")).toBe("3,2000");
    expect(formatFixed(3.14159, "en")).toBe("3.1416");
  });

  it("10 000 points se calculent vite (moins de 50 ms)", () => {
    const run = addPoints(emptyRun(2026), 90_000);
    const start = performance.now();
    addPoints(run, 10_000);
    expect(performance.now() - start).toBeLessThan(50);
  });
});
