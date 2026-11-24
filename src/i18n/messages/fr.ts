/**
 * Textes français : source de vérité de la structure des messages.
 * Le fichier anglais doit avoir exactement les mêmes clés (vérifié par TypeScript).
 * Textes des annexes B et C du cahier, mot pour mot (vérifié par texts.test.ts et demos.test.ts). Une phrase coupée par
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
      "Des expériences de mécanique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton.",
    title: "Physique",
    intro:
      "Des expériences de mécanique à régler vous-même : la trajectoire d’un projectile, les chocs du pendule de Newton.",
  },
  // Expériences (annexes C.2 et C.3). Sources : ce qui est entre deux `*` s'écrit en italique.
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
  },
};

export type Messages = typeof fr;

export default fr;
