import { describe, expect, it } from "vitest";
import {
  nextTheme,
  resolveTheme,
  themeInitScript,
  THEME_STORAGE_KEY,
} from "./theme";

describe("resolveTheme", () => {
  it("est sombre quand aucun choix n'est enregistré", () => {
    expect(resolveTheme(null)).toBe("dark");
  });

  it("respecte le choix enregistré par le visiteur", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
  });

  it("ignore une valeur enregistrée invalide", () => {
    expect(resolveTheme("violet")).toBe("dark");
    expect(resolveTheme("")).toBe("dark");
  });
});

describe("nextTheme", () => {
  it("bascule entre clair et sombre", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});

describe("themeInitScript", () => {
  function run(stored: string | null, storageThrows = false) {
    const classes = new Set<string>();
    const documentElement = {
      dataset: {} as Record<string, string>,
      classList: { add: (name: string) => classes.add(name) },
    };
    const localStorage = {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("bloqué");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    };
    new Function("document", "localStorage", themeInitScript)({ documentElement }, localStorage);
    return { theme: documentElement.dataset.theme, classes };
  }

  it("pose le thème enregistré sur <html> avant l'affichage", () => {
    expect(run("light").theme).toBe("light");
    expect(run("dark").theme).toBe("dark");
  });

  it("pose le thème sombre en l'absence de choix, sans lire la préférence du système", () => {
    expect(run(null).theme).toBe("dark");
    expect(themeInitScript).not.toContain("prefers-color-scheme");
  });

  it("ignore une valeur enregistrée invalide", () => {
    expect(run("violet").theme).toBe("dark");
  });

  it("ne casse pas la page si le stockage du navigateur est bloqué", () => {
    expect(run(null, true).theme).toBe("dark");
  });

  it("signale que JavaScript est actif par la classe js sur <html>", () => {
    expect(run(null).classes.has("js")).toBe(true);
    expect(run("light", true).classes.has("js")).toBe(true);
  });
});
