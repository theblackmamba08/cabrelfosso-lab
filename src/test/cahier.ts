import { readFileSync } from "node:fs";

/**
 * Lecture du cahier des charges pour les tests : le contenu du site doit en être repris,
 * pas réinventé. Le cahier est en typographie simple : on compare sans apostrophe courbe
 * ni espace insécable.
 */
export const plain = (value: string) => value.replace(/’/g, "'").replace(/ /g, " ");

export const cahier = plain(
  readFileSync(new URL("../../docs/cahier-des-charges.md", import.meta.url), "utf8"),
);

/** Texte compris entre deux titres du cahier (le second exclu). */
export function between(start: string, end: string): string {
  const from = cahier.indexOf(start);
  if (from === -1) throw new Error(`Titre introuvable dans le cahier : ${start}`);
  const to = cahier.indexOf(end, from + start.length);
  if (to === -1) throw new Error(`Titre introuvable dans le cahier : ${end}`);
  return cahier.slice(from, to);
}

/** Lignes d'un tableau Markdown, cellules découpées, sans l'en-tête ni la ligne de séparation. */
export function tableRows(section: string): string[][] {
  return section
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map((line) =>
      line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim()),
    );
}
