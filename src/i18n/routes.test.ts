import { describe, expect, it } from "vitest";
import { alternatePaths, localizedPath, pathInLocale, routeKeyFromPath, routes } from "./routes";

describe("table des adresses (cahier, section 2)", () => {
  it("donne le nom d’adresse de chaque page dans chaque langue", () => {
    expect(routes).toEqual({
      home: { fr: "", en: "" },
      privacy: { fr: "confidentialite", en: "privacy" },
      physics: { fr: "physique", en: "physics" },
      computing: { fr: "informatique", en: "computing" },
    });
  });
});

describe("localizedPath", () => {
  it("donne la racine de la langue pour l’accueil", () => {
    expect(localizedPath("home", "fr")).toBe("/fr");
    expect(localizedPath("home", "en")).toBe("/en");
  });

  it("traduit le nom de la page, sans barre oblique finale", () => {
    expect(localizedPath("privacy", "fr")).toBe("/fr/confidentialite");
    expect(localizedPath("privacy", "en")).toBe("/en/privacy");
    expect(localizedPath("physics", "fr")).toBe("/fr/physique");
    expect(localizedPath("computing", "en")).toBe("/en/computing");
  });
});

describe("alternatePaths", () => {
  it("liste l’adresse de la page dans chaque langue", () => {
    expect(alternatePaths("privacy")).toEqual({ fr: "/fr/confidentialite", en: "/en/privacy" });
    expect(alternatePaths("home")).toEqual({ fr: "/fr", en: "/en" });
  });
});

describe("routeKeyFromPath", () => {
  it("ne reconnaît une adresse que dans sa propre langue", () => {
    expect(routeKeyFromPath("/fr/confidentialite", "fr")).toBe("privacy");
    expect(routeKeyFromPath("/fr/privacy", "fr")).toBe("home");
  });
});

describe("pathInLocale (sélecteur de langue)", () => {
  it("mène à la même page dans l’autre langue", () => {
    expect(pathInLocale("/fr/confidentialite", "fr", "en")).toBe("/en/privacy");
    expect(pathInLocale("/en/privacy", "en", "fr")).toBe("/fr/confidentialite");
    expect(pathInLocale("/fr", "fr", "en")).toBe("/en");
  });

  it("mène à l’accueil depuis une adresse inconnue", () => {
    expect(pathInLocale("/fr/inconnu", "fr", "en")).toBe("/en");
    expect(pathInLocale("/en/confidentialite", "en", "fr")).toBe("/fr");
    expect(pathInLocale("/", "fr", "en")).toBe("/en");
    expect(pathInLocale("/fr/confidentialite/inconnu", "fr", "en")).toBe("/en");
  });
});
