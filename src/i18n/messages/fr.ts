/**
 * Textes français : source de vérité de la structure des messages.
 * Le fichier anglais doit avoir exactement les mêmes clés (vérifié par TypeScript).
 * Textes des annexes B à F du cahier, mot pour mot (vérifié par texts.test.ts et demos.test.ts). Une phrase coupée par
 * une mise en forme ou un lien est découpée en morceaux, dans l'ordre (before, link…).
 */
const fr = {
  site: {
    name: "Le Labo",
    author: "Cabrel FOSSO",
    ogName: "Le Labo — Cabrel FOSSO",
    skipToContent: "Aller au contenu",
    languageSwitcher: "Choisir la langue",
    themeToggle: "Changer de thème (clair ou sombre)",
  },
  header: {
    portfolio: "Portfolio",
  },
  footer: {
    label: "Liens utiles",
    portfolio: "Mon portfolio",
    code: "Code source sur GitHub",
    privacy: "Confidentialité",
    codeLicense: { before: "Code sous ", link: "licence MIT" },
    contentLicense: { before: "Textes et figures sous licence ", link: "CC BY 4.0" },
    copyright: "Cabrel FOSSO",
  },
  notFound: {
    title: "Page introuvable",
    body: "Cette page n’existe pas ou a été déplacée.",
    backHome: "Retour à l’accueil du Labo",
  },
  home: {
    metaTitle: "Le Labo — Cabrel FOSSO",
    metaDescription:
      "Expériences interactives de physique et d’informatique : réglez, observez, comprenez les équations et les algorithmes. Gratuit, dans le navigateur.",
    eyebrow: "Le Labo",
    title: { before: "Comprendre la physique et l’informatique ", highlight: "en manipulant" },
    intro:
      "Le Labo rassemble des expériences interactives. On règle un paramètre, on observe ce qui change, puis on découvre les équations ou l’algorithme qui expliquent le résultat. Tout se calcule dans votre navigateur, sur ordinateur comme sur téléphone, sans compte ni installation.",
    physics: {
      title: "Physique",
      open: "Ouvrir l’expérience",
      all: "Toutes les expériences de physique",
    },
    computing: {
      title: "Informatique",
      all: "Toutes les expériences d’informatique",
    },
    how: {
      title: "Comment ça marche",
      steps: {
        adjust: {
          title: "Régler",
          text: "Chaque expérience a ses réglages : un angle, une vitesse, la taille d’un problème.",
        },
        observe: {
          title: "Observer",
          text: "La figure et les mesures changent en direct.",
        },
        understand: {
          title: "Comprendre",
          text: "Les équations, les hypothèses du modèle et des questions « À essayer » accompagnent chaque expérience. Les sources sont citées. Une expérience explique un phénomène connu ; elle ne prétend jamais résoudre un problème ouvert.",
        },
      },
    },
    audiences: {
      title: "Pour qui ?",
      items: {
        students: { title: "Élèves et étudiants", text: "voir ce que disent les formules du cours." },
        teachers: { title: "Enseignants", text: "projeter une simulation en classe." },
        researchers: {
          title: "Chercheurs",
          text: "des démos qui relient l’IA, la physique et l’informatique théorique.",
        },
      },
    },
    signature: {
      text: "Je suis Cabrel FOSSO : enseignant de physique au Cameroun, titulaire d’un Master en informatique (IA explicable) et développeur.",
      link: "Voir mon portfolio",
    },
  },
  privacy: {
    metaTitle: "Confidentialité — Le Labo",
    metaDescription: "Ce que le Labo enregistre, et ce qu’il n’enregistre pas.",
    title: "Confidentialité",
    intro: "Ce que le Labo enregistre, et ce qu’il n’enregistre pas.",
    controller: {
      term: "Responsable",
      text: {
        before: "Jospin Cabrel FOSSO TIOFOUET, joignable par la ",
        link: "page Contact de mon portfolio",
        after: ".",
      },
    },
    entries: {
      analytics: {
        term: "Mesure d’audience",
        text: "Cloudflare Web Analytics compte les visites et mesure la vitesse d’affichage des pages, de façon globale. D’après Cloudflare, ce service n’utilise ni cookie ni stockage dans votre navigateur pour cette mesure, et ne vous suit pas d’un site à l’autre.",
      },
      preferences: {
        term: "Préférences",
        text: "votre choix de thème (clair ou sombre) est enregistré dans votre propre navigateur ; il ne m’est pas transmis. Le choix de langue n’est pas enregistré : il figure dans l’adresse de la page (/fr ou /en). À l’adresse lab.cabrelfosso.com seule, la langue est choisie d’après la préférence qu’indique votre navigateur, sans rien enregistrer.",
      },
      experiments: {
        term: "Expériences",
        text: "les calculs se font dans votre navigateur ; vos réglages ne me sont pas envoyés.",
      },
      doesNot: {
        term: "Ce que le Labo ne fait pas",
        text: "pas de compte, pas de formulaire, pas de publicité ; il ne vend aucune donnée et n’en partage avec personne à des fins commerciales.",
      },
      hosting: {
        term: "Hébergement",
        text: "le site est hébergé par Cloudflare.",
      },
      rights: {
        term: "Vos droits",
        text: "je n’enregistre aucune donnée qui vous identifie. Pour toute question, écrivez-moi par la page Contact de mon portfolio.",
      },
    },
    updated: {
      term: "Dernière mise à jour",
    },
  },
  // Menu, fil d'Ariane et fin de page d'une expérience (annexe C.1).
  nav: {
    label: "Menu principal",
    physics: "Physique",
    computing: "Informatique",
    breadcrumb: "Fil d’Ariane",
  },
  experiment: {
    sources: "Pour aller plus loin",
    inEnglish: "(en anglais)",
    portfolio: "Voir mon portfolio",
  },
  physics: {
    metaTitle: "Physique — Le Labo",
    metaDescription:
      "Des expériences de physique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton, le trajet de la lumière.",
    title: "Physique",
    intro:
      "Des expériences de physique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton, le trajet de la lumière.",
  },
  computing: {
    metaTitle: "Informatique — Le Labo",
    metaDescription:
      "Des expériences d’informatique à lancer vous-même, en commençant par les énigmes logiques 3-SAT\u00a0: où se trouvent les problèmes vraiment difficiles\u00a0?",
    title: "Informatique",
    intro:
      "Des expériences d’informatique à lancer vous-même, en commençant par les énigmes logiques 3-SAT\u00a0: où se trouvent les problèmes vraiment difficiles\u00a0?",
  },
  // Expériences (annexes C à F). Sources : ce qui est entre deux `*` s'écrit en italique.
  demos: {
    projectile: {
      card: {
        title: "Le mouvement d’un projectile",
        text: "Angle, vitesse, hauteur de départ, pesanteur\u00a0: réglez le lancer et observez la trajectoire.",
      },
      metaTitle: "Le mouvement d’un projectile — Le Labo",
      metaDescription:
        "Simulation interactive du mouvement d’un projectile\u00a0: équations horaires, trajectoire, portée et flèche, mises à jour en direct.",
      title: "Le mouvement d’un projectile",
      intro:
        "Un ballon frappé, un jet d’eau, une pierre lancée d’un pont\u00a0: tous suivent la même loi. Réglez le lancer, puis comparez les trajectoires.",
      controls: {
        title: "Réglages",
        angle: "Angle de tir (°)",
        speed: "Vitesse initiale (m/s)",
        height: "Hauteur de départ (m)",
        gravity: "Pesanteur",
        earth: "Terre (g = 9,8\u00a0m/s²)",
        moon: "Lune (g = 1,6\u00a0m/s²)",
        mars: "Mars (g = 3,7\u00a0m/s²)",
      },
      buttons: {
        launch: "Lancer",
        keep: "Garder ce tir pour comparer",
        clear: "Effacer la comparaison",
      },
      results: {
        title: "Résultats",
        flightTime: "Durée du vol",
        range: "Portée",
        apex: "Flèche (hauteur maximale)",
        impactSpeed: "Vitesse à l’impact",
      },
      legend: {
        current: "Tir actuel",
        kept: "Tir gardé",
      },
      summary: {
        current: "Tir actuel\u00a0: portée {range}, flèche {height}.",
        kept: "Tir gardé\u00a0: portée {range}, flèche {height}.",
      },
      equations: {
        title: "Les équations",
        frame:
          "Le repère\u00a0: origine au sol, à la verticale du point de lancement\u00a0; axe Ox horizontal, axe Oy vertical vers le haut.",
        motion: "Équations horaires",
        trajectory: "Équation de la trajectoire (une parabole)",
        apex: "Flèche",
        flightTime: "Durée du vol",
        range: "Portée",
        rangeNoHeight: "sans hauteur de départ",
        impactSpeed: "Vitesse à l’impact",
        vertical: "Tir vertical\u00a0: le projectile reste sur l’axe Oy (x = 0).",
      },
      assumptions: {
        title: "Hypothèses",
        text: "Le projectile est assimilé à un point matériel. Le référentiel terrestre est supposé galiléen. Les frottements de l’air sont négligés\u00a0: seul le poids agit, donc l’accélération vaut g, verticale et vers le bas.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          sameRange: {
            question:
              "Sans hauteur de départ, lancez à 30° puis à 60° avec la même vitesse. Que remarquez-vous\u00a0?",
            answer:
              "la portée vaut v₀² sin 2α / g, et sin 60° = sin 120°. Deux angles complémentaires donnent la même portée.",
          },
          bestAngle: {
            question:
              "Toujours sans hauteur de départ, cherchez l’angle qui donne la plus grande portée.",
            answer: "45°, car sin 2α vaut au plus 1, quand 2α = 90°.",
          },
          moon: {
            question:
              "Faites le même lancer sur la Terre puis sur la Lune, sans hauteur de départ. Par combien la portée est-elle multipliée\u00a0?",
            answer:
              "par 9,8 / 1,6 ≈ 6,1. Sans hauteur de départ, la portée est inversement proportionnelle à g.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 1*, section 4.3 « Projectile Motion »",
          href: "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
          english: true,
        },
      ],
    },
    "newtons-cradle": {
      card: {
        title: "Le pendule de Newton",
        text: "Écartez une ou plusieurs billes, lâchez, et suivez la quantité de mouvement et l’énergie à chaque choc.",
      },
      metaTitle: "Le pendule de Newton — Le Labo",
      metaDescription:
        "Simulation interactive du pendule de Newton\u00a0: chocs entre billes, conservation de la quantité de mouvement et de l’énergie cinétique.",
      title: "Le pendule de Newton",
      intro:
        "Écartez une bille et lâchez-la\u00a0: une seule bille repart de l’autre côté. Écartez-en deux\u00a0: deux billes repartent. Ce jouet de bureau illustre deux lois de conservation.",
      controls: {
        title: "Réglages",
        pulled: "Nombre de billes écartées",
        angle: "Angle de départ (°)",
        restitution: "Coefficient de restitution",
        restitutionHelp:
          "1\u00a0: choc parfaitement élastique. En dessous de 1, une partie de l’énergie cinétique est perdue à chaque choc.",
      },
      fixed: {
        mass: "Masse d’une bille\u00a0: {mass}",
        length: "Longueur des fils\u00a0: {length}",
        gravity: "g = {gravity}",
      },
      buttons: {
        release: "Lâcher",
        pause: "Pause",
        resume: "Reprendre",
        reset: "Recommencer",
        slow: "Ralenti (×0,1)",
      },
      readings: {
        title: "Au moment du choc",
        speedBefore: "Vitesse juste avant le choc",
        speedsAfter: "Vitesses juste après le choc",
        ball: "Bille",
        momentum: "Quantité de mouvement totale",
        energy: "Énergie cinétique totale",
        before: "Avant",
        after: "Après",
      },
      summary:
        "Avant le choc\u00a0: p = {p}, Ec = {Ec}. Après le choc\u00a0: p = {p}, Ec = {Ec}.",
      laws: {
        title: "Les lois",
        items: {
          lowestPoint: {
            term: "Vitesse au point bas, par conservation de l’énergie mécanique pendant la descente",
            lines: ["$*v* = √(2 *g* *L* (1 − cos *θ*_{0}))$"],
          },
          momentum: {
            term: "Quantité de mouvement",
            lines: [
              "$*p* = *m* *v*$. Elle est conservée à chaque choc\u00a0: $*m* *v*_{1} + *m* *v*_{2} = *m* *v*_{1}′ + *m* *v*_{2}′$",
            ],
          },
          energy: {
            term: "Énergie cinétique",
            lines: [
              "$*E*_{c} = ½ *m* *v*^{2}$. Elle n’est conservée que si le choc est parfaitement élastique.",
            ],
          },
          restitution: {
            term: "Coefficient de restitution",
            lines: ["$*e* = (*v*_{2}′ − *v*_{1}′) / (*v*_{1} − *v*_{2})$"],
          },
          twoBalls: {
            term: "Deux billes identiques, la seconde immobile",
            lines: [
              "$*v*_{1}′ = (1 − *e*) *v*_{1} / 2$ et $*v*_{2}′ = (1 + *e*) *v*_{1} / 2$. Pour $*e* = 1$, les vitesses s’échangent\u00a0: $*v*_{1}′ = 0$ et $*v*_{2}′ = *v*_{1}$.",
            ],
          },
          lost: {
            term: "Énergie cinétique perdue lors de ce choc",
            lines: ["la fraction $(1 − *e*^{2}) / 2$."],
          },
        },
      },
      assumptions: {
        title: "Hypothèses",
        text: "Les billes sont identiques. Les fils sont inextensibles et de masse négligeable, et les frottements de l’air sont négligés. Chaque choc est instantané et ne concerne que deux billes voisines\u00a0: les chocs se suivent de bille en bille. Un vrai pendule de Newton est plus subtil, car ses billes se touchent\u00a0; ce modèle simple en reproduit l’essentiel.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          twoBalls: {
            question:
              "Écartez deux billes. Pourquoi ne voit-on jamais une seule bille repartir, deux fois plus vite\u00a0?",
            answer:
              "une seule bille à 2v conserverait bien la quantité de mouvement (m · 2v = 2 m v), mais son énergie cinétique serait ½ m (2v)² = 2 m v², au lieu de 2 × ½ m v² = m v². Les deux lois ensemble imposent que deux billes repartent, à la vitesse v.",
          },
          restitution: {
            question:
              "Réglez le coefficient de restitution sur 0,8 et lâchez une bille. Que deviennent la quantité de mouvement et l’énergie cinétique\u00a0?",
            answer:
              "la quantité de mouvement totale reste la même\u00a0; l’énergie cinétique diminue à chaque choc, et toutes les billes finissent par bouger un peu.",
          },
          angle: {
            question:
              "Passez l’angle de départ de 20° à 40°. La vitesse au point bas double-t-elle\u00a0?",
            answer:
              "presque. Comme 1 − cos θ₀ = 2 sin² (θ₀/2), on a v = 2 sin (θ₀/2) √(g L). Or sin 20° / sin 10° ≈ 1,97\u00a0: la vitesse est multipliée par 1,97. Pour de petits angles, elle est presque proportionnelle à l’angle.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 1*, section 8.3 « Conservation of Energy » (exemple 8.7 : le pendule simple)",
          href: "https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 1*, section 9.3 « Conservation of Linear Momentum »",
          href: "https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 1*, section 9.4 « Types of Collisions »",
          href: "https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions",
          english: true,
        },
        {
          text: "Wikipédia, « Coefficient de restitution »",
          href: "https://fr.wikipedia.org/wiki/Coefficient_de_restitution",
          english: false,
        },
        {
          text: "S. Hutzler, G. Delaney, D. Weaire et F. MacLeod, « Rocking Newton’s cradle », *American Journal of Physics*, vol. 72, n° 12, p. 1508-1516, 2004",
          href: "https://doi.org/10.1119/1.1783898",
          english: true,
        },
      ],
    },
    "three-sat": {
      card: {
        title: "Où se cachent les problèmes difficiles\u00a0?",
        text: "Des énigmes logiques tirées au hasard\u00a0: réglez leur nombre de contraintes et voyez où le solveur peine.",
      },
      metaTitle: "Où se cachent les problèmes difficiles\u00a0? — Le Labo",
      metaDescription:
        "Expérience interactive sur la transition de phase de 3-SAT\u00a0: part des énigmes logiques qui ont une solution et effort d’un solveur DPLL, calculés dans votre navigateur.",
      title: "Où se cachent les problèmes difficiles\u00a0?",
      subtitle: "La transition de phase de 3-SAT",
      intro:
        "L’ordinateur fabrique au hasard des énigmes logiques. Avec peu de contraintes, presque toutes ont une solution\u00a0; avec beaucoup, presque aucune. Entre les deux se trouve une zone étroite où le solveur peine le plus. Réglez, lancez, et voyez où elle se trouve.",
      controls: {
        title: "L’expérience",
        variables: "Nombre de variables (n)",
        puzzles: "Énigmes par valeur de α",
        seed: "Graine du hasard",
        seedHelp: "Même graine, mêmes énigmes\u00a0: vous pouvez refaire exactement le même calcul.",
        seedError: "Entrez un nombre entier de 1 à 999\u00a0999.",
      },
      buttons: {
        run: "Lancer",
        pause: "Pause",
        resume: "Reprendre",
        stop: "Arrêter",
        clear: "Effacer les courbes",
      },
      status: {
        progress: "Calcul pour n = {n}\u00a0: α = {α} ({i} / 26)",
        done: "Calcul terminé pour n = {n}\u00a0: {total} énigmes résolues.",
        stopped: "Calcul arrêté.",
        empty: "Choisissez n, puis lancez le calcul.",
      },
      charts: {
        share: "Énigmes qui ont une solution (%)",
        choices: "Nombre de choix du solveur (médiane, échelle logarithmique)",
        axis: "α = clauses / variables",
        curve: "n = {n}",
        prediction: "4,27\u00a0: prédiction pour n très grand",
      },
      summaries: {
        crossing:
          "n = {n}\u00a0: la part des énigmes qui ont une solution passe sous 50\u00a0% entre α = {a} et α = {b}\u00a0; le solveur fait le plus de choix à α = {c} (médiane {d}).",
        above:
          "n = {n}\u00a0: la part des énigmes qui ont une solution reste d’au moins 50\u00a0% sur toute la plage\u00a0; le solveur fait le plus de choix à α = {c} (médiane {d}).",
        below:
          "n = {n}\u00a0: la part des énigmes qui ont une solution est sous 50\u00a0% dès α = {a}\u00a0; le solveur fait le plus de choix à α = {c} (médiane {d}).",
      },
      table: {
        show: "Voir les valeurs",
        alpha: "α",
        share: "n = {n}\u00a0: ont une solution (%)",
        choices: "n = {n}\u00a0: choix (médiane)",
      },
      steps: {
        title: "Pas à pas\u00a0: le solveur sur une petite énigme",
        intro:
          "Une énigme de 6 variables (x₁ à x₆) et 24 clauses, tirée de la même graine. La première énigme proposée est celle où le solveur doit revenir en arrière au moins une fois. Suivez chaque décision du solveur.",
        number: "Énigme n°\u00a0{numéro}",
        buttons: {
          next: "Étape suivante",
          restart: "Recommencer",
          another: "Autre énigme",
        },
        counter: "Choix\u00a0: {k}",
        states: {
          satisfied: "satisfaite",
          false: "fausse",
          unit: "unitaire (un seul littéral encore possible)",
          pending: "en attente",
        },
        words: { or: "ou", not: "non" },
        messages: {
          choiceTrue: "Choix\u00a0: x{i} = vrai.",
          choiceFalse: "Choix\u00a0: x{i} = faux (on essaie l’autre valeur).",
          propagation: "Propagation\u00a0: la clause {c} n’a plus qu’un littéral possible, donc x{i} = {valeur}.",
          conflict: "Conflit\u00a0: la clause {c} est fausse.",
          backtrack: "Retour en arrière\u00a0: on annule le choix de x{i} et tout ce qui l’a suivi.",
          solution: "Solution trouvée après {k} choix\u00a0: {affectation}.",
          none: "Aucune solution\u00a0: toutes les possibilités ont été éliminées, après {k} choix.",
        },
        values: { true: "vrai", false: "faux", free: "libre (n’importe quelle valeur convient)" },
      },
      // Ce qui est entre deux `**` s'écrit en gras ; les indices Unicode deviennent des indices HTML.
      problem: {
        title: "Le problème et l’algorithme",
        paragraphs: [
          "**Le problème 3-SAT**\u00a0: Une variable booléenne vaut vrai ou faux. Un littéral est une variable (x) ou sa négation (non x, notée ¬x). Une clause relie trois littéraux par «\u00a0ou\u00a0»\u00a0: elle est vraie si au moins un des trois est vrai. Elle n’interdit donc qu’une seule des 8 combinaisons de ses trois variables. Une énigme (formule 3-SAT) demande de rendre vraies toutes ses clauses à la fois. Elle est satisfiable s’il existe une telle affectation, insatisfiable sinon.",
          "**Exemple**\u00a0: (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃). Avec x₃ = vrai, les deux clauses sont vraies\u00a0: l’énigme est satisfiable.",
          "**Le réglage α** est le nombre de clauses par variable\u00a0: avec n = 40 et α = 4,2, l’énigme compte 168 clauses.",
          "**Comment les énigmes sont tirées**\u00a0: chaque clause prend trois variables différentes au hasard, et chacune est niée avec une chance sur deux. Les clauses sont tirées indépendamment les unes des autres, comme dans l’expérience de Mitchell, Selman et Levesque (1992).",
        ],
        solver: "**Le solveur (algorithme DPLL)**, du nom de Davis, Putnam, Logemann et Loveland, dans une version simple\u00a0:",
        solverSteps: [
          "Propagation\u00a0: si une clause n’a plus qu’un littéral possible, ce littéral doit être vrai.",
          "Si une clause est fausse\u00a0: conflit\u00a0; on revient au dernier choix et on essaie l’autre valeur.",
          "Si toutes les clauses sont vraies\u00a0: solution trouvée.",
          "Sinon, choix\u00a0: on prend la plus petite variable libre d’une clause pas encore vraie, et on essaie d’abord «\u00a0vrai\u00a0», puis «\u00a0faux\u00a0».",
        ],
        after: [
          "S’il a essayé les deux valeurs de chaque choix sans succès, le solveur a prouvé que l’énigme n’a pas de solution.",
          "**Ce que l’on mesure**\u00a0: le nombre de choix (étape 4), pour chaque énigme. La médiane est la valeur du milieu\u00a0: la moitié des énigmes demandent moins de choix, l’autre moitié plus. Sur le second graphique, chaque graduation multiplie le nombre de choix par 10 (échelle logarithmique).",
        ],
      },
      threshold: {
        title: "Que sait-on du seuil\u00a0?",
        items: [
          "En 1992, Mitchell, Selman et Levesque observent que les énigmes les plus difficiles pour ce type de solveur se trouvent là où la moitié a une solution\u00a0: vers α = 4,3 pour 50 variables, et vers 4,55 pour 20 variables.",
          "Des physiciens ont calculé une valeur voisine de 4,27 pour n très grand, en 2002, par une méthode issue de l’étude des verres de spin (la méthode de la cavité). C’est un calcul, pas une démonstration.",
          "Les mathématiciens ont démontré qu’en dessous de 3,52, presque toutes les énigmes ont une solution, et qu’au-dessus de 4,49, presque aucune, quand n devient très grand. Pour 3-SAT, on n’a pas démontré qu’il existe une valeur précise du seuil. On l’a démontré en 2022 pour des clauses beaucoup plus longues.",
        ],
      },
      complexity: {
        title: "P, NP et cette expérience",
        items: [
          "**P**\u00a0: les problèmes qu’un algorithme résout en un nombre d’étapes borné par un polynôme de la taille de l’énoncé (par exemple n² ou n³)\u00a0; on dit «\u00a0en temps polynomial\u00a0».",
          "**NP**\u00a0: les problèmes dont une solution proposée se vérifie en temps polynomial. Pour 3-SAT, vérifier une affectation est facile\u00a0: on relit chaque clause.",
          "**NP-complet**\u00a0: un problème de NP auquel tous les problèmes de NP se ramènent en temps polynomial. Stephen Cook a démontré en 1971 que SAT est NP-complet\u00a0; 3-SAT l’est aussi.",
          "La question «\u00a0P = NP\u00a0?\u00a0» demande si tout problème dont la solution se vérifie vite peut aussi se résoudre vite. Elle n’est pas résolue.",
          "La NP-complétude parle du pire cas. Une énigme tirée au hasard n’est pas forcément difficile\u00a0: cette expérience regarde les cas typiques.",
          "Cette expérience n’apporte pas de réponse à la question P = NP. Elle montre où se trouvent, en pratique, les énigmes difficiles pour un solveur.",
        ],
      },
      assumptions: {
        title: "Hypothèses",
        text: "Les énigmes sont aléatoires\u00a0: les résultats ne disent rien directement des énigmes tirées de problèmes réels. Les tailles sont petites (50 variables au plus)\u00a0: le passage à 50\u00a0% se fait au-dessus de 4,27, et il se rapproche de cette valeur quand n augmente. Le nombre de choix dépend du solveur\u00a0: un autre algorithme donnerait d’autres nombres, et des travaux ont montré que la difficulté dépend aussi du solveur choisi.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          size: {
            question:
              "Lancez le calcul pour n = 20, puis pour n = 50, sans effacer. Que devient la courbe des énigmes qui ont une solution\u00a0?",
            answer:
              "pour n = 50, elle descend plus brutalement, et elle passe sous 50\u00a0% plus près de 4,27. Plus l’énigme est grande, plus la transition est nette\u00a0: c’est l’effet de taille finie.",
          },
          peak: {
            question: "Où se trouve le pic du nombre de choix par rapport au passage à 50\u00a0%\u00a0?",
            answer:
              "presque au même endroit. À gauche, les solutions sont nombreuses et les premiers choix réussissent. À droite, les contraintes sont si nombreuses que les conflits arrivent vite, et le solveur prouve rapidement qu’il n’y a pas de solution. Au milieu, il doit explorer beaucoup de pistes avant de conclure.",
          },
          seed: {
            question: "Pour n = 20, recommencez avec une autre graine. Pourquoi la courbe change-t-elle\u00a0?",
            answer:
              "20 énigmes par valeur de α forment un petit échantillon\u00a0; le hasard des tirages se voit. Avec 100 énigmes, la courbe devient plus régulière.",
          },
        },
      },
      sources: [
        {
          text: "D. Mitchell, B. Selman et H. Levesque, «\u00a0Hard and Easy Distributions of SAT Problems\u00a0», *AAAI-92*, p. 459-465, 1992",
          href: "https://cdn.aaai.org/AAAI/1992/AAAI92-071.pdf",
          english: true,
        },
        {
          text: "M. Mézard, G. Parisi et R. Zecchina, «\u00a0Analytic and Algorithmic Solution of Random Satisfiability Problems\u00a0», *Science*, vol. 297, p. 812-815, 2002",
          href: "https://doi.org/10.1126/science.1073287",
          english: true,
        },
        {
          text: "M. Mézard et R. Zecchina, «\u00a0The random K-satisfiability problem: from an analytic solution to an efficient algorithm\u00a0», *Physical Review E*, vol. 66, 056126, 2002",
          href: "https://arxiv.org/abs/cond-mat/0207194",
          english: true,
        },
        {
          text: "J. Ding, A. Sly et N. Sun, «\u00a0Proof of the satisfiability conjecture for large k\u00a0», *Annals of Mathematics*, vol. 196, p. 1-388, 2022",
          href: "https://doi.org/10.4007/annals.2022.196.1.1",
          english: true,
        },
        {
          text: "M. Davis, G. Logemann et D. Loveland, «\u00a0A machine program for theorem-proving\u00a0», *Communications of the ACM*, vol. 5, p. 394-397, 1962",
          href: "https://doi.org/10.1145/368273.368557",
          english: true,
        },
        {
          text: "S. Cook, «\u00a0The P versus NP Problem\u00a0», Clay Mathematics Institute",
          href: "https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf",
          english: true,
        },
      ],
    },
    // Série « découverte » (annexe E) : ce qui est entre deux `$` est une formule (notation de MathText).
    refraction: {
      card: {
        title: "La réfraction de la lumière",
        text: "Changez l’angle d’un rayon et les milieux qu’il traverse\u00a0: regardez-le se briser, puis rester piégé.",
      },
      metaTitle: "La réfraction de la lumière — Le Labo",
      metaDescription:
        "Simulation interactive de la réfraction\u00a0: loi de Snell-Descartes, angle limite et réflexion totale, mis à jour en direct.",
      title: "La réfraction de la lumière",
      intro:
        "Dans un aquarium, un poisson semble parfois se trouver à deux endroits à la fois\u00a0: la lumière change de direction quand elle passe de l’eau à l’air. Réglez le rayon et regardez-le se briser.",
      controls: {
        title: "Réglages",
        from: "Milieu d’où vient la lumière",
        to: "Milieu où entre la lumière",
        angle: "Angle d’incidence (°)",
        media: {
          air: "Air (n = 1,00)",
          water: "Eau (n = 1,33)",
          glass: "Verre (n = 1,52)",
          diamond: "Diamant (n = 2,42)",
        },
      },
      results: {
        title: "Résultats",
        reflection: "Angle de réflexion",
        refraction: "Angle de réfraction",
        critical: "Angle limite",
        total: "aucun\u00a0: réflexion totale",
        noCritical: "aucun\u00a0: la lumière entre dans un milieu d’indice égal ou plus grand",
      },
      legend: {
        incident: "Rayon incident",
        reflected: "Rayon réfléchi",
        refracted: "Rayon réfracté",
        normal: "Normale",
      },
      summary: {
        refracted: "Rayon incident à {i₁}\u00a0; rayon réfracté à {i₂}.",
        total: "Rayon incident à {i₁}\u00a0; réflexion totale\u00a0: aucun rayon réfracté.",
      },
      laws: {
        title: "Les lois",
        intro:
          "Les angles se mesurent par rapport à la normale, la droite perpendiculaire à la surface au point où arrive le rayon.",
        items: [
          "Indice de réfraction d’un milieu\u00a0: $*n* = *c* / *v*$, où $*c*$ est la vitesse de la lumière dans le vide et $*v*$ sa vitesse dans le milieu.",
          "Loi de la réflexion\u00a0: $*r* = *i*_{1}$",
          "Loi de la réfraction (loi de Snell-Descartes)\u00a0: $*n*_{1} sin *i*_{1} = *n*_{2} sin *i*_{2}$",
          "Avec les valeurs réglées\u00a0: $sin *i*_{2} = *n*_{1} sin *i*_{1} / *n*_{2} = {s}$",
          "Si ce nombre dépasse 1, aucun angle $*i*_{2}$ ne convient\u00a0: il n’y a pas de rayon réfracté, toute la lumière est réfléchie. C’est la réflexion totale.",
          "Angle limite, quand la lumière passe dans un milieu d’indice plus petit ($*n*_{1} > *n*_{2}$)\u00a0: $sin *i*_{lim} = *n*_{2} / *n*_{1}$. Au-delà de cet angle, la réflexion est totale.",
        ],
      },
      assumptions: {
        title: "Hypothèses",
        text: "La lumière est d’une seule couleur (jaune, 589\u00a0nm)\u00a0: l’indice d’un milieu varie un peu avec la couleur. Les milieux sont transparents et homogènes, et leur surface de séparation est plane. La figure ne montre pas l’intensité des rayons\u00a0: en réalité, une partie de la lumière est toujours réfléchie, même quand elle traverse la surface.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          closer: {
            question:
              "De l’air vers l’eau, augmentez l’angle d’incidence de 0° à 89°. Le rayon réfracté se rapproche-t-il ou s’éloigne-t-il de la normale\u00a0?",
            answer:
              "il se rapproche de la normale, car l’eau a un indice plus grand que l’air. Même à 89°, l’angle de réfraction reste sous 48,8°\u00a0: $sin *i*_{2}$ ne peut pas dépasser 1,00 / 1,33.",
          },
          trapped: {
            question: "Inversez\u00a0: de l’eau vers l’air. À partir de quel angle le rayon réfracté disparaît-il\u00a0?",
            answer:
              "entre 48° et 49°. L’angle limite vaut 48,8°, car $sin *i*_{lim} = 1,00 / 1,33$. Au-delà, la lumière reste piégée dans l’eau\u00a0: c’est la réflexion totale.",
          },
          diamond: {
            question: "Comparez l’angle limite du diamant vers l’air avec celui de l’eau vers l’air.",
            answer:
              "24,4° pour le diamant, contre 48,8° pour l’eau. Plus l’indice du milieu 1 est grand, plus l’angle limite est petit, et plus la lumière y reste facilement piégée. Les fibres optiques utilisent la réflexion totale pour guider la lumière.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.3 «\u00a0Refraction\u00a0»",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.4 «\u00a0Total Internal Reflection\u00a0»",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.5 «\u00a0Dispersion\u00a0»",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-5-dispersion",
          english: true,
        },
      ],
    },
    "think-of-a-number": {
      card: {
        title: "Pensez à un nombre",
        text: "Choisissez un nombre entre 1 et 1\u00a0000\u00a0: l’ordinateur le trouve en 10 questions au plus.",
      },
      metaTitle: "Pensez à un nombre — Le Labo",
      metaDescription:
        "Jeu interactif\u00a0: choisissez un nombre, l’ordinateur le trouve en quelques questions grâce à la recherche dichotomique.",
      title: "Pensez à un nombre",
      subtitle: "La recherche dichotomique",
      intro:
        "Choisissez un nombre dans votre tête, sans le dire. L’ordinateur va le trouver en posant très peu de questions. Son secret\u00a0: couper en deux, à chaque fois, la liste des nombres encore possibles.",
      // L'annexe E.3 ne donne pas de titre anglais au jeu : il n'en a dans aucune langue.
      controls: { range: "Choisissez un nombre entre 1 et…" },
      instruction: "Choisissez un nombre entre 1 et {N}, gardez-le en tête, puis cliquez sur «\u00a0J’ai choisi\u00a0».",
      buttons: {
        ready: "J’ai choisi",
        higher: "Plus grand",
        lower: "Plus petit",
        found: "C’est ça\u00a0!",
        undo: "Annuler la dernière réponse",
        replay: "Rejouer",
      },
      question: "Votre nombre est-il {g}\u00a0?",
      counter: "Question {k} sur {Q} au plus",
      possibilities: {
        many: "Il reste {r} nombres possibles, de {a} à {b}.",
        one: "Il ne reste qu’un nombre possible\u00a0: {a}.",
      },
      history: {
        title: "Questions posées",
        higher: "{g}\u00a0? Plus grand",
        lower: "{g}\u00a0? Plus petit",
        found: "{g}\u00a0? C’est ça\u00a0!",
      },
      end: {
        many: "Trouvé\u00a0! Votre nombre est {g}, découvert en {k} questions.",
        one: "Trouvé\u00a0! Votre nombre est {g}, découvert dès la première question.",
      },
      contradiction:
        "Vos réponses se contredisent\u00a0: aucun nombre de 1 à {N} ne convient. Annulez la dernière réponse ou rejouez.",
      bar: "Nombres encore possibles\u00a0: de {a} à {b}, sur 1 à {N}.",
      how: {
        title: "Comment fait l’ordinateur\u00a0?",
        items: [
          "Il propose toujours le nombre du milieu des nombres encore possibles. Votre réponse élimine d’un coup la moitié d’entre eux.",
          "Avec 1\u00a0000 nombres, il en reste au plus 500 après la première question, puis 250, 125, 62, 31, 15, 7, 3, 1. Il lui faut donc au plus 10 questions.",
          "En général, il faut au plus $⌊log_{2} *N*⌋ + 1$ questions pour $*N*$ nombres\u00a0: le nombre de fois qu’on peut couper $*N*$ en deux, plus un. Pour un million de nombres, 20 questions suffisent, car $2^{20} = 1\u00a0048\u00a0576$.",
          "Cette méthode s’appelle la recherche dichotomique. Elle sert partout où les données sont rangées dans l’ordre\u00a0: un mot dans un dictionnaire, un nom dans une liste triée, une valeur dans une table.",
          "Si l’ordinateur posait les nombres un par un (1, 2, 3…), il lui faudrait jusqu’à 1\u00a0000 questions pour 1\u00a0000 nombres.",
        ],
      },
      assumptions: {
        title: "Hypothèses",
        text: "Vous répondez honnêtement et ne changez pas de nombre en cours de partie. Les nombres possibles sont rangés dans l’ordre\u00a0: c’est ce qui permet d’en éliminer la moitié à chaque réponse.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          thousand: {
            question: "Jouez avec 1\u00a0000 nombres en choisissant 1\u00a0000. Combien de questions faut-il\u00a0?",
            answer: "10, le maximum\u00a0: 500, 750, 875, 938, 969, 985, 993, 997, 999, puis 1\u00a0000.",
          },
          million: {
            question: "Passez à un million de nombres. Combien de questions au plus\u00a0?",
            answer:
              "20, seulement deux fois plus que pour 1\u00a0000 nombres, alors qu’il y a mille fois plus de nombres. Chaque question supplémentaire fait à peu près doubler la quantité de nombres que l’on peut départager.",
          },
          lie: {
            question:
              "Mentez exprès\u00a0: avec 100 nombres, répondez «\u00a0Plus grand\u00a0» à 50, puis «\u00a0Plus petit\u00a0» à 75, puis «\u00a0Plus grand\u00a0» à toutes les questions suivantes. Que se passe-t-il\u00a0?",
            answer:
              "après 62, 68, 71, 73 et 74, il ne reste plus aucun nombre possible\u00a0: aucun nombre ne peut vérifier toutes vos réponses, et l’ordinateur le détecte.",
          },
        },
      },
      sources: [
        {
          text: "Wikipédia, «\u00a0Recherche dichotomique\u00a0»",
          href: "https://fr.wikipedia.org/wiki/Recherche_dichotomique",
          english: false,
        },
      ],
    },
    "converging-lens": {
      card: {
        title: "La lentille convergente",
        text: "Déplacez un objet devant une lentille\u00a0: regardez son image grandir, se renverser, puis changer de côté.",
      },
      metaTitle: "La lentille convergente — Le Labo",
      metaDescription:
        "Simulation interactive d’une lentille convergente\u00a0: construction des rayons, position et taille de l’image, mises à jour en direct.",
      title: "La lentille convergente",
      intro:
        "Une loupe, et même votre œil\u00a0: tous deux utilisent une lentille convergente. Déplacez l’objet et regardez où se forme son image, et comment elle change.",
      controls: {
        title: "Réglages",
        focal: "Distance focale (cm)",
        distance: "Distance entre l’objet et la lentille (cm)",
      },
      fixed: "Hauteur de l’objet\u00a0: 2\u00a0cm",
      // Les mesures algébriques (OA, OA′, OF′, AB, A′B′) sont surmontées d'une barre à l'affichage.
      results: {
        title: "Résultats",
        position: "Position de l’image (OA′)",
        magnification: "Grandissement (γ)",
        height: "Taille algébrique de l’image (A′B′)",
        nature: "Nature de l’image",
        none: "aucune",
        // « aucun » : valeurs de contrôle de l'annexe F.1.
        noMagnification: "aucun",
      },
      natures: {
        smaller: "Réelle, renversée, plus petite que l’objet.",
        same: "Réelle, renversée, de même taille que l’objet.",
        larger: "Réelle, renversée, plus grande que l’objet.",
        virtual: "Virtuelle, droite, plus grande que l’objet\u00a0: c’est le principe de la loupe.",
        none: "Pas d’image\u00a0: les rayons ressortent parallèles, l’image est rejetée à l’infini.",
      },
      outside: "L’image se forme hors du cadre de la figure.",
      legend: {
        object: "Objet",
        image: "Image",
        rays: "Rayons",
        extensions: "Prolongements des rayons",
        foci: "Foyers F et F′",
      },
      summary: {
        image: "Objet à {d} de la lentille\u00a0; image {nature}, à {OA′} de la lentille, de taille {A′B′}.",
        none: "Objet au foyer F\u00a0: pas d’image.",
      },
      laws: {
        title: "Les lois",
        items: [
          "Les distances sont comptées à partir du centre O de la lentille, positives dans le sens de la lumière (vers la droite)\u00a0: l’objet, à gauche, a donc une position OA négative. Les tailles sont comptées positives vers le haut\u00a0: une image renversée a une taille A′B′ négative.",
          "Relation de conjugaison\u00a0: $1/OA′ − 1/OA = 1/OF′$",
          "Grandissement\u00a0: $γ = A′B′ / AB = OA′ / OA$",
          "Avec les valeurs réglées\u00a0: $OA$ = {OA}\u00a0; $OF′$ = {f′}\u00a0; $OA′$ = {OA′}\u00a0; $γ$ = {γ}",
          "Une image réelle ($OA′ > 0$) se forme de l’autre côté de la lentille et peut être recueillie sur un écran. Une image virtuelle ($OA′ < 0$) se voit seulement en regardant à travers la lentille.",
          "Un grandissement négatif signifie une image renversée\u00a0; un grandissement plus grand que 1 en valeur absolue, une image plus grande que l’objet.",
        ],
      },
      assumptions: {
        title: "Hypothèses",
        text: "La lentille est mince\u00a0: son épaisseur est négligée. Les rayons sont tracés selon les trois règles de construction d’une lentille convergente. L’objet est perpendiculaire à l’axe optique, son pied A sur l’axe.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          twice: {
            question: "Avec f′ = 5\u00a0cm, placez l’objet à 10\u00a0cm de la lentille. Que remarquez-vous\u00a0?",
            answer:
              "l’image est renversée, de même taille que l’objet, à 10\u00a0cm de l’autre côté. Quand l’objet est à 2f′, γ = −1.",
          },
          focus: {
            question: "Rapprochez l’objet jusqu’à 5\u00a0cm, puis jusqu’à 5,5\u00a0cm. Que devient l’image\u00a0?",
            answer:
              "à 5\u00a0cm, l’objet est au foyer\u00a0: les rayons ressortent parallèles et il n’y a pas d’image. À 5,5\u00a0cm, l’image est très loin (55\u00a0cm) et très grande (γ = −10).",
          },
          magnifier: {
            question: "Placez l’objet à 2,5\u00a0cm, plus près que le foyer. Où est l’image\u00a0?",
            answer:
              "du même côté que l’objet, droite et deux fois plus grande (γ = 2). Elle est virtuelle\u00a0: on la voit à travers la lentille. C’est ainsi que fonctionne une loupe.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 3*, section 2.4 «\u00a0Thin Lenses\u00a0»",
          href: "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 2.7 «\u00a0The Simple Magnifier\u00a0»",
          href: "https://openstax.org/books/university-physics-volume-3/pages/2-7-the-simple-magnifier",
          english: true,
        },
      ],
    },
    "estimating-pi": {
      card: {
        title: "Calculer π avec le hasard",
        text: "Lancez des points au hasard dans un carré\u00a0: peu à peu, π apparaît.",
      },
      metaTitle: "Calculer π avec le hasard — Le Labo",
      metaDescription:
        "Expérience interactive\u00a0: estimez π en lançant des points au hasard dans un carré, avec la méthode de Monte-Carlo.",
      title: "Calculer π avec le hasard",
      subtitle: "La méthode de Monte-Carlo",
      intro:
        "Lancez des points au hasard dans un carré et comptez ceux qui tombent dans le quart de disque. Ce simple comptage donne une valeur approchée de π, de plus en plus proche à mesure que les points s’accumulent.",
      // L'annexe F.2 ne donne pas de titre anglais à l'expérience : elle n'en a dans aucune langue.
      buttons: {
        add100: "Ajouter 100 points",
        add1000: "Ajouter 1\u00a0000 points",
        add10000: "Ajouter 10\u00a0000 points",
        restart: "Recommencer",
      },
      seed: {
        label: "Graine du hasard",
        help: "Même graine, mêmes points\u00a0: vous pouvez refaire exactement la même expérience.",
        error: "Entrez un nombre entier de 1 à 999\u00a0999.",
      },
      results: {
        title: "Résultats",
        total: "Points lancés",
        inside: "Points dans le quart de disque",
        estimate: "Estimation de π (4 × points dans le quart de disque ÷ points lancés)",
        difference: "Écart avec π (π = 3,14159…)",
      },
      empty: "Ajoutez des points pour commencer.",
      maximum: "Maximum atteint\u00a0: 100\u00a0000 points. Recommencez pour une nouvelle série.",
      note: "La figure montre les 2\u00a0000 premiers points\u00a0; les calculs utilisent tous les points.",
      legend: {
        inside: "Point dans le quart de disque",
        outside: "Point en dehors",
      },
      summary: "{N} points lancés, dont {n} dans le quart de disque\u00a0: π ≈ {estimation}.",
      how: {
        title: "Comment ça marche\u00a0?",
        items: [
          "Le carré a pour côté 1, donc pour aire 1. Le quart de disque a pour rayon 1, donc pour aire π / 4.",
          "Un point lancé au hasard dans le carré a donc une probabilité π / 4, environ 0,785, de tomber dans le quart de disque.",
          "Sur un grand nombre de points, la part des points dans le quart de disque se rapproche de π / 4. En la multipliant par 4, on obtient une valeur approchée de π.",
          "Un point est dans le quart de disque si $*x*^{2} + *y*^{2} ≤ 1$, où $*x*$ et $*y*$ sont ses coordonnées.",
          "Cette méthode, qui utilise le hasard pour calculer une valeur, s’appelle la méthode de Monte-Carlo. Elle est lente\u00a0: avec 100 fois plus de points, l’erreur est en moyenne environ 10 fois plus petite.",
        ],
      },
      assumptions: {
        title: "Hypothèses",
        text: "Les points sont répartis uniformément dans le carré. L’ordinateur ne tire pas de vrai hasard\u00a0: il utilise un générateur pseudo-aléatoire, qui donne toujours la même suite pour une même graine.",
      },
      tryThis: {
        title: "À essayer",
        show: "Voir l’explication",
        items: {
          growth: {
            question:
              "Avec la graine 2026, ajoutez 100 points, puis montez jusqu’à 100\u00a0000. Comment évolue l’estimation\u00a0?",
            answer:
              "3,2000 avec 100 points, 3,1760 avec 1\u00a0000, 3,1632 avec 10\u00a0000, 3,1422 avec 100\u00a0000. Elle se rapproche de π, mais pas forcément à chaque étape\u00a0: c’est le hasard.",
          },
          seed: {
            question: "Changez de graine et refaites 100 points. Pourquoi l’estimation change-t-elle\u00a0?",
            answer:
              "d’autres points sont tirés. Avec la graine 1, on obtient 3,0000 avec 100 points. Avec peu de points, l’estimation varie beaucoup d’une graine à l’autre\u00a0; avec beaucoup de points, beaucoup moins.",
          },
          decimal: {
            question: "Combien de points faudrait-il pour gagner une décimale exacte de plus\u00a0?",
            answer:
              "environ 100 fois plus, car l’erreur ne diminue en moyenne que d’un facteur 10 quand on multiplie le nombre de points par 100. C’est pourquoi on ne calcule pas π ainsi en pratique.",
          },
        },
      },
      sources: [
        {
          text: "Wikipédia, «\u00a0Méthode de Monte-Carlo\u00a0»",
          href: "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo",
          english: false,
        },
      ],
    },
  },
};

export type Messages = typeof fr;

export default fr;
