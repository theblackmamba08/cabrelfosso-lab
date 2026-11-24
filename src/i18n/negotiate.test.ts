import { describe, expect, it } from "vitest";
import { chooseLocale } from "./negotiate";

describe("chooseLocale (en-tête Accept-Language)", () => {
  it.each([
    [null, "fr"],
    ["", "fr"],
    ["en-US,en;q=0.9", "en"],
    ["fr-CM,fr;q=0.9,en;q=0.8", "fr"],
    ["en-GB;q=0.5, fr;q=0.8", "fr"],
    ["de-DE,en;q=0.7", "en"],
    ["de-DE", "fr"],
    ["*", "fr"],
    ["EN", "en"],
    ["en;q=0", "fr"],
    ["en;q=abc, fr;q=0.1", "fr"],
    ["en, fr", "en"],
    // Poids égaux, espaces, « Q » majuscule, poids hors de 0 à 1 ou vide, autre langue, entrées vides.
    ["fr;q=0.5, en;q=0.5", "fr"],
    ["fr ; Q=0.3 , en ; Q=0.4", "en"],
    ["en;q=2, fr;q=0.1", "fr"],
    ["en;q=-1", "fr"],
    ["en;q=, fr;q=0.1", "fr"],
    ["eng, enx-US", "fr"],
    [",,;q=1,en", "en"],
  ] as const)("%j → %s", (header, locale) => {
    expect(chooseLocale(header)).toBe(locale);
  });
});
