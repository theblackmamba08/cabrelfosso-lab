# Cahier des charges — le Labo de Cabrel FOSSO

Version 0.4, du 24 novembre 2026 : étape L2a, déménagement du projectile et du pendule de Newton dans le Labo, page Physique, menu et fil d’Ariane, sources, règle Cloudflare de mesure d’audience (sections 2, 4.1, 5, 6, 8, annexes B.2 et C).

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
| Physique | /fr/physique | /en/physics | L2 (annexe C.1) |
| Informatique | /fr/informatique | /en/computing | À la première expérience d’informatique (L3) |
| Une expérience de physique | /fr/physique/[nom] | /en/physics/[name] | L2 : `projectile` / `projectile` (annexe C.2) ; `pendule-de-newton` / `newtons-cradle` (annexe C.3) |
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

### 4.1 Expériences de physique : modèles et conventions

Reprises de la section 13 du cahier du portfolio (« Phase 4 — décisions » et « Étape 4.2 — modèle du pendule de Newton », 7 novembre 2026), adaptées au Labo à l’étape L2.

- **Rendu** : SVG dessiné par le composant, couleurs du design system, thèmes clair et sombre. Aucune bibliothèque de graphique ni de physique.
- **Calculs** : fonctions pures TypeScript, testées avec les valeurs de contrôle des annexes C.2 et C.3, calculées à la main. Les calculs utilisent exactement les valeurs de g affichées (9,8 ; 1,6 ; 3,7 m/s²), pour qu’un élève puisse refaire le calcul.
- **Affichage des nombres** : unités SI, 3 chiffres significatifs, virgule décimale en français, espace insécable avant l’unité.
- **Formules** : texte HTML (italique pour les variables, indices et exposants), police JetBrains Mono, complétée par son sous-ensemble grec (licence OFL, chargé seulement sur les pages qui en ont besoin) pour que α et θ s’affichent dans la même police ; le signe √ reste dans une police de repli. Pas de bibliothèque de formules.
- **Chargement** : le code interactif d’une expérience n’est chargé que sur sa page (import dynamique) ; l’accueil et la page Physique n’en contiennent pas.
- **Accessibilité** : réglages en `<input type="range">` et `<select>` natifs, avec étiquette et valeur affichée ; figure SVG avec un résumé textuel ; résultats dans une liste de définitions ; pas d’annonce `aria-live` à chaque mouvement d’un curseur.
- **Projectile, figure** : repère orthonormé (un mètre a la même longueur sur les deux axes), étendue par paliers (1 ; 1,5 ; 2 ; 3 ; 5 ; 7,5 ; 10 × 10ⁿ), axes intitulés « x (m) » et « y (m) », trajectoire en 64 segments.
- **Projectile, animation du tir** : durée affichée réelle ; l’animation est ramenée à 3 secondes au plus, quelle que soit la durée du vol ; elle ne boucle pas. Avec `prefers-reduced-motion`, pas d’animation : la trajectoire est tracée d’un coup.
- **Pendule de Newton, montage** : 5 billes identiques de masse m = 50 g, suspendues à des fils de longueur L = 20 cm, g = 9,8 m/s². Ces valeurs sont choisies pour la démo et affichées ; elles ne décrivent pas un objet réel.
- **Pendule de Newton, mouvement entre les chocs** : chaque bille est un pendule simple, d’équation θ″ = −(g/L) sin θ, intégrée numériquement (méthode de Runge-Kutta d’ordre 4, pas de temps fixe). Aucune approximation des petits angles.
- **Pendule de Newton, chocs** : instantanés, entre deux billes voisines seulement, quand elles se touchent et se rapprochent. Pour deux billes identiques de vitesses v₁ et v₂ : v₁′ = [(1 − e) v₁ + (1 + e) v₂] / 2 et v₂′ = [(1 + e) v₁ + (1 − e) v₂] / 2, où e est le coefficient de restitution (e = 1 : choc parfaitement élastique). Ces formules découlent de la conservation de la quantité de mouvement et de la définition de e (sources de l’annexe C.3).
- **Pendule de Newton, ordre des chocs au point bas** : quand plusieurs billes se touchent, les chocs sont traités par balayages successifs de gauche à droite (billes écartées à gauche), jusqu’à ce qu’aucune bille n’en rattrape une autre. Les valeurs de contrôle de l’annexe C.3 dépendent de cet ordre. « Après le choc » désigne l’état atteint quand plus aucune bille n’en rattrape une autre.
- **Pendule de Newton, animation** : elle ne démarre qu’au bouton « Lâcher », puis continue ; bouton Pause / Reprendre (WCAG 2.2, critère 2.2.2) et ralenti ×0,1. Avec `prefers-reduced-motion`, le ralenti est coché par défaut.
- **Pendule de Newton, affichage** : barres de la quantité de mouvement totale et de l’énergie cinétique totale, avant et après le choc, à la même échelle ; valeurs chiffrées en unités SI (p en kg·m/s, Ec en J), 3 chiffres significatifs.
- **Sources** : chaque expérience a sa rubrique « Pour aller plus loin » (annexes C.2 et C.3). Le tableau « Affirmations et sources » de chaque annexe dit quelle source appuie quelle affirmation ; il sert à la relecture et n’est pas affiché sur le site.

## 5. Identité visuelle

- Même identité que le portfolio : couleurs, polices (Space Grotesk, Inter, JetBrains Mono, hébergées avec le site), papier millimétré, thème sombre par défaut, typographie française. Source : section 7 du cahier du portfolio et `docs/design-system.md`, recopiés dans le dépôt du Labo à l’étape L1 ; pas de paquet partagé.
- En-tête (barre flottante du portfolio) : « Le Labo » / « The Lab », avec « Cabrel FOSSO » ; sélecteur FR/EN ; bouton de thème ; lien « Portfolio » vers `https://cabrelfosso.com/fr` ou `/en`. Menu : une entrée par catégorie publiée, à partir de L2 « Physique » / « Physics » (annexe C.1) ; elle a le style de page courante sur la page de catégorie et sur ses expériences, et `aria-current="page"` seulement sur la page de catégorie elle-même. Sous 480 px, le menu passe sur une seconde ligne de la barre, sans défilement horizontal.
- Fil d’Ariane visible (composant `Breadcrumb` du portfolio) sur les pages de catégorie et d’expérience : « Le Labo › Physique › {expérience} » / « The Lab › Physics › {experiment} », dernière étape sans lien avec `aria-current="page"` ; données structurées `BreadcrumbList` identiques.
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
- **Règle Cloudflare « Labo : pas de mesure automatique »** (créée par Jospin le 24 novembre 2026, zone `cabrelfosso.com`, Rules → Configuration Rules) : condition `http.host eq "lab.cabrelfosso.com"`, réglage « Disable Real User Monitoring (RUM) ». Raison : l’installation automatique de Web Analytics du portfolio s’applique à toute la zone, sous-domaines compris, et injectait le compteur du portfolio dans les pages du Labo. Cette règle vit dans le tableau de bord, pas dans le dépôt : ne pas la supprimer. Inconnu : si elle bloque aussi l’extrait manuel du Labo ; à vérifier le jour où le jeton est ajouté (sinon, limiter plutôt la règle Web Analytics du portfolio à `cabrelfosso.com`).
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
| L1. Socle (terminée le 24 novembre 2026 : version `1e6be4ff`, PageSpeed Insights mobile 100 dans les quatre catégories sur `/fr` et `/en`) | Projet Next.js statique, bilinguisme, design system recopié, en-tête, pied de page, thème, accueil du Labo (texte d’accueil, annexe B.2), Confidentialité (annexe B.3), 404 bilingue, sitemap, robots, `_headers`, Worker de la racine, Web Analytics, CI, hook, licences ; mise en ligne sur `lab.cabrelfosso.com`. Le sitemap n’est **pas** envoyé à la Search Console à cette étape |
| L2a. Déménagement, côté Labo | Projectile et pendule de Newton (code, tests, textes, sources) ; page Physique ; menu et fil d’Ariane ; accueil avec la section « Physique », sans le bloc provisoire ; mise en ligne ; sitemap envoyé à la Search Console |
| L2b. Déménagement, côté portfolio (après la mise en ligne de L2a) | Dans le dépôt du portfolio : redirections 301 selon la table de la section 2, liens vers le Labo, lien du bandeau d’actualité, retrait du code des démos (section 15 du cahier du portfolio) |
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
- Section « Physique » (à partir de L2, juste après l’introduction ; le bloc provisoire de L1 est retiré)
  - Titre : Physique
  - Carte du projectile : titre « Le mouvement d’un projectile » ; texte « Angle, vitesse, hauteur de départ, pesanteur : réglez le lancer et observez la trajectoire. » ; lien « Ouvrir l’expérience »
  - Carte du pendule de Newton : titre « Le pendule de Newton » ; texte « Écartez une ou plusieurs billes, lâchez, et suivez la quantité de mouvement et l’énergie à chaque choc. » ; lien « Ouvrir l’expérience »
  - Lien sous les cartes : Toutes les expériences de physique → `/fr/physique`
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
- Section “Physics” (from L2, right after the intro; the L1 temporary block is removed)
  - Title: Physics
  - Projectile card: title “Projectile motion”; text “Angle, speed, launch height, gravity: set up the throw and watch the trajectory.”; link “Open the experiment”
  - Newton’s cradle card: title “Newton’s cradle”; text “Pull back one or more balls, let go, and follow momentum and energy through every collision.”; link “Open the experiment”
  - Link below the cards: All physics experiments → `/en/physics`
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

## Annexe C — Expériences de physique (étape L2a)

Textes du projectile et du pendule de Newton repris mot pour mot de l’annexe B.6 du cahier du portfolio (validés le 7 novembre 2026), sauf : titres d’onglet « … — Le Labo » / « … — The Lab », démo vedette de l’accueil supprimée, rubriques « Pour aller plus loin » et lien « Voir mon portfolio » ajoutés (validés par Jospin le 24 novembre 2026). Les libellés d’interface absents d’ici (titres des rubriques, boutons, unités, explications repliables) sont ceux du code du portfolio (`src/i18n/messages/fr.ts` et `en.ts`, partie `demos`), recopiés tels quels ; un libellé qui nomme « Démos » / « Demos » devient « Le Labo » / « The Lab ».

### C.1 Menu, fil d’Ariane et page Physique

| Clé | Français | English |
| --- | --- | --- |
| Entrée du menu | Physique | Physics |
| Menu (nom accessible) | Menu principal | Main menu |
| Fil d’Ariane (nom accessible) | Fil d’Ariane | Breadcrumb |
| Fil d’Ariane, première étape | Le Labo | The Lab |
| Lien de fin de chaque expérience | Voir mon portfolio → `https://cabrelfosso.com/fr` | See my portfolio → `https://cabrelfosso.com/en` |
| Titre de la rubrique des sources | Pour aller plus loin | Further reading |
| Mention après une source en anglais | (en anglais) | |

**Page Physique — /fr/physique · /en/physics**

- Titre de l’onglet : Physique — Le Labo / Physics — The Lab
- Description : Des expériences de mécanique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton. / Mechanics experiments you can set up yourself: the path of a projectile and the collisions in Newton’s cradle.
- Titre : Physique / Physics
- Introduction : Des expériences de mécanique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton. / Mechanics experiments you can set up yourself: the path of a projectile and the collisions in Newton’s cradle.
- Une carte par expérience publiée, avec les textes des cartes de l’accueil (annexe B.2), chacune avec sa petite figure décorative (`DemoFigure` du portfolio).

### C.2 Le mouvement d’un projectile — /fr/physique/projectile · /en/physics/projectile

#### Projectile — français

- **Titre de l’onglet** : Le mouvement d’un projectile — Le Labo
- **Description** : Simulation interactive du mouvement d’un projectile : équations horaires, trajectoire, portée et flèche, mises à jour en direct.
- **Titre de la page** : Le mouvement d’un projectile
- **Introduction** : Un ballon frappé, un jet d’eau, une pierre lancée d’un pont : tous suivent la même loi. Réglez le lancer, puis comparez les trajectoires.
- **Mention** : Au programme de TODO(Jospin): classe concernée. (masquée tant que la classe manque)

**Réglages**

| Réglage | Étiquette | Plage | Pas | Valeur de départ |
| --- | --- | --- | --- | --- |
| Angle de tir α | Angle de tir (°) | 0 à 90 | 1 | 45 |
| Vitesse initiale v₀ | Vitesse initiale (m/s) | 1 à 30 | 0,5 | 10 |
| Hauteur de départ h₀ | Hauteur de départ (m) | 0 à 20 | 0,5 | 0 |
| Pesanteur g | Pesanteur | Terre (g = 9,8 m/s²) · Lune (g = 1,6 m/s²) · Mars (g = 3,7 m/s²) | — | Terre |

- **Boutons** : Lancer · Garder ce tir pour comparer · Effacer la comparaison
- **Résultats** (titre « Résultats ») : Durée du vol · Portée · Flèche (hauteur maximale) · Vitesse à l’impact
- **Légende de la figure** : Tir actuel · Tir gardé (trait pointillé, affiché seulement après « Garder ce tir pour comparer »)
- **Résumé textuel de la figure** (lecteurs d’écran) : « Tir actuel : portée {portée}, flèche {flèche}. » et, s’il existe, « Tir gardé : portée {portée}, flèche {flèche}. »

**Les équations**

Le repère : origine au sol, à la verticale du point de lancement ; axe Ox horizontal, axe Oy vertical vers le haut.

- Équations horaires : x(t) = v₀ cos α · t ; y(t) = −½ g t² + v₀ sin α · t + h₀
- Équation de la trajectoire (une parabole) : y = −g x² / (2 v₀² cos² α) + x tan α + h₀
- Flèche : H = h₀ + v₀² sin² α / (2g)
- Durée du vol : t_v = [v₀ sin α + √(v₀² sin² α + 2 g h₀)] / g
- Portée : D = v₀ cos α · t_v ; sans hauteur de départ, D = v₀² sin 2α / g
- Vitesse à l’impact : v = √(v₀² + 2 g h₀)

Les équations s’affichent aussi avec les valeurs réglées, mises à jour en direct. Pour un tir vertical (α = 90°), l’équation de la trajectoire est remplacée par : « Tir vertical : le projectile reste sur l’axe Oy (x = 0). »

**Hypothèses** : Le projectile est assimilé à un point matériel. Le référentiel terrestre est supposé galiléen. Les frottements de l’air sont négligés : seul le poids agit, donc l’accélération vaut g, verticale et vers le bas.

**À essayer** (chaque question a son explication repliable, intitulée « Voir l’explication »)

1. Sans hauteur de départ, lancez à 30° puis à 60° avec la même vitesse. Que remarquez-vous ? — Explication : la portée vaut v₀² sin 2α / g, et sin 60° = sin 120°. Deux angles complémentaires donnent la même portée.
2. Toujours sans hauteur de départ, cherchez l’angle qui donne la plus grande portée. — Explication : 45°, car sin 2α vaut au plus 1, quand 2α = 90°.
3. Faites le même lancer sur la Terre puis sur la Lune, sans hauteur de départ. Par combien la portée est-elle multipliée ? — Explication : par 9,8 / 1,6 ≈ 6,1. Sans hauteur de départ, la portée est inversement proportionnelle à g.

#### Projectile — English

- **Tab title**: Projectile motion — The Lab
- **Description**: Interactive projectile motion simulation: equations of motion, trajectory, range and maximum height, updated live.
- **Page heading**: Projectile motion
- **Intro**: A kicked ball, a jet of water, a stone thrown from a bridge: they all follow the same law. Set up the throw, then compare trajectories.
- **Note**: Part of the TODO(Jospin): class curriculum in Cameroon. (hidden while the class is missing)
- **Controls**: Launch angle (°) · Initial speed (m/s) · Launch height (m) · Gravity: Earth (g = 9.8 m/s²), Moon (g = 1.6 m/s²), Mars (g = 3.7 m/s²). Same ranges, steps and starting values as the French version.
- **Buttons**: Launch · Keep this throw to compare · Clear comparison
- **Results** (heading "Results"): Flight time · Range · Maximum height · Impact speed
- **Figure legend**: Current throw · Kept throw (dashed line, shown only after "Keep this throw to compare")
- **Text summary of the figure** (screen readers): "Current throw: range {range}, maximum height {height}." and, if there is one, "Kept throw: range {range}, maximum height {height}."

**The equations**

Axes: origin on the ground, directly below the launch point; x-axis horizontal, y-axis pointing up.

- Equations of motion, trajectory, maximum height, flight time, range and impact speed: same formulas as the French version, with these labels: "Equations of motion", "Trajectory (a parabola)", "Maximum height", "Flight time", "Range" ("with no launch height, R = v₀² sin 2α / g"), "Impact speed". The range is written R in English and D in French.
- Vertical throw (α = 90°): "Vertical throw: the projectile stays on the y-axis (x = 0)."

**Assumptions**: The projectile is treated as a point mass, and the Earth’s frame of reference as inertial. Air resistance is neglected: only its weight acts on it, so its acceleration is g, pointing straight down.

**Try this** (each question has a collapsible explanation, labelled "Show the explanation")

1. With no launch height, throw at 30° and then at 60° at the same speed. What do you notice? — Explanation: the range is v₀² sin 2α / g, and sin 60° = sin 120°. Two complementary angles give the same range.
2. Still with no launch height, find the angle that gives the longest range. — Explanation: 45°, because sin 2α is at most 1, when 2α = 90°.
3. Make the same throw on Earth and then on the Moon, with no launch height. By how much is the range multiplied? — Explanation: by 9.8 / 1.6 ≈ 6.1. With no launch height, the range is inversely proportional to g.

#### Valeurs de contrôle pour les tests (calculées le 7 novembre 2026)

| v₀ (m/s) | α (°) | h₀ (m) | g (m/s²) | Durée du vol (s) | Portée (m) | Flèche (m) | Vitesse à l’impact (m/s) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | 45 | 0 | 9,8 | 1,4431 | 10,2041 | 2,5510 | 10,0000 |
| 10 | 0 | 5 | 9,8 | 1,0102 | 10,1015 | 5,0000 | 14,0712 |
| 10 | 30 | 0 | 9,8 | 1,0204 | 8,8370 | 1,2755 | 10,0000 |
| 10 | 60 | 0 | 9,8 | 1,7674 | 8,8370 | 3,8265 | 10,0000 |
| 10 | 45 | 0 | 1,6 | 8,8388 | 62,5000 | 15,6250 | 10,0000 |
| 20 | 90 | 0 | 9,8 | 4,0816 | 0,0000 | 20,4082 | 20,0000 |
| 15 | 30 | 2 | 9,8 | 1,7622 | 22,8920 | 4,8699 | 16,2542 |

#### Pour aller plus loin — projectile

- OpenStax, *University Physics Volume 1*, section 4.3 « Projectile Motion » (en anglais) → `https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion`
- EN : OpenStax, *University Physics Volume 1*, section 4.3 “Projectile Motion” → même lien

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| Équations horaires, trajectoire parabolique, flèche, portée v₀² sin 2α / g sans hauteur de départ | OpenStax 4.3 (équations 4.24 à 4.26) |
| Frottements de l’air négligés, seul le poids agit | OpenStax 4.3 |
| Durée du vol et portée avec hauteur de départ, vitesse à l’impact | Déduites des équations horaires d’OpenStax 4.3 (calcul vérifié par les valeurs de contrôle) |

### C.3 Le pendule de Newton — /fr/physique/pendule-de-newton · /en/physics/newtons-cradle

#### Pendule de Newton — français

- **Titre de l’onglet** : Le pendule de Newton — Le Labo
- **Description** : Simulation interactive du pendule de Newton : chocs entre billes, conservation de la quantité de mouvement et de l’énergie cinétique.
- **Titre de la page** : Le pendule de Newton
- **Introduction** : Écartez une bille et lâchez-la : une seule bille repart de l’autre côté. Écartez-en deux : deux billes repartent. Ce jouet de bureau illustre deux lois de conservation.

**Réglages**

| Réglage | Étiquette | Plage | Pas | Valeur de départ |
| --- | --- | --- | --- | --- |
| Billes écartées | Nombre de billes écartées | 1 à 4 | 1 | 1 |
| Angle de départ θ₀ | Angle de départ (°) | 10 à 45 | 1 | 30 |
| Coefficient de restitution e | Coefficient de restitution | 0,5 à 1 | 0,05 | 1 |

- **Aide sous le coefficient** : 1 : choc parfaitement élastique. En dessous de 1, une partie de l’énergie cinétique est perdue à chaque choc.
- **Données fixes, affichées** : Masse d’une bille : 50 g · Longueur des fils : 20 cm · g = 9,8 m/s²
- **Boutons** : Lâcher · Pause · Reprendre · Recommencer ; case à cocher « Ralenti (×0,1) »
- **Mesures** (titre « Au moment du choc ») : Vitesse juste avant le choc · Vitesses juste après le choc (une ligne par bille qui bouge, numérotée de gauche à droite : « Bille 1 », « Bille 2 »…) · Barres « Quantité de mouvement totale » et « Énergie cinétique totale », chacune avec « Avant » et « Après » et leur valeur
- **Résumé textuel de la figure** (lecteurs d’écran) : « Avant le choc : p = {p}, Ec = {Ec}. Après le choc : p = {p}, Ec = {Ec}. »

**Les lois**

- Vitesse au point bas, par conservation de l’énergie mécanique pendant la descente : v = √(2 g L (1 − cos θ₀))
- Quantité de mouvement : p = m v. Elle est conservée à chaque choc : m v₁ + m v₂ = m v₁′ + m v₂′
- Énergie cinétique : Ec = ½ m v². Elle n’est conservée que si le choc est parfaitement élastique.
- Coefficient de restitution : e = (v₂′ − v₁′) / (v₁ − v₂)
- Deux billes identiques, la seconde immobile : v₁′ = (1 − e) v₁ / 2 et v₂′ = (1 + e) v₁ / 2. Pour e = 1, les vitesses s’échangent : v₁′ = 0 et v₂′ = v₁.
- Énergie cinétique perdue lors de ce choc : la fraction (1 − e²) / 2.

**Hypothèses** : Les billes sont identiques. Les fils sont inextensibles et de masse négligeable, et les frottements de l’air sont négligés. Chaque choc est instantané et ne concerne que deux billes voisines : les chocs se suivent de bille en bille. Un vrai pendule de Newton est plus subtil, car ses billes se touchent ; ce modèle simple en reproduit l’essentiel.

**À essayer** (explication repliable « Voir l’explication »)

1. Écartez deux billes. Pourquoi ne voit-on jamais une seule bille repartir, deux fois plus vite ? — Explication : une seule bille à 2v conserverait bien la quantité de mouvement (m · 2v = 2 m v), mais son énergie cinétique serait ½ m (2v)² = 2 m v², au lieu de 2 × ½ m v² = m v². Les deux lois ensemble imposent que deux billes repartent, à la vitesse v.
2. Réglez le coefficient de restitution sur 0,8 et lâchez une bille. Que deviennent la quantité de mouvement et l’énergie cinétique ? — Explication : la quantité de mouvement totale reste la même ; l’énergie cinétique diminue à chaque choc, et toutes les billes finissent par bouger un peu.
3. Passez l’angle de départ de 20° à 40°. La vitesse au point bas double-t-elle ? — Explication : presque. Comme 1 − cos θ₀ = 2 sin² (θ₀/2), on a v = 2 sin (θ₀/2) √(g L). Or sin 20° / sin 10° ≈ 1,97 : la vitesse est multipliée par 1,97. Pour de petits angles, elle est presque proportionnelle à l’angle.

#### Newton’s cradle — English

- **Tab title**: Newton’s cradle — The Lab
- **Description**: Interactive Newton’s cradle simulation: collisions between balls, conservation of momentum and kinetic energy.
- **Page heading**: Newton’s cradle
- **Intro**: Pull back one ball and let go: a single ball swings out on the other side. Pull back two, and two swing out. This desk toy shows two conservation laws at work.
- **Controls**: Number of balls pulled back · Release angle (°) · Coefficient of restitution. Same ranges, steps and starting values as the French version.
- **Help under the coefficient**: 1 means a perfectly elastic collision. Below 1, some kinetic energy is lost in every collision.
- **Fixed values, shown**: Mass of each ball: 50 g · String length: 20 cm · g = 9.8 m/s²
- **Buttons**: Let go · Pause · Resume · Reset; checkbox "Slow motion (×0.1)"
- **Readings** (heading "At impact"): Speed just before impact · Speeds just after impact (one line per moving ball, numbered from left to right: "Ball 1", "Ball 2"…) · Bars "Total momentum" and "Total kinetic energy", each with "Before" and "After" and their value
- **Text summary of the figure** (screen readers): "Before impact: p = {p}, KE = {KE}. After impact: p = {p}, KE = {KE}."

**The laws**: same formulas as the French version, with these labels: "Speed at the lowest point, from conservation of mechanical energy on the way down", "Momentum p = m v, conserved in every collision", "Kinetic energy KE = ½ m v², conserved only in a perfectly elastic collision", "Coefficient of restitution", "Two identical balls, the second at rest; for e = 1 the speeds swap", "Kinetic energy lost in that collision: the fraction (1 − e²) / 2". Kinetic energy is written KE in English and Ec in French.

**Assumptions**: The balls are identical. The strings don’t stretch and their mass is negligible, and air resistance is neglected. Each collision is instantaneous and involves only two neighbouring balls, so collisions pass from ball to ball. A real Newton’s cradle is subtler, because its balls are touching; this simple model captures the essentials.

**Try this** (collapsible "Show the explanation")

1. Pull back two balls. Why do you never see a single ball fly out twice as fast? — Explanation: a single ball at 2v would conserve momentum (m · 2v = 2 m v), but its kinetic energy would be ½ m (2v)² = 2 m v² instead of 2 × ½ m v² = m v². Together, the two laws require two balls to swing out, at speed v.
2. Set the coefficient of restitution to 0.8 and let go of one ball. What happens to momentum and to kinetic energy? — Explanation: total momentum stays the same; kinetic energy drops with every collision, and eventually all the balls move a little.
3. Change the release angle from 20° to 40°. Does the speed at the lowest point double? — Explanation: almost. Since 1 − cos θ₀ = 2 sin² (θ₀/2), v = 2 sin (θ₀/2) √(g L). And sin 20° / sin 10° ≈ 1.97, so the speed is multiplied by 1.97. For small angles, it is almost proportional to the angle.

#### Valeurs de contrôle du pendule de Newton (calculées le 7 novembre 2026)

Avec m = 0,050 kg, L = 0,20 m, g = 9,8 m/s².

| θ₀ (°) | Vitesse au point bas (m/s) | p d’une bille (kg·m/s) | Ec d’une bille (J) |
| --- | --- | --- | --- |
| 10 | 0,2440 | 0,01220 | 0,001489 |
| 30 | 0,7247 | 0,03623 | 0,013130 |
| 45 | 1,0715 | 0,05358 | 0,028704 |

Vitesses après le choc au point bas, en fraction de la vitesse v des billes lâchées, billes numérotées de gauche à droite (ordre des chocs de la section 4.1) :

| Billes écartées | e | Vitesses après (billes 1 à 5) | p après / p avant | Ec après / Ec avant |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 ; 0 ; 0 ; 0 ; 1 | 1 | 1 |
| 2 | 1 | 0 ; 0 ; 0 ; 1 ; 1 | 1 | 1 |
| 1 | 0,9 | 0,0435 ; 0,0454 ; 0,0473 ; 0,0493 ; 0,8145 | 1 | 0,672 |
| 1 | 0,8 | 0,0775 ; 0,0829 ; 0,0887 ; 0,0948 ; 0,6561 | 1 | 0,460 |
| 2 | 0,8 | 0,1604 ; 0,1723 ; 0,1849 ; 0,7314 ; 0,7509 | 1 | 0,594 |

Choc isolé de deux billes, la seconde immobile, e = 0,8 : v₁′ = 0,1 v₁ et v₂′ = 0,9 v₁ ; énergie cinétique conservée : 82 %.

#### Pour aller plus loin — pendule de Newton

- OpenStax, *University Physics Volume 1*, section 8.3 « Conservation of Energy » (exemple 8.7 : le pendule simple) (en anglais) → `https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy`
- OpenStax, *University Physics Volume 1*, section 9.3 « Conservation of Linear Momentum » (en anglais) → `https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum`
- OpenStax, *University Physics Volume 1*, section 9.4 « Types of Collisions » (en anglais) → `https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions`
- Wikipédia, « Coefficient de restitution » → `https://fr.wikipedia.org/wiki/Coefficient_de_restitution` (EN : Wikipedia, “Coefficient of restitution” → `https://en.wikipedia.org/wiki/Coefficient_of_restitution`)
- S. Hutzler, G. Delaney, D. Weaire et F. MacLeod, « Rocking Newton’s cradle », *American Journal of Physics*, vol. 72, n° 12, p. 1508-1516, 2004 (en anglais) → `https://doi.org/10.1119/1.1783898` (EN : same reference, “pp. 1508–1516”)

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| Vitesse au point bas v = √(2 g L (1 − cos θ₀)) | OpenStax 8.3, exemple 8.7 (même formule : 1,62 m/s pour L = 1,0 m et 30°, vérifié avec la formule du site) |
| Quantité de mouvement conservée à chaque choc | OpenStax 9.3 |
| Énergie cinétique conservée seulement si le choc est élastique | OpenStax 9.4 |
| Définition du coefficient de restitution, e = 1 pour un choc élastique | Wikipédia « Coefficient de restitution » (source encyclopédique, à remplacer par un manuel si Jospin en indique un) |
| Vitesses après un choc en fonction de e, fraction perdue (1 − e²) / 2 | Déduites de la conservation de la quantité de mouvement et de la définition de e (calcul vérifié par les valeurs de contrôle) |
| « Un vrai pendule de Newton est plus subtil, car ses billes se touchent » | Hutzler et al. (2004) : la ligne de billes se sépare dès le premier choc, puis toutes les billes finissent par bouger ensemble |

## Historique

- Version 0.1 (23 novembre 2026) : décision du Labo ; publics ; adresses et table de correspondance ; expériences prévues ; stack statique sur Cloudflare Workers ; feuille de route L1 à L3 ; proposition pour la démo 3-SAT.
- Version 0.2 (24 novembre 2026) : racine `/` par un Worker limité à cette adresse ; stack vérifiée (sans adaptateur, TypeScript 5.9, ESLint 9) et configuration Cloudflare ; en-têtes de sécurité ; noms « Le Labo » et « The Lab », voix à la première personne ; licences MIT (code) et CC BY 4.0 (textes et figures) ; Cloudflare Web Analytics et page Confidentialité ; sitemap envoyé à la Search Console en L2 ; annexe B (textes de L1).
- Version 0.3 (24 novembre 2026) : étape L1.1 ; paragraphe « Mesure d’audience » de la page Confidentialité conditionné au jeton Web Analytics, et description de la page sans mention de la mesure d’audience, pour rester exacte dans les deux cas (section 6, annexe B.3) ; fichier technique `/_not-found` gardé, avec `noindex` (section 4).
- Version 0.4 (24 novembre 2026) : étape L2a ; L1 terminée ; physique publiée (section 2) ; modèles et conventions des expériences (section 4.1) ; menu et fil d’Ariane (section 5) ; règle Cloudflare « Labo : pas de mesure automatique » (section 6) ; L2 découpée en L2a et L2b (section 8) ; accueil avec la section « Physique », bloc provisoire retiré (annexe B.2) ; annexe C : page Physique, projectile et pendule de Newton, sources vérifiées le 24 novembre 2026.
