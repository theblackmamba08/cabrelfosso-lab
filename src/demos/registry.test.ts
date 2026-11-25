import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { demos, demosOf, findPublishedDemo, publishedDemos } from "./registry";

describe("registre des démos", () => {
  it("publie les cinq expériences, dans l’ordre", () => {
    expect(publishedDemos.map((demo) => demo.id)).toEqual([
      "projectile",
      "newtons-cradle",
      "three-sat",
      "refraction",
      "think-of-a-number",
    ]);
  });

  it("reprend les noms d'URL de la section 2 du cahier", () => {
    expect(demos.map((demo) => demo.slugs)).toEqual([
      { fr: "projectile", en: "projectile" },
      { fr: "pendule-de-newton", en: "newtons-cradle" },
      { fr: "transition-de-phase-3-sat", en: "3-sat-phase-transition" },
      { fr: "refraction", en: "refraction" },
      { fr: "pensez-a-un-nombre", en: "think-of-a-number" },
    ]);
  });

  it("donne à chaque démo un nom d'URL unique par langue", () => {
    for (const locale of locales) {
      const slugs = demos.map((demo) => demo.slugs[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("demosOf (expériences publiées d'une catégorie)", () => {
  it("donne les trois expériences de physique", () => {
    expect(demosOf("physics").map((demo) => demo.id)).toEqual(["projectile", "newtons-cradle", "refraction"]);
  });

  it("donne les deux expériences d'informatique", () => {
    expect(demosOf("computing").map((demo) => demo.id)).toEqual(["three-sat", "think-of-a-number"]);
  });

  it("ignore une expérience non publiée ou d'une autre catégorie", () => {
    const [first, second] = demos;
    const list = [{ ...first, published: false }, second, { ...first, category: "computing" as const }];
    expect(demosOf("physics", list)).toEqual([second]);
  });
});

describe("findPublishedDemo", () => {
  it("trouve une démo publiée par son nom d'URL", () => {
    expect(findPublishedDemo("fr", "projectile")?.id).toBe("projectile");
    expect(findPublishedDemo("en", "projectile")?.id).toBe("projectile");
    expect(findPublishedDemo("fr", "pendule-de-newton")?.id).toBe("newtons-cradle");
    expect(findPublishedDemo("en", "newtons-cradle")?.id).toBe("newtons-cradle");
    expect(findPublishedDemo("fr", "transition-de-phase-3-sat")?.id).toBe("three-sat");
    expect(findPublishedDemo("en", "3-sat-phase-transition")?.id).toBe("three-sat");
    expect(findPublishedDemo("fr", "pensez-a-un-nombre")?.id).toBe("think-of-a-number");
    expect(findPublishedDemo("en", "think-of-a-number")?.id).toBe("think-of-a-number");
  });

  it("ignore le nom d'une démo dans l'autre langue", () => {
    expect(findPublishedDemo("fr", "newtons-cradle")).toBeUndefined();
    expect(findPublishedDemo("en", "pendule-de-newton")).toBeUndefined();
    expect(findPublishedDemo("en", "pensez-a-un-nombre")).toBeUndefined();
  });

  it("ignore un nom inconnu", () => {
    expect(findPublishedDemo("fr", "inconnu")).toBeUndefined();
  });
});
