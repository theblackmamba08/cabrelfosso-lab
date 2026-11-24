import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  instantiate,
  iupSegment,
  normalizeAxis,
  readPackedDeltas,
  readPackedPoints,
  tupleScalar,
} from "./instance";
import { readSfnt, tableChecksum } from "./sfnt";

/** Police variable officielle (TTF), telle que publiée par le projet Space Grotesk. */
const variable = new Uint8Array(readFileSync(new URL("../../fonts/space-grotesk-wght.ttf", import.meta.url)));

describe("lecture des variations (gvar)", () => {
  it("numéros de points groupés : 0 = tous les points", () => {
    expect(readPackedPoints(Uint8Array.from([0]), 0)).toEqual({ points: undefined, next: 1 });
  });

  it("numéros de points groupés : écarts cumulés, sur 8 ou 16 bits", () => {
    // 3 points : une série de 2 sur 8 bits (1, +2), puis une série de 1 sur 16 bits (+300).
    expect(readPackedPoints(Uint8Array.from([3, 0x01, 1, 2, 0x80, 0x01, 0x2c]), 0)).toEqual({
      points: [1, 3, 303],
      next: 7,
    });
  });

  it("deltas groupés : zéros, octets signés, mots signés", () => {
    expect(readPackedDeltas(Uint8Array.from([0x81, 0x01, 0xff, 0x05, 0x40, 0xff, 0x00]), 0, 5)).toEqual({
      deltas: [0, 0, -1, 5, -256],
      next: 7,
    });
  });
});

describe("calcul des variations", () => {
  it("normalise la graisse entre -1 et 1, puis applique avar", () => {
    const axis = { tag: "wght", min: 300, default: 300, max: 700 };
    expect(normalizeAxis(axis, 300)).toBe(0);
    expect(normalizeAxis(axis, 700)).toBe(1);
    expect(normalizeAxis(axis, 600)).toBe(0.75);
    expect(normalizeAxis(axis, 900)).toBe(1);
    const avar = [
      [-1, -1],
      [0, 0],
      [0.5, 0.25],
      [1, 1],
    ] as Array<[number, number]>;
    expect(normalizeAxis(axis, 500, avar)).toBe(0.25);
    expect(normalizeAxis(axis, 600, avar)).toBeCloseTo(0.625);
  });

  it("pondère chaque région : pic, région intermédiaire, hors région", () => {
    expect(tupleScalar([1], [0.75])).toBe(0.75);
    expect(tupleScalar([1], [0])).toBe(0);
    expect(tupleScalar([-1], [0.5])).toBe(0);
    expect(tupleScalar([0.5], [0.75], [0], [1])).toBeCloseTo(0.5);
    expect(tupleScalar([0.5], [0.25], [0], [1])).toBeCloseTo(0.5);
    expect(tupleScalar([0.5], [0.75], [0], [0.5])).toBe(0);
  });

  it("interpole les points sans delta (IUP) entre deux points de référence", () => {
    // Références x = 0 (delta 10) et x = 100 (delta 20) ; points à -5, 50 et 150.
    expect(iupSegment([-5, 50, 150], 0, 10, 100, 20)).toEqual([10, 15, 20]);
    expect(iupSegment([3, 4], 7, 2, 7, 2)).toEqual([2, 2]);
    expect(iupSegment([3, 4], 7, 2, 7, 5)).toEqual([0, 0]);
  });
});

describe("instantiate (Space Grotesk du dépôt)", () => {
  const glyphOutlines = (font: Uint8Array) => {
    const { tables } = readSfnt(font);
    const head = new DataView(tables.get("head")!.buffer, tables.get("head")!.byteOffset);
    return { tables, longLoca: head.getInt16(50) === 1 };
  };
  const advances = (font: Uint8Array) => {
    const { tables } = readSfnt(font);
    const hhea = tables.get("hhea")!;
    const hmtx = tables.get("hmtx")!;
    const metrics = (hhea[34] << 8) | hhea[35];
    return Array.from({ length: metrics }, (_, i) => (hmtx[i * 4] << 8) | hmtx[i * 4 + 1]);
  };

  it("retire les tables de variation et garde une police valide", () => {
    const font = instantiate(variable, { wght: 600 });
    const { tables } = glyphOutlines(font);
    for (const tag of ["fvar", "gvar", "avar", "HVAR", "STAT", "DSIG"]) expect(tables.has(tag), tag).toBe(false);
    for (const tag of ["cmap", "glyf", "loca", "hmtx", "head"]) expect(tables.has(tag), tag).toBe(true);
    expect(tableChecksum(font)).toBe(0xb1b0afba);
  });

  it("à la graisse par défaut (300), garde les chasses de la police variable", () => {
    const original = advances(variable);
    const regular = advances(instantiate(variable, { wght: 300 }));
    original.forEach((advance, i) => expect(regular[i]).toBe(advance));
  });

  it("à 700, élargit les glyphes dessinés et règle la classe de graisse", () => {
    const light = advances(instantiate(variable, { wght: 300 }));
    const bold = advances(instantiate(variable, { wght: 700 }));
    const wider = bold.filter((advance, i) => advance > light[i]).length;
    expect(wider).toBeGreaterThan(light.length / 2);
    const { tables } = readSfnt(instantiate(variable, { wght: 600 }));
    const os2 = tables.get("OS/2")!;
    expect((os2[4] << 8) | os2[5]).toBe(600);
  });
});
