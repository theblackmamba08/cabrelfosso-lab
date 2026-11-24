/*
 * Lecture et écriture d'une police sfnt (TrueType) : répertoire de tables trié, tables alignées
 * sur 4 octets, sommes de contrôle et checkSumAdjustment de head
 * (https://learn.microsoft.com/typography/opentype/spec/otff).
 */

/** Somme de contrôle OpenType : somme des mots de 32 bits, le dernier complété par des zéros. */
export function tableChecksum(data: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const word =
      ((data[i] << 24) | ((data[i + 1] ?? 0) << 16) | ((data[i + 2] ?? 0) << 8) | (data[i + 3] ?? 0)) >>> 0;
    sum = (sum + word) >>> 0;
  }
  return sum;
}

export type Sfnt = { flavor: number; tables: Map<string, Uint8Array> };

/** Tables d'une police sfnt, par étiquette. */
export function readSfnt(font: Uint8Array): Sfnt {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength);
  const tables = new Map<string, Uint8Array>();
  const count = view.getUint16(4);
  for (let i = 0; i < count; i++) {
    const at = 12 + i * 16;
    const tag = String.fromCharCode(...font.subarray(at, at + 4));
    const offset = view.getUint32(at + 8);
    tables.set(tag, font.subarray(offset, offset + view.getUint32(at + 12)));
  }
  return { flavor: view.getUint32(0), tables };
}

/** Assemble une police sfnt et règle checkSumAdjustment. */
export function writeSfnt({ flavor, tables }: Sfnt): Uint8Array {
  const tags = [...tables.keys()].sort();
  const sizes = tags.map((tag) => (tables.get(tag)!.length + 3) & ~3);
  const font = new Uint8Array(12 + tags.length * 16 + sizes.reduce((a, b) => a + b, 0));
  const view = new DataView(font.buffer);
  let entrySelector = 0;
  while (1 << (entrySelector + 1) <= tags.length) entrySelector++;
  const searchRange = (1 << entrySelector) * 16;
  view.setUint32(0, flavor);
  view.setUint16(4, tags.length);
  view.setUint16(6, searchRange);
  view.setUint16(8, entrySelector);
  view.setUint16(10, tags.length * 16 - searchRange);
  let offset = 12 + tags.length * 16;
  let headOffset = -1;
  tags.forEach((tag, i) => {
    const data = tables.get(tag)!.slice();
    if (tag === "head") {
      data.fill(0, 8, 12); // checkSumAdjustment, réglé à la fin
      headOffset = offset;
    }
    const at = 12 + i * 16;
    for (let c = 0; c < 4; c++) view.setUint8(at + c, tag.charCodeAt(c));
    view.setUint32(at + 4, tableChecksum(data));
    view.setUint32(at + 8, offset);
    view.setUint32(at + 12, data.length);
    font.set(data, offset);
    offset += sizes[i];
  });
  if (headOffset >= 0) view.setUint32(headOffset + 8, (0xb1b0afba - tableChecksum(font)) >>> 0);
  return font;
}
