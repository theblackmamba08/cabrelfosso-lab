import { describe, expect, it } from "vitest";
import { puzzleKey, puzzleStream, splitMix64, xoshiro128pp, xoshiroState } from "./random";

const hex = (words: readonly number[]) => words.map((word) => word.toString(16).padStart(8, "0")).join(" ");

describe("SplitMix64 (annexe D.3)", () => {
  it("donne les trois premières sorties depuis l'état 0", () => {
    const next = splitMix64(BigInt(0));
    expect([next(), next(), next()].map((z) => z.toString(16).padStart(16, "0"))).toEqual([
      "e220a8397b1dcdaf",
      "6e789e6aa1b965f4",
      "06c45d188009454f",
    ]);
  });
});

describe.each([
  [
    { seed: 2026, tag: 0, n: 20, k: 0, j: 0 },
    "000007ea00140000",
    "83533ed4 3607ec65 3bf32353 a89a7ffe",
    [2050140137, 1402195668, 789525893, 2849562376, 2645018862, 428651170],
  ],
  [
    { seed: 1, tag: 1, n: 6, k: 0, j: 0 },
    "0000000101060000",
    "e990fa20 f15177e1 3348dad9 22ea1f7c",
    [656263206, 4067180487, 605260372, 1371088429, 27368953, 1481644471],
  ],
] as const)("flux de l'énigme %o", (address, key, state, outputs) => {
  it("a la clé, l'état initial et les six premières sorties de l'annexe D.3", () => {
    expect(puzzleKey(address).toString(16).padStart(16, "0")).toBe(key);
    expect(hex(xoshiroState(puzzleKey(address)))).toBe(state);
    const direct = xoshiro128pp(xoshiroState(puzzleKey(address)));
    expect(outputs.map(() => direct())).toEqual(outputs);
    const next = puzzleStream(address);
    expect(outputs.map(() => next())).toEqual(outputs);
  });
});

it("la clé range chaque champ à sa place", () => {
  expect(puzzleKey({ seed: 999_999, tag: 0, n: 50, k: 25, j: 99 })).toBe(
    BigInt(999_999) * BigInt(2 ** 32) + BigInt(50 * 65_536 + 25 * 256 + 99),
  );
  expect(puzzleKey({ seed: 1, tag: 1, n: 6, k: 0, j: 255 })).toBe(BigInt("0x00000001010600ff"));
});
