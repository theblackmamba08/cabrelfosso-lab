# Cahier des charges — le Labo de Cabrel FOSSO

Version 0.3, du 24 novembre 2026 : étape L1.1, paragraphe « Mesure d’audience » affiché seulement quand la mesure est active ; fichier technique `/_not-found` de Next.js (section 4).

Rédigée par Claude dans le projet claude.ai « Labo », à partir de la version 0.1 (projet « Portfolio », 23 novembre 2026) et des réponses de Jospin du 24 novembre 2026. Les marqueurs TODO(Jospin) signalent une information encore manquante. Ce fichier est copié dans le dépôt `cabrelfosso-lab` sous `docs/cahier-des-charges.md` ; c’est cette copie qui fait foi.

## 1. Positionnement

### Ce qu’est le Labo

Un site d’expériences interactives, en physique et en informatique : on règle, on observe, on comprend les équations ou les algorithmes qui sont derrière. Il complète le portfolio `cabrelfosso.com`, qui reste la vitrine professionnelle (CV, projets, recherche, parcours, enseignement, contact).

Nom : « Le Labo » sur les pages françaises, « The Lab » sur les pages anglaises (comme sur le portfolio). Le site parle à la première personne, comme le portfolio (« mon portfolio »), et vouvoie le visiteur.

### Publics

1. **Élèves** du secondaire camerounais et **étudiants** de licence : comprendre en manipulant.
2. **Enseignants** : des simulations à utiliser en classe.
3. **Chercheurs et directeurs de thèse** : des démos qui relient l’IA, la physique et l’informatique théorique.

### Règles d’honnêteté

- Une démo **explique** ; elle ne prétend jamais résoudre un problème ouvert. Exemple : la démo sur 3-SAT montre pourquoi certains problèmes semblent difficiles ; elle n’apporte aucune réponse à la question « P = NP ? » et le dit.
- Les données inventées sont présentées comme telles. Une illustration simplifiée le dit (exemple : « ce n’est pas SEATTS »).
- Chaque affirmation scientifique d’une démo renvoie à une source vérifiée, listée dans la rubrique « Pour aller plus loin ».
- Aucun compteur ni chiffre que le site ne montre pas.

## 2. Adresses et arborescence

Domaine : `lab.cabrelfosso.com`. Adresses en français et en anglais, sans barre oblique finale.

| Page | Adresse FR | Adresse EN | Publiée à |
| --- | --- | --- | --- |
| Racine | / | / | L1 : redirection selon la langue du navigateur (voir plus bas) |
| Accueil (toutes les expériences, par catégorie) | /fr | /en | L1 (texte d’accueil seulement, annexe B.2) |
| Confidentialité | /fr/confidentialite | /en/privacy | L1 (annexe B.3) |
| Physique | /fr/physique | /en/physics | À la première expérience de physique (L2) |
| Informatique | /fr/informatique | /en/computing | À la première expérience d’informatique (L3) |
| Une expérience de physique | /fr/physique/[nom] | /en/physics/[name] | |
| Une expérience d’informatique | /fr/informatique/[nom] | /en/computing/[name] | |
| Page 404 bilingue, sitemap.xml, robots.txt | | | L1 |

Une page de catégorie n’apparaît qu’à partir de sa première expérience publiée. Une adresse non publiée répond 404.

hreflang : chaque page déclare ses versions `fr`, `en` et `x-default` (= la version française), comme le portfolio.

### Table de correspondance avec le portfolio (pour l’étape L2)

| Ancienne adresse (portfolio) | Nouvelle adresse (Labo) |
| --- | --- |
| cabrelfosso.com/fr/demos | lab.cabrelfosso.com/fr |
| cabrelfosso.com/en/demos | lab.cabrelfosso.com/en |
| cabrelfosso.com/fr/demos/projectile | lab.cabrelfosso.com/fr/physique/projectile |
| cabrelfosso.com/en/demos/projectile | lab.cabrelfosso.com/en/physics/projectile |
| cabrelfosso.com/fr/demos/pendule-de-newton | lab.cabrelfosso.com/fr/physique/pendule-de-newton |
| cabrelfosso.com/en/demos/newtons-cradle | lab.cabrelfosso.com/en/physics/newtons-cradle |

Ces adresses ne doivent plus changer une fois publiées.

### Racine `/` (décidé le 24 novembre 2026)

Un petit Worker ne s’exécute que pour l’adresse `/` (`run_worker_first: ["/"]`). Toutes les autres adresses sont servies directement comme fichiers statiques, sans Worker.

- Requête `GET` ou `HEAD` sur `/` : redirection temporaire (302) vers `/en` si l’anglais est la langue la mieux classée par l’en-tête `Accept-Language` parmi le français et l’anglais, vers `/fr` dans tous les autres cas (en-tête absent, illisible, autre langue seule). La chaîne de requête est conservée. En-têtes : `Vary: Accept-Language`, `Cache-Control: no-store`, et les en-têtes de sécurité de la section 4 (les fichiers `_headers` ne s’appliquent pas aux réponses d’un Worker).
- Autre méthode sur `/` : 405, avec `Allow: GET, HEAD`.
- Toute autre adresse qui atteindrait le Worker : servie par les fichiers statiques (liaison `ASSETS`), pour que le comportement ne dépende pas de la portée exacte du motif.
- Coût : ces requêtes comptent dans le quota gratuit des Workers ; au-delà, Cloudflare répond 429 sur `/` seulement. Les fichiers statiques restent gratuits et illimités.

Options écartées : page racine bilingue (un clic de plus, page pauvre indexée) ; redirection fixe vers `/fr` par `_redirects` (un anglophone arrive en français).

## 3. Expériences prévues

| Expérience | Catégorie | Étape | Origine |
| --- | --- | --- | --- |
| Le mouvement d’un projectile | Physique | L2 | Déménage du portfolio (textes : annexe B.6 du cahier du portfolio) |
| Le pendule de Newton | Physique | L2 | Déménage du portfolio (textes : annexe B.6 du cahier du portfolio) |
| Où se cachent les problèmes difficiles ? (transition de phase de 3-SAT) | Informatique | L3 | Nouvelle (annexe A, proposition) |
| IA explicable (ex-démo 4.3) : série temporelle jouet décomposée en niveau, tendance, calendrier ; volet « Expliquer coûte cher » sur le coût du calcul exact des valeurs de Shapley | Informatique | Après L3 | Prévue dans le cahier du portfolio (section 6) |
| Vérifier ou trouver (exemple de prix au marché, en FCFA) | Informatique | Plus tard | Nouvelle |
| De Chomsky à P et NP (lien avec Word Wizard) | Informatique | Plus tard | Nouvelle |
| Autres expériences de physique, du lycée puis du supérieur | Physique | Plus tard | |

### Gabarit d’une page d’expérience

1. Titre, introduction courte, niveau ou programme concerné (TODO(Jospin) quand la classe n’est pas connue : la mention reste masquée).
2. La simulation, avec ses réglages.
3. Les équations ou l’algorithme, avec les valeurs réglées en direct quand c’est possible.
4. Les hypothèses du modèle.
5. « À essayer » : questions avec explication repliable.
6. « Pour aller plus loin » : sources vérifiées.
7. Lien « Voir mon portfolio ».

## 4. Stack et choix techniques (vérifiés le 24 novembre 2026)

- **Next.js 16 (App Router), TypeScript 5.9 en mode strict, Tailwind CSS 4, ESLint 9, Vitest**, comme le portfolio. Versions relevées sur npm le 24 novembre 2026 : next 16.4.6, react et react-dom 19.3.1, tailwindcss 4.3.5, vitest 5.1.1, wrangler 4.167.0. TypeScript 7 et ESLint 10 sont écartés pour l’instant : TypeScript 7 n’a pas l’interface de programmation JavaScript dont dépend la configuration ESLint de Next.js (typescript-eslint).
- **Site entièrement statique** : `output: 'export'`, `trailingSlash: false`. Toutes les pages sont produites à la construction dans `out/`. Un export statique ne prend en charge ni les réécritures, ni les redirections, ni les en-têtes de `next.config`, ni `proxy`, ni les cookies, ni l’optimisation d’images par défaut, ni les routes dynamiques sans `generateStaticParams()` ou avec `dynamicParams: true` (documentation Next.js, mise à jour le 9 août 2026). Conséquences :
  - bilinguisme par de vrais segments `app/[lang]/…` et `generateStaticParams()`, avec `dynamicParams = false` ; les noms d’adresse traduits (`confidentialite`, `privacy`, `physique`, `physics`…) sont des valeurs d’un segment dynamique, produites à partir d’une seule table (`src/i18n/routes.ts`) ;
  - en-têtes de sécurité par `public/_headers`, généré et vérifié à partir d’une seule source dans le code ;
  - pas d’image optimisée par Next.js : figures en SVG, images préparées à la construction ;
  - gestionnaires de routes (sitemap, robots, images de partage) marqués `dynamic = 'force-static'`.
- **Pas d’adaptateur** : ni OpenNext ni vinext. Cloudflare recommande vinext pour faire tourner Next.js sur Workers, mais un site exporté n’a besoin que des fichiers statiques. Écart assumé avec le portfolio, qui utilise OpenNext.
- **Hébergement** : un Worker Cloudflare `cabrelfosso-lab` avec fichiers statiques (`assets.directory = ./out`), `not_found_handling: "404-page"` (le `404.html` le plus proche, statut 404), `html_handling: "auto-trailing-slash"` (`/fr` servi par `fr.html`), `run_worker_first: ["/"]` (section 2). Domaine personnalisé `lab.cabrelfosso.com` (Cloudflare crée l’enregistrement DNS et le certificat ; aucun enregistrement CNAME ne doit exister sur `lab`). Adresses `workers.dev` et d’aperçu désactivées. Journaux du Worker désactivés (`observability`) : rien à enregistrer, et la page Confidentialité le promet.
- **En-têtes de sécurité** (fichiers statiques et réponses du Worker, une seule source) : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, et une politique de sécurité du contenu :
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`.
  `'unsafe-inline'` dans `script-src` : les pages exportées contiennent des scripts en ligne de Next.js et le script de thème ; un nonce exigerait un rendu à chaque requête. Fichiers de `/_next/static/` : `Cache-Control: public, max-age=31536000, immutable`.
- **Fichier technique `/_not-found`** : Next.js exporte aussi `/_not-found` (copie de la page 404, avec `noindex`), qui répond 200. Il est gardé : la page 404 se déclare elle-même comme cette route dans ses données, et le supprimer risquerait des erreurs dans le navigateur. Aucun lien n’y mène, il n’est pas dans le sitemap ; un test vérifie son `noindex`.
- **Calculs** : dans le navigateur. Les calculs longs tournent dans un Web Worker (une tâche de fond séparée de l’affichage), pour que la page reste fluide.
- **Hasard reproductible** : générateur pseudo-aléatoire à graine fixe ; même graine, même résultat, dans les tests comme à l’écran.
- **Graphiques et figures** : SVG dessiné par les composants, aux couleurs du design system ; aucune bibliothèque de graphique ni de physique.
- **Rust compilé en WebAssembly** : seulement si une démo l’exige vraiment, et seulement à la demande de Jospin.
- **Chargement** : le code de chaque simulation n’est chargé que sur sa page.

## 5. Identité visuelle

- Même identité que le portfolio : couleurs, polices (Space Grotesk, Inter, JetBrains Mono, hébergées avec le site), papier millimétré, thème sombre par défaut, typographie française. Source : section 7 du cahier du portfolio et `docs/design-system.md`, recopiés dans le dépôt du Labo à l’étape L1 ; pas de paquet partagé.
- En-tête (barre flottante du portfolio) : « Le Labo » / « The Lab », avec « Cabrel FOSSO » ; sélecteur FR/EN ; bouton de thème ; lien « Portfolio » vers `https://cabrelfosso.com/fr` ou `/en`. Pas de menu tant qu’aucune catégorie n’est publiée.
- Pied de page : lien vers mon portfolio, lien vers le code (dépôt public), Confidentialité, mention des licences (section 7).
- Le choix du thème est enregistré par site (stockage du navigateur, propre à chaque adresse) : il peut différer entre le portfolio et le Labo.
- Pas de bouton WhatsApp, pas de bandeau d’actualité, pas de bouton de retour en haut à l’étape L1.

## 6. Critères d’acceptation

Les mêmes que pour le portfolio :

- Lighthouse mobile ≥ 95 en Performance, Accessibilité, Bonnes pratiques et SEO.
- WCAG 2.2 niveau AA : HTML sémantique, contrastes, focus visible, clavier, texte alternatif, résumé textuel de chaque figure, `prefers-reduced-motion`, bouton Pause pour tout mouvement de plus de 5 secondes.
- Responsive de 360 à 1920 px, sans défilement horizontal.
- SEO : titre, description, Open Graph et Twitter par page, image de partage par page, sitemap.xml, robots.txt, URL canonique sur `lab.cabrelfosso.com`, balises hreflang. Données structurées : `WebSite` (accueil), `BreadcrumbList` (pages d’expérience).
- Aucun lien mort, aucune erreur dans la console, aucun texte de remplissage, aucun numéro de téléphone.
- Thème clair et sombre.
- Chaque calcul est une fonction pure testée avec des valeurs de contrôle calculées à la main ou par une source indépendante.

### Mesure d’audience et confidentialité (décidé le 24 novembre 2026)

- Cloudflare Web Analytics, installé par l’extrait JavaScript officiel (« manual JS snippet ») placé avant la fin de `<body>` sur chaque page, avec le jeton du site (public). L’installation automatique n’est pas documentée pour un Worker : l’extrait rend le comportement vérifiable par un test. TODO(Jospin): jeton du site Web Analytics `lab.cabrelfosso.com`. Sans jeton, aucun extrait n’est ajouté et la page Confidentialité n’affiche pas le paragraphe « Mesure d’audience » : la page ne décrit jamais une mesure qui n’existe pas.
- D’après Cloudflare, ce service n’utilise ni cookie ni stockage du navigateur pour mesurer l’audience et ne suit pas les visiteurs d’un site à l’autre.
- Page Confidentialité du Labo (annexe B.3), liée depuis le pied de page.

## 7. Flux de travail

Le même que pour le portfolio (section 13 de son cahier) :

- `main` toujours stable ; une branche par étape (`etape/l1-socle`, …) ; TDD ; `npm run check` et tests d’intégration réussis avant fusion ; CI GitHub Actions ; hook `pre-push` qui refuse l’envoi direct sur `main`.
- Premier commit de `main` : fichier `LICENSE` créé par Jospin sur GitHub (modèle MIT). Claude Code ne pousse jamais sur `main`.
- Fusion en squash par Jospin, après relecture par Claude ; jamais par Claude.
- Dépôt **public** `theblackmamba08/cabrelfosso-lab` : ruleset sur `main` (pull request obligatoire, CI verte obligatoire), activé par Jospin après la première exécution de la CI.
- **Licences** : le code sous licence MIT (`LICENSE`, au nom de Jospin Cabrel FOSSO TIOFOUET) ; les textes du site et les figures des expériences sous licence Creative Commons Attribution 4.0 International (CC BY 4.0, `LICENSE-CONTENT.md`) ; les polices sous leur propre licence (SIL OFL 1.1).
- Poste Windows 11 : dépôt dans `C:\dev\cabrelfosso-lab`, ouvert avec un C majuscule ; Claude Code lancé depuis PowerShell ; arrêter les serveurs avant `npm ci` ; scripts portables Windows et Linux.
- Relais : Claude (projet claude.ai « Labo ») rédige la consigne dans `docs/consignes/`, Jospin la lance dans Claude Code, colle le rapport, Claude vérifie les fichiers réels.
- Déploiement depuis `main` uniquement, depuis le PC de Jospin.

## 8. Feuille de route

| Étape | Contenu |
| --- | --- |
| L1. Socle | Projet Next.js statique, bilinguisme, design system recopié, en-tête, pied de page, thème, accueil du Labo (texte d’accueil, annexe B.2), Confidentialité (annexe B.3), 404 bilingue, sitemap, robots, `_headers`, Worker de la racine, Web Analytics, CI, hook, licences ; mise en ligne sur `lab.cabrelfosso.com`. Le sitemap n’est **pas** envoyé à la Search Console à cette étape |
| L2. Déménagement | Projectile et pendule de Newton (code, tests, textes) ; page Physique ; retrait du bloc provisoire de l’accueil ; sitemap envoyé à la Search Console ; puis, dans le dépôt du portfolio : redirections 301 selon la table de la section 2, liens vers le Labo, retrait du code des démos (section 15 du cahier du portfolio) |
| L3. Transition de phase de 3-SAT | Annexe A |
| Ensuite | IA explicable, puis les autres expériences de la section 3 |

## 9. Checklist de recette

- [ ] Lighthouse mobile ≥ 95 dans les 4 catégories, sur l’accueil et sur une expérience.
- [ ] Navigation complète au clavier, focus visible.
- [ ] Aucun lien mort.
- [ ] Aperçu correct au partage, en FR et en EN.
- [ ] Domaine, URL canonique et sitemap sur `lab.cabrelfosso.com`.
- [ ] `/` redirige vers `/fr` ou `/en` selon la langue du navigateur.
- [ ] Anciennes adresses du portfolio redirigées, sans aucun 404 (après L2).
- [ ] Aucun TODO ni texte de remplissage visible.

## Annexe A — Démo « Où se cachent les problèmes difficiles ? » (proposition, à valider avant L3)

### Idée

L’ordinateur fabrique au hasard des énigmes logiques (formules 3-SAT : chaque contrainte relie trois variables vraies ou fausses, par exemple « A ou non B ou C »). Le visiteur règle α, le nombre de contraintes par variable. Avec peu de contraintes, presque toutes les énigmes ont une solution et le solveur la trouve vite ; avec beaucoup, presque aucune n’en a et il le prouve vite ; autour d’un seuil critique, voisin de 4,26 d’après la littérature, le solveur fait beaucoup plus d’essais. La démo trace ces deux courbes en direct.

### Paramètres proposés

| Élément | Proposition |
| --- | --- |
| Nombre de variables n | Au choix : 20, 30, 40 ou 50 |
| α | De 2 à 7, par pas de 0,25 |
| Formules par valeur de α | 20 (réglable : 10 à 50) |
| Solveur | DPLL avec propagation unitaire, écrit pour le site |
| Mesure | Nombre d’embranchements (choix faits par le solveur), médiane par valeur de α |
| Courbes | Part des formules satisfiables (en %) ; médiane du nombre d’embranchements |
| Mode pas à pas | Une petite formule (environ 8 variables) résolue étape par étape, pour les élèves |
| Graine | Fixe par défaut, modifiable ; affichée |

Temps de calcul sur un téléphone moyen : probablement quelques secondes pour n = 50, à mesurer pendant L3 ; si c’est trop long, réduire n ou le nombre de formules.

### Textes obligatoires

- « Cette expérience n’apporte pas de réponse à la question P = NP. Elle montre où se trouvent, en pratique, les énigmes difficiles pour un solveur. »
- Définitions courtes de P, NP et NP-complet.

### Sources à vérifier avant L3

- Seuil de satisfiabilité de 3-SAT aléatoire, voisin de 4,26 : plusieurs articles le rapportent (par exemple arXiv 2605.28602 et arXiv 1412.5862, consultés le 22 novembre 2026). TODO : choisir une source de référence primaire, par exemple l’article de Mitchell, Selman et Levesque (AAAI 1992), à vérifier.
- Lien avec la physique statistique (verres de spin) : arXiv cond-mat/0111153, consulté le 22 novembre 2026.
- Pour la démo IA explicable : Van den Broeck, Lykov, Schleich et Suciu, « On the Tractability of SHAP Explanations », AAAI 2021, DOI 10.1609/aaai.v35i7.16806.

## Annexe B — Textes du Labo (étape L1, validés le 24 novembre 2026)

Typographie dans le code : apostrophe courbe (’) ; en français, espace insécable avant « : ; ! ? » et à l’intérieur des guillemets, avec la même convention que le portfolio. Les textes ci-dessous sont repris mot pour mot ; seule la typographie des espaces est appliquée dans le code.

### B.1 Éléments communs

| Clé | Français | English |
| --- | --- | --- |
| Lien d’évitement | Aller au contenu | Skip to content |
| Nom du site (en-tête) | Le Labo | The Lab |
| Auteur (en-tête) | Cabrel FOSSO | Cabrel FOSSO |
| Sélecteur de langue (nom accessible) | Choisir la langue | Choose language |
| Bouton de thème (nom accessible) | Changer de thème (clair ou sombre) | Switch theme (light or dark) |
| Lien vers le portfolio (en-tête) | Portfolio | Portfolio |
| Pied de page (nom de la zone) | Liens utiles | Useful links |
| Pied de page, liens | Mon portfolio · Code source sur GitHub · Confidentialité | My portfolio · Source code on GitHub · Privacy |
| Pied de page, licences | Code sous licence MIT · Textes et figures sous licence CC BY 4.0 | Code under the MIT license · Text and figures under CC BY 4.0 |
| Pied de page, droits | © {année} Cabrel FOSSO | © {year} Cabrel FOSSO |
| Nom du site (Open Graph) | Le Labo — Cabrel FOSSO | The Lab — Cabrel FOSSO |

Liens : portfolio `https://cabrelfosso.com/fr` ou `/en` ; code `https://github.com/theblackmamba08/cabrelfosso-lab` ; « licence MIT » vers `https://github.com/theblackmamba08/cabrelfosso-lab/blob/main/LICENSE` ; « CC BY 4.0 » vers `https://creativecommons.org/licenses/by/4.0/deed.fr` (EN : `deed.en`).

Page 404 (bilingue, une seule page) :

| Français | English |
| --- | --- |
| Page introuvable | Page not found |
| Cette page n’existe pas ou a été déplacée. | This page doesn’t exist or has moved. |
| Retour à l’accueil du Labo (→ /fr) | Back to the Lab’s home page (→ /en) |

### B.2 Accueil

**Français**

- Titre de l’onglet : Le Labo — Cabrel FOSSO
- Description : Expériences interactives de physique et d’informatique : réglez, observez, comprenez les équations et les algorithmes. Gratuit, dans le navigateur.
- Étiquette : Le Labo
- Titre : Comprendre la physique et l’informatique **en manipulant** (« en manipulant » en couleur « craie »)
- Introduction : Le Labo rassemble des expériences interactives. On règle un paramètre, on observe ce qui change, puis on découvre les équations ou l’algorithme qui expliquent le résultat. Tout se calcule dans votre navigateur, sur ordinateur comme sur téléphone, sans compte ni installation.
- Section « Comment ça marche »
  - **Régler** : Chaque expérience a ses réglages : un angle, une vitesse, la taille d’un problème.
  - **Observer** : La figure et les mesures changent en direct.
  - **Comprendre** : Les équations, les hypothèses du modèle et des questions « À essayer » accompagnent chaque expérience. Les sources sont citées. Une expérience explique un phénomène connu ; elle ne prétend jamais résoudre un problème ouvert.
- Section « Pour qui ? »
  - **Élèves et étudiants** : voir ce que disent les formules du cours.
  - **Enseignants** : projeter une simulation en classe.
  - **Chercheurs** : des démos qui relient l’IA, la physique et l’informatique théorique.
- Bloc provisoire (retiré à l’étape L2)
  - Titre : Les expériences arrivent
  - Texte : Les expériences s’installent ici. En attendant, le mouvement d’un projectile et le pendule de Newton sont sur mon portfolio.
  - Lien : Voir les démos sur mon portfolio → `https://cabrelfosso.com/fr/demos`
- Signature : Je suis Cabrel FOSSO : enseignant de physique au Cameroun, titulaire d’un Master en informatique (IA explicable) et développeur.
  - Bouton : Voir mon portfolio → `https://cabrelfosso.com/fr`

**English**

- Tab title: The Lab — Cabrel FOSSO
- Description: Interactive physics and computing experiments: adjust, observe, and understand the equations and algorithms behind them. Free, in your browser.
- Label: The Lab
- Title: Understand physics and computing **hands-on** (“hands-on” in the chalk colour)
- Intro: The Lab is a collection of interactive experiments. Change a setting, watch what happens, then explore the equations or the algorithm behind the result. Everything runs in your browser, on a laptop or a phone, with no account and nothing to install.
- Section “How it works”
  - **Adjust**: Each experiment has its own controls: an angle, a speed, the size of a problem.
  - **Observe**: The figure and the readings update live.
  - **Understand**: Every experiment comes with its equations, the assumptions of the model, and “Try this” questions. Sources are cited. An experiment explains a known phenomenon; it never claims to solve an open problem.
- Section “Who is it for?”
  - **Students**: see what the formulas from class actually do.
  - **Teachers**: project a simulation in class.
  - **Researchers**: demos that connect AI, physics and theoretical computer science.
- Temporary block (removed at L2)
  - Title: Experiments on the way
  - Text: The experiments are moving in. Meanwhile, projectile motion and Newton’s cradle are on my portfolio.
  - Link: See the demos on my portfolio → `https://cabrelfosso.com/en/demos`
- Signature: I’m Cabrel FOSSO, a physics teacher in Cameroon with a Master’s in computer science (explainable AI), and a developer.
  - Button: See my portfolio → `https://cabrelfosso.com/en`

### B.3 Confidentialité

**Français**

- Titre de l’onglet : Confidentialité — Le Labo
- Description : Ce que le Labo enregistre, et ce qu’il n’enregistre pas.
- Titre : Confidentialité
- Introduction : Ce que le Labo enregistre, et ce qu’il n’enregistre pas.
- **Responsable** : Jospin Cabrel FOSSO TIOFOUET, joignable par la page Contact de mon portfolio (lien `https://cabrelfosso.com/fr/contact`).
- **Mesure d’audience** (affiché seulement quand la mesure est active, section 6) : Cloudflare Web Analytics compte les visites et mesure la vitesse d’affichage des pages, de façon globale. D’après Cloudflare, ce service n’utilise ni cookie ni stockage dans votre navigateur pour cette mesure, et ne vous suit pas d’un site à l’autre.
- **Préférences** : votre choix de thème (clair ou sombre) est enregistré dans votre propre navigateur ; il ne m’est pas transmis. Le choix de langue n’est pas enregistré : il figure dans l’adresse de la page (/fr ou /en). À l’adresse lab.cabrelfosso.com seule, la langue est choisie d’après la préférence qu’indique votre navigateur, sans rien enregistrer.
- **Expériences** : les calculs se font dans votre navigateur ; vos réglages ne me sont pas envoyés.
- **Ce que le Labo ne fait pas** : pas de compte, pas de formulaire, pas de publicité ; il ne vend aucune donnée et n’en partage avec personne à des fins commerciales.
- **Hébergement** : le site est hébergé par Cloudflare.
- **Vos droits** : je n’enregistre aucune donnée qui vous identifie. Pour toute question, écrivez-moi par la page Contact de mon portfolio.
- **Dernière mise à jour** : {date de l’étape, en toutes lettres}

**English**

- Tab title: Privacy — The Lab
- Description: What the Lab records, and what it doesn’t.
- Title: Privacy
- Intro: What the Lab records, and what it doesn’t.
- **Data controller**: Jospin Cabrel FOSSO TIOFOUET, reachable through the Contact page of my portfolio (link `https://cabrelfosso.com/en/contact`).
- **Analytics** (shown only when analytics is active, section 6): Cloudflare Web Analytics counts visits and measures how fast pages load, in aggregate. According to Cloudflare, it uses no cookies or browser storage for this, and doesn’t track you from one site to another.
- **Preferences**: your theme choice (light or dark) is stored in your own browser and never sent to me. Your language isn’t stored: it’s part of the page address (/fr or /en). Only at lab.cabrelfosso.com itself is the language picked from the preference your browser sends, and nothing is stored.
- **Experiments**: all calculations run in your browser; your settings are never sent to me.
- **What the Lab doesn’t do**: no accounts, no forms, no ads. It doesn’t sell any data or share it with anyone for commercial purposes.
- **Hosting**: the site is hosted by Cloudflare.
- **Your rights**: I don’t store any data that identifies you. If you have a question, write to me through the Contact page of my portfolio.
- **Last updated**: {date of the step, written out}

## Historique

- Version 0.1 (23 novembre 2026) : décision du Labo ; publics ; adresses et table de correspondance ; expériences prévues ; stack statique sur Cloudflare Workers ; feuille de route L1 à L3 ; proposition pour la démo 3-SAT.
- Version 0.2 (24 novembre 2026) : racine `/` par un Worker limité à cette adresse ; stack vérifiée (sans adaptateur, TypeScript 5.9, ESLint 9) et configuration Cloudflare ; en-têtes de sécurité ; noms « Le Labo » et « The Lab », voix à la première personne ; licences MIT (code) et CC BY 4.0 (textes et figures) ; Cloudflare Web Analytics et page Confidentialité ; sitemap envoyé à la Search Console en L2 ; annexe B (textes de L1).
- Version 0.3 (24 novembre 2026) : étape L1.1 ; paragraphe « Mesure d’audience » de la page Confidentialité conditionné au jeton Web Analytics, et description de la page sans mention de la mesure d’audience, pour rester exacte dans les deux cas (section 6, annexe B.3) ; fichier technique `/_not-found` gardé, avec `noindex` (section 4).
