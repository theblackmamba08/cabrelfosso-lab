/**
 * Hasard reproductible (cahier, annexe D.2) : xoshiro128++ 1.0 de D. Blackman et S. Vigna,
 * initialisé par SplitMix64 (https://prng.di.unimi.it/, code de référence en C, domaine public).
 * La cible TypeScript est ES2017 : pas de littéraux BigInt.
 */

const mask64 = BigInt("0xffffffffffffffff");
const golden = BigInt("0x9e3779b97f4a7c15");
const mix1 = BigInt("0xbf58476d1ce4e5b9");
const mix2 = BigInt("0x94d049bb133111eb");
const [shift27, shift30, shift31, shift32] = [27, 30, 31, 32].map((bits) => BigInt(bits));

/** SplitMix64 : sorties de 64 bits à partir d'un état initial. */
export function splitMix64(seed: bigint): () => bigint {
  let state = seed;
  return () => {
    state = (state + golden) & mask64;
    let z = state;
    z = ((z ^ (z >> shift30)) * mix1) & mask64;
    z = ((z ^ (z >> shift27)) * mix2) & mask64;
    return z ^ (z >> shift31);
  };
}

/** Adresse d'une énigme : tag 0 pour les courbes, 1 pour le mode pas à pas. */
export type PuzzleAddress = { seed: number; tag: 0 | 1; n: number; k: number; j: number };

/** Clé de 64 bits : graine × 2³² + tag × 2²⁴ + n × 2¹⁶ + k × 2⁸ + j. */
export function puzzleKey({ seed, tag, n, k, j }: PuzzleAddress): bigint {
  return (BigInt(seed) << shift32) + BigInt(tag * 2 ** 24 + n * 2 ** 16 + k * 2 ** 8 + j);
}

type State = readonly [number, number, number, number];

/** État initial de xoshiro128++ : les deux premières sorties de SplitMix64, 32 bits bas d'abord. */
export function xoshiroState(key: bigint): State {
  const next = splitMix64(key);
  const [z1, z2] = [next(), next()];
  const low = (z: bigint) => Number(BigInt.asUintN(32, z));
  const high = (z: bigint) => Number(z >> shift32);
  return [low(z1), high(z1), low(z2), high(z2)];
}

const rotl = (x: number, k: number) => (x << k) | (x >>> (32 - k));

/** xoshiro128++ : sorties entières de 0 à 2³² − 1. */
export function xoshiro128pp([a, b, c, d]: State): () => number {
  let s0 = a;
  let s1 = b;
  let s2 = c;
  let s3 = d;
  return () => {
    const result = (rotl((s0 + s3) | 0, 7) + s0) >>> 0;
    const t = s1 << 9;
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = rotl(s3, 11);
    return result;
  };
}

/** Flux propre à une énigme. */
export function puzzleStream(address: PuzzleAddress): () => number {
  return xoshiro128pp(xoshiroState(puzzleKey(address)));
}
