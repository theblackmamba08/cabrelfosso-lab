import { describe, expect, it } from "vitest";
import { plainMath } from "@/demos/projectile/math";
import { gravities } from "@/demos/projectile/physics";
import { between, plain } from "@/test/cahier";
import en from "./en";
import fr from "./fr";

/** Toutes les chaînes d'un objet, avec leur chemin. */
function strings(value: object, path = ""): Array<[string, string]> {
  return Object.entries(value).flatMap(([key, item]) => {
    const itemPath = path ? `${path}.${key}` : key;
    if (typeof item === "string") return [[itemPath, item]] as Array<[string, string]>;
    return item && typeof item === "object" ? strings(item, itemPath) : [];
  });
}

/** Les textes de la figure utilisent les mêmes champs dans les deux langues. */
const withCahierFields = (value: string) => value.replace("{range}", "{portée}").replace("{height}", "{flèche}");

/** Lois du pendule : un dollar entoure une formule, écrite dans la notation de MathText. */
const asWritten = (value: string, decimal: string) =>
  plainMath(value.replaceAll("$", ""))
    .replace("{mass}", "50 g")
    .replace("{length}", "20 cm")
    .replace("{gravity}", `9${decimal}8 m/s²`);

const projectileFr = between("#### Projectile — français", "#### Projectile — English");
const projectileEn = between("#### Projectile — English", "#### Valeurs de contrôle pour les tests");
const projectileSources = between("#### Pour aller plus loin — projectile", "### C.3");
const cradleFr = between("#### Pendule de Newton — français", "#### Newton's cradle — English");
const cradleEn =
  between("#### Newton's cradle — English", "#### Valeurs de contrôle du pendule") +
  // « Same formulas as the French version » : les formules anglaises sont celles-ci.
  between("**Les lois**", "**Hypothèses** : Les billes");
const cradleSources = between("#### Pour aller plus loin — pendule", "## Annexe D");

const threeSatFr = between("#### 3-SAT — français", "#### 3-SAT — English");
const threeSatEn = between("#### 3-SAT — English", "#### Valeurs de contrôle de 3-SAT");
const threeSatSources = between("#### Pour aller plus loin — 3-SAT", "**Affirmations et sources** (relecture");

const refractionFr = between("#### Réfraction — français", "#### Réfraction — English");
const refractionEn = between("#### Réfraction — English", "#### Valeurs de contrôle de la réfraction");
const refractionSources = between("#### Pour aller plus loin — réfraction", "**Affirmations et sources** (relecture");
const numberFr = between("#### Nombre mystère — français", "#### Nombre mystère — English");
const numberEn = between("#### Nombre mystère — English", "#### Valeurs de contrôle du nombre mystère");
const numberSources = between("#### Pour aller plus loin — nombre mystère", "**Affirmations et sources** (relecture");

/** Texte simple : un dollar entoure une formule, écrite dans la notation de MathText. */
const simple = (value: string) => plain(plainMath(value.replaceAll("$", "")));

/** Textes propres à l'annexe C : les cartes (annexe B.2) et les sources ont leurs tests. */
const own = ({ card, sources, ...texts }: { card: object; sources: object }) => {
  expect([card, sources]).toHaveLength(2);
  return strings(texts);
};

describe.each([
  ["projectile, français", fr.demos.projectile, projectileFr, ","],
  ["projectile, anglais", en.demos.projectile, projectileEn, "."],
  ["pendule, français", fr.demos["newtons-cradle"], cradleFr, ","],
  ["pendule, anglais", en.demos["newtons-cradle"], cradleEn, "."],
] as const)("%s : mot pour mot de l'annexe C", (_name, demo, annexe, decimal) => {
  it.each(own(demo))("%s", (_path, value) => {
    const text = plain(value);
    expect(annexe).toContain(asWritten(decimal === "," ? withCahierFields(text) : text, decimal));
  });
});

describe.each([
  ["français", fr.demos["three-sat"], threeSatFr],
  ["anglais", en.demos["three-sat"], threeSatEn],
] as const)("3-SAT, %s : mot pour mot de l'annexe D", (_langue, demo, annexe) => {
  it.each(own(demo))("%s", (_path, value) => {
    expect(annexe).toContain(plain(value));
  });

  it("rien ne manque", () => {
    const { problem, threshold, complexity, tryThis, steps, sources } = demo;
    expect([problem.paragraphs, problem.solverSteps, problem.after].map((list) => list.length)).toEqual([4, 4, 2]);
    expect([threshold.items, complexity.items].map((list) => list.length)).toEqual([3, 6]);
    expect(Object.keys(tryThis.items)).toHaveLength(3);
    expect(Object.keys(steps.messages)).toHaveLength(7);
    expect(sources).toHaveLength(6);
  });

  // Lignes entières : un paragraphe tronqué dans le code ne passe pas.
  it("les paragraphes et les listes sont entiers", () => {
    const lines = annexe.split("\n").map((line) => line.trim().replace(/^(- |\d\. )/, ""));
    const { problem, threshold, complexity } = demo;
    for (const text of [
      ...problem.paragraphs,
      problem.solver,
      ...problem.solverSteps,
      ...problem.after,
      ...threshold.items,
      ...complexity.items,
    ]) {
      expect(lines).toContain(plain(text));
    }
  });
});

describe.each([
  ["réfraction, français", fr.demos.refraction, refractionFr],
  ["réfraction, anglais", en.demos.refraction, refractionEn],
  ["nombre mystère, français", fr.demos["think-of-a-number"], numberFr],
  ["nombre mystère, anglais", en.demos["think-of-a-number"], numberEn],
] as const)("%s : mot pour mot de l'annexe E", (_name, demo, annexe) => {
  it.each(own(demo))("%s", (_path, value) => {
    expect(annexe).toContain(simple(value));
  });

  // Lignes entières : un texte tronqué dans le code ne passe pas.
  it("les lois ou l'explication, les hypothèses et les questions sont entières", () => {
    const lines = annexe.split("\n").map((line) => line.trim().replace(/^(- |\d\. )/, ""));
    const french = annexe === refractionFr || annexe === numberFr;
    const [assumptions, explanation] = french ? ["**Hypothèses** : ", "Explication : "] : ["**Assumptions**: ", "Explanation: "];
    const { items } = "laws" in demo ? demo.laws : demo.how;
    expect(items).toHaveLength("laws" in demo ? 6 : 5);
    for (const item of items) expect(lines).toContain(simple(item));
    if ("laws" in demo) expect(lines).toContain(simple(demo.laws.intro));
    expect(lines).toContain(assumptions + simple(demo.assumptions.text));
    const questions = Object.values(demo.tryThis.items);
    expect(questions).toHaveLength(3);
    for (const { question, answer } of questions) {
      expect(lines).toContain(`${simple(question)} — ${explanation}${simple(answer)}`);
    }
  });
});

describe("pendule : rien ne manque", () => {
  it.each([
    ["français", fr, "Ec"],
    ["anglais", en, "KE"],
  ] as const)("%s : aucun réglage ni aucune section", (_langue, messages, ec) => {
    const cradle = messages.demos["newtons-cradle"];
    expect(Object.keys(cradle.laws.items)).toHaveLength(6);
    expect(Object.keys(cradle.tryThis.items)).toHaveLength(3);
    expect(cradle.summary.match(/\{p\}/g)).toHaveLength(2);
    expect(cradle.summary.match(new RegExp(`\\{${ec}\\}`, "g"))).toHaveLength(2);
    expect(cradle.laws.items.energy.lines.join(" ")).toContain(ec === "Ec" ? "*E*_{c}" : "*KE*");
  });

  it("recompose les libellés anglais des lois, coupés à la ponctuation", () => {
    const { momentum, energy, lost } = en.demos["newtons-cradle"].laws.items;
    const written = (term: string, line: string) => asWritten(`${term} ${line}`, ".");
    expect(cradleEn).toContain(written(momentum.term, momentum.lines[0]));
    expect(cradleEn).toContain(written(energy.term, energy.lines[0]));
    expect(cradleEn).toContain(asWritten(`${lost.term}: ${lost.lines[0]}`, "."));
  });
});

describe("sources « Pour aller plus loin »", () => {
  const inEnglish = plain(fr.experiment.inEnglish);

  it.each([
    ...fr.demos.projectile.sources.map((source) => [source.text, source, projectileSources] as const),
    ...fr.demos["newtons-cradle"].sources.map((source) => [source.text, source, cradleSources] as const),
    ...fr.demos["three-sat"].sources.map((source) => [source.text, source, threeSatSources] as const),
    ...fr.demos.refraction.sources.map((source) => [source.text, source, refractionSources] as const),
    ...fr.demos["think-of-a-number"].sources.map((source) => [source.text, source, numberSources] as const),
  ])("français, mot pour mot : %s", (_text, source, annexe) => {
    const mention = source.english ? ` ${inEnglish}` : "";
    expect(annexe).toContain(`${plain(source.text)}${mention} → \`${source.href}\``);
  });

  it("il y en a une pour le projectile, cinq pour le pendule, trois pour la réfraction et une pour le nombre mystère, dans les deux langues", () => {
    for (const messages of [fr, en]) {
      expect(messages.demos.projectile.sources).toHaveLength(1);
      expect(messages.demos["newtons-cradle"].sources).toHaveLength(5);
      expect(messages.demos.refraction.sources).toHaveLength(3);
      expect(messages.demos["think-of-a-number"].sources).toHaveLength(1);
    }
  });

  it("anglais : mêmes liens, sauf les pages Wikipédia anglaises ; aucune mention « (en anglais) »", () => {
    const links = (messages: typeof fr) => Object.values(messages.demos).flatMap((demo) => demo.sources.map((s) => s.href));
    const english: Record<string, string> = {
      "https://fr.wikipedia.org/wiki/Coefficient_de_restitution": "https://en.wikipedia.org/wiki/Coefficient_of_restitution",
      "https://fr.wikipedia.org/wiki/Recherche_dichotomique": "https://en.wikipedia.org/wiki/Binary_search",
    };
    expect(links(en)).toEqual(links(fr).map((href) => english[href] ?? href));
    expect(refractionSources).toContain("English (same links):");
    expect(cradleSources).toContain("https://en.wikipedia.org/wiki/Coefficient_of_restitution");
    expect(threeSatSources).toContain("English (same links):");
    expect(JSON.stringify(en.demos)).not.toContain("en anglais");
    expect(en.experiment.inEnglish).toBe("");
  });

  // Lignes entières : un texte tronqué ou complété dans le code ne passe pas.
  it.each([
    ...en.demos.projectile.sources.map(({ text }) => [text, projectileSources, `- EN : ${plain(text)} → same link`] as const),
    ...en.demos["newtons-cradle"].sources.map(
      ({ text, href }) =>
        [
          text,
          cradleSources.slice(cradleSources.indexOf("English (same links, except Wikipedia):")),
          `- ${plain(text)}${href.includes("wikipedia") ? ` → \`${href}\`` : ""}`,
        ] as const,
    ),
    ...en.demos["three-sat"].sources.map(
      ({ text }) =>
        [text, threeSatSources.slice(threeSatSources.indexOf("English (same links):")), `- ${plain(text)}`] as const,
    ),
    ...en.demos.refraction.sources.map(
      ({ text }) =>
        [text, refractionSources.slice(refractionSources.indexOf("English (same links):")), `- ${plain(text)}`] as const,
    ),
    ...en.demos["think-of-a-number"].sources.map(
      ({ text, href }) => [text, numberSources, `- ${plain(text)} → \`${href}\``] as const,
    ),
  ])("anglais, mot pour mot : %s", (_text, annexe, line) => {
    expect(annexe.split("\n")).toContain(line);
  });
});

describe("mention du programme", () => {
  it.each([...strings(fr, "fr"), ...strings(en, "en")])("%s : ni TODO ni phrase sur le programme", (_path, value) => {
    expect(value).not.toContain("TODO");
    expect(value).not.toMatch(/Au programme de|Part of the/);
  });
});

describe("pesanteur", () => {
  it("affiche dans les options les valeurs utilisées par les calculs", () => {
    const { earth, moon, mars } = gravities;
    const decimal = (value: number, separator: string) => `g = ${String(value).replace(".", separator)}\u00a0m/s²`;
    for (const [messages, separator] of [
      [fr, ","],
      [en, "."],
    ] as const) {
      const { controls } = messages.demos.projectile;
      expect(controls.earth).toContain(decimal(earth, separator));
      expect(controls.moon).toContain(decimal(moon, separator));
      expect(controls.mars).toContain(decimal(mars, separator));
    }
  });
});
