# Consigne L2a — Physique : le projectile et le pendule de Newton dans le Labo

Rédigée par Claude (projet claude.ai « Labo ») le 24 novembre 2026, pour Claude Code.

Cette consigne a **deux parties**. Exécute la **partie 1** maintenant. N’exécute la **partie 2** que lorsque Jospin te l’écrit explicitement (« Partie 2 »), après relecture et fusion de la partie 1.

## 0. Contexte

L1 est en ligne (`main` à `de7e3a2`, version Cloudflare `1e6be4ff`). L2a fait déménager dans le Labo les deux démos du portfolio, le mouvement d’un projectile et le pendule de Newton : code, tests, textes, plus ce que le Labo exige en plus (page Physique, menu, fil d’Ariane, sources). Le portfolio n’est **pas** modifié : ses redirections viendront à l’étape L2b, après la mise en ligne de L2a.

**Fichiers fournis par Jospin** (non commités) : `docs/a-integrer/cahier-des-charges.md` (**version 0.4**) et `docs/a-integrer/l2a-physique.md` (cette consigne). Vérifie la ligne 3 « Version 0.4 » et la dernière ligne d’historique « Version 0.4 ». Sinon, arrête-toi.

**Source de vérité** : le cahier 0.4. Sections utiles : 2 (adresses), 3 (gabarit d’une page d’expérience), **4.1 (modèles et conventions des expériences)**, 5 (menu, fil d’Ariane), 6 (règle Cloudflare de mesure d’audience), 8, annexe B.2 (accueil) et **annexe C** (page Physique, textes, valeurs de contrôle, sources). Les textes sont repris **mot pour mot** ; seule la typographie des espaces est appliquée dans le code.

**Portfolio, en lecture seule** : `C:\dev\cabrelfosso-portfolio`. Il est actuellement sur la branche `etape/l0-labo` : lis les fichiers tels qu’ils sont dans le dossier, sans changer de branche. Tu n’y écris rien, tu n’y lances aucune commande (ni `npm`, ni `git` autre que de lecture).

---

## PARTIE 1 — construire (branche, pas de pull request, pas de déploiement)

### 1. Préparation

1. `main` à jour avec `origin` ; `git status` ne montre que `docs/a-integrer/`. Sinon, arrête-toi.
2. Branche `etape/l2a-physique`.
3. Premier commit, « L2a : cahier des charges 0.4 et consigne » : `docs/a-integrer/cahier-des-charges.md` remplace `docs/cahier-des-charges.md` ; `docs/a-integrer/l2a-physique.md` → `docs/consignes/l2a-physique.md` ; suppression de `docs/a-integrer/`.
4. `npm test` : exactement **six** tests doivent échouer, « accueil : temporary.title », « temporary.text » et « temporary.link », en français et en anglais (`src/i18n/messages/texts.test.ts`), parce que la 0.4 retire le bloc provisoire de l’annexe B.2 (vérifié par Claude sur une copie : 6 échecs, 604 réussis). C’est l’étape rouge de 3.4. Tout autre échec : arrête-toi.
5. Lis, dans le portfolio : `src/demos/` (tout), `src/app/[lang]/demos/` (les deux pages), la partie `demos` de `src/i18n/messages/fr.ts` et `en.ts` et `src/i18n/messages/demos.test.ts`, `src/components/breadcrumb.tsx`, `src/lib/seo/structured-data.ts` (`BreadcrumbList`), `src/design/fonts.ts` (sous-ensemble grec de JetBrains Mono) et `src/fonts/jetbrains-mono-greek-wght-normal.woff2`.

### 2. Principes

- **Recopier, pas réécrire** : les calculs et leurs tests sont repris tels quels, avec les valeurs de contrôle de l’annexe C. Tu adaptes seulement les chemins, les imports, le registre et les textes. Si un test recopié échoue, cherche la cause (`superpowers:systematic-debugging` si disponible) au lieu d’ajuster la valeur attendue.
- **Pas de démo vedette** sur l’accueil : les fichiers `featured-*` du projectile ne sont pas repris, sauf si la page d’expérience en dépend (dis-le alors dans le rapport).
- **TDD** pour tout le nouveau : registre, adresses, page Physique, menu, fil d’Ariane, accueil, métadonnées, sitemap, contrôles de `smoke`.

### 3. Comportements

#### 3.1 Registre et adresses
- Un registre des expériences (modèle : `src/demos/registry.ts` du portfolio) : identifiant, catégorie (`physics`), nom d’adresse par langue, état publié. Projectile : `projectile` / `projectile` ; pendule : `pendule-de-newton` / `newtons-cradle`.
- La catégorie Physique est publiée dans `src/i18n/published.ts`, l’Informatique ne l’est pas.
- Pages : `src/app/[lang]/[section]/page.tsx` rend désormais la page Confidentialité **ou** la page de catégorie ; nouvelle route `src/app/[lang]/[section]/[experiment]/page.tsx`, avec `generateStaticParams` tiré du registre (seulement les expériences publiées de la catégorie, chacune avec le nom d’adresse de sa langue) et `dynamicParams = false`.
- `pathInLocale` : `/fr/physique/pendule-de-newton` ↔ `/en/physics/newtons-cradle`, `/fr/physique` ↔ `/en/physics`. Tests.
- Tests sur `out/` : existent `fr/physique.html`, `en/physics.html`, `fr/physique/projectile.html`, `en/physics/projectile.html`, `fr/physique/pendule-de-newton.html`, `en/physics/newtons-cradle.html` ; n’existent pas `en/physics/pendule-de-newton.html`, `fr/physique/newtons-cradle.html`, `fr/informatique.html`, `en/computing.html`.

#### 3.2 Code des expériences
- Recopie `src/demos/projectile/`, `src/demos/newtons-cradle/`, `src/demos/demo-figure.tsx` et leurs tests, et le sous-ensemble grec de JetBrains Mono (fichier, licence déjà présente, déclaration dans `src/design/fonts.ts`, chargé seulement sur les pages d’expérience ; test).
- Chargement à la demande (import dynamique), comme dans le portfolio. Test sur `out/` : le JavaScript référencé par `fr.html` et `fr/physique.html` ne contient pas le code des simulations (par exemple, aucune chaîne propre aux fichiers `physics.ts` ou `motion.ts`) ; celui de `fr/physique/projectile.html`, si.
- Le pendule garde son bouton Pause / Reprendre et le ralenti coché par défaut avec `prefers-reduced-motion` (cahier, 4.1). L’animation du projectile dure 3 s au plus et ne boucle pas.

#### 3.3 Page d’expérience (gabarit du cahier, section 3)
Dans cet ordre : fil d’Ariane ; en-tête de page (titre, introduction ; la mention « Au programme de… » reste **masquée**, la classe manque : `TODO(Jospin)` dans le code, rien de visible) ; la simulation ; les équations (projectile) ou les lois (pendule) ; les hypothèses ; « À essayer » (explications repliables) ; « Pour aller plus loin » (liste des sources de l’annexe C, liens, « (en anglais) » seulement sur les pages françaises) ; lien « Voir mon portfolio ».
- Métadonnées comme les autres pages (titre de l’onglet de l’annexe C, description, canonique, hreflang, Open Graph, image de partage 1200 × 630 générée au build) et données structurées `BreadcrumbList` (Le Labo › Physique › titre), égales au fil d’Ariane visible. Tests.
- Tests de textes sur le modèle de `texts.test.ts` : chaque chaîne des nouvelles clés se trouve, mot pour mot, dans la partie de l’annexe C qui la concerne (C.1, C.2 français, C.2 English, C.3 français, C.3 English).

#### 3.4 Accueil (annexe B.2)
- Supprime le bloc provisoire (`temporary-demos.tsx`, ses textes, ses tests) : c’est ce qui fait repasser au vert les six tests de l’étape 1.4.
- Ajoute, juste après l’introduction et avant « Comment ça marche », la section « Physique » / « Physics » : titre `h2`, une `Card` par expérience publiée (titre `h3`, texte, figure décorative `DemoFigure`, lien « Ouvrir l’expérience »), puis le lien « Toutes les expériences de physique » vers la page Physique.
- Les cartes sont produites à partir du registre : une expérience non publiée n’y apparaît pas (test).

#### 3.5 Page Physique (annexe C.1)
- Fil d’Ariane « Le Labo › Physique » ; en-tête de page (titre, introduction) ; une carte par expérience publiée (mêmes cartes que l’accueil). Métadonnées, image de partage, `BreadcrumbList`. Tests.

#### 3.6 Menu (cahier, section 5)
- Barre : entrée « Physique » / « Physics » dans un `nav` nommé « Menu principal » / « Main menu ». Style de page courante sur la page Physique et ses expériences ; `aria-current="page"` **seulement** sur la page Physique. Le sélecteur de langue mène à la même page dans l’autre langue.
- Sous 480 px, le menu passe sur une seconde ligne de la barre. Aucun défilement horizontal de 360 à 1920 px, avec et sans JavaScript.

#### 3.7 SEO
- `sitemap.xml` : 10 adresses (accueil, Confidentialité, Physique, deux expériences, dans les deux langues), avec leurs équivalents hreflang. Images de partage des 6 nouvelles pages. Tests sur `out/`.

#### 3.8 Mesure d’audience : contrôle dans `smoke`
- `smoke` vérifie qu’aucune page publiée ne contient `cloudflareinsights` tant que `webAnalyticsToken` vaut `null` (et exactement un extrait le jour où il y a un jeton). Pour ce contrôle, `smoke` envoie un `User-Agent` de navigateur et `Accept: text/html` : l’injection automatique de Cloudflare n’a lieu que sur ce genre de requête (cahier, section 6). Tests du script.

#### 3.9 Documents
- `docs/maintenance.md` : « Ajouter une expérience » (registre, textes dans le cahier, tests, sources) ; la règle Cloudflare « Labo : pas de mesure automatique » (où elle se trouve, pourquoi ne pas la supprimer).
- `docs/design-system.md` : `Breadcrumb`, `DemoFigure`, le menu, et le bouton Pause du pendule passent dans les composants présents dans le Labo.

### 4. Hors périmètre
Aucune modification du portfolio. Pas de jeton Web Analytics. Pas de page Informatique. Pas de démo interactive sur l’accueil. Ne change ni les calculs ni les valeurs de contrôle.

### 5. Vérifications et rapport de la partie 1
1. `npm run check` et `npm run test:integration` réussis.
2. `npm run preview`, puis `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis. Si un lien de source (par exemple le DOI) est refusé aux outils automatiques (403) alors qu’il est correct, ne change pas la source : signale-le dans le rapport.
3. Dans le navigateur, sur `npm run preview` :
   - projectile : lancer, garder un tir, comparer, effacer, Terre, Lune et Mars ;
   - pendule : lâcher 1 puis 2 billes, Pause, Reprendre, ralenti, e = 0,8 ;
   - avec `prefers-reduced-motion` (émulation dans les outils de développement) ;
   - 360, 768, 1280 et 1920 px ; thèmes sombre et clair ; clavier ; sans JavaScript ;
   - aucune erreur dans la console (CSP comprise).
4. Arrête tous tes serveurs ; aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. N’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`, plus : la liste des fichiers repris du portfolio et ce qui y a changé ; les liens de sources vérifiés et leur statut.

---

## PARTIE 2 — publier (seulement quand Jospin écrit « Partie 2 »)

Préalables confirmés par Jospin : partie 1 fusionnée dans `main` (en squash) ; `npx wrangler whoami` montre son compte.

1. `git switch main`, `git pull`, `npm ci`, `npm run check`.
2. `npm run deploy`. Note l’identifiant de la version.
3. `npm run smoke -- https://lab.cabrelfosso.com` (avec le contrôle 3.8 : aucune trace de `cloudflareinsights`) et `npm run linkcheck -- https://lab.cabrelfosso.com`.
4. Demande à Jospin :
   - PageSpeed Insights mobile sur `https://lab.cabrelfosso.com/fr/physique/projectile` et `https://lab.cabrelfosso.com/en/physics/newtons-cradle` (au moins 95 dans les quatre catégories) ;
   - d’essayer les deux expériences sur son téléphone ;
   - d’envoyer le sitemap à la Search Console : `https://lab.cabrelfosso.com/sitemap.xml` (étapes dans le rapport de Claude du projet « Labo »).
5. Rends compte : version déployée, résultats, retour arrière (`npx wrangler rollback` vers `1e6be4ff-bef4-4c93-9544-24b41eb72612`).

En cas d’échec : arrête-toi, ne tente aucun contournement en production, et rends compte.
