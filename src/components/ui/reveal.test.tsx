import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "./reveal";
import { observeReveal } from "./reveal-observer";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const MOTION_OK = "@media (prefers-reduced-motion: no-preference)";

type Entry = { isIntersecting: boolean; boundingClientRect: { top: number } };

class FakeObserver {
  static last: FakeObserver;
  observed: Element[] = [];
  disconnected = false;
  constructor(public callback: (entries: Entry[]) => void) {
    FakeObserver.last = this;
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  disconnect() {
    this.disconnected = true;
  }
}
const Observer = FakeObserver as unknown as typeof IntersectionObserver;

/** Élément factice : lire sa position directement forcerait un recalcul de mise en page. */
function fakeElement() {
  const attributes = new Map<string, string>();
  return {
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
    hasAttribute: (name: string) => attributes.has(name),
    getBoundingClientRect: () => {
      throw new Error("getBoundingClientRect force un recalcul de mise en page");
    },
  } as unknown as Element;
}
const VIEWPORT = 800;
const entry = (top: number, isIntersecting: boolean): Entry => ({ isIntersecting, boundingClientRect: { top } });

describe("Reveal (rendu serveur)", () => {
  it("rend le contenu tel quel, sans style qui le masque : sans JavaScript, tout est visible", () => {
    expect(renderToStaticMarkup(<Reveal>Bonjour</Reveal>)).toBe('<div data-reveal="">Bonjour</div>');
  });
});

describe("observeReveal", () => {
  it("ne masque rien avant la première mesure de l'observateur", () => {
    const element = fakeElement();
    observeReveal(element, Observer, VIEWPORT);
    expect(FakeObserver.last.observed).toEqual([element]);
    expect(element.hasAttribute("data-reveal-pending")).toBe(false);
  });

  it("sous la ligne de flottaison : masque l'élément, le fait apparaître quand il entre dans la fenêtre", () => {
    const element = fakeElement();
    observeReveal(element, Observer, VIEWPORT);
    const observer = FakeObserver.last;
    observer.callback([entry(2000, false)]);
    expect(element.hasAttribute("data-reveal-pending")).toBe(true);
    expect(element.hasAttribute("data-revealed")).toBe(false);
    observer.callback([entry(700, true)]);
    expect(element.hasAttribute("data-revealed")).toBe(true);
    expect(element.hasAttribute("data-reveal-pending")).toBe(false);
    expect(observer.disconnected).toBe(true);
  });

  it("déjà visible (ou au-dessus) à la première mesure : ne le masque jamais", () => {
    // VIEWPORT - 1 : dans la marge basse de 10 %, non « intersectant », mais déjà affiché.
    for (const [top, isIntersecting] of [[0, true], [500, true], [VIEWPORT - 1, false], [-900, false]] as const) {
      const element = fakeElement();
      observeReveal(element, Observer, VIEWPORT);
      FakeObserver.last.callback([entry(top, isIntersecting)]);
      expect(element.hasAttribute("data-reveal-pending")).toBe(false);
      expect(element.hasAttribute("data-revealed")).toBe(true);
      expect(FakeObserver.last.disconnected).toBe(true);
    }
  });

  it("affiche tout de suite sans IntersectionObserver", () => {
    const element = fakeElement();
    observeReveal(element, undefined, VIEWPORT);
    expect(element.hasAttribute("data-revealed")).toBe(true);
    expect(element.hasAttribute("data-reveal-pending")).toBe(false);
  });

  it("renvoie de quoi arrêter l'observation", () => {
    const stop = observeReveal(fakeElement(), Observer, VIEWPORT);
    stop();
    expect(FakeObserver.last.disconnected).toBe(true);
  });
});

describe("styles de Reveal", () => {
  it("ne masquent que les blocs mis en attente par JavaScript, jamais avec prefers-reduced-motion", () => {
    const start = css.indexOf(MOTION_OK);
    expect(start).toBeGreaterThan(-1);
    const hiding = [...css.matchAll(/([^{}]*\[data-reveal[\]-][^{}]*)\{[^}]*opacity:\s*0/g)];
    expect(hiding.length).toBeGreaterThan(0);
    for (const match of hiding) {
      // Chaque règle qui masque exige l'attribut posé par observeReveal sous la ligne de
      // flottaison, et se trouve dans le bloc « mouvement accepté ».
      expect(match[1]).toMatch(/\[data-reveal-pending\]/);
      expect(match.index).toBeGreaterThan(start);
    }
  });
});
