# Cahier des charges — le Labo de Cabrel FOSSO

Version 1.0, du 28 novembre 2026 : clôture de L4, la série « découverte » (sections 8 et 9) ; écarts acceptés lors de la réalisation (annexe E.1).

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
| Informatique | /fr/informatique | /en/computing | L3 (annexe D.1) |
| Une expérience de physique | /fr/physique/[nom] | /en/physics/[name] | L2 : `projectile` / `projectile` (annexe C.2) ; `pendule-de-newton` / `newtons-cradle` (annexe C.3) ; L4 : `refraction` / `refraction` (annexe E.2) |
| Une expérience d’informatique | /fr/informatique/[nom] | /en/computing/[name] | L3 : `transition-de-phase-3-sat` / `3-sat-phase-transition` (annexe D.3) ; L4 : `pensez-a-un-nombre` / `think-of-a-number` (annexe E.3) |
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
| Où se cachent les problèmes difficiles ? (transition de phase de 3-SAT) | Informatique | L3 | Nouvelle (annexe D) |
| La réfraction de la lumière | Physique | L4 | Nouvelle, série « découverte » (annexe E.2) |
| Pensez à un nombre (recherche dichotomique) | Informatique | L4 | Nouvelle, série « découverte » (annexe E.3) |
| IA explicable (ex-démo 4.3) : série temporelle jouet décomposée en niveau, tendance, calendrier ; volet « Expliquer coûte cher » sur le coût du calcul exact des valeurs de Shapley | Informatique | Après L4 | Prévue dans le cahier du portfolio (section 6) |
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
- **Pendule de Newton, ordre des chocs au point bas** : quand plusieurs billes se touchent, les chocs sont traités par balayages successifs **dans le sens du mouvement** : de gauche à droite quand la quantité de mouvement totale est positive ou nulle (billes lâchées à gauche, cas des valeurs de contrôle), de droite à gauche quand elle est négative (au retour), jusqu’à ce qu’aucune bille n’en rattrape une autre. Ainsi, le retour est l’image miroir exacte de l’aller. Les valeurs de contrôle de l’annexe C.3 dépendent de cet ordre. « Après le choc » désigne l’état atteint quand plus aucune bille n’en rattrape une autre.
- **Pendule de Newton, animation** : elle ne démarre qu’au bouton « Lâcher », puis continue ; bouton Pause / Reprendre (WCAG 2.2, critère 2.2.2) et ralenti ×0,1. Avec `prefers-reduced-motion`, le ralenti est coché par défaut.
- **Pendule de Newton, affichage** : barres de la quantité de mouvement totale et de l’énergie cinétique totale, avant et après le choc, à la même échelle ; valeurs chiffrées en unités SI (p en kg·m/s, Ec en J), 3 chiffres significatifs.
- **Sources** : chaque expérience a sa rubrique « Pour aller plus loin » (annexes C.2 et C.3). Le tableau « Affirmations et sources » de chaque annexe dit quelle source appuie quelle affirmation ; il sert à la relecture et n’est pas affiché sur le site.

## 5. Identité visuelle

- Même identité que le portfolio : couleurs, polices (Space Grotesk, Inter, JetBrains Mono, hébergées avec le site), papier millimétré, thème sombre par défaut, typographie française. Source : section 7 du cahier du portfolio et `docs/design-system.md`, recopiés dans le dépôt du Labo à l’étape L1 ; pas de paquet partagé.
- En-tête (barre flottante du portfolio) : « Le Labo » / « The Lab », avec « Cabrel FOSSO » ; sélecteur FR/EN ; bouton de thème ; lien « Portfolio » vers `https://cabrelfosso.com/fr` ou `/en`. Menu : une entrée par catégorie publiée, à partir de L2 « Physique » / « Physics » (annexe C.1), puis à partir de L3 « Informatique » / « Computing » (annexe D.1) ; elle a le style de page courante sur la page de catégorie et sur ses expériences, et `aria-current="page"` seulement sur la page de catégorie elle-même. Sous 480 px, le menu passe sur une seconde ligne de la barre, sans défilement horizontal. Sous 640 px, « Cabrel FOSSO » est masqué visuellement dans la barre (il reste dans le nom accessible du lien), pour que le menu tienne sur la première ligne dès 480 px.
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
| L2a. Déménagement, côté Labo (terminée le 24 novembre 2026 : version `7ba02663` ; sitemap envoyé dans la propriété « domaine » `cabrelfosso.com` de la Search Console, 10 pages découvertes) | Projectile et pendule de Newton (code, tests, textes, sources) ; page Physique ; menu et fil d’Ariane ; accueil avec la section « Physique », sans le bloc provisoire ; mise en ligne ; sitemap envoyé à la Search Console |
| L2b. Déménagement, côté portfolio (terminée le 24 novembre 2026 : version du portfolio `f10afe9f` ; six redirections 308 mesurées par `curl` et par les tests `smoke` du portfolio) | Dans le dépôt du portfolio : redirections permanentes (308, que Google traite comme une 301) selon la table de la section 2, liens vers le Labo, lien du bandeau d’actualité, retrait du code des démos (section 15 du cahier du portfolio) |
| L3. Transition de phase de 3-SAT (terminée le 25 novembre 2026 : version `42c36b41` ; contrôles de Jospin conformes : PageSpeed Insights mobile, durées de calcul sur téléphone, affichage de ∨ et ∧, sitemap de 14 adresses renvoyé à la Search Console) | Annexe D : page Informatique, expérience « Où se cachent les problèmes difficiles ? » (générateur, solveur DPLL, courbes, mode pas à pas, textes, sources), menu, accueil avec la section « Informatique » ; mise en ligne |
| L4. Série « découverte » (terminée : mise en ligne le 25 novembre 2026, contrôlée en ligne par Claude ; contrôles de Jospin conformes le 28 novembre 2026 : PageSpeed Insights mobile, essai sur téléphone, sitemap de 18 adresses renvoyé à la Search Console) | Annexe E : la réfraction de la lumière (physique) et « Pensez à un nombre » (informatique), pages courtes et visuelles ; mise en ligne |
| Ensuite | IA explicable, puis les autres expériences de la section 3 |

## 9. Checklist de recette

- [x] Lighthouse mobile ≥ 95 dans les 4 catégories, sur l’accueil et sur une expérience (PageSpeed Insights, vérifié par Jospin le 25 novembre 2026 sur les deux expériences de physique, puis sur la page 3-SAT et la page Informatique, puis le 28 novembre 2026 sur les pages de la série « découverte »).
- [ ] Navigation complète au clavier, focus visible.
- [ ] Aucun lien mort.
- [ ] Aperçu correct au partage, en FR et en EN.
- [ ] Domaine, URL canonique et sitemap sur `lab.cabrelfosso.com`.
- [ ] `/` redirige vers `/fr` ou `/en` selon la langue du navigateur.
- [x] Anciennes adresses du portfolio redirigées, sans aucun 404 (vérifié le 24 novembre 2026 : six redirections 308 ; confirmé dans le navigateur par Jospin le 25 novembre 2026).
- [ ] Aucun TODO ni texte de remplissage visible.

## Annexe A — Démo 3-SAT (proposition de la version 0.1, remplacée)

Remplacée par l’annexe D à la version 0.7. Changements : pas de α de 0,2 au lieu de 0,25 (le nombre de clauses doit être entier) ; « nombre de choix » au lieu de « nombre d’embranchements » ; seuil cité « voisin de 4,27 », d’après la méthode de la cavité ; sources primaires vérifiées ; arXiv cond-mat/0111153 retiré (il traite d’énigmes difficiles à solution cachée, pas de la valeur du seuil).

Source gardée pour la future démo IA explicable : Van den Broeck, Lykov, Schleich et Suciu, « On the Tractability of SHAP Explanations », AAAI 2021, DOI 10.1609/aaai.v35i7.16806.

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
- Description : Des expériences de physique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton, le trajet de la lumière. / Physics experiments you can set up yourself: the path of a projectile, the collisions in Newton’s cradle, and the path of light.
- Titre : Physique / Physics
- Introduction : Des expériences de physique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton, le trajet de la lumière. / Physics experiments you can set up yourself: the path of a projectile, the collisions in Newton’s cradle, and the path of light.
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
- EN : OpenStax, *University Physics Volume 1*, section 4.3 “Projectile Motion” → same link

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
- Wikipédia, « Coefficient de restitution » → `https://fr.wikipedia.org/wiki/Coefficient_de_restitution`
- S. Hutzler, G. Delaney, D. Weaire et F. MacLeod, « Rocking Newton’s cradle », *American Journal of Physics*, vol. 72, n° 12, p. 1508-1516, 2004 (en anglais) → `https://doi.org/10.1119/1.1783898`

English (same links, except Wikipedia):

- OpenStax, *University Physics Volume 1*, section 8.3 “Conservation of Energy” (Example 8.7: the simple pendulum)
- OpenStax, *University Physics Volume 1*, section 9.3 “Conservation of Linear Momentum”
- OpenStax, *University Physics Volume 1*, section 9.4 “Types of Collisions”
- Wikipedia, “Coefficient of restitution” → `https://en.wikipedia.org/wiki/Coefficient_of_restitution`
- S. Hutzler, G. Delaney, D. Weaire and F. MacLeod, “Rocking Newton’s cradle”, *American Journal of Physics*, vol. 72, no. 12, pp. 1508–1516, 2004

Le lien DOI répond 403 aux outils automatiques (vérification de L2a) ; il s’ouvre normalement dans un navigateur.

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| Vitesse au point bas v = √(2 g L (1 − cos θ₀)) | OpenStax 8.3, exemple 8.7 (même formule : 1,62 m/s pour L = 1,0 m et 30°, vérifié avec la formule du site) |
| Quantité de mouvement conservée à chaque choc | OpenStax 9.3 |
| Énergie cinétique conservée seulement si le choc est élastique | OpenStax 9.4 |
| Définition du coefficient de restitution, e = 1 pour un choc élastique | Wikipédia « Coefficient de restitution » (source encyclopédique, à remplacer par un manuel si Jospin en indique un) |
| Vitesses après un choc en fonction de e, fraction perdue (1 − e²) / 2 | Déduites de la conservation de la quantité de mouvement et de la définition de e (calcul vérifié par les valeurs de contrôle) |
| « Un vrai pendule de Newton est plus subtil, car ses billes se touchent » | Hutzler et al. (2004) : la ligne de billes se sépare dès le premier choc, puis toutes les billes finissent par bouger ensemble |

## Annexe D — Expérience d’informatique : la transition de phase de 3-SAT (étape L3)

Paramètres choisis le 25 novembre 2026 (n par Jospin, les autres choix délégués à Claude), sources vérifiées le 25 novembre 2026, textes rédigés par Claude et acceptés par Jospin le 25 novembre 2026 pour lancer L3. Remplace l’annexe A. Les textes sont repris mot pour mot ; seule la typographie des espaces est appliquée dans le code.

### D.1 Menu, page Informatique et accueil

| Clé | Français | English |
| --- | --- | --- |
| Entrée du menu | Informatique | Computing |
| Fil d’Ariane, page de catégorie | Le Labo › Informatique | The Lab › Computing |
| Fil d’Ariane, expérience | Le Labo › Informatique › Où se cachent les problèmes difficiles ? | The Lab › Computing › Where are the hard problems? |

**Page Informatique — /fr/informatique · /en/computing**

- Titre de l’onglet : Informatique — Le Labo / Computing — The Lab
- Description : Des expériences d’informatique à lancer vous-même, en commençant par les énigmes logiques 3-SAT : où se trouvent les problèmes vraiment difficiles ? / Computing experiments you can run yourself, starting with 3-SAT logic puzzles: where are the truly hard problems?
- Titre : Informatique / Computing
- Introduction : identique à la description.
- Une carte par expérience publiée, avec les textes des cartes de l’accueil, chacune avec sa petite figure décorative.

**Accueil : section « Informatique »** (juste après la section « Physique », même présentation)

- Titre : Informatique / Computing
- Carte de l’expérience : titre « Où se cachent les problèmes difficiles ? » ; texte « Des énigmes logiques tirées au hasard : réglez leur nombre de contraintes et voyez où le solveur peine. » ; lien « Ouvrir l’expérience »
- EN card: title “Where are the hard problems?”; text “Randomly generated logic puzzles: change how constrained they are and see where the solver struggles.”; link “Open the experiment”
- Lien sous la carte : Toutes les expériences d’informatique → `/fr/informatique` / All computing experiments → `/en/computing`

### D.2 Modèle et conventions

Tout ce qui suit est une convention du site, choisie pour que le calcul soit reproductible et testable. Les sources (D.3) appuient le modèle de tirage et l’algorithme ; les nombres de choix sont propres à ce solveur.

**Réglages et plages**

| Élément | Convention |
| --- | --- |
| Nombre de variables n | 20, 30, 40 ou 50 ; 40 par défaut |
| α (clauses par variable) | 26 valeurs : α = (10 + k) / 5 pour k = 0 à 25, soit 2,0 ; 2,2 ; … ; 7,0. Nombre de clauses m = n (10 + k) / 5, calculé en nombres entiers (toujours entier pour les n autorisés) |
| Énigmes par valeur de α (F) | 10, 20, 50 ou 100 ; 20 par défaut |
| Graine | Entier de 1 à 999 999 ; 2026 par défaut ; affichée et modifiable. Valeur invalide : message d’erreur, calcul non lancé |

**Hasard reproductible**

- Générateur : xoshiro128++ 1.0 de D. Blackman et S. Vigna (sorties de 32 bits), initialisé par SplitMix64, comme le recommandent les auteurs (`https://prng.di.unimi.it/`, consulté le 25 novembre 2026). Code de référence en C, domaine public, recopié tel quel dans sa logique.
- Clé de 64 bits d’un flux : clé = graine × 2³² + tag × 2²⁴ + n × 2¹⁶ + k × 2⁸ + j, avec tag = 0 pour les courbes, 1 pour le mode pas à pas ; k = indice de α ; j = indice de l’énigme (0 à F − 1 ; pour le mode pas à pas, k = 0 et j = numéro de l’énigme moins 1, de 0 à 255).
- Initialisation : l’état de SplitMix64 vaut la clé ; z₁ et z₂ sont ses deux premières sorties ; l’état de xoshiro128++ est (s₀, s₁, s₂, s₃) = (32 bits bas de z₁, 32 bits hauts de z₁, 32 bits bas de z₂, 32 bits hauts de z₂).
- Chaque énigme a son propre flux : passer de 20 à 50 énigmes par valeur de α garde les 20 premières identiques.
- Variable au hasard : à partir d’une sortie r (entier de 0 à 2³² − 1), la variable vaut 1 + ⌊r × n / 2³²⌋. Le biais de cette méthode est inférieur à n / 2³², négligeable ici.

**Tirage d’une énigme** (modèle de Mitchell, Selman et Levesque, 1992)

- Les m clauses sont tirées l’une après l’autre, indépendamment : deux clauses identiques sont permises.
- Pour une clause : on tire des variables jusqu’à en avoir trois différentes (une variable déjà tirée pour cette clause est rejetée), dans l’ordre du tirage ; puis, pour chacune des trois dans cet ordre, une sortie r : la variable est niée si le bit de poids fort de r vaut 1.
- Les clauses sont numérotées de 1 à m dans l’ordre du tirage ; les littéraux gardent l’ordre du tirage.

**Solveur (DPLL, version simple)**

1. Propagation, répétée tant qu’elle change quelque chose : on parcourt les clauses dans l’ordre de leurs numéros ; la première clause fausse (tous ses littéraux faux) provoque un conflit ; sinon, la première clause unitaire (aucun littéral vrai, un seul littéral libre) impose la valeur qui rend ce littéral vrai.
2. Si toutes les clauses sont vraies : solution, arrêt.
3. Sinon, choix : la variable libre de plus petit numéro qui figure dans une clause pas encore vraie ; on essaie d’abord « vrai », puis « faux ».
4. Conflit : retour en arrière au dernier choix dont la seconde valeur n’a pas été essayée.
5. Si les deux valeurs du premier choix ont échoué : l’énigme est insatisfiable.

Pas de règle du littéral pur, pas d’apprentissage de clauses : le solveur s’arrête à la première solution.

**Mesure**

- Nombre de choix d’une énigme : nombre d’affectations faites à l’étape 3 (les deux essais d’une même variable comptent ; les affectations par propagation ne comptent pas). Il vaut toujours au moins 1 pour les énigmes des courbes, car aucune clause n’est unitaire au départ.
- Pour chaque n et chaque α : part des énigmes satisfiables (en %, arrondie à l’entier) et médiane du nombre de choix. Médiane d’un nombre pair de valeurs : moyenne des deux valeurs centrales (elle peut finir par ,5).
- Résumé d’une courbe : a et b = les valeurs de α qui encadrent le premier α où la part satisfiable passe **sous** 50 % (exactement 50 % n’est pas « sous ») ; c = le α de la plus grande médiane (le plus petit α en cas d’égalité) et d = cette médiane. α toujours affiché avec une décimale.

**Affichage**

- Deux graphiques SVG superposés, même axe horizontal (α de 2 à 7) : part satisfiable (0 à 100 %, échelle linéaire) ; médiane du nombre de choix (échelle logarithmique, graduations aux puissances de 10, de 1 à la première puissance de 10 au-dessus du maximum affiché).
- Ligne verticale pointillée à α = 4,27, avec sa légende.
- Une courbe par n calculé (au plus quatre), chacune avec un style de trait et un marqueur différents (cercle, carré, triangle, losange pour n = 20, 30, 40, 50) ; jamais la couleur seule. Relancer un n remplace sa courbe ; « Effacer les courbes » les retire toutes.
- Résumé textuel de chaque courbe et tableau repliable des valeurs (textes en D.3).

**Exécution**

- Rien n’est calculé au chargement de la page pour les courbes : le calcul démarre au bouton « Lancer », dans un Web Worker.
- Le calcul avance valeur de α par valeur de α ; la courbe se dessine au fur et à mesure. « Pause » prend effet à la fin de la valeur de α en cours ; « Arrêter » interrompt tout de suite (la courbe partielle est retirée). Changer un réglage pendant un calcul est impossible (réglages désactivés).
- Annonce aux lecteurs d’écran (`aria-live="polite"`) seulement à la fin ou à l’arrêt du calcul.
- Objectifs, mesurés sur le téléphone de Jospin : calcul par défaut (n = 40, 20 énigmes) en 3 s au plus ; n = 50 avec 100 énigmes en 30 s au plus. Atteints (vérifié par Jospin le 25 novembre 2026).

**Mode pas à pas**

- Énigme de 6 variables et 24 clauses (tag = 1, k = 0), tirée de la graine courante.
- Énigme de départ : la première, de numéro 1 à 256 (j = 0 à 255), dont la résolution contient au moins un conflit ; s’il n’y en a aucune, la numéro 1. « Autre énigme » passe au numéro suivant (après 256, retour à 1). Changer la graine recalcule l’énigme de départ.
- Une étape = un événement de la trace du solveur : choix, propagation, conflit, retour en arrière, puis solution ou « aucune solution ». Aucune lecture automatique.
- Chaque clause affiche son numéro, ses littéraux et son état (texte et icône, pas la couleur seule) : satisfaite, fausse, unitaire, en attente.
- Les indices (x₁…x₆) sont des indices HTML ; chaque clause a un nom accessible en mots (« x₁ ou non x₃ ou x₅ »).

**Écarts acceptés lors de la réalisation (L3, 25 novembre 2026)**

- Graine : champ texte avec clavier numérique (un champ numérique ne laisse pas traiter « abc ») ; le message d’erreur s’affiche dès la saisie.
- Boutons indisponibles : `aria-disabled` plutôt que `disabled`, pour garder le focus ; « Effacer les courbes » est indisponible pendant un calcul.
- « Arrêter » pendant le recalcul d’un n déjà tracé : l’ancienne courbe de ce n réapparaît (rien n’est perdu).
- Erreur du Web Worker : le message « Calcul arrêté. » s’affiche (aucun autre texte n’existe dans le cahier).
- Variable libre dans le message de solution : « x₂ libre (n’importe quelle valeur convient) », sans signe « = ».
- ∨ et ∧ ne sont pas dans les polices hébergées : ils viennent d’une police de repli du système, comme √ (section 4.1). Affichage vérifié sur le téléphone de Jospin le 25 novembre 2026.
- Turbopack publie aussi une copie brute, non utilisée, de `curves.worker.ts` dans `out/_next/static/media/` ; le Worker réel est un fichier JavaScript compilé. `tsconfig.json` exclut `out`.

### D.3 Où se cachent les problèmes difficiles ? — /fr/informatique/transition-de-phase-3-sat · /en/computing/3-sat-phase-transition

#### 3-SAT — français

- **Titre de l’onglet** : Où se cachent les problèmes difficiles ? — Le Labo
- **Description** : Expérience interactive sur la transition de phase de 3-SAT : part des énigmes logiques qui ont une solution et effort d’un solveur DPLL, calculés dans votre navigateur.
- **Titre de la page** : Où se cachent les problèmes difficiles ?
- **Sous-titre** : La transition de phase de 3-SAT
- **Introduction** : L’ordinateur fabrique au hasard des énigmes logiques. Avec peu de contraintes, presque toutes ont une solution ; avec beaucoup, presque aucune. Entre les deux se trouve une zone étroite où le solveur peine le plus. Réglez, lancez, et voyez où elle se trouve.
- **Mention** : Niveau : TODO(Jospin): niveau concerné. (masquée tant que le niveau manque)

**L’expérience**

| Réglage | Étiquette | Valeurs | Valeur de départ |
| --- | --- | --- | --- |
| n | Nombre de variables (n) | 20 · 30 · 40 · 50 | 40 |
| F | Énigmes par valeur de α | 10 · 20 · 50 · 100 | 20 |
| Graine | Graine du hasard | Entier de 1 à 999 999 | 2026 |

- Aide sous la graine : Même graine, mêmes énigmes : vous pouvez refaire exactement le même calcul.
- Erreur de graine : Entrez un nombre entier de 1 à 999 999.
- Boutons : Lancer · Pause · Reprendre · Arrêter · Effacer les courbes
- Progression : Calcul pour n = {n} : α = {α} ({i} / 26)
- Fin du calcul : Calcul terminé pour n = {n} : {total} énigmes résolues.
- Arrêt : Calcul arrêté.
- Graphique 1 : Énigmes qui ont une solution (%)
- Graphique 2 : Nombre de choix du solveur (médiane, échelle logarithmique)
- Axe horizontal : α = clauses / variables
- Légende : n = {n} ; ligne pointillée : 4,27 : prédiction pour n très grand
- Avant tout calcul : Choisissez n, puis lancez le calcul.
- Résumé d’une courbe : n = {n} : la part des énigmes qui ont une solution passe sous 50 % entre α = {a} et α = {b} ; le solveur fait le plus de choix à α = {c} (médiane {d}).
- Variante : n = {n} : la part des énigmes qui ont une solution reste d’au moins 50 % sur toute la plage ; le solveur fait le plus de choix à α = {c} (médiane {d}).
- Variante : n = {n} : la part des énigmes qui ont une solution est sous 50 % dès α = {a} ; le solveur fait le plus de choix à α = {c} (médiane {d}).
- Tableau repliable : Voir les valeurs ; colonnes : α · n = {n} : ont une solution (%) · n = {n} : choix (médiane)

**Pas à pas : le solveur sur une petite énigme**

- Introduction : Une énigme de 6 variables (x₁ à x₆) et 24 clauses, tirée de la même graine. La première énigme proposée est celle où le solveur doit revenir en arrière au moins une fois. Suivez chaque décision du solveur.
- Numéro : Énigme n° {numéro}
- Boutons : Étape suivante · Recommencer · Autre énigme
- Compteur : Choix : {k}
- États d’une clause : satisfaite · fausse · unitaire (un seul littéral encore possible) · en attente
- Clause lue à voix haute : « x₁ ou non x₃ ou x₅ » (affichée x₁ ∨ ¬x₃ ∨ x₅)
- Messages :
  - Choix : x{i} = vrai.
  - Choix : x{i} = faux (on essaie l’autre valeur).
  - Propagation : la clause {c} n’a plus qu’un littéral possible, donc x{i} = {valeur}.
  - Conflit : la clause {c} est fausse.
  - Retour en arrière : on annule le choix de x{i} et tout ce qui l’a suivi.
  - Solution trouvée après {k} choix : {affectation}.
  - Aucune solution : toutes les possibilités ont été éliminées, après {k} choix.
- Valeurs : vrai · faux · libre (n’importe quelle valeur convient)

**Le problème et l’algorithme**

- **Le problème 3-SAT** : Une variable booléenne vaut vrai ou faux. Un littéral est une variable (x) ou sa négation (non x, notée ¬x). Une clause relie trois littéraux par « ou » : elle est vraie si au moins un des trois est vrai. Elle n’interdit donc qu’une seule des 8 combinaisons de ses trois variables. Une énigme (formule 3-SAT) demande de rendre vraies toutes ses clauses à la fois. Elle est satisfiable s’il existe une telle affectation, insatisfiable sinon.
- **Exemple** : (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃). Avec x₃ = vrai, les deux clauses sont vraies : l’énigme est satisfiable.
- **Le réglage α** est le nombre de clauses par variable : avec n = 40 et α = 4,2, l’énigme compte 168 clauses.
- **Comment les énigmes sont tirées** : chaque clause prend trois variables différentes au hasard, et chacune est niée avec une chance sur deux. Les clauses sont tirées indépendamment les unes des autres, comme dans l’expérience de Mitchell, Selman et Levesque (1992).
- **Le solveur (algorithme DPLL)**, du nom de Davis, Putnam, Logemann et Loveland, dans une version simple :
  1. Propagation : si une clause n’a plus qu’un littéral possible, ce littéral doit être vrai.
  2. Si une clause est fausse : conflit ; on revient au dernier choix et on essaie l’autre valeur.
  3. Si toutes les clauses sont vraies : solution trouvée.
  4. Sinon, choix : on prend la plus petite variable libre d’une clause pas encore vraie, et on essaie d’abord « vrai », puis « faux ».
- S’il a essayé les deux valeurs de chaque choix sans succès, le solveur a prouvé que l’énigme n’a pas de solution.
- **Ce que l’on mesure** : le nombre de choix (étape 4), pour chaque énigme. La médiane est la valeur du milieu : la moitié des énigmes demandent moins de choix, l’autre moitié plus. Sur le second graphique, chaque graduation multiplie le nombre de choix par 10 (échelle logarithmique).

**Que sait-on du seuil ?**

- En 1992, Mitchell, Selman et Levesque observent que les énigmes les plus difficiles pour ce type de solveur se trouvent là où la moitié a une solution : vers α = 4,3 pour 50 variables, et vers 4,55 pour 20 variables.
- Des physiciens ont calculé une valeur voisine de 4,27 pour n très grand, en 2002, par une méthode issue de l’étude des verres de spin (la méthode de la cavité). C’est un calcul, pas une démonstration.
- Les mathématiciens ont démontré qu’en dessous de 3,52, presque toutes les énigmes ont une solution, et qu’au-dessus de 4,49, presque aucune, quand n devient très grand. Pour 3-SAT, on n’a pas démontré qu’il existe une valeur précise du seuil. On l’a démontré en 2022 pour des clauses beaucoup plus longues.

**P, NP et cette expérience**

- **P** : les problèmes qu’un algorithme résout en un nombre d’étapes borné par un polynôme de la taille de l’énoncé (par exemple n² ou n³) ; on dit « en temps polynomial ».
- **NP** : les problèmes dont une solution proposée se vérifie en temps polynomial. Pour 3-SAT, vérifier une affectation est facile : on relit chaque clause.
- **NP-complet** : un problème de NP auquel tous les problèmes de NP se ramènent en temps polynomial. Stephen Cook a démontré en 1971 que SAT est NP-complet ; 3-SAT l’est aussi.
- La question « P = NP ? » demande si tout problème dont la solution se vérifie vite peut aussi se résoudre vite. Elle n’est pas résolue.
- La NP-complétude parle du pire cas. Une énigme tirée au hasard n’est pas forcément difficile : cette expérience regarde les cas typiques.
- Cette expérience n’apporte pas de réponse à la question P = NP. Elle montre où se trouvent, en pratique, les énigmes difficiles pour un solveur.

**Hypothèses** : Les énigmes sont aléatoires : les résultats ne disent rien directement des énigmes tirées de problèmes réels. Les tailles sont petites (50 variables au plus) : le passage à 50 % se fait au-dessus de 4,27, et il se rapproche de cette valeur quand n augmente. Le nombre de choix dépend du solveur : un autre algorithme donnerait d’autres nombres, et des travaux ont montré que la difficulté dépend aussi du solveur choisi.

**À essayer** (chaque question a son explication repliable, intitulée « Voir l’explication »)

1. Lancez le calcul pour n = 20, puis pour n = 50, sans effacer. Que devient la courbe des énigmes qui ont une solution ? — Explication : pour n = 50, elle descend plus brutalement, et elle passe sous 50 % plus près de 4,27. Plus l’énigme est grande, plus la transition est nette : c’est l’effet de taille finie.
2. Où se trouve le pic du nombre de choix par rapport au passage à 50 % ? — Explication : presque au même endroit. À gauche, les solutions sont nombreuses et les premiers choix réussissent. À droite, les contraintes sont si nombreuses que les conflits arrivent vite, et le solveur prouve rapidement qu’il n’y a pas de solution. Au milieu, il doit explorer beaucoup de pistes avant de conclure.
3. Pour n = 20, recommencez avec une autre graine. Pourquoi la courbe change-t-elle ? — Explication : 20 énigmes par valeur de α forment un petit échantillon ; le hasard des tirages se voit. Avec 100 énigmes, la courbe devient plus régulière.

#### 3-SAT — English

- **Tab title**: Where are the hard problems? — The Lab
- **Description**: Interactive experiment on the 3-SAT phase transition: the share of random logic puzzles that have a solution, and how hard a DPLL solver works, computed in your browser.
- **Page heading**: Where are the hard problems?
- **Subtitle**: The 3-SAT phase transition
- **Intro**: The computer generates random logic puzzles. With few constraints, almost all of them have a solution; with many, almost none do. In between lies a narrow zone where the solver struggles most. Set it up, run it, and see where that zone is.
- **Note**: Level: TODO(Jospin): level. (hidden while missing)

**The experiment**

- Controls: Number of variables (n) · Puzzles per value of α · Random seed. Same values, ranges and defaults as the French version.
- Help under the seed: Same seed, same puzzles: you can rerun exactly the same calculation.
- Seed error: Enter a whole number from 1 to 999,999.
- Buttons: Run · Pause · Resume · Stop · Clear curves
- Progress: Computing n = {n}: α = {α} ({i} / 26)
- End of run: Done for n = {n}: {total} puzzles solved.
- Stopped: Calculation stopped.
- Chart 1: Puzzles that have a solution (%)
- Chart 2: Solver decisions (median, log scale)
- x-axis: α = clauses / variables
- Legend: n = {n}; dashed line: 4.27: prediction for very large n
- Before any run: Choose n, then run the calculation.
- Curve summary: n = {n}: the share of puzzles with a solution drops below 50% between α = {a} and α = {b}; the solver makes the most decisions at α = {c} (median {d}).
- Variant: n = {n}: the share of puzzles with a solution stays at 50% or more across the whole range; the solver makes the most decisions at α = {c} (median {d}).
- Variant: n = {n}: the share of puzzles with a solution is below 50% from α = {a}; the solver makes the most decisions at α = {c} (median {d}).
- Collapsible table: Show the values; columns: α · n = {n}: have a solution (%) · n = {n}: decisions (median)

**Step by step: the solver on a small puzzle**

- Intro: A puzzle with 6 variables (x₁ to x₆) and 24 clauses, drawn from the same seed. The first puzzle shown is one where the solver has to backtrack at least once. Follow each decision the solver makes.
- Number: Puzzle no. {number}
- Buttons: Next step · Start over · Another puzzle
- Counter: Decisions: {k}
- Clause states: satisfied · false · unit (only one literal left) · pending
- Clause read aloud: “x₁ or not x₃ or x₅”
- Messages:
  - Decision: x{i} = true.
  - Decision: x{i} = false (trying the other value).
  - Propagation: clause {c} has only one literal left, so x{i} = {value}.
  - Conflict: clause {c} is false.
  - Backtrack: undo the decision on x{i} and everything after it.
  - Solution found after {k} decisions: {assignment}.
  - No solution: every possibility has been ruled out, after {k} decisions.
- Values: true · false · free (any value works)

**The problem and the algorithm**

- **The 3-SAT problem**: A Boolean variable is either true or false. A literal is a variable (x) or its negation (not x, written ¬x). A clause joins three literals with “or”: it is true if at least one of them is true, so it rules out only one of the 8 combinations of its three variables. A puzzle (a 3-SAT formula) asks for all its clauses to be true at once. It is satisfiable if such an assignment exists, and unsatisfiable otherwise.
- **Example**: (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃). With x₃ = true, both clauses are true, so the puzzle is satisfiable.
- **The α setting** is the number of clauses per variable: with n = 40 and α = 4.2, the puzzle has 168 clauses.
- **How the puzzles are drawn**: each clause picks three different variables at random and negates each one with probability one half. Clauses are drawn independently of each other, as in the experiment by Mitchell, Selman and Levesque (1992).
- **The solver (the DPLL algorithm)**, after Davis, Putnam, Logemann and Loveland, in a simple version:
  1. Propagation: if a clause has only one literal left, that literal must be true.
  2. If a clause is false: conflict; go back to the last decision and try the other value.
  3. If every clause is true: solution found.
  4. Otherwise, decide: take the lowest-numbered free variable in a clause that isn’t true yet, and try “true” first, then “false”.
- If both values of every decision have failed, the solver has proved that the puzzle has no solution.
- **What we measure**: the number of decisions (step 4) for each puzzle. The median is the middle value: half the puzzles need fewer decisions, half need more. On the second chart, each gridline multiplies the number of decisions by 10 (log scale).

**What do we know about the threshold?**

- In 1992, Mitchell, Selman and Levesque observed that the hardest puzzles for this kind of solver lie where half of them have a solution: around α = 4.3 for 50 variables, and around 4.55 for 20 variables.
- In 2002, physicists computed a value close to 4.27 for very large n, using a method from the study of spin glasses (the cavity method). It is a calculation, not a proof.
- Mathematicians have proved that below 3.52 almost all puzzles have a solution, and above 4.49 almost none do, as n becomes very large. For 3-SAT, nobody has proved that the threshold has one precise value. That was proved in 2022 for much longer clauses.

**P, NP and this experiment**

- **P**: problems an algorithm can solve in a number of steps bounded by a polynomial in the size of the input (such as n² or n³), known as “polynomial time”.
- **NP**: problems where a proposed solution can be checked in polynomial time. For 3-SAT, checking an assignment is easy: read through every clause.
- **NP-complete**: a problem in NP to which every problem in NP can be reduced in polynomial time. In 1971, Stephen Cook proved that SAT is NP-complete; 3-SAT is too.
- The question “P = NP?” asks whether every problem whose solution can be checked quickly can also be solved quickly. It remains open.
- NP-completeness is about the worst case. A randomly drawn puzzle isn’t necessarily hard: this experiment looks at typical cases.
- This experiment does not answer the P = NP question. It shows where, in practice, the puzzles that are hard for a solver are found.

**Assumptions**: The puzzles are random, so the results say nothing directly about puzzles that come from real-world problems. The sizes are small (50 variables at most): the 50% crossing happens above 4.27 and moves closer to it as n grows. The number of decisions depends on the solver: another algorithm would give other numbers, and research has shown that hardness also depends on the solver used.

**Try this** (collapsible “Show the explanation”)

1. Run n = 20, then n = 50, without clearing. What happens to the curve of puzzles that have a solution? — Explanation: for n = 50 it drops more steeply and falls below 50% closer to 4.27. The bigger the puzzles, the sharper the transition: this is a finite-size effect.
2. Where is the peak in decisions compared with the 50% crossing? — Explanation: almost in the same place. On the left, there are many solutions and the first decisions succeed. On the right, there are so many constraints that conflicts come quickly and the solver soon proves there is no solution. In the middle, it has to explore many paths before it can conclude.
3. With n = 20, run it again with another seed. Why does the curve change? — Explanation: 20 puzzles per value of α is a small sample, so the randomness of the draw shows. With 100 puzzles, the curve becomes smoother.

#### Valeurs de contrôle de 3-SAT (calculées le 25 novembre 2026)

Calculées par Claude avec une implantation de référence indépendante : le hasard en C (code des auteurs, compilé avec gcc), le tirage en C et en JavaScript (identiques sur 6 clés), deux solveurs JavaScript (l’un suit D.2 à la lettre, l’autre utilise des compteurs) qui donnent le même résultat et le même nombre de choix sur 2 080 énigmes (graine 2026, n = 20 à 50, 20 énigmes par α). Les traces H2 et H3 ont été refaites à la main. Le code du site doit retrouver ces valeurs, sans qu’on ajuste une valeur attendue.

**Hasard**

- SplitMix64, état initial 0, trois premières sorties : 0xe220a8397b1dcdaf ; 0x6e789e6aa1b965f4 ; 0x06c45d188009454f.
- Clé (graine 2026, tag 0, n = 20, k = 0, j = 0) = 0x000007ea00140000 : état initial de xoshiro128++ 83533ed4 3607ec65 3bf32353 a89a7ffe (hexadécimal) ; six premières sorties : 2050140137 ; 1402195668 ; 789525893 ; 2849562376 ; 2645018862 ; 428651170.
- Clé (graine 1, tag 1, n = 6, k = 0, j = 0) = 0x0000000101060000 : état e990fa20 f15177e1 3348dad9 22ea1f7c ; sorties 656263206 ; 4067180487 ; 605260372 ; 1371088429 ; 27368953 ; 1481644471.

**Tirage**

- Graine 2026, n = 20, k = 0, j = 0 : cinq premières clauses (−x = non x) : (−10, −7, 4) ; (7, −10, 4) ; (−11, 3, 18) ; (20, −8, −1) ; (−6, −13, 18).
- Mode pas à pas, graine 2026, énigme n° 2 (j = 1), 24 clauses : c1 (4, −5, −1) ; c2 (6, −5, −4) ; c3 (−2, −1, −4) ; c4 (6, 3, 5) ; c5 (−1, −2, 4) ; c6 (5, −1, −3) ; c7 (−5, 4, 1) ; c8 (−2, 6, −1) ; c9 (−4, −6, 1) ; c10 (3, 4, 1) ; c11 (3, 6, 2) ; c12 (4, −6, 3) ; c13 (−4, 3, −1) ; c14 (3, −5, 2) ; c15 (−2, 4, 3) ; c16 (−4, −3, 6) ; c17 (4, −2, −3) ; c18 (−3, 4, 2) ; c19 (−6, 4, 1) ; c20 (3, −2, 5) ; c21 (6, 4, −2) ; c22 (4, −2, −1) ; c23 (4, 3, 2) ; c24 (5, 3, 2).

**Solveur : petites énigmes écrites à la main**

| Énigme | n | Clauses | Résultat | Choix | Trace |
| --- | --- | --- | --- | --- | --- |
| H1 | 3 | (1, 2, 3) | satisfiable : x₁ = vrai, x₂ et x₃ libres | 1 | choix x₁ = vrai ; solution |
| H2 | 3 | les 8 clauses sur x₁, x₂, x₃, dans l’ordre (1, 2, 3) ; (1, 2, −3) ; (1, −2, 3) ; (1, −2, −3) ; (−1, 2, 3) ; (−1, 2, −3) ; (−1, −2, 3) ; (−1, −2, −3) | insatisfiable | 6 | choix x₁ = vrai ; choix x₂ = vrai ; propagation c7 : x₃ = vrai ; conflit c8 ; retour x₂ ; choix x₂ = faux ; propagation c5 : x₃ = vrai ; conflit c6 ; retour x₂ ; retour x₁ ; choix x₁ = faux ; choix x₂ = vrai ; propagation c3 : x₃ = vrai ; conflit c4 ; retour x₂ ; choix x₂ = faux ; propagation c1 : x₃ = vrai ; conflit c2 ; retour x₂ ; retour x₁ ; aucune solution |
| H3 | 3 | (−1, 2, 3) ; (−1, −2, 3) ; (−1, 2, −3) ; (−1, −2, −3) | satisfiable : x₁ = faux, x₂ et x₃ libres | 4 | choix x₁ = vrai ; choix x₂ = vrai ; propagation c2 : x₃ = vrai ; conflit c4 ; retour x₂ ; choix x₂ = faux ; propagation c1 : x₃ = vrai ; conflit c3 ; retour x₂ ; retour x₁ ; choix x₁ = faux ; solution |
| H4 | 4 | (1, 2, 3) ; (−1, 2, 4) ; (−2, −3, 4) ; (−4, 1, −3) ; (−4, −1, 3) | satisfiable : tout vrai | 3 | choix x₁ = vrai ; choix x₂ = vrai ; choix x₃ = vrai ; propagation c3 : x₄ = vrai ; solution |
| Pas à pas, graine 2026, n° 2 | 6 | ci-dessus | satisfiable : x₁ = vrai, x₂ = faux, x₃ à x₆ = vrai | 4 | choix x₁ = vrai ; choix x₂ = vrai ; propagation c3 : x₄ = faux ; conflit c5 ; retour x₂ ; choix x₂ = faux ; choix x₃ = vrai ; propagation c6 : x₅ = vrai ; propagation c1 : x₄ = vrai ; propagation c2 : x₆ = vrai ; solution |

Mode pas à pas, graine 2026 : l’énigme n° 1 (j = 0) se résout sans conflit (3 choix) ; l’énigme de départ est donc la n° 2. Les énigmes n° 3 et n° 4 demandent 5 et 2 choix.

**Courbes de référence, graine 2026, 20 énigmes par α** (énigmes satisfiables sur 20 ; médiane du nombre de choix)

| α | n = 20 : satisfiables | n = 20 : médiane | n = 40 : satisfiables | n = 40 : médiane |
| --- | --- | --- | --- | --- |
| 2,0 | 20 | 9 | 20 | 18,5 |
| 2,2 | 20 | 10 | 20 | 17,5 |
| 2,4 | 20 | 10 | 20 | 15 |
| 2,6 | 20 | 10 | 20 | 16 |
| 2,8 | 20 | 8,5 | 20 | 21 |
| 3,0 | 20 | 9 | 20 | 15 |
| 3,2 | 20 | 9 | 20 | 17 |
| 3,4 | 20 | 13 | 20 | 38 |
| 3,6 | 20 | 11 | 18 | 52,5 |
| 3,8 | 20 | 14 | 19 | 84 |
| 4,0 | 18 | 13,5 | 20 | 77,5 |
| 4,2 | 14 | 21,5 | 13 | 173,5 |
| 4,4 | 11 | 22 | 11 | 242,5 |
| 4,6 | 12 | 24,5 | 4 | 207 |
| 4,8 | 6 | 25 | 4 | 160 |
| 5,0 | 4 | 36,5 | 0 | 166 |
| 5,2 | 5 | 28 | 3 | 130 |
| 5,4 | 3 | 28 | 2 | 129 |
| 5,6 | 2 | 28 | 0 | 139 |
| 5,8 | 3 | 26 | 0 | 122 |
| 6,0 | 0 | 21 | 1 | 118 |
| 6,2 | 1 | 26 | 0 | 86 |
| 6,4 | 0 | 26 | 0 | 79 |
| 6,6 | 0 | 21 | 0 | 73 |
| 6,8 | 0 | 18 | 0 | 84 |
| 7,0 | 0 | 20 | 0 | 74 |

Résumés attendus : « n = 20 : la part des énigmes qui ont une solution passe sous 50 % entre α = 4,6 et α = 4,8 ; le solveur fait le plus de choix à α = 5,0 (médiane 36,5). » et « n = 40 : la part des énigmes qui ont une solution passe sous 50 % entre α = 4,4 et α = 4,6 ; le solveur fait le plus de choix à α = 4,4 (médiane 242,5). »

#### Pour aller plus loin — 3-SAT

- D. Mitchell, B. Selman et H. Levesque, « Hard and Easy Distributions of SAT Problems », *AAAI-92*, p. 459-465, 1992 (en anglais) → `https://cdn.aaai.org/AAAI/1992/AAAI92-071.pdf`
- M. Mézard, G. Parisi et R. Zecchina, « Analytic and Algorithmic Solution of Random Satisfiability Problems », *Science*, vol. 297, p. 812-815, 2002 (en anglais) → `https://doi.org/10.1126/science.1073287`
- M. Mézard et R. Zecchina, « The random K-satisfiability problem: from an analytic solution to an efficient algorithm », *Physical Review E*, vol. 66, 056126, 2002 (en anglais) → `https://arxiv.org/abs/cond-mat/0207194`
- J. Ding, A. Sly et N. Sun, « Proof of the satisfiability conjecture for large k », *Annals of Mathematics*, vol. 196, p. 1-388, 2022 (en anglais) → `https://doi.org/10.4007/annals.2022.196.1.1`
- M. Davis, G. Logemann et D. Loveland, « A machine program for theorem-proving », *Communications of the ACM*, vol. 5, p. 394-397, 1962 (en anglais) → `https://doi.org/10.1145/368273.368557`
- S. Cook, « The P versus NP Problem », Clay Mathematics Institute (en anglais) → `https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf`

English (same links):

- D. Mitchell, B. Selman and H. Levesque, “Hard and Easy Distributions of SAT Problems”, *AAAI-92*, pp. 459–465, 1992
- M. Mézard, G. Parisi and R. Zecchina, “Analytic and Algorithmic Solution of Random Satisfiability Problems”, *Science*, vol. 297, pp. 812–815, 2002
- M. Mézard and R. Zecchina, “The random K-satisfiability problem: from an analytic solution to an efficient algorithm”, *Physical Review E*, vol. 66, 056126, 2002
- J. Ding, A. Sly and N. Sun, “Proof of the satisfiability conjecture for large k”, *Annals of Mathematics*, vol. 196, pp. 1–388, 2022
- M. Davis, G. Logemann and D. Loveland, “A machine program for theorem-proving”, *Communications of the ACM*, vol. 5, pp. 394–397, 1962
- S. Cook, “The P versus NP Problem”, Clay Mathematics Institute

Les liens DOI peuvent répondre 403 aux outils automatiques ; ils s’ouvrent normalement dans un navigateur.

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| Pic de difficulté là où la moitié des énigmes a une solution ; vers 4,3 pour n = 50, 4,55 pour n = 20 ; modèle de tirage | Mitchell, Selman et Levesque (1992), PDF consulté le 25 novembre 2026 |
| Valeur voisine de 4,27 (4,267) par la méthode de la cavité ; calcul non rigoureux | Mézard et Zecchina (2002) ; Mertens, Mézard et Zecchina, *Random Structures & Algorithms* 28, 2006, DOI 10.1002/rsa.20090 ; Mézard, Parisi et Zecchina (2002) |
| Bornes démontrées 3,52 et 4,49 (4,4898) | Hajiaghayi et Sorkin, arXiv math/0310193 (2003) ; Díaz, Kirousis, Mitsche et Pérez-Giménez, arXiv 0807.3600 (2008) |
| Existence d’une valeur précise non démontrée pour 3-SAT | Díaz et al. (introduction) ; F. Vorobyev, arXiv 2610.10599 (prépublication du 6 octobre 2026, non relue par des pairs, qui annonce une borne supérieure de 4,268 et laisse la question ouverte) |
| Seuil démontré en 2022 pour k grand | Ding, Sly et Sun (2022) |
| Une clause à 3 littéraux interdit 1 combinaison sur 8 | Déduction logique (testée) |
| Origine de DPLL | Davis, Logemann et Loveland (1962) ; Davis et Putnam, *Journal of the ACM*, 1960 (bibliographie de l’article de 1962) |
| Définitions de P et NP ; P = NP non résolu | Cook, Clay Mathematics Institute |
| SAT NP-complet (Cook, 1971) ; 3-SAT aussi | S. A. Cook, « The complexity of theorem-proving procedures », *STOC 1971*, p. 151-158, DOI 10.1145/800157.805047 : théorèmes 1 et 2 (l’ensemble D3, forme complémentaire de 3-SAT) |
| NP-complétude = pire cas ; énigmes aléatoires = cas typiques | Mézard, Parisi et Zecchina (2002), introduction |
| La difficulté dépend aussi du solveur | C. Coarfa et al., « Random 3-SAT: The Plot Thickens », DOI 10.1023/A:1025671026963 (résumé lu ; revue et année à confirmer) |
| Effet de taille finie | Mitchell, Selman et Levesque (1992) ; observable dans la démo |
| Générateur xoshiro128++ et initialisation par SplitMix64 | `https://prng.di.unimi.it/`, consulté le 25 novembre 2026 |

## Annexe E — Série « découverte » : la réfraction et le nombre mystère (étape L4)

Décidée par Jospin le 25 novembre 2026 : des expériences simples et visuelles, pour donner envie de visiter le Labo, avant l’IA explicable. Paramètres et textes rédigés par Claude (choix délégués par Jospin), sources vérifiées le 25 novembre 2026. Une page « découverte » suit le gabarit de la section 3, en plus court. Les textes sont repris mot pour mot ; seule la typographie des espaces est appliquée dans le code.

### E.1 Pages de catégorie et accueil

- La description et l’introduction de la page Physique (annexe C.1) deviennent : Des expériences de physique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton, le trajet de la lumière. / Physics experiments you can set up yourself: the path of a projectile, the collisions in Newton’s cradle, and the path of light.
- Carte de la réfraction (accueil, section « Physique », et page Physique, après le pendule de Newton) : titre « La réfraction de la lumière » ; texte « Changez l’angle d’un rayon et les milieux qu’il traverse : regardez-le se briser, puis rester piégé. » ; lien « Ouvrir l’expérience »
  - EN card: title “Refraction of light”; text “Change the angle of a light ray and the materials it crosses: watch it bend, then get trapped.”; link “Open the experiment”
- Carte du nombre mystère (accueil, section « Informatique », et page Informatique, après 3-SAT) : titre « Pensez à un nombre » ; texte « Choisissez un nombre entre 1 et 1 000 : l’ordinateur le trouve en 10 questions au plus. » ; lien « Ouvrir l’expérience »
  - EN card: title “Think of a number”; text “Pick a number between 1 and 1,000: the computer finds it in 10 questions or fewer.”; link “Open the experiment”
- Fil d’Ariane : Le Labo › Physique › La réfraction de la lumière / The Lab › Physics › Refraction of light ; Le Labo › Informatique › Pensez à un nombre / The Lab › Computing › Think of a number.

**Écarts acceptés lors de la réalisation (L4, 25 novembre 2026)**

- Deux fonctions communes ont été déplacées, sans changement de comportement, pour être partagées par les expériences : `plainMath` (vers `src/demos/projectile/math.ts`) et `fill` (vers `src/demos/fill.ts`). Tous les tests des expériences existantes passent.
- Le calcul exhaustif pour N = 1 000 000 tourne dans les tests unitaires (`npm test`).

### E.2 La réfraction de la lumière — /fr/physique/refraction · /en/physics/refraction

#### Réfraction : modèle et conventions

- **Milieux** et indices de réfraction, arrondis à 3 chiffres significatifs à partir du tableau 1.1 d’OpenStax (lumière de longueur d’onde 589 nm) : Air (n = 1,00) ; Eau (n = 1,33) ; Verre (n = 1,52, verre « crown ») ; Diamant (n = 2,42). Les calculs utilisent exactement ces valeurs affichées.
- **Réglages** : milieu 1 (d’où vient la lumière), milieu 2 (où elle entre), angle d’incidence i₁ de 0 à 89°, par pas de 1°. Départ : Air, Eau, 40°.
- **Calculs** : r = i₁ ; s = n₁ sin i₁ / n₂ ; si s ≤ 1, i₂ = arcsin s ; si s > 1, pas de rayon réfracté (réflexion totale). Angle limite i_lim = arcsin (n₂ / n₁), seulement si n₁ > n₂.
- **Affichage des nombres** : angles en degrés et sinus à 3 chiffres significatifs (0 s’écrit « 0 »), virgule décimale en français ; i₁ est affiché tel quel (entier).
- **Figure** : SVG, surface de séparation horizontale, milieu 1 en haut, milieu 2 en bas (teintes différentes, par jetons du design system), normale en pointillés, rayon incident, rayon réfléchi (trait fin), rayon réfracté, arcs des angles i₁ et i₂ ; en cas de réflexion totale, pas de rayon réfracté et rayon réfléchi en trait épais. Aucune animation : la figure suit les réglages.
- **Accessibilité** : `<select>` natifs pour les milieux, `<input type="range">` pour l’angle, avec étiquette et valeur affichée ; résumé textuel de la figure ; pas d’annonce `aria-live` à chaque mouvement du curseur.

#### Réfraction — français

- **Titre de l’onglet** : La réfraction de la lumière — Le Labo
- **Description** : Simulation interactive de la réfraction : loi de Snell-Descartes, angle limite et réflexion totale, mis à jour en direct.
- **Titre de la page** : La réfraction de la lumière
- **Introduction** : Dans un aquarium, un poisson semble parfois se trouver à deux endroits à la fois : la lumière change de direction quand elle passe de l’eau à l’air. Réglez le rayon et regardez-le se briser.
- **Mention** : Au programme de TODO(Jospin): classe concernée. (masquée tant que la classe manque)

**Réglages**

| Réglage | Étiquette | Valeurs | Valeur de départ |
| --- | --- | --- | --- |
| Milieu 1 | Milieu d’où vient la lumière | Air (n = 1,00) · Eau (n = 1,33) · Verre (n = 1,52) · Diamant (n = 2,42) | Air |
| Milieu 2 | Milieu où entre la lumière | Air (n = 1,00) · Eau (n = 1,33) · Verre (n = 1,52) · Diamant (n = 2,42) | Eau |
| Angle i₁ | Angle d’incidence (°) | 0 à 89, pas de 1 | 40 |

- **Résultats** (titre « Résultats ») : Angle de réflexion · Angle de réfraction · Angle limite
- **Angle de réfraction, en cas de réflexion totale** : aucun : réflexion totale
- **Angle limite, si n₁ ≤ n₂** : aucun : la lumière entre dans un milieu d’indice égal ou plus grand
- **Légende de la figure** : Rayon incident · Rayon réfléchi · Rayon réfracté · Normale
- **Résumé textuel de la figure** : « Rayon incident à {i₁} ; rayon réfracté à {i₂}. » ou « Rayon incident à {i₁} ; réflexion totale : aucun rayon réfracté. »

**Les lois**

Les angles se mesurent par rapport à la normale, la droite perpendiculaire à la surface au point où arrive le rayon.

- Indice de réfraction d’un milieu : n = c / v, où c est la vitesse de la lumière dans le vide et v sa vitesse dans le milieu.
- Loi de la réflexion : r = i₁
- Loi de la réfraction (loi de Snell-Descartes) : n₁ sin i₁ = n₂ sin i₂
- Avec les valeurs réglées : sin i₂ = n₁ sin i₁ / n₂ = {s}
- Si ce nombre dépasse 1, aucun angle i₂ ne convient : il n’y a pas de rayon réfracté, toute la lumière est réfléchie. C’est la réflexion totale.
- Angle limite, quand la lumière passe dans un milieu d’indice plus petit (n₁ > n₂) : sin i_lim = n₂ / n₁. Au-delà de cet angle, la réflexion est totale.

**Hypothèses** : La lumière est d’une seule couleur (jaune, 589 nm) : l’indice d’un milieu varie un peu avec la couleur. Les milieux sont transparents et homogènes, et leur surface de séparation est plane. La figure ne montre pas l’intensité des rayons : en réalité, une partie de la lumière est toujours réfléchie, même quand elle traverse la surface.

**À essayer** (chaque question a son explication repliable, intitulée « Voir l’explication »)

1. De l’air vers l’eau, augmentez l’angle d’incidence de 0° à 89°. Le rayon réfracté se rapproche-t-il ou s’éloigne-t-il de la normale ? — Explication : il se rapproche de la normale, car l’eau a un indice plus grand que l’air. Même à 89°, l’angle de réfraction reste sous 48,8° : sin i₂ ne peut pas dépasser 1,00 / 1,33.
2. Inversez : de l’eau vers l’air. À partir de quel angle le rayon réfracté disparaît-il ? — Explication : entre 48° et 49°. L’angle limite vaut 48,8°, car sin i_lim = 1,00 / 1,33. Au-delà, la lumière reste piégée dans l’eau : c’est la réflexion totale.
3. Comparez l’angle limite du diamant vers l’air avec celui de l’eau vers l’air. — Explication : 24,4° pour le diamant, contre 48,8° pour l’eau. Plus l’indice du milieu 1 est grand, plus l’angle limite est petit, et plus la lumière y reste facilement piégée. Les fibres optiques utilisent la réflexion totale pour guider la lumière.

#### Réfraction — English

- **Tab title**: Refraction of light — The Lab
- **Description**: Interactive refraction simulation: Snell’s law, critical angle and total internal reflection, updated live.
- **Page heading**: Refraction of light
- **Intro**: In a fish tank, a fish can seem to be in two places at once: light changes direction when it passes from water into air. Set up the ray and watch it bend.
- **Note**: Part of the TODO(Jospin): class curriculum in Cameroon. (hidden while the class is missing)
- **Controls**: Material the light comes from · Material the light enters · Angle of incidence (°). Materials: Air (n = 1.00), Water (n = 1.33), Glass (n = 1.52), Diamond (n = 2.42). Same ranges, steps and starting values as the French version.
- **Results** (heading “Results”): Angle of reflection · Angle of refraction · Critical angle
- **Angle of refraction, with total internal reflection**: none: total internal reflection
- **Critical angle, if n₁ ≤ n₂**: none: the light enters a material with an equal or higher index
- **Figure legend**: Incident ray · Reflected ray · Refracted ray · Normal
- **Text summary of the figure**: “Incident ray at {i₁}; refracted ray at {i₂}.” or “Incident ray at {i₁}; total internal reflection: no refracted ray.”

**The laws**

Angles are measured from the normal, the line perpendicular to the surface where the ray meets it.

- Index of refraction of a material: n = c / v, where c is the speed of light in a vacuum and v its speed in the material.
- Law of reflection: r = i₁
- Law of refraction (Snell’s law): n₁ sin i₁ = n₂ sin i₂
- With the current settings: sin i₂ = n₁ sin i₁ / n₂ = {s}
- If this number is greater than 1, no angle i₂ fits: there is no refracted ray and all the light is reflected. This is total internal reflection.
- Critical angle, when light passes into a material with a lower index (n₁ > n₂): sin i_lim = n₂ / n₁. Beyond this angle, the reflection is total.

**Assumptions**: The light is a single colour (yellow, 589 nm): a material’s index varies slightly with colour. The materials are transparent and uniform, and the surface between them is flat. The figure doesn’t show how bright each ray is: in reality, some light is always reflected, even when it crosses the surface.

**Try this** (each question has a collapsible explanation, labelled “Show the explanation”)

1. From air into water, increase the angle of incidence from 0° to 89°. Does the refracted ray move towards the normal or away from it? — Explanation: towards it, because water has a higher index than air. Even at 89°, the angle of refraction stays below 48.8°: sin i₂ can’t exceed 1.00 / 1.33.
2. Swap them: from water into air. At what angle does the refracted ray disappear? — Explanation: between 48° and 49°. The critical angle is 48.8°, since sin i_lim = 1.00 / 1.33. Beyond it, the light stays trapped in the water: this is total internal reflection.
3. Compare the critical angle from diamond into air with the one from water into air. — Explanation: 24.4° for diamond, against 48.8° for water. The higher the index of the first material, the smaller the critical angle, and the more easily light stays trapped inside. Optical fibres use total internal reflection to guide light.

#### Valeurs de contrôle de la réfraction (calculées le 25 novembre 2026)

Avec les indices affichés (1,00 ; 1,33 ; 1,52 ; 2,42). Valeurs calculées par Claude en Python (bibliothèque `math`), à 4 décimales ; affichage à 3 chiffres significatifs.

| Milieu 1 → milieu 2 | i₁ (°) | sin i₂ = n₁ sin i₁ / n₂ | i₂ (°) | Angle limite (°) |
| --- | --- | --- | --- | --- |
| Air → Eau | 0 | 0 | 0 | aucun |
| Air → Eau | 40 | 0,4833 | 28,9011 | aucun |
| Air → Eau | 89 | 0,7518 | 48,7435 | aucun |
| Air → Verre | 30 | 0,3289 | 19,2049 | aucun |
| Air → Diamant | 60 | 0,3579 | 20,9689 | aucun |
| Eau → Air | 30 | 0,6650 | 41,6823 | 48,7535 |
| Eau → Air | 48 | 0,9884 | 81,2580 | 48,7535 |
| Eau → Air | 49 | 1,0038 | réflexion totale | 48,7535 |
| Verre → Air | 41 | 0,9972 | 85,7188 | 41,1395 |
| Verre → Air | 42 | 1,0171 | réflexion totale | 41,1395 |
| Diamant → Air | 24 | 0,9843 | 79,8347 | 24,4075 |
| Diamant → Air | 25 | 1,0227 | réflexion totale | 24,4075 |
| Verre → Eau | 61 | 0,9996 | 88,3107 | 61,0450 |
| Eau → Eau | 35 | 0,5736 | 35,0000 | aucun |

Affichages attendus (français) : 28,9° ; 48,7° ; 41,7° ; 81,3° ; 48,8° (angle limite eau → air) ; 41,1° ; 24,4° ; 61,0° ; 88,3° ; 35,0°. Contrôle externe : OpenStax donne 48,6° pour l’angle limite eau → air avec n = 1,333 ; avec n = 1,33, on trouve 48,8°, ce qui est cohérent.

#### Pour aller plus loin — réfraction

- OpenStax, *University Physics Volume 3*, section 1.3 « Refraction » (en anglais) → `https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction`
- OpenStax, *University Physics Volume 3*, section 1.4 « Total Internal Reflection » (en anglais) → `https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection`
- OpenStax, *University Physics Volume 3*, section 1.5 « Dispersion » (en anglais) → `https://openstax.org/books/university-physics-volume-3/pages/1-5-dispersion`

English (same links):

- OpenStax, *University Physics Volume 3*, section 1.3 “Refraction”
- OpenStax, *University Physics Volume 3*, section 1.4 “Total Internal Reflection”
- OpenStax, *University Physics Volume 3*, section 1.5 “Dispersion”

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| n = c / v ; indices de l’air, de l’eau, du verre crown et du diamant (589 nm) | OpenStax, *University Physics Volume 3*, section 1.1, tableau 1.1 (air 1,000293 ; eau 1,333 ; verre crown 1,52 ; diamant 2,419), arrondis par le site ; source citée par le site : sections 1.3 et 1.4 |
| Loi de la réflexion r = i₁, angles mesurés par rapport à la normale | OpenStax, section 1.2 « The Law of Reflection » |
| Loi de Snell-Descartes ; une partie de la lumière est toujours réfléchie ; le poisson de l’aquarium qui semble à deux endroits | OpenStax, section 1.3 |
| Angle limite, réflexion totale seulement si n₁ > n₂ ; angle limite du diamant 24,4° ; fibres optiques | OpenStax, section 1.4 |
| Indice variable avec la couleur | OpenStax, section 1.5 « Dispersion » (vérifiée le 25 novembre 2026) |
| Valeurs numériques de la page | Calculées à partir des formules (valeurs de contrôle ci-dessus) |

### E.3 Pensez à un nombre — /fr/informatique/pensez-a-un-nombre · /en/computing/think-of-a-number

#### Nombre mystère : modèle et conventions

- **Plages** : de 1 à N, avec N = 100, 1 000 ou 1 000 000 ; départ : 1 000.
- **Stratégie de l’ordinateur** (recherche dichotomique) : il garde l’intervalle [a, b] des nombres encore possibles, d’abord [1, N]. Il propose g = ⌊(a + b) / 2⌋. Réponse « Plus grand » : a = g + 1 ; « Plus petit » : b = g − 1 ; « C’est ça ! » : fin.
- **Contradiction** : si a > b après une réponse, aucun nombre ne convient ; la partie s’arrête avec un message.
- **Nombre maximal de questions** : Q(N) = ⌊log₂ N⌋ + 1, soit 7 pour 100, 10 pour 1 000, 20 pour 1 000 000. Déduction vérifiée par calcul exhaustif (tous les nombres de 1 à N, pour chaque N).
- **Annuler** : « Annuler la dernière réponse » rend l’état d’avant cette réponse (autant de fois qu’il y a de réponses).
- **Affichage** : la question en cours ; le compteur « Question {k} sur {Q} au plus » ; une barre (SVG) qui montre l’intervalle [a, b] dans [1, N] ; le nombre de possibilités restantes b − a + 1 ; l’historique des questions et réponses, dans une liste ordonnée.
- **Nombres** : séparateur de milliers (espace insécable en français, virgule en anglais).
- **Accessibilité** : boutons natifs ; la nouvelle question est annoncée (`aria-live="polite"`), une fois par réponse ; aucun minuteur, aucune animation.
- Aucun hasard : la même suite de réponses donne toujours les mêmes questions.

#### Nombre mystère — français

- **Titre de l’onglet** : Pensez à un nombre — Le Labo
- **Description** : Jeu interactif : choisissez un nombre, l’ordinateur le trouve en quelques questions grâce à la recherche dichotomique.
- **Titre de la page** : Pensez à un nombre
- **Sous-titre** : La recherche dichotomique
- **Introduction** : Choisissez un nombre dans votre tête, sans le dire. L’ordinateur va le trouver en posant très peu de questions. Son secret : couper en deux, à chaque fois, la liste des nombres encore possibles.
- **Mention** : Niveau : TODO(Jospin): niveau concerné. (masquée tant que le niveau manque)

**Le jeu**

| Réglage | Étiquette | Valeurs | Valeur de départ |
| --- | --- | --- | --- |
| N | Choisissez un nombre entre 1 et… | 100 · 1 000 · 1 000 000 | 1 000 |

- Consigne avant la partie : Choisissez un nombre entre 1 et {N}, gardez-le en tête, puis cliquez sur « J’ai choisi ».
- Boutons : J’ai choisi · Plus grand · Plus petit · C’est ça ! · Annuler la dernière réponse · Rejouer
- Question : Votre nombre est-il {g} ?
- Compteur : Question {k} sur {Q} au plus
- Possibilités : Il reste {r} nombres possibles, de {a} à {b}.
- Une seule possibilité : Il ne reste qu’un nombre possible : {a}.
- Historique (titre « Questions posées ») : {g} ? Plus grand · {g} ? Plus petit · {g} ? C’est ça !
- Fin : Trouvé ! Votre nombre est {g}, découvert en {k} questions.
- Fin en une question : Trouvé ! Votre nombre est {g}, découvert dès la première question.
- Contradiction : Vos réponses se contredisent : aucun nombre de 1 à {N} ne convient. Annulez la dernière réponse ou rejouez.
- Résumé textuel de la barre : Nombres encore possibles : de {a} à {b}, sur 1 à {N}.

**Comment fait l’ordinateur ?**

- Il propose toujours le nombre du milieu des nombres encore possibles. Votre réponse élimine d’un coup la moitié d’entre eux.
- Avec 1 000 nombres, il en reste au plus 500 après la première question, puis 250, 125, 62, 31, 15, 7, 3, 1. Il lui faut donc au plus 10 questions.
- En général, il faut au plus ⌊log₂ N⌋ + 1 questions pour N nombres : le nombre de fois qu’on peut couper N en deux, plus un. Pour un million de nombres, 20 questions suffisent, car 2²⁰ = 1 048 576.
- Cette méthode s’appelle la recherche dichotomique. Elle sert partout où les données sont rangées dans l’ordre : un mot dans un dictionnaire, un nom dans une liste triée, une valeur dans une table.
- Si l’ordinateur posait les nombres un par un (1, 2, 3…), il lui faudrait jusqu’à 1 000 questions pour 1 000 nombres.

**Hypothèses** : Vous répondez honnêtement et ne changez pas de nombre en cours de partie. Les nombres possibles sont rangés dans l’ordre : c’est ce qui permet d’en éliminer la moitié à chaque réponse.

**À essayer** (explication repliable « Voir l’explication »)

1. Jouez avec 1 000 nombres en choisissant 1 000. Combien de questions faut-il ? — Explication : 10, le maximum : 500, 750, 875, 938, 969, 985, 993, 997, 999, puis 1 000.
2. Passez à un million de nombres. Combien de questions au plus ? — Explication : 20, seulement deux fois plus que pour 1 000 nombres, alors qu’il y a mille fois plus de nombres. Chaque question supplémentaire fait à peu près doubler la quantité de nombres que l’on peut départager.
3. Mentez exprès : avec 100 nombres, répondez « Plus grand » à 50, puis « Plus petit » à 75, puis « Plus grand » à toutes les questions suivantes. Que se passe-t-il ? — Explication : après 62, 68, 71, 73 et 74, il ne reste plus aucun nombre possible : aucun nombre ne peut vérifier toutes vos réponses, et l’ordinateur le détecte.

#### Nombre mystère — English

- **Tab title**: Think of a number — The Lab
- **Description**: Interactive game: pick a number, and the computer finds it in just a few questions using binary search.
- **Page heading**: Think of a number
- **Subtitle**: Binary search
- **Intro**: Think of a number, and keep it to yourself. The computer will find it with very few questions. Its secret: each time, it cuts the list of numbers that are still possible in half.
- **Note**: Level: TODO(Jospin): level. (hidden while missing)
- **Control**: Pick a number between 1 and… · 100 · 1,000 · 1,000,000 (starting value 1,000)
- Before the game: Pick a number between 1 and {N}, keep it in mind, then click “I’ve picked”.
- Buttons: I’ve picked · Higher · Lower · That’s it! · Undo last answer · Play again
- Question: Is your number {g}?
- Counter: Question {k} of {Q} at most
- Possibilities: {r} numbers are still possible, from {a} to {b}.
- One possibility left: Only one number is still possible: {a}.
- History (heading “Questions asked”): {g}? Higher · {g}? Lower · {g}? That’s it!
- End: Found it! Your number is {g}, found in {k} questions.
- End after one question: Found it! Your number is {g}, found with the very first question.
- Contradiction: Your answers contradict each other: no number from 1 to {N} fits them all. Undo your last answer or play again.
- Text summary of the bar: Numbers still possible: from {a} to {b}, out of 1 to {N}.

**How does the computer do it?**

- It always guesses the number in the middle of the numbers that are still possible. Your answer rules out half of them at once.
- With 1,000 numbers, at most 500 are left after the first question, then 250, 125, 62, 31, 15, 7, 3, 1. So it needs 10 questions at most.
- In general, N numbers take at most ⌊log₂ N⌋ + 1 questions: the number of times N can be halved, plus one. For a million numbers, 20 questions are enough, because 2²⁰ = 1,048,576.
- This method is called binary search. It works wherever data is kept in order: a word in a dictionary, a name in a sorted list, a value in a table.
- If the computer guessed the numbers one by one (1, 2, 3…), it could take up to 1,000 questions for 1,000 numbers.

**Assumptions**: You answer honestly and don’t change your number during the game. The possible numbers are in order: that is what lets each answer rule out half of them.

**Try this** (collapsible “Show the explanation”)

1. Play with 1,000 numbers and pick 1,000. How many questions does it take? — Explanation: 10, the maximum: 500, 750, 875, 938, 969, 985, 993, 997, 999, then 1,000.
2. Switch to a million numbers. How many questions at most? — Explanation: 20, only twice as many as for 1,000 numbers, even though there are a thousand times more numbers. Each extra question roughly doubles how many numbers can be told apart.
3. Lie on purpose: with 100 numbers, answer “Higher” to 50, then “Lower” to 75, then “Higher” to every question after that. What happens? — Explanation: after 62, 68, 71, 73 and 74, no number is left: none can match all your answers, and the computer notices.

#### Valeurs de contrôle du nombre mystère (calculées le 25 novembre 2026)

Calculées par Claude en Python, par simulation de toutes les parties honnêtes (tous les nombres de 1 à N).

| N | Nombre choisi | Questions posées | Nombre de questions |
| --- | --- | --- | --- |
| 20 | 14 | 10, 15, 12, 13, 14 | 5 |
| 100 | 37 | 50, 25, 37 | 3 |
| 100 | 100 | 50, 75, 88, 94, 97, 99, 100 | 7 |
| 100 | 1 | 50, 25, 12, 6, 3, 1 | 6 |
| 1 000 | 1 | 500, 250, 125, 62, 31, 15, 7, 3, 1 | 9 |
| 1 000 | 1 000 | 500, 750, 875, 938, 969, 985, 993, 997, 999, 1 000 | 10 |
| 1 000 | 777 | 500, 750, 875, 812, 781, 765, 773, 777 | 8 |
| 1 000 000 | 1 | 500 000, 250 000, 125 000, 62 500, 31 250, 15 625, 7 812, 3 906, 1 953, 976, 488, 244, 122, 61, 30, 15, 7, 3, 1 | 19 |
| 1 000 000 | 123 456 | 500 000, 250 000, 125 000, 62 500, 93 750, 109 375, 117 187, 121 093, 123 046, 124 023, 123 534, 123 290, 123 412, 123 473, 123 442, 123 457, 123 449, 123 453, 123 455, 123 456 | 20 |

Calcul exhaustif sur toutes les parties honnêtes : maximum 5 questions pour N = 20, 7 pour N = 100 (37 nombres l’atteignent), 10 pour N = 1 000 (489 nombres), 20 pour N = 1 000 000 (475 713 nombres) ; moyennes 3,7 ; 5,8 ; 8,987 ; 18,9514. Le maximum vaut toujours ⌊log₂ N⌋ + 1.

Contradiction (N = 100), réponses « Plus grand » à 50, « Plus petit » à 75, puis « Plus grand » à chaque question : questions 50, 75, 62, 68, 71, 73, 74 ; intervalles [51, 100], [51, 74], [63, 74], [69, 74], [72, 74], [74, 74], puis a = 75 > b = 74 : contradiction après 7 réponses (calculé par programme).

#### Pour aller plus loin — nombre mystère

- Wikipédia, « Recherche dichotomique » → `https://fr.wikipedia.org/wiki/Recherche_dichotomique`

English:

- Wikipedia, “Binary search” → `https://en.wikipedia.org/wiki/Binary_search`

**Affirmations et sources** (relecture, non affiché)

| Affirmation de la page | Source |
| --- | --- |
| Principe : comparer au milieu, garder la moitié qui convient ; données triées | Wikipédia « Recherche dichotomique » et « Binary search » (sources encyclopédiques ; l’article français renvoie à Knuth, *The Art of Computer Programming*, vol. 3, section 6.2.1) |
| Exemple 1 à 20, nombre 14 : 10, 15, 12, 13, 14 | Wikipédia « Recherche dichotomique » (même règle du milieu arrondi à l’entier inférieur que le site) |
| Au plus ⌊log₂ N⌋ + 1 questions ; 10 pour 1 000, 20 pour un million | Déduction, vérifiée par calcul exhaustif (valeurs de contrôle) |
| Recherche un par un : jusqu’à N questions | Déduction immédiate |

## Historique

- Version 0.1 (23 novembre 2026) : décision du Labo ; publics ; adresses et table de correspondance ; expériences prévues ; stack statique sur Cloudflare Workers ; feuille de route L1 à L3 ; proposition pour la démo 3-SAT.
- Version 0.2 (24 novembre 2026) : racine `/` par un Worker limité à cette adresse ; stack vérifiée (sans adaptateur, TypeScript 5.9, ESLint 9) et configuration Cloudflare ; en-têtes de sécurité ; noms « Le Labo » et « The Lab », voix à la première personne ; licences MIT (code) et CC BY 4.0 (textes et figures) ; Cloudflare Web Analytics et page Confidentialité ; sitemap envoyé à la Search Console en L2 ; annexe B (textes de L1).
- Version 0.3 (24 novembre 2026) : étape L1.1 ; paragraphe « Mesure d’audience » de la page Confidentialité conditionné au jeton Web Analytics, et description de la page sans mention de la mesure d’audience, pour rester exacte dans les deux cas (section 6, annexe B.3) ; fichier technique `/_not-found` gardé, avec `noindex` (section 4).
- Version 0.4 (24 novembre 2026) : étape L2a ; L1 terminée ; physique publiée (section 2) ; modèles et conventions des expériences (section 4.1) ; menu et fil d’Ariane (section 5) ; règle Cloudflare « Labo : pas de mesure automatique » (section 6) ; L2 découpée en L2a et L2b (section 8) ; accueil avec la section « Physique », bloc provisoire retiré (annexe B.2) ; annexe C : page Physique, projectile et pendule de Newton, sources vérifiées le 24 novembre 2026.
- Version 0.5 (24 novembre 2026) : relecture de L2a ; ordre des chocs du pendule « dans le sens du mouvement », comme le code du portfolio (section 4.1) ; « Cabrel FOSSO » masqué visuellement sous 640 px (section 5) ; textes anglais des sources, validés (annexe C).
- Version 0.6 (25 novembre 2026) : clôture de L2 ; L2a (version `7ba02663`, sitemap envoyé) et L2b (version du portfolio `f10afe9f`) terminées ; redirections permanentes en 308 et non 301 (section 8) ; recette des anciennes adresses cochée (section 9). Version préparée mais jamais commitée : son contenu est repris dans la 0.7.
- Version 0.7 (25 novembre 2026) : étape L3 ; L2 confirmée par Jospin (PageSpeed Insights, 308 dans le navigateur, essai sur téléphone) ; Informatique publiée (sections 2 et 5) ; annexe D : modèle, textes, valeurs de contrôle et sources de l’expérience 3-SAT, vérifiées le 25 novembre 2026 ; annexe A remplacée.
- Version 0.8 (25 novembre 2026) : clôture de L3 (version `42c36b41`, contrôles de Jospin conformes) ; écarts acceptés lors de la réalisation (annexe D.2) ; objectifs de durée atteints.
- Version 0.9 (25 novembre 2026) : étape L4, série « découverte » décidée par Jospin : la réfraction de la lumière et « Pensez à un nombre » (annexe E, sources vérifiées le 25 novembre 2026) ; description de la page Physique élargie (annexe C.1) ; l’IA explicable passe après L4 (sections 3 et 8).
- Version 1.0 (28 novembre 2026) : clôture de L4 (mise en ligne le 25 novembre 2026, contrôles de Jospin conformes le 28 novembre 2026) ; écarts acceptés lors de la réalisation (annexe E.1).
