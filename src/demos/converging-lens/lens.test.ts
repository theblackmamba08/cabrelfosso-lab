import { describe, expect, it } from "vitest";
import { between, tableRows } from "@/test/cahier";
import { formatLength, formatRatio } from "./format";
import { imageDistance, imageHeight, magnification, nature, objectHeight, type Setup } from "./lens";

const section = between("#### Valeurs de contrôle de la lentille", "Affichages attendus");
const decimal = (text: string) => Number(text.replace(",", ".").replace("−", "-"));
const natures = {
  "réelle, renversée, plus petite": "smaller",
  "réelle, renversée, même taille": "same",
  "réelle, renversée, plus grande": "larger",
  "virtuelle, droite, plus grande": "virtual",
  "pas d'image": "none",
} as const;

const rows = tableRows(section).map(([focal, distance, position, ratio, height, kind]) => ({
  setup: { focal: decimal(focal), distance: decimal(distance) } satisfies Setup,
  position,
  ratio,
  height,
  kind: natures[kind.replace(" (hors du cadre)", "") as keyof typeof natures],
}));

describe("objet", () => {
  it("a une hauteur fixe de 2 cm", () => {
    expect(objectHeight).toBe(2);
  });
});

describe("valeurs de contrôle de l'annexe F.1", () => {
  it("le tableau a douze lignes", () => {
    expect(rows).toHaveLength(12);
    expect(rows.every((row) => row.kind !== undefined)).toBe(true);
  });

  it.each(rows)("f′ = $setup.focal, d = $setup.distance", ({ setup, position, ratio, height, kind }) => {
    expect(nature(setup)).toBe(kind);
    if (kind === "none") {
      expect([imageDistance(setup), magnification(setup), imageHeight(setup)]).toEqual([null, null, null]);
      expect([position, ratio, height]).toEqual(["aucune", "aucun", "aucune"]);
      return;
    }
    expect(imageDistance(setup)).toBeCloseTo(decimal(position), 9);
    expect(magnification(setup)).toBeCloseTo(decimal(ratio), 9);
    expect(imageHeight(setup)).toBeCloseTo(decimal(height), 9);
  });
});

describe("affichages attendus (3 chiffres significatifs, arrondis avant l'affichage)", () => {
  const shown = between("Affichages attendus (français, 3 chiffres significatifs)", "Contrôle externe")
    .slice("Affichages attendus (français, 3 chiffres significatifs) : ".length)
    .trim()
    .replace(/\.$/, "")
    .split(" ; ");
  const setups: Setup[] = [
    { focal: 5, distance: 15 },
    { focal: 5, distance: 10 },
    { focal: 5, distance: 5.5 },
    { focal: 5, distance: 2.5 },
    { focal: 10, distance: 10.5 },
    { focal: 5, distance: 30 },
  ];
  const ours = setups.flatMap((setup) => [
    formatLength(imageDistance(setup)!, "fr"),
    formatRatio(magnification(setup)!, "fr"),
    formatLength(imageHeight(setup)!, "fr"),
  ]);

  it("chaque affichage du cahier est produit", () => {
    const plain = (text: string) => text.replace(/ /g, " ");
    expect(shown).toHaveLength(17);
    for (const text of shown) expect(ours.map(plain), text).toContain(text);
  });

  it("signe moins typographique, virgule ou point, espace insécable avant l'unité", () => {
    expect(formatRatio(-1, "fr")).toBe("−1,00");
    expect(formatRatio(-1, "en")).toBe("−1.00");
    expect(formatLength(-0.4, "en")).toBe("−0.400 cm");
    expect(formatLength(210, "fr")).toBe("210 cm");
    expect(formatRatio(-0.49999999999, "fr")).toBe("−0,500");
  });
});

describe("nature, décidée par d, f′ et 2f′ (jamais par γ)", () => {
  it.each([
    [5, 10.5, "smaller"],
    [5, 10, "same"],
    [5, 9.5, "larger"],
    [5, 5, "none"],
    [5, 4.5, "virtual"],
    [2, 40, "smaller"],
    [10, 1, "virtual"],
  ] as const)("f′ = %f, d = %f : %s", (focal, distance, kind) => {
    expect(nature({ focal, distance })).toBe(kind);
  });
});
