# Consigne L4 — Série « découverte » : la réfraction et le nombre mystère

Rédigée par Claude (projet claude.ai « Labo ») le 25 novembre 2026, pour Claude Code.

Cette consigne a **deux parties**. Exécute la **partie 1** maintenant. N’exécute la **partie 2** que lorsque Jospin te l’écrit explicitement (« Partie 2 »), après relecture et fusion de la partie 1.

## 0. Contexte

L3 est en ligne et close (`main` à `a3f7a4d`, cahier 0.8, version Cloudflare `42c36b41`). Jospin veut maintenant des expériences simples et visuelles, pour donner envie de visiter le Labo : la réfraction de la lumière (physique) et « Pensez à un nombre » (informatique, recherche dichotomique). Pages courtes, mêmes exigences de qualité.

**Fichiers fournis** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 0.9**, md5 `17a465c040b616ec7056dbf57126319b`) et `docs/a-integrer/l4-decouverte.md` (cette consigne). Vérifie la ligne 3 « Version 0.9 » et la somme md5. Tout autre fichier dans `docs/a-integrer/` : arrête-toi et signale-le.

**Source de vérité** : le cahier 0.9, en particulier les sections 2, 3 (gabarit), 4.1 (conventions des expériences de physique), 5 et **l’annexe E** (E.1 pages de catégorie et accueil ; E.2 réfraction ; E.3 nombre mystère : conventions, textes, valeurs de contrôle, sources). Les textes sont repris **mot pour mot** ; seule la typographie des espaces est appliquée dans le code.

**Portfolio** : tu n’y touches pas.

---

## PARTIE 1 — construire (branche, pas de pull request, pas de déploiement)

### 1. Préparation

1. Le dépôt local est encore sur `etape/l3-cloture` (fusionnée en squash dans `main` sous `a3f7a4d`). `git switch main`, puis `git pull --ff-only` : `main` doit être à `a3f7a4d`. Supprime la branche locale `etape/l3-cloture` (`git branch -D`, elle est fusionnée). `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi.
2. `git diff --no-index docs/cahier-des-charges.md docs/a-integrer/cahier-des-charges.md` : changent seulement la ligne 3 ; les deux lignes « Une expérience de physique » et « Une expérience d’informatique » (section 2) ; deux nouvelles lignes et la ligne « IA explicable » (« Après L4 ») de la section 3 ; la description et l’introduction de la page Physique (annexe C.1) ; une nouvelle ligne L4 (section 8) ; la nouvelle annexe E avant « ## Historique » ; une ligne d’historique « Version 0.9 ». Tout autre écart : arrête-toi et montre-le.
3. Branche `etape/l4-decouverte`.
4. Premier commit, « L4 : cahier des charges 0.9 et consigne » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l4-decouverte.md` → `docs/consignes/l4-decouverte.md` ; suppression de `docs/a-integrer/`.
5. `npm test` : exactement **quatre** tests échouent, « menu et page Physique : physics.metaDescription » et « physics.intro », en français et en anglais (`src/i18n/messages/texts.test.ts`), parce que la 0.9 élargit la description de la page Physique (vérifié par Claude sur une copie de `main` : 4 échecs, 2 726 réussis). C’est l’étape rouge de 3.1. Tout autre échec : arrête-toi.

### 2. Principes

- **TDD** pour tout. Chaque calcul est une fonction pure testée avec les **valeurs de contrôle de l’annexe E** (E.2 et E.3), calculées par Claude en Python. N’ajuste **jamais** une valeur attendue ; si tu es convaincu qu’une valeur est fausse, arrête-toi et explique-le.
- **Réutiliser** ce qui existe : registre, page de catégorie commune, cartes, gabarit de page d’expérience, `MathText` et `plainMath` (formules, indices comme i₁ ou i_lim), réglages natifs du projectile, format des nombres, fil d’Ariane, métadonnées, images de partage. Pas de nouvelle dépendance.
- Pages « découverte » : courtes, mais avec tout le gabarit de la section 3 (fil d’Ariane, en-tête, expérience, lois ou explication, hypothèses, « À essayer », « Pour aller plus loin », lien « Voir mon portfolio »).
- Avant tout code qui dépend d’une version, vérifie la documentation officielle actuelle et cite les liens dans le rapport.

### 3. Comportements

#### 3.1 Registre, pages de catégorie, accueil (E.1)
- Registre : `refraction` (catégorie `physics`, noms d’adresse `refraction` / `refraction`), puis `think-of-a-number` (catégorie `computing`, `pensez-a-un-nombre` / `think-of-a-number`), publiées, après les expériences existantes.
- Nouvelle description et nouvelle introduction de la page Physique : c’est ce qui fait repasser au vert les quatre tests de l’étape 1.5.
- Cartes (accueil et pages de catégorie) produites par le registre, avec les textes de E.1 et une petite figure décorative originale chacune (SVG, jetons du design system, sans texte).
- Tests sur `out/` : existent `fr/physique/refraction.html`, `en/physics/refraction.html`, `fr/informatique/pensez-a-un-nombre.html`, `en/computing/think-of-a-number.html` ; n’existent pas `en/computing/pensez-a-un-nombre.html` ni `fr/informatique/think-of-a-number.html`. `sitemap.xml` : **18 adresses**, avec hreflang. Images de partage des 4 nouvelles pages. `BreadcrumbList` égal au fil d’Ariane visible.

#### 3.2 La réfraction (`src/demos/refraction/`)
- Fonctions pures : sin i₂ = n₁ sin i₁ / n₂ ; i₂ ou réflexion totale (si sin i₂ > 1) ; angle limite seulement si n₁ > n₂ ; angle de réflexion. Tests : **toutes les lignes du tableau de E.2** (4 décimales) et **tous les affichages attendus** listés sous le tableau (3 chiffres significatifs, virgule en français, point en anglais, « 0 » pour zéro).
- Les indices sont exactement ceux affichés (1,00 ; 1,33 ; 1,52 ; 2,42).
- Figure SVG (E.2, conventions) : géométrie des rayons en fonctions pures testées (directions des rayons pour au moins 0°, 40° air → eau, et un cas de réflexion totale). Aucune animation.
- La ligne « Avec les valeurs réglées : sin i₂ = n₁ sin i₁ / n₂ = {s} » suit les réglages ; quand s > 1, la ligne suivante du cahier (« Si ce nombre dépasse 1… ») reste visible et la figure montre la réflexion totale.
- Résultats dans une liste de définitions ; résumé textuel de la figure ; pas d’annonce `aria-live` à chaque mouvement du curseur.

#### 3.3 Pensez à un nombre (`src/demos/think-of-a-number/`)
- État du jeu en fonctions pures (début, réponse « Plus grand », « Plus petit », « C’est ça ! », annulation, contradiction, nouvelle partie) et Q(N) = ⌊log₂ N⌋ + 1, sans calcul en virgule flottante sur le logarithme. Tests :
  - chaque ligne du tableau de E.3 (suite exacte des nombres proposés) ;
  - le scénario de contradiction de E.3 (intervalles exacts, contradiction après 7 réponses) ;
  - **calcul exhaustif** pour N = 20, 100, 1 000 et 1 000 000 : le maximum de questions vaut 5, 7, 10, 20, et le nombre de nombres qui l’atteignent vaut 5, 37, 489, 475 713 (si N = 1 000 000 dépasse 10 s dans `npm test`, place-le dans les tests d’intégration et dis-le) ;
  - l’annulation rend exactement l’état précédent, plusieurs fois de suite.
- Interface : bouton « J’ai choisi » pour commencer ; boutons de réponse natifs ; compteur « Question {k} sur {Q} au plus » ; barre SVG de l’intervalle avec son résumé textuel ; historique en liste ordonnée ; la nouvelle question annoncée une fois par réponse (`aria-live="polite"`). Aucun minuteur, aucune animation, aucun hasard.
- Nombres avec séparateur de milliers (français : espace insécable, selon la convention déjà utilisée dans le code ; anglais : virgule).

#### 3.4 Pages, textes et chargement
- Ordre des pages : gabarit de la section 3. Pour la réfraction : réglages, figure, résultats, « Les lois ». Pour le nombre mystère : le jeu, puis « Comment fait l’ordinateur ? ». La mention du niveau ou de la classe reste **masquée** (`TODO(Jospin)` dans le code seulement).
- Tests de textes sur le modèle de `texts.test.ts` et `demos.test.ts` : chaque chaîne des nouvelles clés se trouve mot pour mot dans sa partie de l’annexe E (E.1 ; « #### Réfraction — français » ; « #### Réfraction — English » ; « #### Nombre mystère — français » ; « #### Nombre mystère — English » ; les deux rubriques « Pour aller plus loin »). Les sections qui finissent aujourd’hui à « ## Historique » finissent désormais à « ## Annexe E ».
- Le code de chaque expérience n’est chargé que sur sa page (import dynamique) ; test sur `out/` comme pour les autres expériences.

#### 3.5 Documents
- `docs/maintenance.md` : les deux expériences dans la liste ; rien d’autre de nouveau à expliquer, sauf si tu ajoutes un composant commun.
- `docs/design-system.md` : la figure de la réfraction, la barre d’intervalle du jeu, les deux figures de carte.

### 4. Hors périmètre
Aucune modification des expériences existantes ni de leurs valeurs de contrôle (seules la description et l’introduction de la page Physique changent). Pas de modification du portfolio. Pas de jeton Web Analytics. Aucun autre texte que ceux du cahier.

### 5. Vérifications et rapport de la partie 1
1. `npm run check` et `npm run test:integration` réussis.
2. `npm run preview`, puis `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis (les liens externes refusés aux outils automatiques sont signalés, pas modifiés).
3. Dans le navigateur, sur `npm run preview`, en français **et en anglais** :
   - réfraction : air → eau de 0° à 89° ; eau → air à 48° puis 49° (réflexion totale) ; diamant → air ; même milieu des deux côtés ; les valeurs affichées égales à celles de E.2 ;
   - nombre mystère : les trois scénarios « À essayer » de E.3, l’annulation, « Rejouer », N = 1 000 000 ;
   - 360, 768, 1280 et 1920 px ; thèmes sombre et clair ; clavier ; sans JavaScript (textes lisibles) ; `prefers-reduced-motion` ;
   - aucune erreur dans la console (CSP comprise).
4. Arrête tous tes serveurs ; aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. N’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`, plus : où tourne le calcul exhaustif pour N = 1 000 000 et sa durée ; les liens de sources vérifiés et leur statut.

---

## PARTIE 2 — publier (seulement quand Jospin écrit « Partie 2 »)

Préalables confirmés par Jospin : partie 1 fusionnée dans `main` (en squash) ; `npx wrangler whoami` montre son compte.

1. `git switch main`, `git pull`, `npm ci`, `npm run check`.
2. Note l’identifiant complet de la version en ligne (`npx wrangler deployments list` : elle commence par `42c36b41`).
3. `npm run deploy`. Note l’identifiant de la nouvelle version.
4. `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.
5. Rends compte : version déployée, résultats, commande de retour arrière (`npx wrangler rollback 42c36b41-7243-4d5a-b48b-75848fbacadc`). Claude (projet « Labo ») fait ensuite les contrôles en ligne ; il reste à Jospin d’essayer les deux pages sur son téléphone et de renvoyer le sitemap à la Search Console (18 adresses).

En cas d’échec : arrête-toi, ne tente aucun contournement en production, et rends compte.
