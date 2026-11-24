# Consigne L1.1 — Corrections avant la fusion de L1

Rédigée par Claude (projet claude.ai « Labo ») le 24 novembre 2026, pour Claude Code, après vérification de la branche `etape/l1-socle` (commit `97a8d1b`).

## 0. Contexte

Vérification faite par Claude sur une copie propre de la branche, sous Linux : `npm ci`, `npm run check` (606 tests) et `npm run test:integration` (71 tests) réussis ; textes, URL canoniques, hreflang, sitemap, robots, images de partage et 404 conformes ; `wrangler dev` répond 302 sur `/` selon la langue, avec les en-têtes de sécurité.

Deux points restent à corriger **sur la même branche**, avant la pull request :

1. La page Confidentialité affiche le paragraphe « Mesure d’audience » alors qu’aucun jeton Web Analytics n’est configuré : publiée ainsi, elle décrirait une mesure qui n’existe pas.
2. `/_not-found` répond 200 (question de ton rapport). Décision : **on le garde** (voir 2), mais on le vérifie par un test et on le documente.

Puis `smoke` et `linkcheck` doivent être relancés, puisqu’ils ne l’ont pas été après les deux derniers commits.

**Fichiers fournis par Jospin** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 0.3**) et `docs/a-integrer/l1-1-corrections.md` (cette consigne). Vérifie la ligne 3 « Version 0.3 » et la dernière ligne d’historique « Version 0.3 ». Sinon, arrête-toi.

## 1. Préparation

1. Branche `etape/l1-socle` à jour avec `origin` ; `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi.
2. Premier commit, « L1.1 : cahier des charges 0.3 et consigne » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l1-1-corrections.md` → `docs/consignes/l1-1-corrections.md` ; suppression de `docs/a-integrer/`. Lance `npm test` : exactement **deux** tests doivent échouer, « confidentialité : metaDescription » en français et en anglais (`src/i18n/messages/texts.test.ts`), parce que la 0.3 change cette description ; tous les autres passent (vérifié par Claude sur une copie). C’est l’étape rouge de 2.1 : ne les corrige qu’en 2.1. Tout autre échec : arrête-toi.

## 2. Corrections (en TDD : voir le test échouer, puis corriger)

### 2.1 Paragraphe « Mesure d’audience » conditionnel (cahier, section 6 et annexe B.3)

- Le paragraphe « Mesure d’audience » / « Analytics » de la page Confidentialité n’est rendu que si `webAnalyticsToken !== null` (`src/lib/analytics.ts`). Une seule condition, à côté de celle de l’extrait : l’extrait et le paragraphe apparaissent ensemble, ou ni l’un ni l’autre.
- Tests unitaires : avec `null`, ni le terme ni le texte du paragraphe dans les deux langues ; avec un jeton factice, le paragraphe est présent, mot pour mot comme dans l’annexe B.3, à sa place (après « Responsable »).
- Test sur `out/` (jeton actuel `null`) : `fr/confidentialite.html` et `en/privacy.html` ne contiennent pas « Cloudflare Web Analytics » ; aucune page ne contient `static.cloudflareinsights.com`.
- Description de la page (titre de l’onglet inchangé) : elle devient « Ce que le Labo enregistre, et ce qu’il n’enregistre pas. » / “What the Lab records, and what it doesn’t.” (annexe B.3 de la 0.3), valable avec ou sans jeton : elle ne cite plus la mesure d’audience. Les tests qui lisent le cahier doivent échouer sur l’ancienne description, puis passer.
- Ne change pas la date de dernière mise à jour de la page : le texte publié ne change pas tant que le jeton est absent. Le jour où le jeton est ajouté, la date sera mise à jour (ajoute cette règle dans `docs/maintenance.md`, ligne du jeton Web Analytics).

### 2.2 `/_not-found` gardé et vérifié (cahier, section 4)

- Ne supprime pas `out/_not-found*` : `out/404.html` se déclare lui-même comme la route `/_not-found` dans ses données RSC, et le code client de Next.js connaît ce nom. Le supprimer pourrait provoquer des erreurs dans le navigateur.
- Tests : `out/_not-found.html` contient `<meta name="robots" content="noindex"/>` ; le sitemap ne contient pas `_not-found` ; aucune page publiée n’a de lien vers `_not-found`. En intégration : `/_not-found` répond avec la balise `noindex`.
- `docs/maintenance.md` : une ligne qui explique pourquoi ce fichier existe et pourquoi il est gardé.

## 3. Vérifications et rapport

1. `npm run check` et `npm run test:integration` réussis.
2. `npm run preview`, puis `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis.
3. Dans le navigateur : `/fr/confidentialite` et `/en/privacy` sans le paragraphe ; une 404 (par exemple `/xyz`) sans erreur dans la console.
4. Arrête tous tes serveurs ; aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. N’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`.

N’exécute aucune commande dans le dossier du portfolio, même en lecture du registre npm.
