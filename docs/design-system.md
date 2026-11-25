# Design system du Labo

> Recopié du portfolio le 24 novembre 2026 (étape L1). Les choix de fond (couleurs, typographie,
> motif, mouvement) sont ceux du portfolio ; ce qui n'existe pas ici est retiré ou marqué
> « absent du Labo ». « Section 7 du cahier » et les étapes citées sont celles du portfolio.

## Composants présents dans le Labo

| Composant | Fichier | Rôle |
| --- | --- | --- |
| `ButtonLink`, `Button`, `buttonClassName` | `ui/button.tsx` | Pilules `primary`, `outline` (par défaut), `ghost`. Hauteur 44 px au moins |
| `Badge` | `ui/badge.tsx` | Petite étiquette sur fond `accent-soft` (pas encore utilisée) |
| `Card` | `ui/card.tsx` | Carte ; léger soulèvement et halo au survol, `lift={false}` pour une carte immobile |
| `SectionHeading` | `ui/section-heading.tsx` | Étiquette facultative, puis le titre (h2 ou h3) |
| `Reveal` | `ui/reveal.tsx` | Apparition douce au défilement |
| `PageHero` | `ui/page-hero.tsx` | En-tête de page ; `size="display"` pour l'accueil |
| `PageSection` | `page-section.tsx` | Section d'une page : titre, contenu, `Reveal` |
| `SiteHeader` | `site-header.tsx` | Barre flottante : nom, menu, FR/EN, thème, « Portfolio » |
| `MainNav` | `main-nav.tsx` | Menu : une entrée par catégorie publiée ; `aria-current` sur la page de catégorie seulement |
| `Breadcrumb`, `PageTrail` | `breadcrumb.tsx`, `page-trail.tsx` | Fil d'Ariane, et ses données structurées à partir des mêmes étapes |
| `ExperimentCards`, `DemoFigure` | `experiment-cards.tsx`, `demos/demo-figure.tsx` | Cartes d'expériences, avec leur petite figure décorative (`aria-hidden`) |
| Bouton Pause / Reprendre du pendule | `demos/newtons-cradle/newtons-cradle-demo.tsx` | Arrête l'animation (WCAG 2.2.2) ; ralenti coché par défaut avec `prefers-reduced-motion` |
| `ChartFigure`, `ChartLegend` | `demos/three-sat/chart-figure.tsx` | Graphique SVG et sa légende (voir « Graphiques ») |
| `ActionButton` | `demos/three-sat/action-button.tsx` | Bouton `aria-disabled`, qui garde le focus quand il devient indisponible |
| `RichText` | `demos/three-sat/rich-text.tsx` | Gras, indices HTML, symboles dans la police des formules |
| `SiteFooter` | `site-footer.tsx` | Liens, licences, droits |
| `LanguageSwitcher` | `language-switcher.tsx` | Même page dans l'autre langue, par un lien ordinaire |
| `ThemeToggle` | `theme-toggle.tsx` | Thème clair ou sombre, clé `theme` du navigateur |
| `WebAnalytics` | `web-analytics.tsx` | Extrait Cloudflare Web Analytics, s'il y a un jeton |

Absents du Labo : menu mobile, `Timeline`, `TeachingNav`, `FloatingActions`
(WhatsApp, retour en haut), `NewsBanner`, `CopyButton`, `MotionToggle`, accueil animé (`Hero`,
`HeroVisual`, `RoleTypewriter`, `TechMarquee`), formulaires.

Les valeurs vivent dans `src/app/globals.css`, les composants de base dans `src/components/ui/`.

## Intention

Le même langage visuel que les portfolios de Carlos KEMADJEU et de Duclair Fopa Kuete :
thème sombre, barre de menu flottante en verre dépoli, boutons en pilule, mouvement discret.
Aucun code, texte ni image repris de leurs sites.

Ce qui reste propre à Jospin :

- **la trajectoire** d'un projectile : motif de fond, fond de page, icône du site, images de partage ;
- **le papier millimétré** : le fond d'un cahier de physique, pas des hexagones ni des traits lumineux ;
- **la couleur « craie »** (`highlight`) : les mots mis en valeur dans les grands titres, comme au tableau.

## Couleurs

Thème **sombre par défaut** : ses valeurs sont sur `:root`, elles s'appliquent sans JavaScript et
sans choix enregistré. Le thème clair (`[data-theme="light"]`) ne s'applique que sur choix du visiteur,
enregistré dans son navigateur (clé `theme`). La préférence du système n'est pas lue.

| Jeton | Rôle | Sombre (par défaut) | Clair |
| --- | --- | --- | --- |
| `paper` | Fond de page | #060A14 | #FFFFFF |
| `surface` | Sections, cartes | #0D1426 | #F5F7FA |
| `surface-raised` | Cartes au premier plan, barre flottante | #131D35 | #FFFFFF |
| `ink` | Texte principal | #E8EDF7 | #0F172A |
| `ink-muted` | Texte secondaire, bordure des champs | #9AA8C2 | #475569 |
| `line` | Bordures décoratives | #22304D | #CBD5E1 |
| `accent` | Liens, boutons, focus | #6EA2FF | #1E3A8A |
| `on-accent` | Texte sur l'accent | #060A14 | #FFFFFF |
| `accent-soft` | Fond de badge, survol discret | #14254A | #E8EEFB |
| `highlight` | Mots mis en valeur dans les grands titres (« craie ») | #F5C866 | #8A5000 |

Chaque jeton est exposé à Tailwind (`bg-paper`, `text-ink-muted`, `bg-surface-raised`,
`text-highlight`…). La variante `dark:` vaut pour tout sauf le thème clair choisi.

Contrastes vérifiés par `src/design/contrast.test.ts`, dans les deux thèmes :

- `ink`, `ink-muted` et `accent` : au moins 7:1 sur `paper` et sur `surface` ;
- `on-accent` : au moins 7:1 sur `accent` ;
- `highlight` : au moins 4,5:1 sur `paper`, **réservé aux grands titres** ;
- `ink-muted` (bordure des champs, critère 1.4.11 de WCAG 2.2) : au moins 3:1 ;
- texte des badges et de la barre (`surface-raised`, `accent-soft`) : au moins 4,5:1.

## Typographie

- **Space Grotesk** (variable, 300 à 700, `--font-display`, classe `font-heading`) : titres h1 à h3,
  nom du site. Poids 600, interlignage serré, légère réduction de l'approche.
- **Inter** : tout le reste, poids 400 et 600. Corps 17 px, interlignage 1.65, lignes de 70 caractères au plus.
- **JetBrains Mono** : formules, code et **petites étiquettes techniques** (étiquette de `SectionHeading`).
- Échelle (rapport 1,25) : 14 · 17 · 21 · 26 · 33 · 41 · 52 px, plus un niveau d'affichage
  `text-display` : `clamp(3rem, 1.8rem + 4vw, 4.5rem)`, interlignage 1.05, pour les grands titres de l'accueil.
  Pages intérieures : `text-page-title` : `clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)`, interlignage 1.08.
- Polices hébergées avec le site (`src/fonts/`, licences SIL OFL 1.1), aucun appel à Google Fonts.
  Inter et Space Grotesk sont préchargées ; JetBrains Mono ne l'est pas (formules seulement).

## Motif et matière

- **Fond de page** (CSS seulement, sous le contenu ; étape D1, cahier section 13) :
  - **papier millimétré** (`body::before`) : lignes fines tous les 10 px, lignes marquées tous
    les 50 px, dans la couleur de l'accent. La couche est en `position: fixed` et couvre la
    fenêtre : le quadrillage reste immobile et le contenu défile par-dessus. Elle est composée à
    part (`will-change: transform`) et ne dépend que de la taille de la fenêtre : le défilement
    ne la repeint pas et ne recalcule pas la mise en page. Jamais de `background-attachment`
    fixe (coûteux sur mobile) ;
  - **halo bleu** en haut de page (fond du `body`) et **deux trajectoires paraboliques** en
    filigrane (`body::after`, masque SVG coloré par l'accent du thème) : ils défilent avec la page.
- **Jetons du motif** (part de l'accent mêlée au fond) :

  | Jeton | Rôle | Sombre | Clair |
  | --- | --- | --- | --- |
  | `--motif-grid-major` | Lignes marquées (50 px) | 13 % | 10 % |
  | `--motif-grid-minor` | Lignes fines (10 px) | 5,5 % | 3,5 % |
  | `--motif-halo` | Halo du haut de page | 4 % | 2 % |
  | `--motif-trace` | Trajectoires en filigrane | 4 % | 2 % |

  Le sombre reprend l'aperçu validé par Jospin le 16 novembre 2026. Le clair donne le même
  contraste entre ligne et fond (1,19:1 pour les lignes marquées, 1,06:1 pour les fines).
- **Contraste** (`src/design/motif.test.ts`) : le texte reste à 7:1 sur le fond uni ; au point
  le plus marqué (ligne marquée, ligne fine, halo et trajectoire réunis, parts additionnées), le
  texte secondaire et l'accent restent à au moins 4,5:1. Valeurs actuelles : texte secondaire
  5,32:1 en sombre et 5,58:1 en clair ; accent 5,03:1 et 7,63:1.
- **Lisibilité** : cartes et barre flottante ont un
  fond qui masque le quadrillage (opaque, ou translucide avec flou d'arrière-plan pour la barre).
- **Cartes** (`Card`) : fond `surface`, bordure `line`, coins de 1 rem (`rounded-card`), halo d'accent
  discret (`shadow-glow`) au survol et quand un de leurs éléments a le focus.
- **Barre flottante** : collante, détachée des bords, coins très arrondis, fond
  `surface-raised` à 90 % avec flou d'arrière-plan et bordure fine : le texte qui passe dessous
  reste illisible au travers, la barre reste lisible.

## Barre flottante

```
≥ 640 px   ( Le Labo Cabrel FOSSO   Physique  Informatique   FR EN ◐  (Portfolio) )
480–639    ( Le Labo   Physique  Informatique             FR EN ◐  (Portfolio) )   « Cabrel FOSSO » reste dans le nom accessible
< 480 px   ( Le Labo                              FR EN ◐  (Portfolio) )
           ( Physique  Informatique                                    )
```

## Graphiques et énigmes (3-SAT)

- **Axes** : quadrillage `line`, axes et textes `ink-muted` ; viewBox fixe, texte de 22, 16 ou 13 unités
  selon la largeur, pour rester lisible de 360 à 1920 px.
- **Courbes** : un trait et un marqueur par n (20 : `ink-muted`, pointillé court, cercle ; 30 : `ink`,
  tirets, carré ; 40 : `accent`, plein, triangle ; 50 : `ink`, tiret-point, losange creux). Jamais la couleur seule.
- **Ligne de référence** (4,27) : `ink-muted`, pointillé fin, expliquée dans la légende.
- **Pastilles de clauses** : bordure `line` ; clause de l'étape en cours : bordure `accent`, fond
  `accent-soft`. L'état est écrit, avec une icône SVG.
- **Formules** : α vient de JetBrains Mono (grec), ¬ du latin ; ∨ et ∧, absents des fichiers hébergés,
  viennent d'une police de repli du système, comme √.
- **Figure de l'informatique** (carte) : trois pastilles reliées, une seule pleine, sans texte.

## Série « découverte » (réfraction, nombre mystère)

- **Figure de la réfraction** : milieu 1 en `paper`, milieu 2 en `accent-soft`, surface et normale
  (pointillée) en `ink-muted`. Rayons incident et réfléchi en `accent`, rayon réfracté en `ink`, chacun
  avec sa flèche ; rayon réfléchi fin, épais en réflexion totale. Arcs et noms des angles en `ink`.
  Aucune animation.
- **Barre d'intervalle** (nombre mystère) : cadre `ink-muted` sur `paper`, intervalle encore possible en
  `accent`, large d'au moins 4 unités. Absente quand les réponses se contredisent.
- **Figures de carte** : un rayon réfléchi et réfracté ; quatre barres, chacune moitié de la précédente.
  Sans texte.

## Mouvement

- Survols et apparitions : transitions courtes (0,6 s au plus). Dans une grille, les cartes
  (`data-reveal-item`, rang `--i`) apparaissent avec 70 ms de décalage.
- Seules `transform` et `opacity` sont animées par les `@keyframes` (`src/design/motion-css.test.ts`).
- Arrivée de l'en-tête : fondu et glissement de 12 px, élément après élément (80 ms), une fois.
- Aucune animation CSS en boucle, donc pas de `MotionToggle`. Le pendule de Newton a son propre
  bouton Pause ; le tir du projectile dure 3 s au plus et ne boucle pas.
- `Reveal` : l'état masqué n'existe qu'avec la classe `js` sur `<html>` (posée par le script de thème
  dans `<head>`) **et** `prefers-reduced-motion: no-preference`. Sans JavaScript, ou pour qui refuse
  le mouvement, tout est visible d'emblée.
- `prefers-reduced-motion: reduce` coupe toutes les transitions et animations.

## Accessibilité

- Focus clavier toujours visible : contour de 2 px couleur accent, décalé de 3 px ; il suit les coins
  de l'élément (pilules, cartes).
- Lien d'évitement « Aller au contenu », visible au focus.
- Une ancre ne finit pas sous la barre (`scroll-padding-top`).
- Liens au milieu d'une phrase : soulignés.

## Principes

1. Sombre d'abord, clair au même niveau de soin : chaque couleur passe par un jeton, jamais de valeur en dur.
2. La couleur « craie » est rare : quelques mots des grands titres, jamais du texte courant.
3. Ombres et halos seulement pour détacher ce qui flotte (barre) ou répondre
   au survol et au focus (cartes).
4. Les étiquettes techniques en JetBrains Mono restent courtes et en casse normale.
5. Le mouvement accompagne la lecture, il ne la conditionne jamais : sans JavaScript et sans
   mouvement, tout le contenu est là.
6. Aucun chiffre ni compteur que le site ne prouve.
7. Texte aligné à gauche, lignes de 70 caractères au plus, conteneur de 72 rem.
