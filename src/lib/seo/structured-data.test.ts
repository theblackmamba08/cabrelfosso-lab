import { describe, expect, it } from "vitest";
import { serializeJsonLd, websiteLd } from "./structured-data";

describe("WebSite", () => {
  it("nomme le site, son adresse canonique, sa langue et son auteur", () => {
    expect(websiteLd("en")).toEqual({
      "@type": "WebSite",
      name: "The Lab — Cabrel FOSSO",
      url: "https://lab.cabrelfosso.com/en",
      inLanguage: "en",
      author: { "@type": "Person", name: "Cabrel FOSSO", url: "https://cabrelfosso.com" },
    });
    expect(websiteLd("fr")).toMatchObject({
      name: "Le Labo — Cabrel FOSSO",
      url: "https://lab.cabrelfosso.com/fr",
      inLanguage: "fr",
    });
  });
});

describe("serializeJsonLd", () => {
  it("ajoute le contexte schema.org et échappe « < » : aucune balise ne peut fermer le script", () => {
    const json = serializeJsonLd([{ "@type": "Thing", name: "</script><b>" }]);
    expect(json).not.toContain("<");
    expect(json).toContain("\\u003c/script>");
    expect(JSON.parse(json)).toEqual({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "Thing", name: "</script><b>" }],
    });
  });
});
