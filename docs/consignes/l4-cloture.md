# Consigne L4 — Clôture : cahier des charges 1.0

Rédigée par Claude (projet claude.ai « Labo ») le 28 novembre 2026, pour Claude Code.

Tâche courte, **documentation seulement** : aucun code, aucun déploiement.

## 0. Contexte

L4 (série « découverte » : la réfraction de la lumière et « Pensez à un nombre ») est en ligne depuis le 25 novembre 2026 (`main` à `3ed5199`). Claude a contrôlé les pages et le sitemap en ligne ; Jospin a fait ses contrôles le 28 novembre 2026 (PageSpeed Insights mobile, essai sur téléphone, sitemap renvoyé à la Search Console) : tout est conforme. Le cahier 1.0 inscrit cette clôture et les écarts acceptés.

**Fichiers fournis** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 1.0**, md5 `bc28ec1cb8bd9e48d608460df964d38b`) et `docs/a-integrer/l4-cloture.md` (cette consigne). Vérifie la ligne 3 « Version 1.0 » et la somme md5. Tout autre fichier dans `docs/a-integrer/` : arrête-toi et signale-le.

**Portfolio** : tu n’y touches pas.

## 1. Étapes

1. `main` à jour avec `origin` (à `3ed5199`) ; `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi. Si la branche locale `etape/l4-decouverte` existe encore, supprime-la (`git branch -D`, elle est fusionnée).
2. `git diff --no-index docs/cahier-des-charges.md docs/a-integrer/cahier-des-charges.md` : changent seulement la ligne 3 ; la ligne L4 (section 8) ; la case Lighthouse (section 9) ; un nouveau paragraphe « Écarts acceptés lors de la réalisation (L4…) » juste avant « ### E.2 » ; une ligne d’historique « Version 1.0 ». Tout autre écart : arrête-toi et montre-le.
3. Branche `etape/l4-cloture`.
4. Un seul commit, « L4 : clôture, cahier des charges 1.0 » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l4-cloture.md` → `docs/consignes/l4-cloture.md` ; suppression de `docs/a-integrer/`.
5. `npm run check` : tout passe (vérifié par Claude sur une copie de `main` : 62 fichiers, 3 517 tests réussis avec le cahier 1.0). Tout échec : arrête-toi et cherche la cause, sans modifier le cahier.
6. Pousse la branche. N’ouvre pas la pull request : Jospin l’ouvre et fusionne en squash.

Interdits rappelés : pas de commit sur `main`, pas de `wrangler login`, pas de `deploy`.

## 2. Rapport (6 points, comme d’habitude)

1. Résultat de la vérification (ligne 3, md5, différences).
2. Branche et hash du commit.
3. Résultat de `check` (nombre de tests réussis).
4. Branche poussée.
5. Écarts ou surprises.
6. Ce que Jospin doit faire ensuite : ouvrir la pull request et fusionner en squash.
