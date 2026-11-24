import type { Messages } from "./fr";

/** Textes anglais de l'annexe B du cahier, mot pour mot. Mêmes clés que fr.ts. */
const en: Messages = {
  site: {
    name: "The Lab",
    author: "Cabrel FOSSO",
    ogName: "The Lab — Cabrel FOSSO",
    skipToContent: "Skip to content",
    languageSwitcher: "Choose language",
    themeToggle: "Switch theme (light or dark)",
  },
  header: {
    portfolio: "Portfolio",
  },
  footer: {
    label: "Useful links",
    portfolio: "My portfolio",
    code: "Source code on GitHub",
    privacy: "Privacy",
    codeLicense: { before: "Code under the ", link: "MIT license" },
    contentLicense: { before: "Text and figures under ", link: "CC BY 4.0" },
    copyright: "Cabrel FOSSO",
  },
  notFound: {
    title: "Page not found",
    body: "This page doesn’t exist or has moved.",
    backHome: "Back to the Lab’s home page",
  },
  home: {
    metaTitle: "The Lab — Cabrel FOSSO",
    metaDescription:
      "Interactive physics and computing experiments: adjust, observe, and understand the equations and algorithms behind them. Free, in your browser.",
    eyebrow: "The Lab",
    title: { before: "Understand physics and computing ", highlight: "hands-on" },
    intro:
      "The Lab is a collection of interactive experiments. Change a setting, watch what happens, then explore the equations or the algorithm behind the result. Everything runs in your browser, on a laptop or a phone, with no account and nothing to install.",
    how: {
      title: "How it works",
      steps: {
        adjust: {
          title: "Adjust",
          text: "Each experiment has its own controls: an angle, a speed, the size of a problem.",
        },
        observe: {
          title: "Observe",
          text: "The figure and the readings update live.",
        },
        understand: {
          title: "Understand",
          text: "Every experiment comes with its equations, the assumptions of the model, and “Try this” questions. Sources are cited. An experiment explains a known phenomenon; it never claims to solve an open problem.",
        },
      },
    },
    audiences: {
      title: "Who is it for?",
      items: {
        students: { title: "Students", text: "see what the formulas from class actually do." },
        teachers: { title: "Teachers", text: "project a simulation in class." },
        researchers: {
          title: "Researchers",
          text: "demos that connect AI, physics and theoretical computer science.",
        },
      },
    },
    temporary: {
      title: "Experiments on the way",
      text: "The experiments are moving in. Meanwhile, projectile motion and Newton’s cradle are on my portfolio.",
      link: "See the demos on my portfolio",
    },
    signature: {
      text: "I’m Cabrel FOSSO, a physics teacher in Cameroon with a Master’s in computer science (explainable AI), and a developer.",
      link: "See my portfolio",
    },
  },
  privacy: {
    metaTitle: "Privacy — The Lab",
    metaDescription: "What the Lab records, and what it doesn’t.",
    title: "Privacy",
    intro: "What the Lab records, and what it doesn’t.",
    controller: {
      term: "Data controller",
      text: {
        before: "Jospin Cabrel FOSSO TIOFOUET, reachable through the ",
        link: "Contact page of my portfolio",
        after: ".",
      },
    },
    entries: {
      analytics: {
        term: "Analytics",
        text: "Cloudflare Web Analytics counts visits and measures how fast pages load, in aggregate. According to Cloudflare, it uses no cookies or browser storage for this, and doesn’t track you from one site to another.",
      },
      preferences: {
        term: "Preferences",
        text: "your theme choice (light or dark) is stored in your own browser and never sent to me. Your language isn’t stored: it’s part of the page address (/fr or /en). Only at lab.cabrelfosso.com itself is the language picked from the preference your browser sends, and nothing is stored.",
      },
      experiments: {
        term: "Experiments",
        text: "all calculations run in your browser; your settings are never sent to me.",
      },
      doesNot: {
        term: "What the Lab doesn’t do",
        text: "no accounts, no forms, no ads. It doesn’t sell any data or share it with anyone for commercial purposes.",
      },
      hosting: {
        term: "Hosting",
        text: "the site is hosted by Cloudflare.",
      },
      rights: {
        term: "Your rights",
        text: "I don’t store any data that identifies you. If you have a question, write to me through the Contact page of my portfolio.",
      },
    },
    updated: {
      term: "Last updated",
    },
  },
};

export default en;
