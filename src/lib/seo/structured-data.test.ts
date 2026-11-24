import { describe, expect, it } from "vitest";
import { breadcrumbLd, serializeJsonLd, websiteLd } from "./structured-data";

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

describe("BreadcrumbList", () => {
  it("reprend les étapes du fil d’Ariane, en URL absolues", () => {
    expect(
      breadcrumbLd([
        { label: "Le Labo", href: "/fr" },
        { label: "Physique", href: "/fr/physique" },
      ]),
    ).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Le Labo", item: "https://lab.cabrelfosso.com/fr" },
        { "@type": "ListItem", position: 2, name: "Physique", item: "https://lab.cabrelfosso.com/fr/physique" },
      ],
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
