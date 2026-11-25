import { describe, expect, it } from "vitest";
import { demos } from "../demos/registry";
import { experimentParams, findPage, publishedPages, publishedPaths, sectionParams } from "./published";

const [projectile, cradle, threeSat, refraction, number] = demos;

describe("pages publiées à l’étape L4", () => {
  it("sont l’accueil, la Confidentialité, les catégories et leurs expériences", () => {
    expect(publishedPages).toEqual([
      { key: "home" },
      { key: "privacy" },
      { key: "physics" },
      { key: "computing" },
      { key: "physics", demo: projectile },
      { key: "physics", demo: cradle },
      { key: "physics", demo: refraction },
      { key: "computing", demo: threeSat },
      { key: "computing", demo: number },
    ]);
  });

  it("ont dix-huit adresses", () => {
    expect(publishedPaths()).toEqual([
      "/fr",
      "/en",
      "/fr/confidentialite",
      "/en/privacy",
      "/fr/physique",
      "/en/physics",
      "/fr/informatique",
      "/en/computing",
      "/fr/physique/projectile",
      "/en/physics/projectile",
      "/fr/physique/pendule-de-newton",
      "/en/physics/newtons-cradle",
      "/fr/physique/refraction",
      "/en/physics/refraction",
      "/fr/informatique/transition-de-phase-3-sat",
      "/en/computing/3-sat-phase-transition",
      "/fr/informatique/pensez-a-un-nombre",
      "/en/computing/think-of-a-number",
    ]);
  });
});

describe("paramètres statiques", () => {
  it("sections : chaque page publiée, avec le nom d’adresse de sa langue seulement", () => {
    expect(sectionParams("fr")).toEqual([
      { section: "confidentialite" },
      { section: "physique" },
      { section: "informatique" },
    ]);
    expect(sectionParams("en")).toEqual([{ section: "privacy" }, { section: "physics" }, { section: "computing" }]);
  });

  it("expériences : chacune dans sa catégorie, avec les noms de sa langue", () => {
    expect(experimentParams("fr")).toEqual([
      { section: "physique", experiment: "projectile" },
      { section: "physique", experiment: "pendule-de-newton" },
      { section: "physique", experiment: "refraction" },
      { section: "informatique", experiment: "transition-de-phase-3-sat" },
      { section: "informatique", experiment: "pensez-a-un-nombre" },
    ]);
    expect(experimentParams("en")).toEqual([
      { section: "physics", experiment: "projectile" },
      { section: "physics", experiment: "newtons-cradle" },
      { section: "physics", experiment: "refraction" },
      { section: "computing", experiment: "3-sat-phase-transition" },
      { section: "computing", experiment: "think-of-a-number" },
    ]);
  });
});

describe("findPage", () => {
  it("retrouve la page publiée d’après ses noms d’adresse", () => {
    expect(findPage("fr", "confidentialite")).toEqual({ key: "privacy" });
    expect(findPage("en", "physics")).toEqual({ key: "physics" });
    expect(findPage("fr", "physique", "pendule-de-newton")).toEqual({ key: "physics", demo: cradle });
    expect(findPage("fr", "informatique")).toEqual({ key: "computing" });
    expect(findPage("en", "computing", "3-sat-phase-transition")).toEqual({ key: "computing", demo: threeSat });
  });

  it("ignore une page non publiée, une autre langue ou une autre catégorie", () => {
    expect(findPage("en", "informatique")).toBeUndefined();
    expect(findPage("en", "computing", "transition-de-phase-3-sat")).toBeUndefined();
    expect(findPage("fr", "physique", "transition-de-phase-3-sat")).toBeUndefined();
    expect(findPage("en", "confidentialite")).toBeUndefined();
    expect(findPage("en", "physics", "pendule-de-newton")).toBeUndefined();
    expect(findPage("fr", "confidentialite", "projectile")).toBeUndefined();
    expect(findPage("fr", "")).toBeUndefined();
  });
});
