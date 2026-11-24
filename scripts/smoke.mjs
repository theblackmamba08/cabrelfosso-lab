// Vérifie un site servi : npm run smoke -- <adresse>
// Exemples : npm run smoke -- http://localhost:8787 (après npm run preview)
//            npm run smoke -- https://lab.cabrelfosso.com (après mise en ligne)
// Sans dépendance, Windows et Linux. Seulement des GET et HEAD, plus un POST / refusé (405).
import { runSmoke } from "./lib/smoke.mjs";

try {
  const baseUrl = process.argv[2];
  console.log(`Vérification de ${baseUrl ?? "(aucune adresse)"}`);
  const { failures } = await runSmoke({ baseUrl, log: (line) => console.log(line) });
  if (failures.length > 0) {
    console.error(`\n${failures.length} vérification(s) en échec.`);
    process.exit(1);
  }
  console.log("\nToutes les vérifications ont réussi.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
