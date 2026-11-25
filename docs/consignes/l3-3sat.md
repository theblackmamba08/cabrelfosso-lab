# Consigne L3 — Informatique : la transition de phase de 3-SAT

Rédigée par Claude (projet claude.ai « Labo ») le 25 novembre 2026, pour Claude Code.

Cette consigne a **deux parties**. Exécute la **partie 1** maintenant. N’exécute la **partie 2** que lorsque Jospin te l’écrit explicitement (« Partie 2 »), après relecture et fusion de la partie 1.

## 0. Contexte

L2 est en ligne et vérifiée par Jospin le 25 novembre 2026 (version Cloudflare `7ba02663`, `main` à `7f301dd`). La clôture de L2 (cahier 0.6) n’a jamais été commitée : le cahier 0.7 la reprend. L3 publie la catégorie Informatique et sa première expérience, « Où se cachent les problèmes difficiles ? » (transition de phase de 3-SAT).

**Fichiers fournis par Jospin** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 0.7**, md5 `b2ee39c0a7a25768c9466bb09eda949e`, 918 lignes) et `docs/a-integrer/l3-3sat.md` (cette consigne). Vérifie la ligne 3 « Version 0.7 » et la somme md5. S’il reste dans `docs/a-integrer/` un autre fichier (par exemple `l2-cloture.md`), arrête-toi et signale-le.

**Source de vérité** : le cahier 0.7, en particulier les sections 2, 3 (gabarit), 5, 6, 8 et **l’annexe D** (D.1 menu, page Informatique, accueil ; **D.2 modèle et conventions** ; D.3 textes, valeurs de contrôle, sources). Les textes sont repris **mot pour mot** ; seule la typographie des espaces est appliquée dans le code.

**Portfolio** : tu n’y touches pas.

---

## PARTIE 1 — construire (branche, pas de pull request, pas de déploiement)

### 1. Préparation

1. `main` à jour avec `origin` (à `7f301dd`) ; `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi.
2. `git diff --no-index docs/cahier-des-charges.md docs/a-integrer/cahier-des-charges.md` : changent seulement la ligne 3 ; les lignes Informatique et « Une expérience d’informatique » (section 2) ; la ligne 3-SAT (section 3) ; la phrase du menu (section 5) ; les lignes L2a, L2b et L3 (section 8) ; deux cases cochées (section 9) ; l’annexe A, remplacée par une note ; la nouvelle annexe D avant « ## Historique » ; deux lignes d’historique (0.6 et 0.7). Tout autre écart : arrête-toi et montre-le.
3. Branche `etape/l3-3sat`.
4. Premier commit, « L3 : cahier des charges 0.7 et consigne » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l3-3sat.md` → `docs/consignes/l3-3sat.md` ; suppression de `docs/a-integrer/`.
5. `npm test` : tout passe (vérifié par Claude sur une copie du dépôt : 49 fichiers, 1 818 tests réussis avec le cahier 0.7). Tout échec : arrête-toi et cherche la cause, sans modifier le cahier.

### 2. Principes

- **TDD** pour tout. Chaque calcul est une fonction pure testée avec les **valeurs de contrôle de l’annexe D.3**. Elles viennent d’une implantation de référence indépendante (hasard en C compilé, deux solveurs concordants) : si un test échoue, cherche la cause (`superpowers:systematic-debugging` si disponible) ; n’ajuste **jamais** une valeur attendue. Si tu es convaincu qu’une valeur de l’annexe est fausse, arrête-toi et explique-le dans le rapport.
- Le modèle de D.2 est une **spécification exacte** : ordre des tirages, ordre de parcours des clauses, choix de la variable, définition du nombre de choix, de la médiane et du résumé.
- Avant tout code qui dépend d’une version (Web Worker dans Next.js 16 en export statique, Turbopack ou webpack), vérifie la documentation officielle actuelle et cite les liens dans le rapport.

### 3. Comportements

#### 3.1 Registre, publication et adresses
- Registre : expérience `three-sat`, catégorie `computing`, noms d’adresse `transition-de-phase-3-sat` / `3-sat-phase-transition`, publiée.
- `src/i18n/published.ts` : la catégorie `computing` est publiée ; généralise ce qui suppose aujourd’hui que `physics` est la seule catégorie (par exemple `publishedCategories`). Tests.
- `pathInLocale` : `/fr/informatique/transition-de-phase-3-sat` ↔ `/en/computing/3-sat-phase-transition`, `/fr/informatique` ↔ `/en/computing`. Tests.
- Tests sur `out/` : existent `fr/informatique.html`, `en/computing.html`, `fr/informatique/transition-de-phase-3-sat.html`, `en/computing/3-sat-phase-transition.html` ; n’existent pas les croisements de langue (`en/computing/transition-de-phase-3-sat.html`, `fr/informatique/3-sat-phase-transition.html`). Les pages de physique sont inchangées.

#### 3.2 Calcul (fonctions pures, `src/demos/three-sat/`)
- **Hasard** : SplitMix64 et xoshiro128++ selon D.2, avec la clé de 64 bits et l’initialisation décrites. La cible TypeScript est ES2017 : **pas de littéraux BigInt** (`123n`). Utilise `BigInt(...)` sans littéral, ou une arithmétique 64 bits en deux mots de 32 bits ; ne change pas la cible de `tsconfig.json`. Tests : les vecteurs de D.3 (sorties de SplitMix64 depuis 0, états initiaux et six sorties pour les deux clés).
- **Tirage** : `m = n (10 + k) / 5` en entiers ; variables par `1 + ⌊r × n / 2³²⌋` ; rejet des doublons dans une clause ; signe par le bit de poids fort. Tests : les cinq clauses de la graine 2026 (n = 20, k = 0, j = 0) et les 24 clauses de l’énigme pas à pas n° 2. Propriété : avec F = 50, les 20 premières énigmes sont celles de F = 20.
- **Deux solveurs** :
  - un solveur **avec trace**, qui suit D.2 à la lettre (parcours des clauses par numéro, première clause fausse puis première clause unitaire, événements choix / propagation / conflit / retour / solution ou aucune solution). Il sert au mode pas à pas ;
  - un solveur **rapide** (listes d’occurrences et compteurs), sans trace, pour les courbes.
  - Tests : H1 à H4 et l’énigme pas à pas (résultat, nombre de choix, trace complète, affectation) ; **les deux solveurs donnent le même résultat et le même nombre de choix** sur les 2 080 énigmes de la graine 2026 (n = 20, 30, 40, 50 ; k = 0 à 25 ; j = 0 à 19) ; pour 500 énigmes aléatoires de 6 à 12 variables, le résultat est celui d’une **recherche exhaustive** (2ⁿ affectations) ; toute affectation annoncée satisfait toutes les clauses ; le nombre de choix vaut au moins 1 pour les énigmes des courbes.
- **Statistiques** : part satisfiable, médiane (moyenne des deux valeurs centrales si F est pair), résumé (a, b, c, d et les trois variantes), énigme de départ du mode pas à pas (première de 1 à 256 avec au moins un conflit). Tests : les deux courbes de référence de D.3 (n = 20 et n = 40, 26 lignes chacune) et leurs deux résumés, mot pour mot ; énigme de départ n° 2 pour la graine 2026.
- Si le test des 2 080 énigmes est trop lent pour `npm test` (plus de 10 s), garde-le entier dans `npm run test:integration` ou dans un fichier de tests séparé lancé par `npm run check`, et un échantillon dans les tests unitaires. Dis-le dans le rapport.

#### 3.3 Web Worker
- Les courbes sont calculées dans un Web Worker (CSP actuelle : `worker-src 'self'`, ne la change pas). Le fil principal demande **une valeur de α à la fois** : « Pause » prend effet à la fin de la valeur en cours ; « Arrêter » termine le Worker (`terminate`) et retire la courbe partielle ; un nouveau Worker est créé au calcul suivant.
- Rien n’est calculé au chargement pour les courbes. Le code de l’expérience n’est chargé que sur sa page (import dynamique, comme les expériences de physique). Test sur `out/` : le JavaScript de `fr.html` et de `fr/informatique.html` ne contient pas le code du solveur.
- Test : le fichier du Worker est présent dans `out/` et servi depuis la même origine.

#### 3.4 Page de l’expérience (gabarit de la section 3, textes de D.3)
Dans cet ordre : fil d’Ariane ; en-tête (titre, sous-titre, introduction ; la mention du niveau reste **masquée**, `TODO(Jospin)` dans le code seulement) ; **l’expérience** (réglages, boutons, progression, deux graphiques, résumés, tableau repliable), puis **le pas à pas** ; « Le problème et l’algorithme », « Que sait-on du seuil ? », « P, NP et cette expérience » ; hypothèses ; « À essayer » (explications repliables) ; « Pour aller plus loin » (« (en anglais) » seulement sur les pages françaises) ; lien « Voir mon portfolio ».
- **Réglages** : `<select>` natifs pour n et F ; champ de saisie numérique pour la graine, avec étiquette, aide et message d’erreur reliés (`aria-describedby`) ; réglages désactivés pendant un calcul.
- **Graphiques** (D.2, Affichage) : SVG dessiné par le composant, couleurs par jetons du design system, thèmes clair et sombre ; axe logarithmique du second graphique ; ligne pointillée à 4,27 ; un style de trait et un marqueur par n ; légende ; lisible de 360 à 1920 px sans défilement horizontal. Fonctions de mise à l’échelle pures et testées (positions des graduations logarithmiques, bornes).
- **Nombres** : virgule décimale en français, point en anglais ; α avec une décimale ; « 55 % » avec espace insécable en français, « 55% » en anglais.
- **Pas à pas** : clauses dans une liste ordonnée ; état écrit et icône pour chaque clause ; indices en `<sub>` ; nom accessible en mots ; boutons « Étape suivante », « Recommencer », « Autre énigme » ; le message de l’étape est annoncé (`aria-live="polite"`), une fois par clic. Aucune lecture automatique.
- **Polices** : vérifie que ¬, ∨, ∧ et α s’affichent dans les polices chargées (α est dans le sous-ensemble grec de JetBrains Mono). Sinon, dis-le dans le rapport avec ta solution (police de repli ou sous-ensemble), sans changer les textes.
- Métadonnées (titre de l’onglet, description, canonique, hreflang, Open Graph, image de partage 1200 × 630 générée au build) et `BreadcrumbList` égal au fil d’Ariane visible. Tests.

#### 3.5 Page Informatique, accueil et menu (D.1)
- Page Informatique sur le modèle de la page Physique : fil d’Ariane, en-tête, une carte par expérience publiée (cartes produites à partir du registre), figure décorative. Métadonnées, image de partage, `BreadcrumbList`.
- Accueil : section « Informatique » juste après « Physique », même présentation, lien « Toutes les expériences d’informatique ».
- Menu : entrée « Informatique » / « Computing » après « Physique ». Mêmes règles que pour la physique (`aria-current="page"` seulement sur la page de catégorie ; seconde ligne sous 480 px) ; aucun défilement horizontal de 360 à 1920 px, avec deux entrées.
- Figure décorative de l’informatique : SVG simple et original (par exemple trois pastilles reliées), aux couleurs du design system, sans texte.

#### 3.6 SEO
- `sitemap.xml` : **14 adresses** (les 10 actuelles, plus Informatique et l’expérience, dans les deux langues), avec leurs équivalents hreflang. Images de partage des 4 nouvelles pages. Tests sur `out/`.

#### 3.7 Tests de textes
- Sur le modèle de `texts.test.ts` et `demos.test.ts` : chaque chaîne des nouvelles clés se trouve mot pour mot dans la partie de l’annexe D qui la concerne (D.1 ; « #### 3-SAT — français » ; « #### 3-SAT — English » ; « #### Pour aller plus loin — 3-SAT »). Les indices et symboles suivent la même logique que `plainMath` pour le projectile.
- Les sections qui finissent aujourd’hui à « ## Historique » (sources du pendule dans `demos.test.ts`) finissent désormais à « ## Annexe D ».
- Un test vérifie que la phrase « Cette expérience n’apporte pas de réponse à la question P = NP. » figure sur la page française, et son équivalent sur la page anglaise.

#### 3.8 Documents
- `docs/maintenance.md` : « Ajouter une expérience d’informatique » (registre, Worker, valeurs de contrôle) ; comment régénérer les valeurs de contrôle si le modèle de D.2 change (jamais sans nouvelle version du cahier).
- `docs/design-system.md` : graphiques SVG (axes, marqueurs, ligne de référence), pastilles de clauses, figure de l’informatique.

### 4. Hors périmètre
Pas de Rust ni de WebAssembly. Aucune modification des expériences de physique ni de leurs valeurs de contrôle. Pas de modification du portfolio. Pas de jeton Web Analytics. Aucun autre texte que ceux du cahier.

### 5. Vérifications et rapport de la partie 1
1. `npm run check` et `npm run test:integration` réussis.
2. `npm run preview`, puis `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis. Un lien de source refusé aux outils automatiques (403) alors qu’il est correct : ne change pas la source, signale-le.
3. Dans le navigateur, sur `npm run preview` :
   - calcul n = 40 par défaut, puis n = 20 et n = 50 sans effacer ; Pause, Reprendre, Arrêter, Effacer ; graine 2026 puis une autre ; graine invalide (0, 1 000 000, « abc ») ;
   - **la courbe n = 20 et n = 40 avec la graine 2026 et 20 énigmes affiche les valeurs de référence de D.3** (tableau repliable) ;
   - pas à pas : énigme n° 2 de la graine 2026, jusqu’à la solution, Recommencer, Autre énigme ;
   - temps de calcul mesurés avec le ralentissement du processeur ×4 des outils de développement de Chrome : défaut (n = 40, 20 énigmes) et n = 50 avec 100 énigmes ;
   - `prefers-reduced-motion` ; 360, 768, 1280 et 1920 px ; thèmes sombre et clair ; clavier ; sans JavaScript (textes et sources restent lisibles ; les réglages se comportent comme ceux des expériences de physique ; aucun texte absent du cahier n’est ajouté) ;
   - aucune erreur dans la console (CSP comprise, Worker compris).
4. Arrête tous tes serveurs ; aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. N’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`, plus : les temps mesurés ; le résultat du contrôle des polices ; où tourne le test des 2 080 énigmes et sa durée ; les liens de sources vérifiés et leur statut.

---

## PARTIE 2 — publier (seulement quand Jospin écrit « Partie 2 »)

Préalables confirmés par Jospin : partie 1 fusionnée dans `main` (en squash) ; `npx wrangler whoami` montre son compte.

1. `git switch main`, `git pull`, `npm ci`, `npm run check`.
2. Note l’identifiant complet de la version en ligne (`npx wrangler deployments list` : elle commence par `7ba02663`), pour un éventuel retour arrière.
3. `npm run deploy`. Note l’identifiant de la nouvelle version.
4. `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.
5. Demande à Jospin :
   - PageSpeed Insights mobile sur `https://lab.cabrelfosso.com/fr/informatique/transition-de-phase-3-sat` et `https://lab.cabrelfosso.com/en/computing` (au moins 95 dans les quatre catégories) ;
   - de lancer sur son téléphone le calcul par défaut et n = 50 avec 100 énigmes, et de noter les deux durées (objectifs : 3 s et 30 s au plus) ;
   - de renvoyer le sitemap à la Search Console (`https://lab.cabrelfosso.com/sitemap.xml`, 14 adresses attendues).
6. Rends compte : version déployée, résultats, commande de retour arrière (`npx wrangler rollback <identifiant complet de 7ba02663…>`).

En cas d’échec : arrête-toi, ne tente aucun contournement en production, et rends compte.
