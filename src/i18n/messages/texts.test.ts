import { describe, expect, it } from "vitest";
import { between, plain } from "@/test/cahier";
import en from "./en";
import fr from "./fr";

/** Chaînes d'un objet, avec leur chemin. */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Section du cahier, sans la mise en forme Markdown (gras, code, liens décrits entre parenthèses). */
const readable = (section: string) => section.replace(/\*\*/g, "").replace(/`/g, "");

const common = readable(between("### B.1 Éléments communs", "### B.2 Accueil"));
const homeFr = readable(between("### B.2 Accueil", "Tab title: The Lab"));
const homeEn = readable(between("Tab title: The Lab", "### B.3 Confidentialité"));
const privacyFr = readable(between("### B.3 Confidentialité", "Tab title: Privacy"));
const privacyEn = readable(between("Tab title: Privacy", "## Annexe C"));
const menu = readable(between("### C.1 Menu", "### C.2"));
const computingPages = readable(between("### D.1 Menu", "### D.2"));
const discovery = readable(between("### E.1 Pages", "### E.2"));
const discoveryMore = readable(between("### F.0 Cartes", "### F.1"));

describe.each([
  ["fr", fr, homeFr, privacyFr],
  ["en", en, homeEn, privacyEn],
] as const)("textes %s, mot pour mot ceux de l’annexe B", (_locale, messages, home, privacy) => {
  const { site, header, footer, notFound } = messages;
  it.each(strings({ site, header, footer, notFound }))("commun : %s", (_path, value) => {
    expect(common).toContain(plain(value).trim());
  });

  const { experiment, computing, physics } = messages;
  const { computing: computingEntry, ...nav } = messages.nav;
  const { computing: computingSection, ...homeTexts } = messages.home;
  const { "three-sat": threeSat, refraction, "think-of-a-number": number, "converging-lens": lens, "estimating-pi": pi, ...mechanics } = messages.demos;
  it.each(strings({ nav, physics, experiment }))("menu et page Physique : %s", (_path, value) => {
    expect(menu).toContain(plain(value).trim());
  });

  it.each(strings(Object.values(mechanics).map((demo) => demo.card)))("carte : %s", (_path, value) => {
    expect(home).toContain(plain(value).trim());
  });

  it.each(strings({ refraction: refraction.card, number: number.card, intro: physics.intro }))(
    "série « découverte » (E.1) : %s",
    (_path, value) => {
      expect(discovery).toContain(plain(value));
    },
  );

  it("fil d’Ariane de la série « découverte » (E.1)", () => {
    const trail = (category: string, title: string) => plain([messages.site.name, category, title].join(" › "));
    expect(discovery).toContain(trail(physics.title, refraction.title));
    expect(discovery).toContain(trail(computing.title, number.title));
  });

  it.each(strings({ lens: lens.card, pi: pi.card }))("série « découverte », suite (F.0) : %s", (_path, value) => {
    expect(discoveryMore).toContain(plain(value));
  });

  it("fil d’Ariane de la suite de la série (F.0)", () => {
    const trail = (category: string, title: string) => plain([messages.site.name, category, title].join(" › "));
    expect(discoveryMore).toContain(trail(physics.title, lens.title));
    expect(discoveryMore).toContain(trail(computing.title, pi.title));
  });

  it.each(strings(homeTexts))("accueil : %s", (_path, value) => {
    expect(home).toContain(plain(value).trim());
  });

  it.each(strings({ computingEntry, computing, computingSection, card: threeSat.card }))("informatique (D.1) : %s", (_path, value) => {
    expect(computingPages).toContain(plain(value).trim());
  });

  it.each(strings(messages.privacy))("confidentialité : %s", (_path, value) => {
    expect(privacy).toContain(plain(value).trim());
  });
});

describe("phrases coupées par une mise en forme ou un lien", () => {
  const join = (parts: Record<string, string>) => plain(Object.values(parts).join(""));

  it("titre de l’accueil", () => {
    expect(homeFr).toContain(join(fr.home.title));
    expect(homeEn).toContain(join(en.home.title));
  });

  it("responsable (lien vers la page Contact)", () => {
    expect(join(fr.privacy.controller.text)).toBe(
      "Jospin Cabrel FOSSO TIOFOUET, joignable par la page Contact de mon portfolio.",
    );
    expect(join(en.privacy.controller.text)).toBe(
      "Jospin Cabrel FOSSO TIOFOUET, reachable through the Contact page of my portfolio.",
    );
  });

  it("licences du pied de page", () => {
    expect(common).toContain(join(fr.footer.codeLicense) + " · " + join(fr.footer.contentLicense));
    expect(common).toContain(join(en.footer.codeLicense) + " · " + join(en.footer.contentLicense));
  });
});

describe("rien n’est oublié", () => {
  it.each([
    ["fr", fr],
    ["en", en],
  ] as const)("%s : trois étapes, trois publics, sept rubriques de confidentialité", (_locale, messages) => {
    expect(Object.keys(messages.home.how.steps)).toHaveLength(3);
    expect(Object.keys(messages.home.audiences.items)).toHaveLength(3);
    const { controller, entries, updated } = messages.privacy;
    expect([controller, ...Object.values(entries), updated]).toHaveLength(8);
  });
});
