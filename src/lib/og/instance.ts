import { readSfnt, writeSfnt } from "./sfnt";

/*
 * Instanciation d'une police variable TrueType à une position donnée (par exemple wght 600) :
 * les variations de gvar sont appliquées aux contours et aux chasses, puis les tables de
 * variation sont retirées. Le générateur des images de partage (satori) ne dessine que
 * l'instance par défaut d'une police variable. Spécification :
 * https://learn.microsoft.com/typography/opentype/spec/gvar et .../otvarcommonformats
 */

type Read<T> = T & { next: number };
type Axis = { tag: string; min: number; default: number; max: number };

/** Tables retirées : les variations, et la signature numérique (DSIG), qui ne vaut plus une fois les contours modifiés. */
const DROPPED_TABLES = ["fvar", "gvar", "avar", "cvar", "HVAR", "VVAR", "MVAR", "STAT", "DSIG"];

/** Numéros de points groupés ; `undefined` = tous les points. */
export function readPackedPoints(data: Uint8Array, offset: number): Read<{ points: number[] | undefined }> {
  let count = data[offset++];
  if (count === 0) return { points: undefined, next: offset };
  if (count & 0x80) count = ((count & 0x7f) << 8) | data[offset++];
  const points: number[] = [];
  let last = 0;
  while (points.length < count) {
    const control = data[offset++];
    const run = (control & 0x7f) + 1;
    for (let i = 0; i < run && points.length < count; i++) {
      if (control & 0x80) {
        last += (data[offset] << 8) | data[offset + 1];
        offset += 2;
      } else {
        last += data[offset++];
      }
      points.push(last);
    }
  }
  return { points, next: offset };
}

/** Deltas groupés : séries de zéros, d'octets signés ou de mots signés. */
export function readPackedDeltas(data: Uint8Array, offset: number, count: number): Read<{ deltas: number[] }> {
  const deltas: number[] = [];
  while (deltas.length < count) {
    const control = data[offset++];
    const run = (control & 0x3f) + 1;
    for (let i = 0; i < run && deltas.length < count; i++) {
      if (control & 0x80) {
        deltas.push(0);
      } else if (control & 0x40) {
        const word = (data[offset] << 8) | data[offset + 1];
        deltas.push(word & 0x8000 ? word - 0x10000 : word);
        offset += 2;
      } else {
        const byte = data[offset++];
        deltas.push(byte & 0x80 ? byte - 0x100 : byte);
      }
    }
  }
  return { deltas, next: offset };
}

/** Coordonnée normalisée d'un axe (-1 à 1), puis corrigée par la table avar s'il y en a une. */
export function normalizeAxis(axis: Axis, value: number, avar?: Array<[number, number]>): number {
  const clamped = Math.min(Math.max(value, axis.min), axis.max);
  let v =
    clamped < axis.default
      ? (clamped - axis.default) / (axis.default - axis.min)
      : clamped > axis.default
        ? (clamped - axis.default) / (axis.max - axis.default)
        : 0;
  if (avar && avar.length) {
    for (let i = 1; i < avar.length; i++) {
      const [fromA, toA] = avar[i - 1];
      const [fromB, toB] = avar[i];
      if (v <= fromB) {
        v = fromB === fromA ? toB : toA + ((v - fromA) * (toB - toA)) / (fromB - fromA);
        break;
      }
    }
  }
  return v;
}

/** Poids d'une région de variation pour une position donnée (produit sur les axes). */
export function tupleScalar(peak: number[], coords: number[], start?: number[], end?: number[]): number {
  let scalar = 1;
  for (let a = 0; a < peak.length; a++) {
    const p = peak[a];
    const v = coords[a] ?? 0;
    if (p === 0) continue;
    if (v === 0) return 0;
    if (start && end) {
      const s = start[a];
      const e = end[a];
      if (s > p || p > e || (s < 0 && e > 0 && p !== 0)) continue;
      if (v < s || v > e) return 0;
      scalar *= v < p ? (p === s ? 1 : (v - s) / (p - s)) : v > p ? (e === p ? 1 : (e - v) / (e - p)) : 1;
    } else {
      if (v < Math.min(0, p) || v > Math.max(0, p)) return 0;
      scalar *= v / p;
    }
  }
  return scalar;
}

/** Delta interpolé (IUP) de points sans delta, entre deux points de référence, sur un axe. */
export function iupSegment(coords: number[], x1: number, d1: number, x2: number, d2: number): number[] {
  if (x1 === x2) return coords.map(() => (d1 === d2 ? d1 : 0));
  if (x1 > x2) [x1, x2, d1, d2] = [x2, x1, d2, d1];
  const scale = (d2 - d1) / (x2 - x1);
  return coords.map((x) => (x <= x1 ? d1 : x >= x2 ? d2 : d1 + (x - x1) * scale));
}

/** Complète les deltas d'un contour : points sans delta interpolés entre leurs voisins touchés. */
function iupContour(xs: number[], ys: number[], dx: (number | undefined)[], dy: (number | undefined)[]) {
  const n = xs.length;
  const touched = dx.map((d, i) => (d === undefined ? -1 : i)).filter((i) => i >= 0);
  if (touched.length === 0) return { dx: xs.map(() => 0), dy: ys.map(() => 0) };
  const outX = dx.slice() as number[];
  const outY = dy.slice() as number[];
  if (touched.length === 1) {
    const t = touched[0];
    return { dx: xs.map(() => dx[t]!), dy: ys.map(() => dy[t]!) };
  }
  for (let k = 0; k < touched.length; k++) {
    const i1 = touched[k];
    const i2 = touched[(k + 1) % touched.length];
    const between: number[] = [];
    for (let i = (i1 + 1) % n; i !== i2; i = (i + 1) % n) between.push(i);
    if (between.length === 0) continue;
    const ix = iupSegment(between.map((i) => xs[i]), xs[i1], dx[i1]!, xs[i2], dx[i2]!);
    const iy = iupSegment(between.map((i) => ys[i]), ys[i1], dy[i1]!, ys[i2], dy[i2]!);
    between.forEach((i, j) => {
      outX[i] = ix[j];
      outY[i] = iy[j];
    });
  }
  return { dx: outX, dy: outY };
}

type SimpleGlyph = {
  kind: "simple";
  endPoints: number[];
  instructions: Uint8Array;
  onCurve: boolean[];
  overlap: boolean;
  xs: number[];
  ys: number[];
};
type Component = { flags: number; glyph: number; dx: number; dy: number; transform: Uint8Array };
type CompositeGlyph = { kind: "composite"; xMin: number; components: Component[]; instructions?: Uint8Array };
type Glyph = { kind: "empty" } | SimpleGlyph | CompositeGlyph;

function parseGlyph(data: Uint8Array): Glyph {
  if (data.length === 0) return { kind: "empty" };
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const contours = view.getInt16(0);
  let at = 10;
  if (contours < 0) {
    const components: Component[] = [];
    let flags: number;
    let withInstructions = false;
    do {
      flags = view.getUint16(at);
      const glyph = view.getUint16(at + 2);
      at += 4;
      let dx: number;
      let dy: number;
      if (flags & 0x0001) {
        dx = flags & 0x0002 ? view.getInt16(at) : view.getUint16(at);
        dy = flags & 0x0002 ? view.getInt16(at + 2) : view.getUint16(at + 2);
        at += 4;
      } else {
        dx = flags & 0x0002 ? view.getInt8(at) : view.getUint8(at);
        dy = flags & 0x0002 ? view.getInt8(at + 1) : view.getUint8(at + 1);
        at += 2;
      }
      const size = flags & 0x0008 ? 2 : flags & 0x0040 ? 4 : flags & 0x0080 ? 8 : 0;
      components.push({ flags, glyph, dx, dy, transform: data.slice(at, at + size) });
      at += size;
      if (flags & 0x0100) withInstructions = true;
    } while (flags & 0x0020);
    const instructions = withInstructions
      ? data.slice(at + 2, at + 2 + view.getUint16(at))
      : undefined;
    return { kind: "composite", xMin: view.getInt16(2), components, instructions };
  }
  const endPoints = Array.from({ length: contours }, (_, i) => view.getUint16(at + i * 2));
  at += contours * 2;
  const instructionLength = view.getUint16(at);
  const instructions = data.slice(at + 2, at + 2 + instructionLength);
  at += 2 + instructionLength;
  const total = contours ? endPoints[contours - 1] + 1 : 0;
  const flags: number[] = [];
  while (flags.length < total) {
    const flag = data[at++];
    flags.push(flag);
    if (flag & 0x08) {
      const repeat = data[at++];
      for (let r = 0; r < repeat; r++) flags.push(flag);
    }
  }
  const read = (short: number, same: number) => {
    const values: number[] = [];
    let value = 0;
    for (const flag of flags) {
      if (flag & short) {
        value += flag & same ? data[at] : -data[at];
        at += 1;
      } else if (!(flag & same)) {
        value += view.getInt16(at);
        at += 2;
      }
      values.push(value);
    }
    return values;
  };
  const xs = read(0x02, 0x10);
  const ys = read(0x04, 0x20);
  return {
    kind: "simple",
    endPoints,
    instructions,
    onCurve: flags.map((f) => (f & 0x01) !== 0),
    overlap: (flags[0] & 0x40) !== 0,
    xs,
    ys,
  };
}

/** Écrit un glyphe au format TrueType ; renvoie aussi sa boîte englobante. */
function writeGlyph(glyph: Glyph, boxes: Array<number[] | undefined>): { bytes: Uint8Array; box?: number[] } {
  if (glyph.kind === "empty") return { bytes: new Uint8Array(0) };
  const parts: number[] = [];
  const u8 = (v: number) => parts.push(v & 0xff);
  const u16 = (v: number) => parts.push((v >> 8) & 0xff, v & 0xff);
  let box: number[];
  if (glyph.kind === "simple") {
    box = [Math.min(...glyph.xs), Math.min(...glyph.ys), Math.max(...glyph.xs), Math.max(...glyph.ys)];
    u16(glyph.endPoints.length);
    box.forEach(u16);
    glyph.endPoints.forEach(u16);
    u16(glyph.instructions.length);
    glyph.instructions.forEach(u8);
    glyph.onCurve.forEach((on, i) => u8((on ? 0x01 : 0) | (i === 0 && glyph.overlap ? 0x40 : 0)));
    let previous = 0;
    for (const x of glyph.xs) {
      u16(x - previous);
      previous = x;
    }
    previous = 0;
    for (const y of glyph.ys) {
      u16(y - previous);
      previous = y;
    }
  } else {
    // Boîte englobante : union de celles des composants, décalées (transformations ignorées).
    const corners = glyph.components.flatMap((c) => {
      const b = boxes[c.glyph];
      return b ? [[b[0] + c.dx, b[1] + c.dy, b[2] + c.dx, b[3] + c.dy]] : [];
    });
    box = corners.length
      ? [
          Math.min(...corners.map((b) => b[0])),
          Math.min(...corners.map((b) => b[1])),
          Math.max(...corners.map((b) => b[2])),
          Math.max(...corners.map((b) => b[3])),
        ]
      : [0, 0, 0, 0];
    u16(0xffff);
    box.forEach(u16);
    glyph.components.forEach((c, i) => {
      const more = i < glyph.components.length - 1;
      // Décalages toujours écrits sur 16 bits.
      u16((c.flags | 0x0001) & ~0x0020 & 0xffff | (more ? 0x0020 : 0));
      u16(c.glyph);
      u16(c.dx);
      u16(c.dy);
      c.transform.forEach(u8);
    });
    if (glyph.instructions) {
      u16(glyph.instructions.length);
      glyph.instructions.forEach(u8);
    }
  }
  while (parts.length % 4) parts.push(0);
  return { bytes: Uint8Array.from(parts), box };
}

/** Instancie une police variable aux positions données (par étiquette d'axe : { wght: 600 }). */
export function instantiate(font: Uint8Array, position: Record<string, number>): Uint8Array {
  const { flavor, tables } = readSfnt(font);
  const table = (tag: string) => {
    const data = tables.get(tag);
    if (!data) throw new Error(`Police : table ${tag} absente`);
    return { data, view: new DataView(data.buffer, data.byteOffset, data.byteLength) };
  };

  // Axes et position normalisée.
  const fvar = table("fvar");
  const axesOffset = fvar.view.getUint16(4);
  const axisCount = fvar.view.getUint16(8);
  const axisSize = fvar.view.getUint16(10);
  const axes: Axis[] = Array.from({ length: axisCount }, (_, i) => {
    const at = axesOffset + i * axisSize;
    return {
      tag: String.fromCharCode(...fvar.data.subarray(at, at + 4)),
      min: fvar.view.getInt32(at + 4) / 65536,
      default: fvar.view.getInt32(at + 8) / 65536,
      max: fvar.view.getInt32(at + 12) / 65536,
    };
  });
  const avarMaps: Array<Array<[number, number]>> = [];
  if (tables.has("avar")) {
    const avar = table("avar");
    let at = 8;
    for (let a = 0; a < avar.view.getUint16(6); a++) {
      const count = avar.view.getUint16(at);
      at += 2;
      avarMaps.push(
        Array.from({ length: count }, (_, i) => [
          avar.view.getInt16(at + i * 4) / 16384,
          avar.view.getInt16(at + i * 4 + 2) / 16384,
        ]),
      );
      at += count * 4;
    }
  }
  const coords = axes.map((axis, a) => normalizeAxis(axis, position[axis.tag] ?? axis.default, avarMaps[a]));

  // Glyphes d'origine.
  const head = table("head");
  const longLoca = head.view.getInt16(50) === 1;
  const numGlyphs = table("maxp").view.getUint16(4);
  const loca = table("loca");
  const glyfData = table("glyf").data;
  const offset = (i: number) => (longLoca ? loca.view.getUint32(i * 4) : loca.view.getUint16(i * 2) * 2);
  const glyphs = Array.from({ length: numGlyphs }, (_, i) =>
    parseGlyph(glyfData.subarray(offset(i), offset(i + 1))),
  );
  const hhea = table("hhea");
  const numberOfHMetrics = hhea.view.getUint16(34);
  const hmtx = table("hmtx");
  const advances = Array.from({ length: numGlyphs }, (_, i) =>
    hmtx.view.getUint16(Math.min(i, numberOfHMetrics - 1) * 4),
  );
  const lsbs = Array.from({ length: numGlyphs }, (_, i) =>
    i < numberOfHMetrics ? hmtx.view.getInt16(i * 4 + 2) : hmtx.view.getInt16(numberOfHMetrics * 4 + (i - numberOfHMetrics) * 2),
  );

  // Variations de chaque glyphe.
  const gvar = table("gvar");
  const sharedCount = gvar.view.getUint16(6);
  const sharedOffset = gvar.view.getUint32(8);
  const longOffsets = (gvar.view.getUint16(14) & 1) === 1;
  const dataStart = gvar.view.getUint32(16);
  const sharedTuples = Array.from({ length: sharedCount }, (_, t) =>
    Array.from({ length: axisCount }, (_, a) => gvar.view.getInt16(sharedOffset + (t * axisCount + a) * 2) / 16384),
  );
  const variationOffset = (i: number) =>
    longOffsets ? gvar.view.getUint32(20 + i * 4) : gvar.view.getUint16(20 + i * 2) * 2;

  const newAdvances: number[] = [];
  const newLsbs: number[] = [];
  glyphs.forEach((glyph, g) => {
    const pointCount = glyph.kind === "simple" ? glyph.xs.length : glyph.kind === "composite" ? glyph.components.length : 0;
    const total = pointCount + 4;
    const sumX = new Array<number>(total).fill(0);
    const sumY = new Array<number>(total).fill(0);
    const start = variationOffset(g);
    const end = variationOffset(g + 1);
    if (end > start) {
      const base = dataStart + start;
      const data = gvar.data.subarray(base, dataStart + end);
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const countField = view.getUint16(0);
      const tupleCount = countField & 0x0fff;
      let serialized = view.getUint16(2);
      let sharedPoints: number[] | undefined;
      if (countField & 0x8000) {
        const read = readPackedPoints(data, serialized);
        sharedPoints = read.points;
        serialized = read.next;
      }
      let header = 4;
      for (let t = 0; t < tupleCount; t++) {
        const size = view.getUint16(header);
        const index = view.getUint16(header + 2);
        header += 4;
        let peak: number[];
        if (index & 0x8000) {
          peak = Array.from({ length: axisCount }, (_, a) => view.getInt16(header + a * 2) / 16384);
          header += axisCount * 2;
        } else {
          peak = sharedTuples[index & 0x0fff];
        }
        let regionStart: number[] | undefined;
        let regionEnd: number[] | undefined;
        if (index & 0x4000) {
          regionStart = Array.from({ length: axisCount }, (_, a) => view.getInt16(header + a * 2) / 16384);
          regionEnd = Array.from(
            { length: axisCount },
            (_, a) => view.getInt16(header + (axisCount + a) * 2) / 16384,
          );
          header += axisCount * 4;
        }
        const tupleData = serialized;
        serialized += size;
        const scalar = tupleScalar(peak, coords, regionStart, regionEnd);
        if (scalar === 0) continue;
        let at = tupleData;
        let points = sharedPoints;
        if (index & 0x2000) {
          const read = readPackedPoints(data, at);
          points = read.points;
          at = read.next;
        }
        const count = points ? points.length : total;
        const xs = readPackedDeltas(data, at, count);
        const ys = readPackedDeltas(data, xs.next, count);
        const dx = new Array<number | undefined>(total).fill(undefined);
        const dy = new Array<number | undefined>(total).fill(undefined);
        (points ?? Array.from({ length: total }, (_, i) => i)).forEach((p, i) => {
          if (p >= total) return;
          dx[p] = xs.deltas[i];
          dy[p] = ys.deltas[i];
        });
        if (points && glyph.kind === "simple") {
          // Points d'un contour sans delta : interpolés (IUP), contour par contour.
          let first = 0;
          for (const last of glyph.endPoints) {
            const range = Array.from({ length: last - first + 1 }, (_, k) => first + k);
            const filled = iupContour(
              range.map((i) => glyph.xs[i]),
              range.map((i) => glyph.ys[i]),
              range.map((i) => dx[i]),
              range.map((i) => dy[i]),
            );
            range.forEach((i, k) => {
              dx[i] = filled.dx[k];
              dy[i] = filled.dy[k];
            });
            first = last + 1;
          }
        }
        for (let i = 0; i < total; i++) {
          sumX[i] += scalar * (dx[i] ?? 0);
          sumY[i] += scalar * (dy[i] ?? 0);
        }
      }
    }
    // Points fantômes : origine (pp1) et chasse (pp2).
    const xMin =
      glyph.kind === "simple" ? Math.min(...glyph.xs) : glyph.kind === "composite" ? glyph.xMin : 0;
    const pp1 = xMin - lsbs[g] + sumX[pointCount];
    const pp2 = xMin - lsbs[g] + advances[g] + sumX[pointCount + 1];
    newAdvances.push(Math.max(0, Math.round(pp2 - pp1)));
    const origin = Math.round(pp1);
    if (glyph.kind === "simple") {
      glyph.xs = glyph.xs.map((x, i) => Math.round(x + sumX[i]) - origin);
      glyph.ys = glyph.ys.map((y, i) => Math.round(y + sumY[i]));
      newLsbs.push(Math.min(...glyph.xs));
    } else if (glyph.kind === "composite") {
      glyph.components.forEach((c, i) => {
        if (c.flags & 0x0002) {
          c.dx = Math.round(c.dx + sumX[i]) - origin;
          c.dy = Math.round(c.dy + sumY[i]);
        }
      });
      newLsbs.push(0); // corrigé après le calcul des boîtes englobantes
    } else {
      newLsbs.push(0);
    }
  });

  // Nouvelles tables glyf, loca (format long), hmtx (une métrique complète par glyphe).
  const boxes: Array<number[] | undefined> = new Array(numGlyphs);
  const written: Uint8Array[] = new Array(numGlyphs);
  const order = [
    ...glyphs.map((_, i) => i).filter((i) => glyphs[i].kind !== "composite"),
    ...glyphs.map((_, i) => i).filter((i) => glyphs[i].kind === "composite"),
  ];
  for (const i of order) {
    const { bytes, box } = writeGlyph(glyphs[i], boxes);
    written[i] = bytes;
    boxes[i] = box;
    if (glyphs[i].kind === "composite" && box) newLsbs[i] = box[0];
  }
  const glyfSize = written.reduce((sum, bytes) => sum + bytes.length, 0);
  const newGlyf = new Uint8Array(glyfSize);
  const newLoca = new Uint8Array((numGlyphs + 1) * 4);
  const locaView = new DataView(newLoca.buffer);
  let at = 0;
  written.forEach((bytes, i) => {
    locaView.setUint32(i * 4, at);
    newGlyf.set(bytes, at);
    at += bytes.length;
  });
  locaView.setUint32(numGlyphs * 4, at);
  const newHmtx = new Uint8Array(numGlyphs * 4);
  const hmtxView = new DataView(newHmtx.buffer);
  newAdvances.forEach((advance, i) => {
    hmtxView.setUint16(i * 4, advance);
    hmtxView.setInt16(i * 4 + 2, newLsbs[i]);
  });

  const newHead = head.data.slice();
  const headView = new DataView(newHead.buffer);
  headView.setInt16(50, 1);
  const allBoxes = boxes.filter((b): b is number[] => !!b);
  headView.setInt16(36, Math.min(...allBoxes.map((b) => b[0])));
  headView.setInt16(38, Math.min(...allBoxes.map((b) => b[1])));
  headView.setInt16(40, Math.max(...allBoxes.map((b) => b[2])));
  headView.setInt16(42, Math.max(...allBoxes.map((b) => b[3])));
  const newHhea = hhea.data.slice();
  const hheaView = new DataView(newHhea.buffer);
  hheaView.setUint16(34, numGlyphs);
  hheaView.setUint16(10, Math.max(...newAdvances));

  const output = new Map(tables);
  for (const tag of DROPPED_TABLES) output.delete(tag);
  output.set("glyf", newGlyf);
  output.set("loca", newLoca);
  output.set("hmtx", newHmtx);
  output.set("head", newHead);
  output.set("hhea", newHhea);
  if (tables.has("OS/2") && position.wght !== undefined) {
    const os2 = tables.get("OS/2")!.slice();
    new DataView(os2.buffer).setUint16(4, Math.round(position.wght));
    output.set("OS/2", os2);
  }
  return writeSfnt({ flavor, tables: output });
}
