import { describe, expect, it } from "vitest";
import { arcPath, labelAngle, rays } from "./geometry";

const close = (actual: { x: number; y: number } | null, x: number, y: number) => {
  expect(actual?.x).toBeCloseTo(x, 4);
  expect(actual?.y).toBeCloseTo(y, 4);
};

// Repère du SVG : x vers la droite, y vers le bas. Chaque direction est celle de la lumière.
describe("directions des rayons", () => {
  it("à 0°, tout suit la normale", () => {
    const { incident, reflected, refracted } = rays(0, 0);
    close(incident, 0, 1);
    close(reflected, 0, -1);
    close(refracted, 0, 1);
  });

  it("à 40°, de l'air vers l'eau (28,9011°)", () => {
    const { incident, reflected, refracted } = rays(40, 28.9011);
    close(incident, 0.6428, 0.766);
    close(reflected, 0.6428, -0.766);
    close(refracted, 0.4833, 0.8755);
  });

  it("en réflexion totale, aucun rayon réfracté", () => {
    const { incident, reflected, refracted } = rays(49, null);
    close(incident, 0.7547, 0.6561);
    close(reflected, 0.7547, -0.6561);
    expect(refracted).toBeNull();
  });
});

describe("arcs des angles", () => {
  it("partent de la normale et finissent sur le rayon", () => {
    // i₁ : au-dessus, à gauche de la normale ; i₂ : en dessous, à droite.
    expect(arcPath({ x: 100, y: 100 }, 10, 90, "incident")).toBe("M100.00 90.00A10 10 0 0 0 90.00 100.00");
    expect(arcPath({ x: 100, y: 100 }, 10, 90, "refracted")).toBe("M100.00 110.00A10 10 0 0 0 110.00 100.00");
  });

  it("le nom d'un angle est dans l'arc, ou à côté du rayon si l'arc est étroit", () => {
    expect(labelAngle(80)).toBe(40);
    expect(labelAngle(10)).toBe(28);
  });
});
