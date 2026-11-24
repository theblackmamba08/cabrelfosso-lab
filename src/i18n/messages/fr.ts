/**
 * Textes français : source de vérité de la structure des messages.
 * Le fichier anglais doit avoir exactement les mêmes clés (vérifié par TypeScript).
 * Textes de l'annexe B du cahier, mot pour mot (vérifié par texts.test.ts). Une phrase coupée par
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
    temporary: {
      title: "Les expériences arrivent",
      text: "Les expériences s’installent ici. En attendant, le mouvement d’un projectile et le pendule de Newton sont sur mon portfolio.",
      link: "Voir les démos sur mon portfolio",
    },
    signature: {
      text: "Je suis Cabrel FOSSO : enseignant de physique au Cameroun, titulaire d’un Master en informatique (IA explicable) et développeur.",
      link: "Voir mon portfolio",
    },
  },
  privacy: {
    metaTitle: "Confidentialité — Le Labo",
    metaDescription:
      "Ce que le Labo enregistre, et ce qu’il n’enregistre pas : mesure d’audience, préférences, hébergement.",
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
};

export type Messages = typeof fr;

export default fr;
