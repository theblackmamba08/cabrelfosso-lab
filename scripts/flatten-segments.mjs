// Après `next build` : noms des fichiers de préchargement d'un export fait sous Windows.
import { fileURLToPath } from "node:url";
import { flattenSegments } from "./lib/flatten-segments.mjs";

const moved = flattenSegments(fileURLToPath(new URL("../out", import.meta.url)));
if (moved > 0) console.log(`Fichiers de préchargement renommés (export sous Windows) : ${moved}`);
