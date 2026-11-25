# Consigne L3 — Clôture : cahier des charges 0.8

Rédigée par Claude (projet claude.ai « Labo ») le 25 novembre 2026, pour Claude Code.

Tâche courte, **documentation seulement** : aucun code, aucun déploiement.

## 0. Contexte

L3 est en ligne (version Cloudflare `42c36b41`, `main` à `ac5ebf7`). Jospin a fait ses contrôles le 25 novembre 2026 : PageSpeed Insights mobile, durées de calcul sur téléphone, affichage de ∨ et ∧, sitemap renvoyé à la Search Console ; tout est conforme. Le cahier 0.8 inscrit cette clôture et les écarts acceptés lors de la réalisation.

**Fichiers fournis** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 0.8**, md5 `f133c6d098a968446d524d7acb467bf4`) et `docs/a-integrer/l3-cloture.md` (cette consigne). Vérifie la ligne 3 « Version 0.8 » et la somme md5. Tout autre fichier dans `docs/a-integrer/` : arrête-toi et signale-le.

**Portfolio** : tu n’y touches pas.

## 1. Étapes

1. `main` à jour avec `origin` (à `ac5ebf7`) ; `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi.
2. `git diff --no-index docs/cahier-des-charges.md docs/a-integrer/cahier-des-charges.md` : changent seulement la ligne 3 ; la ligne L3 (section 8) ; la case Lighthouse (section 9) ; la ligne « Objectifs » de l’annexe D.2 (Exécution) ; un nouveau paragraphe « Écarts acceptés lors de la réalisation » juste avant « ### D.3 » ; une ligne d’historique « Version 0.8 ». Tout autre écart : arrête-toi et montre-le.
3. Branche `etape/l3-cloture`.
4. Un seul commit, « L3 : clôture, cahier des charges 0.8 » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l3-cloture.md` → `docs/consignes/l3-cloture.md` ; suppression de `docs/a-integrer/`.
5. `npm run check` : tout passe (vérifié par Claude sur une copie de `main` : 57 fichiers, 2 730 tests réussis avec le cahier 0.8). Tout échec : arrête-toi et cherche la cause, sans modifier le cahier.
6. Pousse la branche. N’ouvre pas la pull request : Jospin l’ouvre et fusionne en squash.

Interdits rappelés : pas de commit sur `main`, pas de `wrangler login`, pas de `deploy`.

## 2. Rapport (6 points, comme d’habitude)

1. Résultat de la vérification (ligne 3, md5, différences).
2. Branche et hash du commit.
3. Résultat de `check` (nombre de tests réussis).
4. Branche poussée.
5. Écarts ou surprises.
6. Ce que Jospin doit faire ensuite : ouvrir la pull request et fusionner en squash.
