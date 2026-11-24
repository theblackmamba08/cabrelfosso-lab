import { describe, expect, it } from "vitest";
import { publishedPages, publishedPaths, publishedSection, sectionParams } from "./published";

describe("pages publiées à l’étape L1", () => {
  it("sont l’accueil et la Confidentialité, rien d’autre", () => {
    expect(publishedPages).toEqual(["home", "privacy"]);
    expect(publishedPaths()).toEqual(["/fr", "/en", "/fr/confidentialite", "/en/privacy"]);
  });
});

describe("paramètres statiques des sections", () => {
  it("donnent chaque page publiée, avec le nom d’adresse de sa langue seulement", () => {
    expect(sectionParams("fr")).toEqual([{ section: "confidentialite" }]);
    expect(sectionParams("en")).toEqual([{ section: "privacy" }]);
  });
});

describe("publishedSection", () => {
  it("retrouve la page publiée d’après son nom d’adresse", () => {
    expect(publishedSection("fr", "confidentialite")).toBe("privacy");
    expect(publishedSection("en", "privacy")).toBe("privacy");
  });

  it("ignore une page non publiée, une autre langue ou l’accueil", () => {
    expect(publishedSection("fr", "physique")).toBeUndefined();
    expect(publishedSection("en", "confidentialite")).toBeUndefined();
    expect(publishedSection("fr", "")).toBeUndefined();
  });
});
