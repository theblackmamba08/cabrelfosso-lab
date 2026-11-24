# Consigne L1 — Socle du Labo

Rédigée par Claude (projet claude.ai « Labo ») le 24 novembre 2026, pour Claude Code.

Cette consigne a **deux parties**. Exécute la **partie 1** maintenant. N’exécute la **partie 2** que lorsque Jospin te l’écrit explicitement (« Partie 2 »), après relecture et fusion de la partie 1.

## 0. Contexte

Le Labo (`lab.cabrelfosso.com`) est un site statique d’expériences interactives de physique et d’informatique, séparé du portfolio. Le dépôt public `theblackmamba08/cabrelfosso-lab` ne contient qu’un commit sur `main` : le fichier `LICENSE` (MIT), créé par Jospin sur GitHub. L1 pose le socle : outillage, identité visuelle, bilinguisme, accueil, Confidentialité, 404, SEO, Worker de la racine, CI ; puis la mise en ligne (partie 2). **Aucune expérience** à cette étape.

**Fichiers fournis par Jospin** (non commités) : `CLAUDE.md` à la racine du dépôt (règles permanentes, déjà lues au démarrage de la session) ; `.gitignore` à la racine ; `docs/a-integrer/cahier-des-charges.md` et `docs/a-integrer/l1-socle.md` (cette consigne).

**Source de vérité** : cahier des charges **version 0.2**, fourni dans `docs/a-integrer/cahier-des-charges.md`. Vérifie : ligne 3 « Version 0.2 », dernière ligne d’historique « Version 0.2 ». Sinon, arrête-toi et signale-le. Lis-le en entier ; sections clés : 2 (adresses, racine), 4 (stack, Cloudflare, en-têtes), 5 (identité), 6 (critères, mesure d’audience), 7 (flux, licences), annexe B (textes, à reprendre mot pour mot).

**Portfolio, en lecture seule** : `C:\dev\cabrelfosso-portfolio`. Tu y lis du code à recopier et à adapter. Tu n’y écris rien, tu n’y lances aucune commande `npm`, et aucune commande `git` autre que de lecture (`status`, `log`, `show`). Les fichiers utiles sont cités plus bas.

**Sécurité** : tu n’exécutes ni `wrangler login`, ni `wrangler deploy` dans la partie 1. Aucune clé secrète n’existe pour ce site ; le jeton Web Analytics est public.

**Règle générale** : avant d’écrire du code qui dépend d’une version d’outil, vérifie la documentation officielle actuelle et cite le lien dans ton rapport. Si un point de cette consigne contredit la documentation que tu lis, ne devine pas : choisis l’option la plus sûre, explique-la dans le rapport.

---

## PARTIE 1 — construire (branche, pas de pull request, pas de déploiement)

### 1. Préparation

1. La session tourne dans `C:\dev\cabrelfosso-lab` (C majuscule ; sinon, arrête-toi). `git log --oneline` montre un seul commit (LICENSE) ; `git status` ne montre que `.gitignore`, `CLAUDE.md` et `docs/a-integrer/`. Sinon, arrête-toi.
2. `node --version` : 22.12 ou plus.
3. Branche `etape/l1-socle`.
4. Premier commit, « L1 : CLAUDE.md, .gitignore, cahier des charges 0.2 et consigne » : `CLAUDE.md` et `.gitignore` tels quels ; `docs/a-integrer/cahier-des-charges.md` → `docs/cahier-des-charges.md`, `docs/a-integrer/l1-socle.md` → `docs/consignes/l1-socle.md` (fins de ligne LF), suppression de `docs/a-integrer/`.
5. Lis, dans le portfolio : `CLAUDE.md`, `docs/design-system.md`, `docs/maintenance.md`, la section 7 de `docs/cahier-des-charges.md`.
6. **Demande à Jospin le jeton du site Cloudflare Web Analytics** pour `lab.cabrelfosso.com` (tableau de bord Cloudflare → Web Analytics → ajouter le site → installation par extrait JavaScript ; le jeton est la valeur `token` de l’attribut `data-cf-beacon`). Il est public : tu peux l’écrire dans le dépôt. S’il ne l’a pas encore, continue et laisse `TODO(Jospin)` (section 3.12).

### 2. Outillage (recopié du portfolio, adapté)

**Dépendances** (vérifie sur npm le jour même ; si un correctif plus récent existe dans la même version mineure, prends-le et note-le) :
- `next` 16.4.6, `react` et `react-dom` 19.3.1, `eslint-config-next` 16.4.6 : versions exactes ;
- `typescript` ~5.9.3 (**pas** TypeScript 7), `eslint` ^9 (**pas** ESLint 10), `tailwindcss` ^4.3, `vitest` ^5.1, `wrangler` ^4.167, `@types/node` ^22, `@types/react`, `@types/react-dom` ;
- intégration de Tailwind : la même que le portfolio (`next.config.ts`, règle Turbopack `@tailwindcss/turbopack`), **après** vérification dans la documentation actuelle de Tailwind pour Next.js ; si elle a changé, suis la documentation et explique ;
- **aucun** `@opennextjs/cloudflare`, **aucun** `vinext` (cahier, section 4).

**Scripts `package.json`** : `dev`, `build` (`next build`, sortie `out/`), `typecheck` (`next typegen && tsc --noEmit`), `lint`, `test`, `test:watch`, `check` (typecheck, lint, tests unitaires, build), `test:integration`, `smoke`, `linkcheck`, `preview` (build puis `wrangler dev`), `deploy` (build puis `wrangler deploy`), `prepare` (hooks). `engines.node` : `>=22.12.0`.

**Fichiers à recopier et adapter** depuis le portfolio : `.gitattributes`, `tsconfig.json`, `eslint.config.mjs` (sans les dossiers OpenNext), `vitest.config.mts`, `.githooks/pre-push`, `scripts/pre-push.mjs`, `scripts/install-hooks.mjs`, `scripts/lib/` (`pre-push-policy`, `install-hooks`, `process-tree`, `integration-run`, `linkcheck`, `smoke`) **avec leurs tests**, `.github/workflows/ci.yml` (job `check` : `npm ci`, `npm run check`, `npm run test:integration`).

**Documents du dépôt** :
- `.gitignore` : déjà fourni. Ajoute une ligne seulement si un outil produit un fichier qui ne doit pas être versionné (par exemple un fichier de configuration temporaire des tests d’intégration), et dis-le dans le rapport.
- `CLAUDE.md` : déjà fourni. Remplis seulement la section « Commandes » quand les scripts existent (sur le modèle du portfolio), et ajoute la ligne `@AGENTS.md` en tête une fois que Next.js a généré `AGENTS.md` (garde ce dernier tel quel). Ne change aucune autre règle ; si l’une te semble fausse, signale-le dans le rapport.
- `README.md` : ce qu’est le Labo, commandes, déploiement, licences.
- `LICENSE-CONTENT.md` : les textes du site (`src/i18n/messages/`, `src/content/`) et les figures des expériences (illustrations, images, y compris les figures que le code dessine) sont sous licence CC BY 4.0 (lien vers `https://creativecommons.org/licenses/by/4.0/`), avec l’attribution demandée : « Cabrel FOSSO, Le Labo, https://lab.cabrelfosso.com, CC BY 4.0 ». Le code reste sous MIT (`LICENSE`) ; les polices, sous SIL OFL 1.1 (`src/fonts/`). Ne recopie pas le texte juridique complet de la licence.
- `docs/design-system.md` : copie de celui du portfolio, précédée d’une note « Recopié du portfolio le … (étape L1) » et d’un tableau des composants **présents** dans le Labo ; retire ou marque « absent du Labo » ce qui n’existe pas ici (menu, WhatsApp, bandeau, frise, accueil animé…).
- `docs/maintenance.md` : court guide sur le modèle du portfolio (modifier un texte, ajouter une page, couleurs, jeton Web Analytics, déploiement, retour arrière, inventaire : Worker `cabrelfosso-lab`, domaine `lab.cabrelfosso.com`, Web Analytics).

### 3. Comportements (en TDD : un test qui échoue, le code minimal, le nettoyage)

#### 3.1 Langues et adresses
- `src/i18n/config.ts` : comme le portfolio (`fr`, `en`, défaut `fr`, `localeNames`, `htmlLang`, `ogLocale`).
- `src/i18n/routes.ts` : table unique des pages, `home` (`""`), `privacy` (`confidentialite` / `privacy`), `physics` (`physique` / `physics`), `computing` (`informatique` / `computing`). `src/i18n/published.ts` : seules `home` et `privacy` sont publiées à L1.
- Fonctions pures testées : `localizedPath`, `alternatePaths`, `pathInLocale` (pour le sélecteur : `/fr/confidentialite` ↔ `/en/privacy` ; adresse inconnue → accueil), et la liste des paramètres statiques des sections (seulement les pages publiées, chacune avec le nom d’adresse de **sa** langue).
- Structure : `src/app/[lang]/layout.tsx` (mise en page racine par langue, `dynamicParams = false`), `src/app/[lang]/page.tsx` (accueil), `src/app/[lang]/[section]/page.tsx` (`generateStaticParams` à partir de la table, `dynamicParams = false` ; rend la page Confidentialité ; prêt à rendre une catégorie en L2). Aucun dossier au nom traduit écrit à la main.
- `next.config.ts` : `output: 'export'`, `trailingSlash: false`, `poweredByHeader: false`, rien qui soit incompatible avec l’export statique (pas de `headers`, `redirects`, `rewrites`).
- Tests sur le résultat du build (`out/`) : `fr.html`, `en.html`, `fr/confidentialite.html`, `en/privacy.html`, `404.html` existent ; `en/confidentialite.html`, `fr/privacy.html`, `fr/physique.html` n’existent pas.

#### 3.2 Page 404
- Une seule page, bilingue (annexe B.1), au design du site, `noindex`, liens vers `/fr` et `/en`, sans erreur d’hydratation. Le portfolio utilise `global-not-found` (option expérimentale `globalNotFound`) : vérifie dans la documentation de Next.js 16.4 et par le build s’il produit bien `out/404.html` avec l’export statique. Sinon, trouve la solution documentée et explique-la.

#### 3.3 Worker de la racine
- `src/i18n/negotiate.ts`, fonction pure `chooseLocale(acceptLanguage: string | null): Locale` : lit les langues et leurs poids `q` (1 par défaut) ; garde le français et l’anglais (sous-étiquette principale, sans tenir compte de la casse) ; ignore les entrées de poids 0 ou illisible ; renvoie celle de plus grand poids, la première citée en cas d’égalité ; `fr` si aucune. Valeurs de contrôle (au moins) :

  | `Accept-Language` | Résultat |
  | --- | --- |
  | absent ou vide | fr |
  | `en-US,en;q=0.9` | en |
  | `fr-CM,fr;q=0.9,en;q=0.8` | fr |
  | `en-GB;q=0.5, fr;q=0.8` | fr |
  | `de-DE,en;q=0.7` | en |
  | `de-DE` | fr |
  | `*` | fr |
  | `EN` | en |
  | `en;q=0` | fr |
  | `en;q=abc, fr;q=0.1` | fr |
  | `en, fr` | en |

- `worker/index.ts` (hors de `src/app`) : `GET` ou `HEAD` sur `/` → 302 vers `/<langue>` (chaîne de requête conservée), avec `Vary: Accept-Language`, `Cache-Control: no-store` et les en-têtes de sécurité (3.4) ; autre méthode sur `/` → 405 avec `Allow: GET, HEAD` ; toute autre adresse → `env.ASSETS.fetch(request)`. Tests unitaires avec une fausse liaison `ASSETS`. Types des liaisons : par la méthode documentée de Wrangler, citée dans le rapport.
- `wrangler.jsonc` (commentaires avec les liens de documentation) : `name: "cabrelfosso-lab"`, `main: "worker/index.ts"`, `compatibility_date` du jour, `assets: { directory: "./out", binding: "ASSETS", not_found_handling: "404-page", html_handling: "auto-trailing-slash", run_worker_first: ["/"] }`, `routes: [{ pattern: "lab.cabrelfosso.com", custom_domain: true }]`, `workers_dev: false`, `preview_urls: false`, `observability: { enabled: false }`. Un test vérifie ces valeurs (modèle : `scripts/wrangler-config.test.ts` du portfolio).

#### 3.4 En-têtes de sécurité
- Une seule source, `src/lib/security-headers.ts` : la liste et la politique de sécurité du contenu de la section 4 du cahier, mot pour mot. Le Worker l’importe ; `public/_headers` en contient exactement la même liste pour `/*`, plus le cache long de `/_next/static/*` ; un test compare les deux (modèle : `security-headers.test.ts` du portfolio).

#### 3.5 Design system et thème
- Recopie depuis le portfolio : `src/app/globals.css` (jetons, thèmes, motif millimétré, mouvement, focus ; sans les règles des composants absents du Labo), `src/fonts/` (fichiers et licences), `src/design/` (`fonts.ts`, `theme.ts` **sans** le bandeau d’actualité, `contrast.ts`) avec les tests `contrast`, `motif`, `motion-css`, `theme`, `fonts` ; composants `ui/button`, `ui/card`, `ui/badge`, `ui/section-heading`, `ui/reveal` (avec `reveal-observer`, `stagger`), `ui/page-hero` et leurs tests ; `theme-toggle`, `language-switcher` (adapté à la table du Labo) ; `public/icon.svg`, `favicon.ico`, `apple-touch-icon.png`.
- Thème sombre par défaut, sans lire la préférence du système ; le choix est enregistré sous la clé `theme`. Script de `<head>` avant l’affichage (classe `js`, `data-theme`), comme le portfolio.
- Le Labo n’a aucune animation en boucle à L1 : pas de bouton Pause, pas de `data-loop`. `prefers-reduced-motion` coupe les transitions.

#### 3.6 En-tête
- Barre flottante du portfolio, sans menu : « Le Labo » / « The Lab » en `font-heading`, puis « Cabrel FOSSO » en `text-ink-muted`, le tout dans un lien vers l’accueil de la langue (nom accessible complet). Sous 480 px, « Cabrel FOSSO » est masqué visuellement mais reste dans le nom accessible. À droite : sélecteur FR/EN, bouton de thème, `ButtonLink` « Portfolio » (contour) vers `https://cabrelfosso.com/fr` ou `/en`. Lien d’évitement « Aller au contenu ».
- Tests : tient sur une ligne de 360 à 1920 px sans défilement horizontal (vérifié dans le navigateur, 3.13) ; noms accessibles ; liens corrects par langue.

#### 3.7 Pied de page
- Annexe B.1 : liens « Mon portfolio », « Code source sur GitHub », « Confidentialité » ; ligne des licences avec leurs deux liens ; « © {année} Cabrel FOSSO ». Marge basse comme le portfolio.

#### 3.8 Accueil
- Textes de l’annexe B.2, mot pour mot : en-tête de page (étiquette, titre `text-display` avec « en manipulant » / « hands-on » en `text-highlight`, introduction), section « Comment ça marche » (trois `Card` avec `h3`), section « Pour qui ? » (liste), bloc provisoire (`Card` avec le lien vers les démos du portfolio), signature et bouton « Voir mon portfolio ».
- Le bloc provisoire vit dans un composant à part, marqué dans le code « Retiré à l’étape L2 (cahier, section 8) ».
- Données structurées `WebSite` (nom du site, adresse canonique, `inLanguage`, auteur `Person` « Cabrel FOSSO » avec l’adresse `https://cabrelfosso.com`) ; test.

#### 3.9 Confidentialité
- Textes de l’annexe B.3, mot pour mot, en liste de définitions comme sur le portfolio ; date de dernière mise à jour en toutes lettres (date du jour de cette étape), dans une constante unique, au même format que le portfolio (`src/content/privacy.ts` du portfolio).

#### 3.10 Métadonnées et images de partage
- `pageMetadata` sur le modèle du portfolio : titre, description, URL canonique absolue sur `https://lab.cabrelfosso.com`, hreflang `fr`, `en`, `x-default` (= version française), Open Graph (nom du site de l’annexe B.1, `og:locale`), Twitter `summary_large_image`, `metadataBase`.
- Une image de partage PNG 1200 × 630 par page publiée et par langue, générée au build (modèle : `src/app/og/[...path]/route.tsx` et `src/lib/og/share-image.tsx` du portfolio), gestionnaire `dynamic = 'force-static'` avec ses paramètres statiques. Test sur `out/` : les 4 fichiers existent, sont des PNG de 1200 × 630.

#### 3.11 Sitemap et robots
- `sitemap.xml` : les 4 adresses publiées, avec leurs équivalents hreflang ; `robots.txt` : tout autorisé, lien absolu vers le sitemap. Tests sur `out/`.

#### 3.12 Cloudflare Web Analytics
- `src/lib/analytics.ts` : `webAnalyticsToken` (le jeton fourni, ou `null` avec `TODO(Jospin): jeton Web Analytics`).
- Avec un jeton, chaque page (y compris la 404) contient, juste avant la fin de `<body>`, l’extrait officiel : `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>` (format à vérifier dans https://developers.cloudflare.com/web-analytics/faq/). Sans jeton, aucun extrait. Tests dans les deux cas.

#### 3.13 Tests d’intégration (`npm run test:integration`)
Build, puis le vrai Worker et les fichiers statiques servis par `wrangler dev` (port libre, processus arrêtés à la fin, Windows et Linux : modèles `scripts/integration.mjs` et `scripts/lib/integration-run.mjs` du portfolio). Vérifications au moins :
- `/` avec `Accept-Language: en-US,en;q=0.9` → 302 vers `/en` ; avec `fr-CM` puis sans en-tête → 302 vers `/fr` ; `/?a=1` → `/fr?a=1` ; `Vary` et `Cache-Control` présents ; `POST /` → 405 ;
- `/fr`, `/en`, `/fr/confidentialite`, `/en/privacy` → 200, en-têtes de sécurité et CSP présents (preuve que `_headers` s’applique) ;
- `/fr/` → redirection vers `/fr` ;
- `/n-importe-quoi`, `/fr/physique`, `/en/confidentialite` → 404 avec la page bilingue ;
- `/sitemap.xml`, `/robots.txt`, `/og/fr.png` (ou l’adresse retenue) → 200 avec le bon type ;
- aucun « TODO » dans le HTML servi.

Si `wrangler dev` n’applique pas `_headers` ou `not_found_handling` comme la production, dis-le dans le rapport, avec la documentation qui l’explique.

#### 3.14 Scripts de contrôle
- `npm run smoke -- <adresse>` (adapté du portfolio, sans dépendance) : toutes les adresses du sitemap en 200, redirection de `/` selon la langue, 404 bilingue, `robots.txt`, images de partage, en-têtes et CSP. Il n’envoie rien d’autre que des `GET` et `HEAD`, plus le `POST /` du test 405.
- `npm run linkcheck -- <adresse>` : recopié du portfolio ; liens internes et ancres cassés = échec ; liens externes listés.

### 4. Hors périmètre de L1
Aucune expérience, aucune page de catégorie, aucun Web Worker ni WebAssembly, pas de menu, pas de bouton WhatsApp, pas de bandeau d’actualité, pas de bouton de retour en haut, pas de bouton Pause. Ne modifie rien dans le portfolio.

### 5. Vérifications et rapport de la partie 1
1. `npm run check` et `npm run test:integration` réussis ; `npm run smoke -- http://localhost:8787` et `npm run linkcheck -- http://localhost:8787` réussis sur `npm run preview` (adapte le port).
2. Dans un navigateur, sur `npm run preview` : `/fr`, `/en`, Confidentialité, une 404 ; à 360, 768, 1280 et 1920 px ; thèmes sombre et clair ; navigation au clavier (focus visible) ; sans JavaScript ; aucune erreur dans la console (CSP comprise).
3. Lighthouse mobile en local sur `/fr` et `/en` : note les quatre scores ; explique tout score sous 95 (par exemple une URL canonique qui pointe vers le domaine de production).
4. Arrête tous les serveurs que tu as lancés ; vérifie qu’aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par toi ne reste ouvert.
5. Pousse la branche. Ne fusionne pas, n’ouvre pas la pull request.
6. Rapport de `CLAUDE.md`, plus : versions installées ; liens de documentation consultés ; contenu final de `wrangler.jsonc` et de `public/_headers` ; solution retenue pour la page 404 ; scores Lighthouse ; jeton Web Analytics présent ou non ; ce que Jospin doit faire avant la partie 2.

### À faire par Jospin entre les deux parties
1. Ouvrir la pull request, attendre la CI verte, coller le rapport à Claude (projet « Labo »), puis fusionner en squash.
2. Après cette première exécution de la CI, activer un ruleset sur `main` (Settings → Rules → Rulesets) : pull request obligatoire, statut `check` obligatoire, envoi forcé et suppression interdits.
3. Cloudflare, DNS de `cabrelfosso.com` : vérifier qu’aucun enregistrement n’existe déjà pour `lab`.
4. `npx wrangler login` dans PowerShell, s’il n’est pas déjà connecté.

---

## PARTIE 2 — publier (seulement quand Jospin écrit « Partie 2 »)

Préalables confirmés par Jospin : partie 1 fusionnée dans `main` ; jeton Web Analytics présent dans `main` (sinon, il décide de publier quand même) ; `npx wrangler login` fait par lui.

1. `git switch main`, `git pull`, `npm ci`, `npm run check`. `npx wrangler whoami` : compte de Jospin.
2. `npm run deploy`. Note l’identifiant de la version déployée.
3. Attends que le certificat du domaine soit actif (quelques minutes), puis `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.
4. Demande à Jospin : PageSpeed Insights mobile sur `https://lab.cabrelfosso.com/fr` et `/en` (≥ 95 dans les quatre catégories) ; ouvrir `https://lab.cabrelfosso.com/` dans son navigateur ; vérifier, une heure plus tard, que Web Analytics compte des visites.
5. **N’envoie pas** le sitemap à la Search Console : c’est pour L2 (cahier, section 8).
6. Rends compte : version déployée, résultats des scripts, scores, et comment revenir en arrière (`npx wrangler rollback`).

En cas d’échec à n’importe quelle étape : arrête-toi, ne tente aucun contournement en production, et rends compte.
