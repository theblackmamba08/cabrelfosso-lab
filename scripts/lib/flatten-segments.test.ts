import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flattenSegments } from "./flatten-segments.mjs";

let out: string;

beforeEach(() => {
  out = mkdtempSync(join(tmpdir(), "out-"));
});

afterEach(() => rmSync(out, { recursive: true, force: true }));

function write(path: string) {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), path);
}

describe("flattenSegments", () => {
  it("renomme les fichiers de préchargement d’un export fait sous Windows", () => {
    write("fr/__next.$d$lang/__PAGE__.txt");
    write("fr/confidentialite/__next.$d$lang/$d$section/__PAGE__.txt");

    expect(flattenSegments(out)).toBe(2);

    expect(readFileSync(join(out, "fr/__next.$d$lang.__PAGE__.txt"), "utf8")).toBe("fr/__next.$d$lang/__PAGE__.txt");
    expect(existsSync(join(out, "fr/confidentialite/__next.$d$lang.$d$section.__PAGE__.txt"))).toBe(true);
    expect(existsSync(join(out, "fr/__next.$d$lang"))).toBe(false);
    expect(existsSync(join(out, "fr/confidentialite/__next.$d$lang"))).toBe(false);
  });

  it("ne change rien à un export déjà correct (Linux)", () => {
    write("fr/__next.$d$lang.__PAGE__.txt");
    write("fr/__next._tree.txt");
    write("_next/static/chunks/a.js");

    expect(flattenSegments(out)).toBe(0);

    for (const path of ["fr/__next.$d$lang.__PAGE__.txt", "fr/__next._tree.txt", "_next/static/chunks/a.js"]) {
      expect(readFileSync(join(out, path), "utf8")).toBe(path);
    }
  });
});
