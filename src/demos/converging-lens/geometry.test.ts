import { describe, expect, it } from "vitest";
import { clipToFrame, frame, lensDiagram } from "./geometry";

type P = { x: number; y: number };
const near = (actual: P | undefined, x: number, y: number) => {
  expect(actual?.x).toBeCloseTo(x, 6);
  expect(actual?.y).toBeCloseTo(y, 6);
};

describe("cadre de la figure", () => {
  it("va de −42 à 42 cm et de −14 à 14 cm", () => {
    expect(frame).toEqual({ left: -42, right: 42, bottom: -14, top: 14 });
  });

  it("coupe un segment à son entrée et à sa sortie, ou l'écarte", () => {
    const [a, b] = clipToFrame({ x: 0, y: 0 }, { x: 100, y: 10 })!;
    near(a, 0, 0);
    near(b, 42, 4.2);
    expect(clipToFrame({ x: 50, y: 0 }, { x: 60, y: 0 })).toBeNull();
  });
});

describe("rayons partant de B, f′ = 5", () => {
  it("d = 15 : image réelle ; (1) par F′, (2) par O, (3) par F puis parallèle", () => {
    const { rays, extensions, image } = lensDiagram({ focal: 5, distance: 15 });
    expect(image).toEqual({ x: 7.5, top: -1, inFrame: true });
    const [one, two, three] = rays;
    expect(rays.map((ray) => ray.id)).toEqual([1, 2, 3]);
    near(one.points[0], -15, 2);
    near(one.points[1], 0, 2);
    // Le rayon (1) passe par F′ (5, 0) et B′ (7,5 ; −1), puis sort du cadre par le bas, en (40, −14).
    near(one.points[2], 40, -14);
    near(two.points[0], -15, 2);
    expect(two.points[1].x).toBeCloseTo(42, 6);
    expect(two.points[1].y).toBeCloseTo(-42 * (2 / 15), 6);
    near(three.points[1], 0, -1);
    near(three.points[2], 42, -1);
    expect(extensions).toEqual([]);
  });

  it("d = 10 : image renversée de même taille, en (10, −2)", () => {
    const { rays, image } = lensDiagram({ focal: 5, distance: 10 });
    expect(image).toEqual({ x: 10, top: -2, inFrame: true });
    near(rays[2].points[1], 0, -2);
  });

  it("d = 5 : objet au foyer, pas d'image ni de rayon (3)", () => {
    const { rays, extensions, image } = lensDiagram({ focal: 5, distance: 5 });
    expect(image).toBeNull();
    expect(rays.map((ray) => ray.id)).toEqual([1, 2]);
    expect(extensions).toEqual([]);
  });

  it("d = 2,5 : image virtuelle en (−5, 4), prolongements en pointillés", () => {
    const { rays, extensions, image } = lensDiagram({ focal: 5, distance: 2.5 });
    expect(image).toEqual({ x: -5, top: 4, inFrame: true });
    near(rays[2].points[0], -2.5, 2);
    near(rays[2].points[1], 0, 4);
    // Prolongements des rayons (1), (2) et (3) vers B′, et construction du rayon (3) depuis F.
    expect(extensions).toHaveLength(4);
    for (const [, end] of extensions.slice(0, 3)) near(end, -5, 4);
    near(extensions[3][0], -5, 0);
    near(extensions[3][1], -2.5, 2);
  });

  it("d = 5,5 : l'image (55 ; −20) sort du cadre", () => {
    const { image, rays } = lensDiagram({ focal: 5, distance: 5.5 });
    expect(image).toEqual({ x: 55, top: -20, inFrame: false });
    // Le rayon (3) atteint la lentille hors du cadre : il est coupé au bord bas.
    expect(rays[2].points.at(-1)!.y).toBeCloseTo(-14, 6);
  });
});
