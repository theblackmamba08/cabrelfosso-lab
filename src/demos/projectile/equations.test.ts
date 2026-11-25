import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { equations, motionEquations, type Equation } from "./equations";
import { parseMath, plainMath } from "./math";
import type { Launch } from "./physics";

const launch: Launch = { speed: 10, angle: 45, height: 0, gravity: 9.8 };

function byId(list: Equation[], id: Equation["id"]) {
  const equation = list.find((item) => item.id === id);
  if (!equation) throw new Error(id);
  return equation;
}

/** Lignes d'une équation en texte simple. */
const plain = (lines: readonly string[]) => lines.map(plainMath);

describe("parseMath", () => {
  it("sépare le texte, les variables, les indices et les exposants", () => {
    expect(parseMath("*v*_{0}^{2} sin *α*")).toEqual([
      { kind: "variable", value: "v" },
      { kind: "sub", value: "0" },
      { kind: "sup", value: "2" },
      { kind: "text", value: " sin " },
      { kind: "variable", value: "α" },
    ]);
  });
});

describe("équations avec leurs valeurs (v₀ = 10, α = 45°, h₀ = 0, g = 9,8)", () => {
  const list = equations(launch, "fr");

  it("équations horaires, sans terme nul", () => {
    expect(plain(byId(list, "motion").values)).toEqual([
      "x(t) = 7,07 t",
      "y(t) = −4,90 t² + 7,07 t",
    ]);
  });

  it("équation de la trajectoire", () => {
    expect(plain(byId(list, "trajectory").values)).toEqual(["y = −0,0980 x² + 1,00 x"]);
  });

  it("flèche, durée du vol, portée et vitesse à l'impact, avec leur unité", () => {
    expect(plain(byId(list, "apex").values)).toEqual(["H = 2,55 m"]);
    expect(plain(byId(list, "flightTime").values)).toEqual(["t_v = 1,44 s"]);
    expect(plain(byId(list, "range").values)).toEqual(["D = 10,2 m"]);
    expect(plain(byId(list, "impactSpeed").values)).toEqual(["v = 10,0 m/s"]);
  });

  it("utilise le point décimal et la lettre R en anglais", () => {
    const english = equations(launch, "en");
    expect(plain(byId(english, "motion").values)).toEqual([
      "x(t) = 7.07 t",
      "y(t) = −4.90 t² + 7.07 t",
    ]);
    expect(plain(byId(english, "range").values)).toEqual(["R = 10.2 m"]);
  });
});

describe("équations : autres cas", () => {
  it("ajoute la hauteur de départ quand elle n'est pas nulle", () => {
    const list = equations({ ...launch, height: 5 }, "fr");
    expect(plain(byId(list, "motion").values)[1]).toBe("y(t) = −4,90 t² + 7,07 t + 5,00");
    expect(plain(byId(list, "trajectory").values)).toEqual([
      "y = −0,0980 x² + 1,00 x + 5,00",
    ]);
  });

  it("retire le terme en t d'un tir horizontal", () => {
    const list = equations({ ...launch, angle: 0, height: 5 }, "fr");
    expect(plain(byId(list, "motion").values)).toEqual([
      "x(t) = 10,0 t",
      "y(t) = −4,90 t² + 5,00",
    ]);
  });

  it("tir vertical : x(t) = 0 et pas d'équation de trajectoire", () => {
    const list = equations({ ...launch, angle: 90 }, "fr");
    expect(plain(byId(list, "motion").values)[0]).toBe("x(t) = 0");
    expect(byId(list, "trajectory").values).toEqual([]);
    expect(byId(list, "trajectory").literal).toEqual([]);
  });
});

describe("motionEquations (accueil)", () => {
  it("donne seulement les équations horaires et la portée", () => {
    const { motion, range } = motionEquations(launch, "fr");
    expect(motion.map(plainMath)).toEqual(["x(t) = 7,07 t", "y(t) = −4,90 t² + 7,07 t"]);
    expect(range).toBe("10,2 m");
  });
});

describe("formes littérales", () => {
  const cahier = readFileSync(
    new URL("../../../docs/cahier-des-charges.md", import.meta.url),
    "utf8",
  );
  const annexe = cahier.slice(cahier.indexOf("### C.2"), cahier.indexOf("### C.3"));

  it.each(equations(launch, "fr").flatMap((equation) => equation.literal.map(plainMath)))(
    "« %s » figure dans l'annexe C.2",
    (formula) => {
      expect(annexe).toContain(formula);
    },
  );

  it("écrit la portée R en anglais", () => {
    const lines = byId(equations(launch, "en"), "range").literal.map(plainMath);
    expect(lines).toEqual(["R = v₀ cos α · t_v", "R = v₀² sin 2α / g"]);
    expect(annexe).toContain(lines[1]);
  });
});
