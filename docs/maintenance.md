# Guide de maintenance

Le cahier des charges (`docs/cahier-des-charges.md`) dit **ce que le site doit être**. Ce guide dit **où le changer et quoi faire ensuite**. Vérifié dans le dépôt le 25 novembre 2026 (étape L3). À mettre à jour quand une étape déplace un de ces fichiers.

## 1. Règle d’or

Le cahier d’abord, puis le code, puis les tests. Un texte changé seulement dans le code fait échouer `npm run check` : `src/i18n/messages/texts.test.ts` et `demos.test.ts` le comparent aux annexes B, C et D. Chaque changement suit le flux Git de `CLAUDE.md`.

## 2. Je veux… → où → et ensuite

| Je veux… | Où | Et ensuite |
| --- | --- | --- |
| Modifier un texte | Cahier (annexes B, C et D), puis `src/i18n/messages/fr.ts` et `en.ts` (mêmes clés) | Typographie vérifiée par `src/content/typography.test.ts`. Pour la page Confidentialité, changer aussi la date : `privacyLastUpdated` dans `src/content/privacy.ts` (et son test) |
| Ajouter une page | Son nom dans chaque langue : `src/i18n/routes.ts`. La publier : `publishedKeys` dans `src/i18n/published.ts`. Ses textes (`title`, `metaTitle`, `metaDescription`) : une clé du même nom dans les messages. Son composant : table `pages` de `src/app/[lang]/[section]/page.tsx` | Sitemap, hreflang, URL canonique, image de partage et sélecteur de langue suivent seuls. Adapter les tests qui fixent la liste des pages publiées (`published.test.ts`, `crawl.test.ts`, `tests/integration/`) |
| Changer l’adresse d’une page | Interdit : les adresses publiées ne changent plus (cahier, section 2) | |
| Ajouter une expérience | 1. Cahier : textes, valeurs de contrôle, sources vérifiées et tableau « Affirmations et sources » (modèle : annexe C). 2. `src/demos/registry.ts` (identifiant, catégorie, nom d’adresse par langue ; `published: true` quand la page est prête). 3. `src/demos/<identifiant>/` : calculs purs et leurs tests (valeurs de contrôle du cahier), figure, composant chargé par import dynamique (`…-lazy.tsx`). 4. Textes : clé `demos` des messages (`card`, `sources` comprises). 5. Brancher : `Simulation` dans `src/components/experiment-page.tsx`, figure de la carte dans `src/demos/demo-figure.tsx` | Adresse, cartes de l’accueil et de la catégorie, sitemap, hreflang, image de partage, fil d’Ariane et sélecteur de langue suivent seuls. Adapter les tests qui fixent la liste des pages et `demos.test.ts`. Première expérience d’une catégorie : publier aussi la catégorie (`published.ts`), ses textes (`home`, `nav` et page de catégorie des messages) et sa page (table `pages` de `[section]/page.tsx`) ; le menu et l’accueil suivent |
| Ajouter une expérience d’informatique | Comme ci-dessus, catégorie `computing`. Calcul long : un Web Worker, `src/demos/<identifiant>/….worker.ts`, créé par `new Worker(new URL("./….worker.ts", import.meta.url), { type: "module" })` (modèle : `three-sat/`). Le dialogue avec le Worker (`curve-runner.ts`) et l’état (`run-state.ts`) sont testés sans navigateur | Worker servi par le site : la CSP (`worker-src 'self'`) ne change pas ; `tests/integration/` vérifie ses fichiers. Turbopack publie aussi une copie du `.ts` dans `_next/static/media/` : sans effet, mais c’est pourquoi `tsconfig.json` exclut `out` |
| Changer le modèle de 3-SAT (annexe D.2) | Jamais sans nouvelle version du cahier : le hasard, l’ordre des clauses et le choix de la variable fixent les valeurs de contrôle de D.3 | Régénérer les valeurs avec une implantation de référence indépendante du code du site (hasard en C des auteurs, deux solveurs concordants), les écrire dans le cahier, puis adapter `src/demos/three-sat/*.test.*` (les courbes de référence y sont lues dans le cahier). Ne jamais ajuster une valeur attendue sur la sortie du site. Les 2 080 énigmes sont vérifiées par `npm run test:integration` |
| Modifier les couleurs, les polices, le motif | `src/app/globals.css`, `src/design/fonts.ts`. Référence : `docs/design-system.md` | Contrastes vérifiés par `src/design/contrast.test.ts` et `motif.test.ts` |
| Mettre le jeton Cloudflare Web Analytics | `src/lib/analytics.ts` : `webAnalyticsToken` (valeur publique ; `null` : aucun extrait) | Le paragraphe « Mesure d’audience » de la page Confidentialité apparaît avec l’extrait, par la même condition (`isAnalyticsActive`). **Le jour où le jeton est ajouté ou retiré, changer aussi la date de la page** : `privacyLastUpdated` (`src/content/privacy.ts`) et ses tests. Puis redéployer. Les tests vérifient que chaque page porte l’extrait dès qu’il y a un jeton |
| Changer un en-tête de sécurité | `src/lib/security-headers.ts` et `public/_headers` (et la section 4 du cahier) | `security-headers.test.ts` compare les trois |
| Changer la configuration Cloudflare | `wrangler.jsonc`, puis `npm run cf-typegen` | `scripts/wrangler-config.test.ts` vérifie les valeurs |

## 3. Déploiement et retour arrière

Depuis `main` à jour seulement : `npm ci`, `npm run check`, `npm run deploy` (noter l’identifiant de version), puis `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.

Retour arrière : `npx wrangler rollback <identifiant de la version précédente>` (liste : `npx wrangler deployments list`).

Après l’ajout de pages, renvoyer le sitemap à la Search Console.

## 4. Fichier technique `/_not-found`

Next.js exporte `out/_not-found*`, une copie de la page 404 qui répond 200. On le garde : `out/404.html` se déclare lui-même comme la route `/_not-found` dans ses données internes, et le supprimer risquerait des erreurs dans le navigateur. Il porte `noindex`, aucun lien n’y mène et il n’est pas dans le sitemap (tests dans `tests/integration/`).

## 5. Règle Cloudflare « Labo : pas de mesure automatique »

Où : tableau de bord Cloudflare, zone `cabrelfosso.com`, Rules → Configuration Rules. Condition `http.host eq "lab.cabrelfosso.com"`, réglage « Disable Real User Monitoring (RUM) ». Créée par Jospin le 24 novembre 2026.

**Ne pas la supprimer** : l’installation automatique de Web Analytics du portfolio vaut pour toute la zone, et injectait le compteur du portfolio dans les pages du Labo, alors que la page Confidentialité n’en dit rien. La règle n’est pas dans le dépôt : `npm run smoke -- https://lab.cabrelfosso.com` vérifie son effet (aucun `cloudflareinsights` sans jeton). Le jour où le jeton est ajouté, vérifier qu’elle ne bloque pas aussi l’extrait manuel (cahier, section 6).

## 6. Inventaire

| Élément | Où | Rôle |
| --- | --- | --- |
| Worker `cabrelfosso-lab` | Cloudflare, Workers & Pages | Fichiers statiques de `out/` ; code exécuté pour `/` seulement. Adresses `workers.dev` et d’aperçu désactivées, aucun journal |
| Domaine `lab.cabrelfosso.com` | Domaine personnalisé du Worker | Enregistrement DNS et certificat créés par Cloudflare au premier déploiement |
| Mesure d’audience | Cloudflare Web Analytics, site `lab.cabrelfosso.com` | Extrait JavaScript, sans cookie |
| Dépôt `theblackmamba08/cabrelfosso-lab` | GitHub, public | Code (MIT), contenus (CC BY 4.0) |
