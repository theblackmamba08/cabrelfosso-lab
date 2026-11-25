import { describe, expect, it } from "vitest";
import { between, tableRows } from "@/test/cahier";
import { formatAngle } from "./format";
import { criticalAngle, indices, reflectionAngle, refract, sineOfRefraction, type Medium } from "./optics";

const names: Record<string, Medium> = { Air: "air", Eau: "water", Verre: "glass", Diamant: "diamond" };
const section = between("#### Valeurs de contrôle de la réfraction", "Affichages attendus");
const written = (value: number) => (value === 0 ? "0" : value.toFixed(4).replace(".", ","));

const rows = tableRows(section).map(([media, angle, sine, refracted, critical]) => {
  const [from, to] = media.split(" → ").map((name) => names[name]);
  return { media, from, to, angle: Number(angle), sine, refracted, critical };
});

describe("indices de réfraction", () => {
  it("sont exactement ceux affichés", () => {
    expect(indices).toEqual({ air: 1, water: 1.33, glass: 1.52, diamond: 2.42 });
  });
});

describe("valeurs de contrôle de l'annexe E.2", () => {
  it("le tableau a quatorze lignes", () => {
    expect(rows).toHaveLength(14);
  });

  it.each(rows)("$media, $angle°", ({ from, to, angle, sine, refracted, critical }) => {
    const setup = { from, to, angle };
    expect(written(sineOfRefraction(setup))).toBe(sine);
    const i2 = refract(setup);
    expect(i2 === null ? "réflexion totale" : written(i2)).toBe(refracted);
    const limit = criticalAngle(setup);
    expect(limit === null ? "aucun" : written(limit)).toBe(critical);
    expect(reflectionAngle(setup)).toBe(angle);
  });
});

describe("affichage des angles", () => {
  it.each([
    [refract({ from: "air", to: "water", angle: 40 }), "28,9°"],
    [refract({ from: "air", to: "water", angle: 89 }), "48,7°"],
    [refract({ from: "water", to: "air", angle: 30 }), "41,7°"],
    [refract({ from: "water", to: "air", angle: 48 }), "81,3°"],
    [criticalAngle({ from: "water", to: "air" }), "48,8°"],
    [criticalAngle({ from: "glass", to: "air" }), "41,1°"],
    [criticalAngle({ from: "diamond", to: "air" }), "24,4°"],
    [criticalAngle({ from: "glass", to: "water" }), "61,0°"],
    [refract({ from: "glass", to: "water", angle: 61 }), "88,3°"],
    [refract({ from: "water", to: "water", angle: 35 }), "35,0°"],
    [refract({ from: "air", to: "water", angle: 0 }), "0°"],
  ])("%f s'écrit %s", (value, shown) => {
    expect(value).not.toBeNull();
    expect(formatAngle(value as number, "fr")).toBe(shown);
    expect(formatAngle(value as number, "en")).toBe(shown.replace(",", "."));
  });
});
