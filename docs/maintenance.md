# Guide de maintenance

Le cahier des charges (`docs/cahier-des-charges.md`) dit **ce que le site doit être**. Ce guide dit **où le changer et quoi faire ensuite**. Vérifié dans le dépôt le 24 novembre 2026 (étape L1). À mettre à jour quand une étape déplace un de ces fichiers.

## 1. Règle d’or

Le cahier d’abord, puis le code, puis les tests. Un texte changé seulement dans le code fait échouer `npm run check` : `src/i18n/messages/texts.test.ts` le compare à l’annexe B. Chaque changement suit le flux Git de `CLAUDE.md`.

## 2. Je veux… → où → et ensuite

| Je veux… | Où | Et ensuite |
| --- | --- | --- |
| Modifier un texte | Cahier (annexe B), puis `src/i18n/messages/fr.ts` et `en.ts` (mêmes clés) | Typographie vérifiée par `src/content/typography.test.ts`. Pour la page Confidentialité, changer aussi la date : `privacyLastUpdated` dans `src/content/privacy.ts` (et son test) |
| Ajouter une page | Son nom dans chaque langue : `src/i18n/routes.ts`. La publier : `publishedPages` dans `src/i18n/published.ts`. Ses textes (`title`, `metaTitle`, `metaDescription`) : une clé du même nom dans les messages. Son composant : table `pages` de `src/app/[lang]/[section]/page.tsx` | Sitemap, hreflang, URL canonique, image de partage et sélecteur de langue suivent seuls. Adapter les tests qui fixent la liste des pages publiées (`published.test.ts`, `crawl.test.ts`, `tests/integration/`) |
| Changer l’adresse d’une page | Interdit : les adresses publiées ne changent plus (cahier, section 2) | |
| Retirer le bloc provisoire de l’accueil (étape L2) | `src/components/temporary-demos.tsx`, son appel dans `home-page.tsx`, la clé `home.temporary` des messages | |
| Modifier les couleurs, les polices, le motif | `src/app/globals.css`, `src/design/fonts.ts`. Référence : `docs/design-system.md` | Contrastes vérifiés par `src/design/contrast.test.ts` et `motif.test.ts` |
| Mettre le jeton Cloudflare Web Analytics | `src/lib/analytics.ts` : `webAnalyticsToken` (valeur publique ; `null` : aucun extrait) | Redéployer. Les tests vérifient que chaque page porte l’extrait dès qu’il y a un jeton |
| Changer un en-tête de sécurité | `src/lib/security-headers.ts` et `public/_headers` (et la section 4 du cahier) | `security-headers.test.ts` compare les trois |
| Changer la configuration Cloudflare | `wrangler.jsonc`, puis `npm run cf-typegen` | `scripts/wrangler-config.test.ts` vérifie les valeurs |

## 3. Déploiement et retour arrière

Depuis `main` à jour seulement : `npm ci`, `npm run check`, `npm run deploy` (noter l’identifiant de version), puis `npm run smoke -- https://lab.cabrelfosso.com` et `npm run linkcheck -- https://lab.cabrelfosso.com`.

Retour arrière : `npx wrangler rollback <identifiant de la version précédente>` (liste : `npx wrangler deployments list`).

Le sitemap n’est pas envoyé à la Search Console avant l’étape L2 (cahier, section 8).

## 4. Inventaire

| Élément | Où | Rôle |
| --- | --- | --- |
| Worker `cabrelfosso-lab` | Cloudflare, Workers & Pages | Fichiers statiques de `out/` ; code exécuté pour `/` seulement. Adresses `workers.dev` et d’aperçu désactivées, aucun journal |
| Domaine `lab.cabrelfosso.com` | Domaine personnalisé du Worker | Enregistrement DNS et certificat créés par Cloudflare au premier déploiement |
| Mesure d’audience | Cloudflare Web Analytics, site `lab.cabrelfosso.com` | Extrait JavaScript, sans cookie |
| Dépôt `theblackmamba08/cabrelfosso-lab` | GitHub, public | Code (MIT), contenus (CC BY 4.0) |
