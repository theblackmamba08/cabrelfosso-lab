import { describe, expect, it } from "vitest";
import { robotsRules, sitemapEntries } from "./crawl";

const site = "https://lab.cabrelfosso.com";

describe("sitemap", () => {
  const entries = sitemapEntries();

  it("liste les quatre adresses publiées, en URL absolues, et rien d’autre", () => {
    expect(entries.map((entry) => entry.url)).toEqual([
      `${site}/fr`,
      `${site}/en`,
      `${site}/fr/confidentialite`,
      `${site}/en/privacy`,
    ]);
  });

  it("donne à chaque URL ses équivalents FR, EN et x-default", () => {
    expect(entries[3].alternates?.languages).toEqual({
      fr: `${site}/fr/confidentialite`,
      en: `${site}/en/privacy`,
      "x-default": `${site}/fr/confidentialite`,
    });
  });

  it("n’invente pas de date de modification", () => {
    for (const entry of entries) expect(entry.lastModified).toBeUndefined();
  });
});

describe("robots.txt", () => {
  it("autorise tout et indique le sitemap absolu", () => {
    expect(robotsRules()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${site}/sitemap.xml`,
    });
  });
});
