import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { answer, newGame, start, type Answer, type Game } from "./game";
import { GamePanel } from "./game-panel";
import ThinkOfANumberDemo from "./think-of-a-number-demo";
import { barSpan, formatInteger, view } from "./view";

const tf = fr.demos["think-of-a-number"];
const te = en.demos["think-of-a-number"];
const played = (n: number, ...answers: Answer[]): Game => answers.reduce(answer, start(newGame(n)));
const repeat = (count: number, given: Answer) => Array.from({ length: count }, () => given);
/** Les espaces insécables d'Intl et du site, ramenées à une espace. */
const spaced = (text: string | null) => text?.replace(/\s/g, " ");

describe("nombres", () => {
  it("séparateur de milliers : espace insécable en français, virgule en anglais", () => {
    expect(formatInteger(1_000_000, "fr")).toMatch(/^1[  ]000[  ]000$/);
    expect(formatInteger(1_000_000, "en")).toBe("1,000,000");
    expect(formatInteger(999, "fr")).toBe("999");
  });
});

describe("textes de la partie", () => {
  it("avant la partie : consigne et toutes les possibilités, rien d'annoncé", () => {
    const shown = view(newGame(1000), tf, "fr");
    expect(spaced(shown.instruction)).toBe(
      "Choisissez un nombre entre 1 et 1 000, gardez-le en tête, puis cliquez sur « J’ai choisi ».",
    );
    expect(shown.announcement).toBeNull();
    expect(shown.counter).toBeNull();
    expect(spaced(shown.possibilities)).toBe("Il reste 1 000 nombres possibles, de 1 à 1 000.");
    expect(spaced(shown.bar)).toBe("Nombres encore possibles : de 1 à 1 000, sur 1 à 1 000.");
  });

  it("pendant la partie", () => {
    const shown = view(played(1_000_000, "higher"), te, "en");
    expect(shown.instruction).toBeNull();
    expect(shown.announcement).toBe("Is your number 750,000?");
    expect(shown.counter).toBe("Question 2 of 20 at most");
    expect(shown.possibilities).toBe("500,000 numbers are still possible, from 500,001 to 1,000,000.");
    expect(shown.history).toEqual(["500,000? Higher"]);
  });

  it("une seule possibilité", () => {
    const shown = view(played(100, "higher", "lower", ...repeat(4, "higher")), tf, "fr");
    expect(spaced(shown.possibilities)).toBe("Il ne reste qu’un nombre possible : 74.");
    expect(spaced(shown.announcement)).toBe("Votre nombre est-il 74 ?");
  });

  it("fin, en une ou plusieurs questions", () => {
    expect(spaced(view(played(100, "found"), tf, "fr").announcement)).toBe(
      "Trouvé ! Votre nombre est 50, découvert dès la première question.",
    );
    const shown = view(played(1000, ...repeat(9, "higher"), "found"), tf, "fr");
    expect(spaced(shown.announcement)).toBe("Trouvé ! Votre nombre est 1 000, découvert en 10 questions.");
    expect(shown.counter).toBeNull();
    expect(shown.history.map(spaced)).toContain("1 000 ? C’est ça !");
    expect(shown.history).toHaveLength(10);
  });

  it("contradiction : le message, ni barre ni possibilités", () => {
    const shown = view(played(100, "higher", "lower", ...repeat(5, "higher")), tf, "fr");
    expect(spaced(shown.announcement)).toBe(
      "Vos réponses se contredisent : aucun nombre de 1 à 100 ne convient. Annulez la dernière réponse ou rejouez.",
    );
    expect([shown.bar, shown.possibilities, shown.counter]).toEqual([null, null, null]);
  });
});

describe("barre de l'intervalle", () => {
  it("occupe la part [low, high] de [1, N]", () => {
    expect(barSpan(newGame(1000), 500)).toEqual({ x: 0, width: 500 });
    expect(barSpan(played(1000, "higher"), 500)).toEqual({ x: 250, width: 250 });
    expect(barSpan(played(100, "lower"), 100)).toEqual({ x: 0, width: 49 });
  });

  it("reste visible et dans le cadre quand l'intervalle est minuscule", () => {
    const span = barSpan(played(1_000_000, ...repeat(19, "higher")), 500);
    expect(span).toEqual({ x: 496, width: 4 });
  });
});

describe.each([
  ["fr", tf],
  ["en", te],
] as const)("interface (%s)", (locale, t) => {
  const actions = { start() {}, answer() {}, undo() {}, replay() {} };
  const panel = (game: Game) => renderToStaticMarkup(<GamePanel game={game} locale={locale} texts={t} {...actions} />);
  const buttons = (html: string) => [...html.matchAll(/<button([^>]*)>(.*?)<\/button>/g)].map((m) => [m[2], m[1].includes('aria-disabled="true"')]);

  it("au chargement : la liste des N (1 000), la consigne, « J'ai choisi », la barre", () => {
    const html = renderToStaticMarkup(<ThinkOfANumberDemo locale={locale} texts={t} />);
    const options = [...html.matchAll(/<option([^>]*)>(.*?)<\/option>/g)];
    expect(options.map((m) => m[2])).toEqual([100, 1000, 1_000_000].map((n) => formatInteger(n, locale)));
    expect(options.findIndex((m) => m[1].includes("selected"))).toBe(1);
    expect(html).toContain(t.controls.range);
    expect(buttons(html)).toEqual([[t.buttons.ready, false]]);
    expect(html).toMatch(/<svg[^>]*role="img"/);
    expect(html.match(/aria-live="polite"/g)).toHaveLength(1);
    expect(html).toMatch(/<p[^>]*aria-live="polite"[^>]*><\/p>/);
  });

  it("pendant la partie : trois réponses, « Annuler » dès la première réponse, « Rejouer »", () => {
    const { higher, lower, found, undo, replay } = t.buttons;
    expect(buttons(panel(played(100)))).toEqual([[higher, false], [lower, false], [found, false], [undo, true], [replay, false]]);
    expect(buttons(panel(played(100, "higher")))[3]).toEqual([undo, false]);
  });

  it("partie finie ou contradiction : plus de réponse possible, mais « Annuler » et « Rejouer »", () => {
    for (const game of [played(100, "found"), played(100, ...repeat(7, "higher"))]) {
      expect(buttons(panel(game)).map(([, off]) => off)).toEqual([true, true, true, false, false]);
    }
  });

  it("historique en liste ordonnée, hors de l'annonce", () => {
    const html = panel(played(100, "higher", "lower"));
    expect(html).toContain(`>${t.history.title}</h2>`);
    expect(html.match(/<ol[^>]*>(.*?)<\/ol>/)?.[1].match(/<li/g)).toHaveLength(2);
    expect(html.match(/<p[^>]*aria-live="polite"[^>]*>(.*?)<\/p>/)?.[1]).toBe(view(played(100, "higher", "lower"), t, locale).announcement);
    expect(panel(played(100))).not.toContain("<ol");
  });
});
