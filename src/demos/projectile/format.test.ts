import { describe, expect, it } from "vitest";
import { formatNumber, formatQuantity, formatTick } from "./format";

describe("formatNumber : 3 chiffres significatifs", () => {
  it("utilise la virgule en français et le point en anglais", () => {
    expect(formatNumber(10.2041, "fr")).toBe("10,2");
    expect(formatNumber(10.2041, "en")).toBe("10.2");
  });

  it("garde les zéros significatifs", () => {
    expect(formatNumber(10, "fr")).toBe("10,0");
    expect(formatNumber(4.9, "en")).toBe("4.90");
  });

  it("arrondit les grands et les petits nombres", () => {
    expect(formatNumber(581.8354, "fr")).toBe("582");
    expect(formatNumber(0.098, "fr")).toBe("0,0980");
  });

  it("écrit zéro sans décimales", () => {
    expect(formatNumber(0, "fr")).toBe("0");
    expect(formatNumber(0, "en")).toBe("0");
  });
});

describe("formatQuantity : espace insécable avant l'unité", () => {
  it.each([
    [10.2041, "m", "fr", "10,2 m"],
    [1.4431, "s", "fr", "1,44 s"],
    [62.5, "m", "fr", "62,5 m"],
    [10.2041, "m", "en", "10.2 m"],
    [1.4431, "s", "en", "1.44 s"],
    [62.5, "m", "en", "62.5 m"],
    [0, "m", "fr", "0 m"],
    [14.0712, "m/s", "en", "14.1 m/s"],
  ] as const)("%d %s (%s) → %s", (value, unit, locale, expected) => {
    expect(formatQuantity(value, unit, locale)).toBe(expected);
  });
});

describe("formatTick : graduations sans zéros inutiles", () => {
  it("n'ajoute pas de décimales", () => {
    expect(formatTick(20, "fr")).toBe("20");
    expect(formatTick(0.05, "fr")).toBe("0,05");
    expect(formatTick(2.5, "en")).toBe("2.5");
  });
});
