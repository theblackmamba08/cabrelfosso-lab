import { describe, expect, it } from "vitest";
import { plainMath } from "@/demos/projectile/equations";
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
const cradleSources = between("#### Pour aller plus loin — pendule", "## Historique");

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
  ])("français, mot pour mot : %s", (_text, source, annexe) => {
    const mention = source.english ? ` ${inEnglish}` : "";
    expect(annexe).toContain(`${plain(source.text)}${mention} → \`${source.href}\``);
  });

  it("il y en a une pour le projectile et cinq pour le pendule, dans les deux langues", () => {
    for (const messages of [fr, en]) {
      expect(messages.demos.projectile.sources).toHaveLength(1);
      expect(messages.demos["newtons-cradle"].sources).toHaveLength(5);
    }
  });

  it("anglais : mêmes liens, sauf la page Wikipédia anglaise ; aucune mention « (en anglais) »", () => {
    const links = (messages: typeof fr) => Object.values(messages.demos).flatMap((demo) => demo.sources.map((s) => s.href));
    expect(links(en)).toEqual(
      links(fr).map((href) =>
        href.includes("wikipedia") ? "https://en.wikipedia.org/wiki/Coefficient_of_restitution" : href,
      ),
    );
    expect(cradleSources).toContain("https://en.wikipedia.org/wiki/Coefficient_of_restitution");
    expect(JSON.stringify(en.demos)).not.toContain("en anglais");
    expect(en.experiment.inEnglish).toBe("");
  });

  it("anglais : textes donnés par l'annexe C", () => {
    expect(projectileSources).toContain(plain(en.demos.projectile.sources[0].text));
    const cradle = en.demos["newtons-cradle"].sources.map((s) => plain(s.text));
    expect(cradleSources).toContain(cradle[3]);
    expect(cradle[4]).toContain("pp. 1508–1516");
    for (const [index, title] of [
      [0, "Conservation of Energy"],
      [1, "Conservation of Linear Momentum"],
      [2, "Types of Collisions"],
      [4, "Rocking Newton's cradle"],
    ] as const) {
      expect(cradleSources).toContain(title);
      expect(cradle[index]).toContain(title);
    }
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
