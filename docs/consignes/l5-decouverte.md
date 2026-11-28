# Consigne L5 — Série « découverte », suite : la lentille convergente et π par le hasard

Rédigée par Claude (projet claude.ai « Labo ») le 28 novembre 2026, pour Claude Code.

Cette consigne a **deux parties**. Exécute la **partie 1** maintenant. N’exécute la **partie 2** que lorsque Jospin te l’écrit explicitement (« Partie 2 »), après relecture et fusion de la partie 1.

## 0. Contexte

L4 est en ligne et close (cahier 1.0). L5 ajoute deux expériences « découverte » : la lentille convergente (physique) et « Calculer π avec le hasard » (informatique, méthode de Monte-Carlo). Pages courtes, mêmes exigences de qualité que L4.

**Fichiers fournis** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 1.1**, md5 `b85faf6f983a362ce25c3e81749f1f9c`) et `docs/a-integrer/l5-decouverte.md` (cette consigne). Vérifie la ligne 3 « Version 1.1 » et la somme md5. Tout autre fichier dans `docs/a-integrer/` : arrête-toi et signale-le.

**Source de vérité** : le cahier 1.1, en particulier les sections 2, 3 (gabarit), 4.1 (conventions des expériences de physique), 5, l’annexe D.2 (générateur de hasard) et **l’annexe F** (F.0 cartes ; F.1 lentille ; F.2 π : conventions, textes, valeurs de contrôle, sources). Les textes sont repris **mot pour mot** ; seule la typographie des espaces est appliquée dans le code.

**Portfolio** : tu n’y touches pas.

---

## PARTIE 1 — construire (branche, pas de pull request, pas de déploiement)

### 1. Préparation

1. `git switch main`, puis `git pull --ff-only`. `docs/cahier-des-charges.md` de `main` doit être la version 1.0 (md5 `bc28ec1cb8bd9e48d608460df964d38b`), c’est-à-dire que la clôture de L4 est fusionnée. Sinon, arrête-toi : Jospin doit d’abord fusionner `etape/l4-cloture`. Supprime les branches locales déjà fusionnées (`etape/l4-cloture`, `etape/l4-decouverte` si elles existent). `git status` ne montre que `docs/a-integrer/`.
2. `git diff --no-index docs/cahier-des-charges.md docs/a-integrer/cahier-des-charges.md` : changent seulement la ligne 3 ; les deux lignes « Une expérience de physique » et « Une expérience d’informatique » (section 2) ; quatre nouvelles lignes et la ligne « IA explicable » de la section 3 ; deux nouvelles lignes L5 et L6 (section 8) ; la nouvelle annexe F avant « ## Historique » ; une ligne d’historique « Version 1.1 ». Tout autre écart : arrête-toi et montre-le.
3. Branche `etape/l5-decouverte`.
4. Premier commit, « L5 : cahier des charges 1.1 et consigne » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l5-decouverte.md` → `docs/consignes/l5-decouverte.md` ; suppression de `docs/a-integrer/`.
5. `npm test` : tout passe (vérifié par Claude sur une copie de `etape/l4-cloture` : 62 fichiers, 3 517 tests réussis avec le cahier 1.1). Tout échec : arrête-toi.

### 2. Principes

- **TDD** pour tout. Chaque calcul est une fonction pure testée avec les **valeurs de contrôle de l’annexe F**. N’ajuste **jamais** une valeur attendue ; si tu es convaincu qu’une valeur est fausse, arrête-toi et explique-le.
- **Réutiliser** : registre, page de catégorie commune, cartes, gabarit de page, `MathText` et `plainMath`, `fill`, réglages natifs, format à 3 chiffres significatifs, fil d’Ariane, métadonnées, images de partage ; pour π, le générateur de 3-SAT (SplitMix64 et xoshiro128++) et la lecture de la graine. Si tu déplaces le générateur vers un module commun, c’est un déplacement sans changement de comportement : tous les tests de 3-SAT doivent passer sans modification de leurs valeurs. Pas de nouvelle dépendance.
- Avant tout code qui dépend d’une version, vérifie la documentation officielle actuelle et cite les liens dans le rapport.

### 3. Comportements

#### 3.1 Registre, cartes et SEO (F.0)
- Registre : `converging-lens` (catégorie `physics`, noms d’adresse `lentille-convergente` / `converging-lens`), après la réfraction ; `estimating-pi` (catégorie `computing`, `calculer-pi` / `estimating-pi`), après le nombre mystère ; publiées.
- Cartes (accueil et pages de catégorie) avec les textes de F.0 et une petite figure décorative originale chacune (SVG, jetons du design system, sans texte).
- Tests sur `out/` : existent `fr/physique/lentille-convergente.html`, `en/physics/converging-lens.html`, `fr/informatique/calculer-pi.html`, `en/computing/estimating-pi.html` ; n’existent pas les croisements de langue. `sitemap.xml` : **22 adresses**, avec hreflang. Images de partage des 4 nouvelles pages. `BreadcrumbList` égal au fil d’Ariane visible.

#### 3.2 La lentille convergente (`src/demos/converging-lens/`)
- Fonctions pures (F.1, conventions) : OA′, γ, A′B′ en mesures algébriques ; « pas d’image » si d = f′ ; nature décidée en comparant d à f′ et à 2f′ (jamais à partir de γ calculé). Tests : **toutes les lignes du tableau de F.1** et **tous les affichages attendus** (3 chiffres significatifs, arrondis avant l’affichage : −1 s’affiche « −1,00 »).
- Géométrie des trois rayons et des prolongements en fonctions pures testées (au moins d = 15, d = 10, d = 5, d = 2,5 avec f′ = 5) ; rayon (3) absent si d = f′ ; image non dessinée et message affiché si elle sort du cadre (F.1 : cadre de −42 à 42 cm et de −14 à 14 cm).
- Page française : mesures algébriques surmontées d’une barre (style, pas de caractère ajouté dans le texte). Page anglaise : notation d_o, d_i, f, m, h_i (indices par `plainMath`).
- Aucune animation ; pas d’annonce `aria-live` à chaque mouvement d’un curseur.

#### 3.3 Calculer π avec le hasard (`src/demos/estimating-pi/`)
- Clé graine × 2³² + 2 × 2²⁴ ; un point = deux sorties successives ; x = r₁ / 2³², y = r₂ / 2³² ; dans le quart de disque si x² + y² ≤ 1 (F.2). Tests : la clé et les trois premiers points de la graine 2026, le premier point de la graine 1, et **les huit lignes du tableau de F.2** (n exact, estimation et écart à 4 décimales).
- Ajouts de 100, 1 000 ou 10 000 points ; au plus 100 000 points ; « Recommencer » ; changement de graine : nouvelle série. Propriété testée : ajouter 100 puis 900 points donne exactement le même état qu’ajouter 1 000 points.
- Figure SVG : seuls les 2 000 premiers points dessinés ; disque plein dedans, petite croix dehors. Aucune animation. Résultats annoncés une fois par clic (`aria-live="polite"`). Le calcul de 10 000 points reste rapide sur le fil principal (mesure-le) ; s’il dépasse 50 ms sur ton poste, dis-le dans le rapport avec ta solution.

#### 3.4 Pages, textes et chargement
- Ordre : gabarit de la section 3. Lentille : réglages, figure, résultats, « Les lois ». π : l’expérience, puis « Comment ça marche ? ». Mentions de classe ou de niveau **masquées** (`TODO(Jospin)` dans le code seulement).
- Tests de textes : chaque chaîne des nouvelles clés se trouve mot pour mot dans sa partie de l’annexe F (F.0 ; « #### Lentille — français » ; « #### Lentille — English » ; « #### π — français » ; « #### π — English » ; les deux rubriques « Pour aller plus loin »). Les sections qui finissent aujourd’hui à « ## Historique » finissent désormais à « ## Annexe F ».
- Code de chaque expérience chargé seulement sur sa page (import dynamique), test sur `out/` comme pour les autres.

#### 3.5 Documents
- `docs/maintenance.md` et `docs/design-system.md` : les deux expériences, leurs figures, et le module commun du générateur s’il a été déplacé.

### 4. Hors périmètre
Aucune modification des expériences existantes ni de leurs valeurs de contrôle (un déplacement de code commun sans changement de comportement est permis, et signalé). Pas de modification du portfolio. Pas de jeton Web Analytics. Aucun autre texte que ceux du cahier.

### 5. Vérifications et rapport de la partie 1
1. `npm run check` et `npm run test:integration` réussis.
2. `npm run preview`, puis `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis (les liens externes refusés aux outils automatiques sont signalés, pas modifiés).
3. Dans le navigateur, sur `npm run preview`, en français **et en anglais** :
   - lentille : les trois scénarios « À essayer » de F.1, d = f′, une image hors du cadre, f′ = 2 et f′ = 10 ; valeurs affichées égales à celles de F.1 ;
   - π : graine 2026 de 100 à 100 000 points (valeurs de F.2), graine 1, graine invalide, « Recommencer », maximum atteint ;
   - 360, 768, 1280 et 1920 px ; thèmes sombre et clair ; clavier ; sans JavaScript (textes lisibles) ; `prefers-reduced-motion` ;
   - aucune erreur dans la console (CSP comprise).
4. Arrête tous tes serveurs ; aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. N’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`, plus : la durée mesurée pour 10 000 points ; les liens de sources vérifiés et leur statut.

---

## PARTIE 2 — publier (seulement quand Jospin écrit « Partie 2 »)

Préalables confirmés par Jospin : partie 1 fusionnée dans `main` (en squash) ; `npx wrangler whoami` montre son compte.

1. `git switch main`, `git pull`, `npm ci`, `npm run check`.
2. Note l’identifiant complet de la version en ligne (`npx wrangler deployments list`), pour un éventuel retour arrière.
3. `npm run deploy`. Note l’identifiant de la nouvelle version.
4. `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.
5. Rends compte : les deux identifiants de version, les résultats, la commande de retour arrière. **Écris aussi les deux identifiants dans un fichier `docs/a-integrer/versions-l5.txt`** (non commité) : Claude (projet « Labo ») les reportera dans le cahier à la clôture. Claude fait ensuite les contrôles en ligne ; il reste à Jospin PageSpeed Insights, l’essai sur téléphone et le sitemap (22 adresses) dans la Search Console.

En cas d’échec : arrête-toi, ne tente aucun contournement en production, et rends compte.
