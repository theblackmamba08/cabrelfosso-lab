import { describe, expect, it } from "vitest";
import { animationDuration, launchProgress } from "./animation";
import type { Launch } from "./physics";

const earth: Launch = { speed: 10, angle: 45, height: 0, gravity: 9.8 };

describe("animationDuration", () => {
  it("garde la durée réelle d'un vol court", () => {
    expect(animationDuration(earth)).toBeCloseTo(1443.1, 0);
  });

  it("ramène un vol long à 3 secondes", () => {
    expect(animationDuration({ ...earth, speed: 30, gravity: 1.6 })).toBe(3000);
  });

  it("vaut zéro quand le vol est nul", () => {
    expect(animationDuration({ ...earth, angle: 0 })).toBe(0);
  });
});

describe("launchProgress", () => {
  it("avance de 0 à 1 pendant l'animation", () => {
    expect(launchProgress(0, 2000)).toBe(0);
    expect(launchProgress(500, 2000)).toBe(0.25);
    expect(launchProgress(2000, 2000)).toBe(1);
  });

  it("s'arrête à 1 après la fin", () => {
    expect(launchProgress(2500, 2000)).toBe(1);
  });

  it("passe directement à 1 sans durée (vol nul)", () => {
    expect(launchProgress(0, 0)).toBe(1);
  });
});
