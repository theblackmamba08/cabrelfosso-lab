import { describe, expect, it } from "vitest";
import { demos } from "../demos/registry";
import { experimentParams, findPage, publishedPages, publishedPaths, sectionParams } from "./published";

const [projectile, cradle] = demos;

describe("pages publiées à l’étape L2a", () => {
  it("sont l’accueil, la Confidentialité, la Physique et ses expériences", () => {
    expect(publishedPages).toEqual([
      { key: "home" },
      { key: "privacy" },
      { key: "physics" },
      { key: "physics", demo: projectile },
      { key: "physics", demo: cradle },
    ]);
  });

  it("ont dix adresses", () => {
    expect(publishedPaths()).toEqual([
      "/fr",
      "/en",
      "/fr/confidentialite",
      "/en/privacy",
      "/fr/physique",
      "/en/physics",
      "/fr/physique/projectile",
      "/en/physics/projectile",
      "/fr/physique/pendule-de-newton",
      "/en/physics/newtons-cradle",
    ]);
  });
});

describe("paramètres statiques", () => {
  it("sections : chaque page publiée, avec le nom d’adresse de sa langue seulement", () => {
    expect(sectionParams("fr")).toEqual([{ section: "confidentialite" }, { section: "physique" }]);
    expect(sectionParams("en")).toEqual([{ section: "privacy" }, { section: "physics" }]);
  });

  it("expériences : chacune dans sa catégorie, avec les noms de sa langue", () => {
    expect(experimentParams("fr")).toEqual([
      { section: "physique", experiment: "projectile" },
      { section: "physique", experiment: "pendule-de-newton" },
    ]);
    expect(experimentParams("en")).toEqual([
      { section: "physics", experiment: "projectile" },
      { section: "physics", experiment: "newtons-cradle" },
    ]);
  });
});

describe("findPage", () => {
  it("retrouve la page publiée d’après ses noms d’adresse", () => {
    expect(findPage("fr", "confidentialite")).toEqual({ key: "privacy" });
    expect(findPage("en", "physics")).toEqual({ key: "physics" });
    expect(findPage("fr", "physique", "pendule-de-newton")).toEqual({ key: "physics", demo: cradle });
  });

  it("ignore une page non publiée, une autre langue ou une autre catégorie", () => {
    expect(findPage("fr", "informatique")).toBeUndefined();
    expect(findPage("en", "confidentialite")).toBeUndefined();
    expect(findPage("en", "physics", "pendule-de-newton")).toBeUndefined();
    expect(findPage("fr", "confidentialite", "projectile")).toBeUndefined();
    expect(findPage("fr", "")).toBeUndefined();
  });
});
