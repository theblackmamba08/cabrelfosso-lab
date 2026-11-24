import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { HomePage } from "./home-page";
import { PrivacyPage } from "./privacy-page";

const messages = { fr, en };

/** Balises retirées, entités utiles décodées. */
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");

describe.each(["fr", "en"] as const)("accueil (%s)", (locale) => {
  const t = messages[locale].home;
  const html = renderToStaticMarkup(<HomePage locale={locale} t={messages[locale]} />);

  it("a un seul grand titre, avec les mots mis en valeur en couleur « craie »", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    const h1 = html.match(/<h1 [^>]*class="([^"]*)"[^>]*>(.*?)<\/h1>/);
    expect(h1?.[1]).toContain("text-display");
    expect(text(h1?.[2] ?? "")).toBe(t.title.before + t.title.highlight);
    expect(h1?.[2]).toContain(`<span class="text-highlight">${t.title.highlight}</span>`);
  });

  it("a ses quatre sections, dans l’ordre, et trois étapes en h3", () => {
    const headings = [...html.matchAll(/<(h2|h3)[^>]*>(.*?)<\/\1>/g)].map((m) => `${m[1]} ${m[2]}`);
    expect(headings).toEqual([
      `h2 ${t.how.title}`,
      `h3 ${t.how.steps.adjust.title}`,
      `h3 ${t.how.steps.observe.title}`,
      `h3 ${t.how.steps.understand.title}`,
      `h2 ${t.audiences.title}`,
      `h2 ${t.temporary.title}`,
    ]);
  });

  it("présente chaque public avec son usage", () => {
    const colon = locale === "fr" ? "\u00a0: " : ": ";
    for (const item of Object.values(t.audiences.items)) {
      expect(text(html)).toContain(`${item.title}${colon}${item.text}`);
    }
  });

  it("mène aux démos et à l’accueil du portfolio, dans la langue de la page", () => {
    const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map((m) => [m[1], m[2]]);
    expect(links).toEqual([
      [`https://cabrelfosso.com/${locale}/demos`, t.temporary.link],
      [`https://cabrelfosso.com/${locale}`, t.signature.link],
    ]);
  });

  it("décrit le site en données structurées", () => {
    const json = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? "");
    expect(json["@graph"].map((thing: { "@type": string }) => thing["@type"])).toEqual(["WebSite"]);
  });
});

describe.each(["fr", "en"] as const)("confidentialité (%s)", (locale) => {
  const t = messages[locale].privacy;
  const html = renderToStaticMarkup(<PrivacyPage locale={locale} t={messages[locale]} />);

  it("est une liste de définitions, dans l’ordre du cahier", () => {
    const terms = [...html.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => m[1]);
    expect(terms).toEqual([
      t.controller.term,
      ...Object.values(t.entries).map((entry) => entry.term),
      t.updated.term,
    ]);
    expect(html.match(/<dd/g)).toHaveLength(terms.length);
  });

  it("a un titre, son introduction et tous ses textes", () => {
    expect(html).toMatch(new RegExp(`<h1[^>]*>${t.title}</h1>`));
    for (const { text: value } of Object.values(t.entries)) expect(text(html)).toContain(value);
    expect(text(html)).toContain(t.intro);
    expect(text(html)).toContain(Object.values(t.controller.text).join(""));
  });

  it("mène à la page Contact du portfolio, et date la dernière mise à jour", () => {
    expect(html).toMatch(new RegExp(`<a [^>]*href="https://cabrelfosso.com/${locale}/contact"[^>]*>${t.controller.text.link}</a>`));
    expect(html).toMatch(/<time dateTime="2026-11-24">24 (novembre|November) 2026<\/time>/);
  });
});
