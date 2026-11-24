# CLAUDE.md — le Labo de Cabrel FOSSO

Ce fichier donne le contexte permanent du projet. Il est lu au début de chaque session.

## Le projet

Le Labo (`lab.cabrelfosso.com`) : site bilingue français/anglais d’expériences interactives de physique et d’informatique. On règle, on observe, on comprend les équations ou les algorithmes qui sont derrière. Il complète le portfolio `cabrelfosso.com` (vitrine professionnelle, dépôt séparé). Publics : élèves et étudiants, enseignants, chercheurs et directeurs de thèse.

## Sources de vérité

- `docs/cahier-des-charges.md` fait foi pour le contenu, la structure, la stack et l’état d’avancement. Avant son premier commit, sa copie est dans `docs/a-integrer/`. Lis les sections utiles avant chaque tâche.
- La consigne de la tâche est dans `docs/consignes/` (dans `docs/a-integrer/` avant son premier commit).
- Ne modifie le cahier que si la consigne le demande.
- En cas de conflit entre une consigne et le cahier, arrête-toi et signale-le dans ton rapport.
- **Portfolio en lecture seule** : `C:\dev\cabrelfosso-portfolio`. Tu peux y lire du code à recopier et à adapter. Tu n’y écris rien, tu n’y lances aucune commande `npm`, et aucune commande `git` autre que de lecture (`status`, `log`, `show`, `diff`).

## Règles de contenu (non négociables)

- N’invente jamais un chiffre, une date, une source, une citation, un résultat scientifique ou une information personnelle. Les textes du site viennent du cahier (annexes), mot pour mot.
- Information manquante : marqueur `TODO(Jospin): <ce qui manque>`, listé dans ton rapport. Aucun TODO ne doit être visible sur le site publié.
- Aucun texte de remplissage. Une section sans vrai contenu est masquée, pas remplie.
- Chaque affirmation scientifique d’une expérience s’appuie sur une source vérifiée et citée. Une expérience explique ; elle ne prétend jamais résoudre un problème ouvert. Des données inventées ou une illustration simplifiée sont présentées comme telles.
- Le site parle à la première personne (« mon portfolio ») et vouvoie le visiteur. Nom : « Le Labo » en français, « The Lab » en anglais.
- Français : apostrophe courbe (’) et espace insécable avant « : ; ! ? » et à l’intérieur des guillemets. Des tests le vérifient.
- L’anglais est rédigé naturellement, pas traduit mot à mot.

## Stack et contraintes techniques

- Next.js 16 (App Router), TypeScript 5.9 en mode strict (pas TypeScript 7), Tailwind CSS 4, ESLint 9, Vitest.
- **Export statique** (`output: 'export'`, sortie `out/`) : pas de `headers`, `redirects`, `rewrites`, `proxy` ni cookies dans Next.js ; routes dynamiques avec `generateStaticParams()` et `dynamicParams = false` ; gestionnaires de routes en `dynamic = 'force-static'`.
- **Cloudflare Workers, fichiers statiques, sans adaptateur** (ni OpenNext ni vinext). Un Worker ne s’exécute que pour l’adresse `/` (redirection selon la langue). En-têtes de sécurité par `public/_headers`, à partir d’une seule source dans le code.
- Calculs dans le navigateur ; calculs longs dans un Web Worker ; hasard à graine fixe. Figures en SVG, sans bibliothèque de graphique ni de physique. Rust/WebAssembly seulement à la demande de Jospin.
- Même identité visuelle que le portfolio (`docs/design-system.md`) ; toute couleur passe par un jeton.
- Avant d’écrire du code qui dépend d’une version d’outil, vérifie la documentation officielle actuelle et cite le lien dans ton rapport.

## Poste de développement

- Windows 11, PowerShell, Git for Windows, Node.js 22. La CI tourne sous Ubuntu.
- Tout script du dépôt doit fonctionner sous Windows ET sous Linux. Pas de commande propre à Linux (`setsid`, `kill -- -PID`…). Préférer des scripts Node.js (`.mjs`).
- Pas de renommage qui ne change que la casse d’un fichier.
- Le projet s’ouvre en `C:\dev\cabrelfosso-lab`, avec le C majuscule (depuis `c:\…`, le build peut échouer). Si la session tourne en `c:\…`, s’arrêter et le signaler.
- `npm run dev` et `npm run preview` doivent être arrêtés avant `npm ci` (sinon EPERM : fichiers verrouillés).
- Claude Code arrête lui-même tous les serveurs qu’il a lancés avant de rendre son rapport, et vérifie qu’aucun processus `node`, `wrangler`, `esbuild` ou `workerd` lancé par lui ne reste ouvert. S’il ne peut pas, il le dit dans le rapport avec la liste des processus.

## Commandes

(À compléter par l’étape L1, quand les scripts existent.)

## Méthode : TDD

Pour chaque comportement : d’abord un test qui échoue, puis le code minimal qui le fait passer, puis le nettoyage. Chaque calcul est une fonction pure testée avec des valeurs de contrôle. Un commit par cycle significatif, message en français.

## Flux Git (strict)

- `main` est toujours stable. Ne fais JAMAIS de commit sur `main`, ne pousse JAMAIS sur `main`. Le seul commit de `main` fait hors pull request est le fichier `LICENSE`, créé par Jospin sur GitHub.
- Une branche par tâche, créée depuis `main` à jour : `etape/<numéro>-<sujet>` (exemple : `etape/l1-socle`).
- Avant de pousser : `npm run check` et `npm run test:integration` réussis (dès qu’ils existent).
- Tu pousses la branche. Tu n’ouvres pas la pull request et tu ne fusionnes jamais : Jospin le fait, en squash.
- Ne réécris jamais l’historique déjà poussé (`push --force`, `rebase` de commits publiés) sans accord explicite.

## Sécurité et déploiement

- Aucune clé secrète dans le dépôt ni dans la conversation. Les seules valeurs publiques admises sont celles que la consigne désigne (par exemple le jeton Cloudflare Web Analytics).
- N’exécute jamais `wrangler login`. N’exécute `wrangler deploy` (ou `npm run deploy`) que dans une partie de consigne qui le demande, après que Jospin a écrit explicitement de la lancer.
- Déploiement depuis `main` à jour uniquement.

## Rapport de fin de tâche (obligatoire)

Termine chaque tâche par un rapport court, dans cet ordre :

1. Branche et liste des commits (`git log --oneline main..HEAD`).
2. Fichiers créés ou modifiés, une ligne chacun.
3. Résultats des tests : nombre de tests unitaires et d’intégration réussis ou échoués.
4. Écarts par rapport à la consigne, et pourquoi.
5. Liens de documentation consultés.
6. Marqueurs TODO ajoutés et questions ouvertes.
