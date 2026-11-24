# Le Labo de Cabrel FOSSO

Site bilingue (français / anglais) d’expériences interactives de physique et d’informatique, publié sur `lab.cabrelfosso.com`. On règle, on observe, on comprend les équations ou les algorithmes qui sont derrière. Il complète le portfolio [cabrelfosso.com](https://cabrelfosso.com/fr).

Le contenu, la structure et les choix de fond sont dans `docs/cahier-des-charges.md`, qui fait foi. Les règles de travail sont dans `CLAUDE.md`, le guide de maintenance dans `docs/maintenance.md`.

## Installation

Node.js **22.12 ou plus** et Git. Poste de développement : Windows 11 (dépôt dans `C:\dev\cabrelfosso-lab`, avec le C majuscule) ; la CI tourne sous Ubuntu. Tous les scripts fonctionnent sur les deux.

```powershell
git clone https://github.com/theblackmamba08/cabrelfosso-lab.git
cd cabrelfosso-lab
npm ci
```

`npm ci` active aussi le hook `pre-push`, qui refuse tout envoi vers `main`. Arrêter `npm run dev` et `npm run preview` avant `npm ci`.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement sur http://localhost:3000/fr (pas de redirection de `/` : elle est faite par le Worker) |
| `npm run build` | Construit le site statique dans `out/` |
| `npm run preview` | Construit, puis sert le site avec le vrai Worker sur http://localhost:8787 |
| `npm test` | Tests unitaires (Vitest) : `src/`, `scripts/`, `worker/` |
| `npm run test:integration` | Construit, sert le site avec `wrangler dev` sur un port libre, teste `out/` et les adresses réelles, puis arrête tout (`PORT` impose un port) |
| `npm run check` | Types, lint, tests unitaires, build |
| `npm run smoke -- <adresse>` | Vérifie un site servi : sitemap, racine, 404, images de partage, en-têtes et CSP |
| `npm run linkcheck -- <adresse>` | Vérifie les liens internes et les ancres ; liste les liens externes |
| `npm run cf-typegen` | Régénère `worker/worker-configuration.d.ts` après un changement de `wrangler.jsonc` ou de Wrangler |
| `npm run deploy` | Construit et publie sur Cloudflare (voir plus bas) |

## Déploiement

Depuis `main` à jour seulement, sur le poste de Jospin, connecté par `npx wrangler login` :

```powershell
git switch main
git pull
npm ci
npm run check
npm run deploy
npm run smoke -- https://lab.cabrelfosso.com
npm run linkcheck -- https://lab.cabrelfosso.com
```

Retour arrière : `npx wrangler rollback`.

## Comment ça marche

- **Export statique** : `next build` produit toutes les pages dans `out/` (`output: 'export'`). Pas d’adaptateur.
- **Adresses traduites** : `src/i18n/routes.ts` est la table unique ; `src/i18n/published.ts` dit quelles pages existent. Le segment `[section]` en tire ses paramètres statiques.
- **Racine `/`** : `worker/index.ts` redirige vers `/fr` ou `/en` selon `Accept-Language`. Toutes les autres adresses sont des fichiers statiques.
- **En-têtes de sécurité** : `src/lib/security-headers.ts`, importé par le Worker et recopié dans `public/_headers` (un test compare les deux).

## Licences

- Code : MIT (`LICENSE`).
- Textes du site et figures des expériences : CC BY 4.0 (`LICENSE-CONTENT.md`).
- Polices (`src/fonts/`) : SIL Open Font License 1.1.
