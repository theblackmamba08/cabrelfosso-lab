import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { firstImpact } from "./physics";
import { cradleSummary, fixedValues, impactReadings } from "./readings";

describe("impactReadings : mesures formatées", () => {
  it("donne la vitesse avant le choc en m/s, 3 chiffres significatifs", () => {
    expect(impactReadings(firstImpact(1, 30, 1), "fr").speed).toBe("0,725 m/s");
    expect(impactReadings(firstImpact(1, 30, 1), "en").speed).toBe("0.725 m/s");
  });

  it("met p en kg·m/s et Ec en J", () => {
    const { momentum, energy } = impactReadings(firstImpact(1, 30, 1), "fr");
    expect(momentum.before.value).toBe("0,0362 kg·m/s");
    expect(energy.before.value).toBe("0,0131 J");
  });

  it("donne une ligne par bille qui bouge, numérotée de gauche à droite", () => {
    expect(impactReadings(firstImpact(1, 30, 1), "fr").balls).toEqual([
      { ball: 5, speed: "0,725 m/s" },
    ]);
    expect(impactReadings(firstImpact(2, 30, 1), "fr").balls.map(({ ball }) => ball)).toEqual([
      4, 5,
    ]);
    expect(impactReadings(firstImpact(1, 30, 0.8), "fr").balls.map(({ ball }) => ball)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("donne aux deux barres d'une grandeur la même échelle", () => {
    const { momentum, energy } = impactReadings(firstImpact(1, 30, 0.8), "fr");
    expect(momentum.before.share).toBeCloseTo(1, 10);
    expect(momentum.after.share).toBeCloseTo(1, 10);
    expect(energy.before.share).toBeCloseTo(1, 10);
    expect(energy.after.share).toBeCloseTo(0.46, 2);
  });

  it("garde des barres égales pour un choc élastique", () => {
    const { energy } = impactReadings(firstImpact(3, 45, 1), "fr");
    expect(energy.after.share).toBeCloseTo(energy.before.share, 10);
  });
});

describe("fixedValues : données fixes affichées", () => {
  it("écrit la masse en g et la longueur en cm", () => {
    expect(fixedValues(fr.demos["newtons-cradle"].fixed, "fr")).toEqual([
      "Masse d’une bille : 50 g",
      "Longueur des fils : 20 cm",
      "g = 9,8 m/s²",
    ]);
  });

  it("s'écrit aussi en anglais", () => {
    expect(fixedValues(en.demos["newtons-cradle"].fixed, "en")).toEqual([
      "Mass of each ball: 50 g",
      "String length: 20 cm",
      "g = 9.8 m/s²",
    ]);
  });
});

describe("cradleSummary : résumé textuel de la figure", () => {
  it("donne les valeurs avant et après", () => {
    expect(
      cradleSummary(firstImpact(1, 30, 0.8), fr.demos["newtons-cradle"].summary, "fr"),
    ).toBe(
      "Avant le choc : p = 0,0362 kg·m/s, Ec = 0,0131 J. Après le choc : p = 0,0362 kg·m/s, Ec = 0,00604 J.",
    );
  });

  it("écrit KE en anglais", () => {
    expect(cradleSummary(firstImpact(1, 30, 1), en.demos["newtons-cradle"].summary, "en")).toBe(
      "Before impact: p = 0.0362 kg·m/s, KE = 0.0131 J. After impact: p = 0.0362 kg·m/s, KE = 0.0131 J.",
    );
  });
});
