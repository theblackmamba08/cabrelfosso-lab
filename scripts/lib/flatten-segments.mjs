import { readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

/** Fichiers d'un dossier, chacun par la liste de ses noms de dossiers puis le sien. */
function filesOf(directory, names = []) {
  return readdirSync(join(directory, ...names), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesOf(directory, [...names, entry.name]) : [[...names, entry.name]],
  );
}

/**
 * Corrige les fichiers de préchargement d'un export fait sous Windows. Next.js 16.4.6 y écrit
 * `__next.$d$lang/__PAGE__.txt` au lieu de `__next.$d$lang.__PAGE__.txt`, l'adresse que le navigateur
 * demande : le chemin relatif contient des « \ » que le code ne remplace pas par des points
 * (next/dist/export/index.js, collectSegmentPaths). Sans effet sur un export fait sous Linux.
 * Renvoie le nombre de fichiers déplacés.
 */
export function flattenSegments(directory) {
  let moved = 0;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);
    if (!entry.name.startsWith("__next.")) {
      moved += flattenSegments(path);
      continue;
    }
    for (const names of filesOf(path)) {
      renameSync(join(path, ...names), join(directory, [entry.name, ...names].join(".")));
      moved += 1;
    }
    rmSync(path, { recursive: true });
  }
  return moved;
}
