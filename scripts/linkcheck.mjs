// Vérifie les liens d'un site servi : npm run linkcheck -- <adresse>
// Exemples : npm run linkcheck -- https://lab.cabrelfosso.com
//            npm run linkcheck -- http://localhost:8787 (après npm run preview)
// Sans dépendance, Windows et Linux. Échoue si un lien interne ou une ancre est cassé ;
// les liens externes sont seulement listés (certains sites refusent les robots).
import { runLinkcheck } from "./lib/linkcheck.mjs";

let pageCount = 0;
const from = (list) => {
  if (list.length === 0) return "";
  return list.length >= pageCount ? " (depuis toutes les pages)" : ` (depuis ${list.join(", ")})`;
};

try {
  const baseUrl = process.argv[2];
  console.log(`Vérification des liens de ${baseUrl ?? "(aucune adresse)"}`);
  const result = await runLinkcheck({ baseUrl, log: (line) => console.log(line) });
  pageCount = result.pages;

  console.log(`\nPages du sitemap : ${result.pages}. Adresses internes demandées : ${result.internal}.`);
  if (result.outOfSitemap.length > 0) {
    console.log(`\nPages internes hors sitemap (${result.outOfSitemap.length}) :`);
    for (const page of result.outOfSitemap) console.log(`  ! ${page.url}${from(page.from)}`);
  }
  console.log(`\nLiens externes (${result.external.length}), non bloquants :`);
  for (const link of result.external) console.log(`  ${link.ok ? "✓" : "!"} ${link.status} ${link.url}${from(link.from)}`);
  console.log(`\nmailto (non testés) : ${result.mailto.join(", ") || "aucun"}`);
  console.log(`tel (non testés) : ${result.tel.join(", ") || "aucun"}`);

  if (result.failures.length > 0) {
    console.error(`\n${result.failures.length} lien(s) interne(s) ou ancre(s) en échec :`);
    for (const failure of result.failures) console.error(`  ✗ ${failure.url} : ${failure.reason}${from(failure.from)}`);
    process.exit(1);
  }
  console.log("\nAucun lien interne ni ancre en échec.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
