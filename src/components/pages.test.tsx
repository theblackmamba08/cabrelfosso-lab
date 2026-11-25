import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { demos } from "@/demos/registry";
import { demosOf } from "@/demos/registry";
import { publishedCategories } from "@/i18n/published";
import { localizedPath } from "@/i18n/routes";
import { CategoryPage } from "./category-page";
import { ExperimentCards } from "./experiment-cards";
import { ExperimentPage } from "./experiment-page";
import { HomePage } from "./home-page";
import { PrivacyPage } from "./privacy-page";

const messages = { fr, en };

/** Balises retirées, entités utiles décodées. */
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");

/** Liens attendus des cartes d'expérience, par catégorie. */
const experimentLinks = (locale: "fr" | "en", category: "physics" | "computing" = "physics") => {
  const open = messages[locale].home.physics.open;
  const paths = {
    physics: { fr: ["/fr/physique/projectile", "/fr/physique/pendule-de-newton"], en: ["/en/physics/projectile", "/en/physics/newtons-cradle"] },
    computing: { fr: ["/fr/informatique/transition-de-phase-3-sat"], en: ["/en/computing/3-sat-phase-transition"] },
  };
  return paths[category][locale].map((path) => [path, open]);
};

const cases = (["fr", "en"] as const).flatMap((locale) => publishedCategories.map((category) => ({ locale, category })));

const links = (html: string) => [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map((m) => [m[1], text(m[2])]);

/** Étapes visibles du fil d'Ariane, et celles des données structurées. */
function breadcrumbs(html: string) {
  const nav = html.match(/<nav[^>]*data-breadcrumb[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
  const visible = [...nav.matchAll(/<(?:a|span)\b[^>]*>([^<]+)<\/(?:a|span)>/g)].map((m) => m[1]).filter((s) => s !== "›");
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? "")["@graph"];
  expect(data).toHaveLength(1);
  expect(data[0]["@type"]).toBe("BreadcrumbList");
  return { nav, visible, structured: data[0].itemListElement as Array<{ name: string; item: string }> };
}

describe("cartes d’expérience", () => {
  it("n’affichent que les expériences reçues, avec leur figure décorative", () => {
    const html = renderToStaticMarkup(<ExperimentCards locale="fr" t={fr} demos={[demos[1]]} headingLevel={3} />);
    expect(links(html)).toEqual([experimentLinks("fr")[1]]);
    expect(html).toContain('data-demo-figure="newtons-cradle"');
    expect(html).not.toContain("projectile");
  });
});

describe.each(cases)("page de catégorie $category ($locale)", ({ locale, category }) => {
  const t = messages[locale];
  const html = renderToStaticMarkup(<CategoryPage category={category} locale={locale} t={t} />);
  const demosHere = demosOf(category);

  it("a son titre, son introduction et une carte (h2) par expérience publiée", () => {
    expect(html).toContain(`>${t[category].title}</h1>`);
    expect(text(html)).toContain(t[category].intro);
    expect([...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1])).toEqual(
      demosHere.map((demo) => t.demos[demo.id].card.title),
    );
    for (const demo of demosHere) {
      expect(text(html)).toContain(t.demos[demo.id].card.text);
      expect(html).toContain(`data-demo-figure="${demo.id}"`);
    }
    expect(links(html).slice(1)).toEqual(experimentLinks(locale, category));
  });

  it("a son fil d’Ariane, égal aux données structurées", () => {
    const { nav, visible, structured } = breadcrumbs(html);
    expect(visible).toEqual([t.site.name, t[category].title]);
    expect(structured.map((step) => step.name)).toEqual(visible);
    expect(html).toContain(`aria-label="${t.nav.breadcrumb}"`);
    expect(nav.match(/aria-current="page"/g)).toHaveLength(1);
    expect(links(nav)).toEqual([[`/${locale}`, t.site.name]]);
  });
});

describe.each(["fr", "en"] as const)("pages d’expérience (%s)", (locale) => {
  const t = messages[locale];

  it.each(demos)("$id : le gabarit du cahier, dans l’ordre", (demo) => {
    const html = renderToStaticMarkup(<ExperimentPage locale={locale} t={t} demo={demo} />);
    const texts = t.demos[demo.id];
    const order = [
      "data-breadcrumb",
      `>${texts.title}</h1>`,
      texts.intro,
      ...("laws" in texts ? [texts.laws.title] : []),
      ...("subtitle" in texts
        ? [
            // L'expérience et le pas à pas, en import dynamique : ordre vérifié sur out/.
            texts.problem.title + "</h2>",
            texts.threshold.title + "</h2>",
            texts.complexity.title + "</h2>",
          ]
        : []),
      texts.assumptions.text.slice(0, 40),
      texts.tryThis.title + "</h2>",
      t.experiment.sources + "</h2>",
      t.experiment.portfolio + "</a>",
    ].map((part) => html.indexOf(part));
    expect(order).not.toContain(-1);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it.each(demos)("$id : fil d’Ariane égal aux données structurées", (demo) => {
    const { visible, structured } = breadcrumbs(
      renderToStaticMarkup(<ExperimentPage locale={locale} t={t} demo={demo} />),
    );
    expect(visible).toEqual([t.site.name, t[demo.category].title, t.demos[demo.id].title]);
    expect(structured[1].item.endsWith(localizedPath(demo.category, locale))).toBe(true);
    expect(structured.map((step) => step.name)).toEqual(visible);
    expect(structured[2].item.endsWith(`/${demo.slugs[locale]}`)).toBe(true);
  });

  it.each(demos)("$id : sources en liens, « (en anglais) » seulement en français", (demo) => {
    const html = renderToStaticMarkup(<ExperimentPage locale={locale} t={t} demo={demo} />);
    const { sources } = t.demos[demo.id];
    for (const source of sources) {
      expect(links(html)).toContainEqual([source.href, source.text.replaceAll("*", "")]);
    }
    const mentions = text(html).split("(en anglais)").length - 1;
    expect(mentions).toBe(locale === "fr" ? sources.filter((s) => s.english).length : 0);
    expect(html).toContain(demo.id === "three-sat" ? "<i>Annals of Mathematics</i>" : "<i>University Physics Volume 1</i>");
  });

  it.each(demos)("$id : explications repliables, aucune mention de programme", (demo) => {
    const html = renderToStaticMarkup(<ExperimentPage locale={locale} t={t} demo={demo} />);
    const explanations = html.slice(html.indexOf(`id="a-essayer"`));
    expect(explanations.match(/<details/g)).toHaveLength(3);
    expect(html).not.toMatch(/<details[^>]* open/);
    expect(html).not.toMatch(/TODO|Au programme|curriculum|Niveau|Level:/);
    expect(links(html)).toContainEqual([`https://cabrelfosso.com/${locale}`, t.experiment.portfolio]);
  });
});

describe.each(["fr", "en"] as const)("page 3-SAT (%s)", (locale) => {
  const t = messages[locale];
  const texts = t.demos["three-sat"];
  const html = renderToStaticMarkup(<ExperimentPage locale={locale} t={t} demo={demos[2]} />);

  it("a son sous-titre entre le titre et l’introduction", () => {
    const [title, subtitle, intro] = [`>${texts.title}</h1>`, `>${texts.subtitle}</p>`, texts.intro].map((s) => html.indexOf(s));
    expect(title).toBeGreaterThan(0);
    expect(subtitle).toBeGreaterThan(title);
    expect(intro).toBeGreaterThan(subtitle);
  });

  it("dit que l’expérience ne répond pas à P = NP", () => {
    expect(text(html)).toContain(
      locale === "fr"
        ? "Cette expérience n’apporte pas de réponse à la question P = NP."
        : "This experiment does not answer the P = NP question.",
    );
  });

  it("met en forme le gras, les indices et les étapes numérotées", () => {
    expect(html).toContain("<strong>");
    expect(html).toContain("x<sub>1</sub>");
    expect(html).not.toContain("**");
    expect(text(html)).not.toMatch(/[₀-₉]/);
    expect(html.match(/<ol[^>]*data-solver-steps[^>]*>(.*?)<\/ol>/)?.[1].match(/<li/g)).toHaveLength(4);
  });
});

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

  it("a ses sections, dans l’ordre : la Physique, puis l’Informatique", () => {
    const headings = [...html.matchAll(/<(h2|h3)[^>]*>(.*?)<\/\1>/g)].map((m) => `${m[1]} ${m[2]}`);
    expect(headings).toEqual([
      `h2 ${t.physics.title}`,
      `h3 ${messages[locale].demos.projectile.card.title}`,
      `h3 ${messages[locale].demos["newtons-cradle"].card.title}`,
      `h2 ${t.computing.title}`,
      `h3 ${messages[locale].demos["three-sat"].card.title}`,
      `h2 ${t.how.title}`,
      `h3 ${t.how.steps.adjust.title}`,
      `h3 ${t.how.steps.observe.title}`,
      `h3 ${t.how.steps.understand.title}`,
      `h2 ${t.audiences.title}`,
    ]);
  });

  it("présente chaque public avec son usage", () => {
    const colon = locale === "fr" ? "\u00a0: " : ": ";
    for (const item of Object.values(t.audiences.items)) {
      expect(text(html)).toContain(`${item.title}${colon}${item.text}`);
    }
  });

  it("mène aux expériences, aux pages de catégorie et au portfolio, dans la langue de la page", () => {
    const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map((m) => [m[1], m[2]]);
    expect(links).toEqual([
      ...experimentLinks(locale),
      [locale === "fr" ? "/fr/physique" : "/en/physics", t.physics.all],
      ...experimentLinks(locale, "computing"),
      [locale === "fr" ? "/fr/informatique" : "/en/computing", t.computing.all],
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
  const html = renderToStaticMarkup(<PrivacyPage locale={locale} t={messages[locale]} analyticsToken="jeton-de-test" />);

  it("est une liste de définitions, dans l’ordre du cahier", () => {
    const terms = [...html.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => m[1]);
    expect(terms).toEqual([
      t.controller.term,
      ...Object.values(t.entries).map((entry) => entry.term),
      t.updated.term,
    ]);
    expect(html.match(/<dd/g)).toHaveLength(terms.length);
  });

  it("avec un jeton, présente la mesure d’audience juste après le responsable, mot pour mot", () => {
    const entries = [...html.matchAll(/<dt[^>]*>(.*?)<\/dt><dd[^>]*>(.*?)<\/dd>/g)].map((m) => [m[1], text(m[2])]);
    expect(entries[0][0]).toBe(t.controller.term);
    expect(entries[1]).toEqual([t.entries.analytics.term, t.entries.analytics.text]);
  });

  it("sans jeton, ne dit rien de la mesure d’audience, et garde tout le reste", () => {
    const without = renderToStaticMarkup(<PrivacyPage locale={locale} t={messages[locale]} analyticsToken={null} />);
    expect(text(without)).not.toContain(t.entries.analytics.term);
    expect(text(without)).not.toContain(t.entries.analytics.text);
    const terms = [...without.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => m[1]);
    const { analytics, ...others } = t.entries;
    expect(terms).toEqual([t.controller.term, ...Object.values(others).map((e) => e.term), t.updated.term]);
    expect(analytics.term).not.toBe("");
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
