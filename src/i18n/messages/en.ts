import type { Messages } from "./fr";

/** Textes anglais des annexes B et C du cahier, mot pour mot. Mêmes clés que fr.ts. */
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
    physics: {
      title: "Physics",
      open: "Open the experiment",
      all: "All physics experiments",
    },
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
  // Menu, fil d'Ariane et fin de page d'une expérience (annexe C.1).
  nav: {
    label: "Main menu",
    physics: "Physics",
    breadcrumb: "Breadcrumb",
  },
  experiment: {
    sources: "Further reading",
    inEnglish: "",
    portfolio: "See my portfolio",
  },
  physics: {
    metaTitle: "Physics — The Lab",
    metaDescription:
      "Mechanics experiments you can set up yourself: the path of a projectile and the collisions in Newton’s cradle.",
    title: "Physics",
    intro:
      "Mechanics experiments you can set up yourself: the path of a projectile and the collisions in Newton’s cradle.",
  },
  // Expériences (annexes C.2 et C.3). Sources : ce qui est entre deux `*` s'écrit en italique.
  demos: {
    projectile: {
      card: {
        title: "Projectile motion",
        text: "Angle, speed, launch height, gravity: set up the throw and watch the trajectory.",
      },
      metaTitle: "Projectile motion — The Lab",
      metaDescription:
        "Interactive projectile motion simulation: equations of motion, trajectory, range and maximum height, updated live.",
      title: "Projectile motion",
      intro:
        "A kicked ball, a jet of water, a stone thrown from a bridge: they all follow the same law. Set up the throw, then compare trajectories.",
      controls: {
        title: "Controls",
        angle: "Launch angle (°)",
        speed: "Initial speed (m/s)",
        height: "Launch height (m)",
        gravity: "Gravity",
        earth: "Earth (g = 9.8\u00a0m/s²)",
        moon: "Moon (g = 1.6\u00a0m/s²)",
        mars: "Mars (g = 3.7\u00a0m/s²)",
      },
      buttons: {
        launch: "Launch",
        keep: "Keep this throw to compare",
        clear: "Clear comparison",
      },
      results: {
        title: "Results",
        flightTime: "Flight time",
        range: "Range",
        apex: "Maximum height",
        impactSpeed: "Impact speed",
      },
      legend: {
        current: "Current throw",
        kept: "Kept throw",
      },
      summary: {
        current: "Current throw: range {range}, maximum height {height}.",
        kept: "Kept throw: range {range}, maximum height {height}.",
      },
      equations: {
        title: "The equations",
        frame:
          "Axes: origin on the ground, directly below the launch point; x-axis horizontal, y-axis pointing up.",
        motion: "Equations of motion",
        trajectory: "Trajectory (a parabola)",
        apex: "Maximum height",
        flightTime: "Flight time",
        range: "Range",
        rangeNoHeight: "with no launch height",
        impactSpeed: "Impact speed",
        vertical: "Vertical throw: the projectile stays on the y-axis (x = 0).",
      },
      assumptions: {
        title: "Assumptions",
        text: "The projectile is treated as a point mass, and the Earth’s frame of reference as inertial. Air resistance is neglected: only its weight acts on it, so its acceleration is g, pointing straight down.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          sameRange: {
            question:
              "With no launch height, throw at 30° and then at 60° at the same speed. What do you notice?",
            answer:
              "the range is v₀² sin 2α / g, and sin 60° = sin 120°. Two complementary angles give the same range.",
          },
          bestAngle: {
            question: "Still with no launch height, find the angle that gives the longest range.",
            answer: "45°, because sin 2α is at most 1, when 2α = 90°.",
          },
          moon: {
            question:
              "Make the same throw on Earth and then on the Moon, with no launch height. By how much is the range multiplied?",
            answer:
              "by 9.8 / 1.6 ≈ 6.1. With no launch height, the range is inversely proportional to g.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 1*, section 4.3 “Projectile Motion”",
          href: "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
          english: true,
        },
      ],
    },
    "newtons-cradle": {
      card: {
        title: "Newton’s cradle",
        text: "Pull back one or more balls, let go, and follow momentum and energy through every collision.",
      },
      metaTitle: "Newton’s cradle — The Lab",
      metaDescription:
        "Interactive Newton’s cradle simulation: collisions between balls, conservation of momentum and kinetic energy.",
      title: "Newton’s cradle",
      intro:
        "Pull back one ball and let go: a single ball swings out on the other side. Pull back two, and two swing out. This desk toy shows two conservation laws at work.",
      controls: {
        title: "Controls",
        pulled: "Number of balls pulled back",
        angle: "Release angle (°)",
        restitution: "Coefficient of restitution",
        restitutionHelp:
          "1 means a perfectly elastic collision. Below 1, some kinetic energy is lost in every collision.",
      },
      fixed: {
        mass: "Mass of each ball: {mass}",
        length: "String length: {length}",
        gravity: "g = {gravity}",
      },
      buttons: {
        release: "Let go",
        pause: "Pause",
        resume: "Resume",
        reset: "Reset",
        slow: "Slow motion (×0.1)",
      },
      readings: {
        title: "At impact",
        speedBefore: "Speed just before impact",
        speedsAfter: "Speeds just after impact",
        ball: "Ball",
        momentum: "Total momentum",
        energy: "Total kinetic energy",
        before: "Before",
        after: "After",
      },
      summary: "Before impact: p = {p}, KE = {KE}. After impact: p = {p}, KE = {KE}.",
      laws: {
        title: "The laws",
        items: {
          lowestPoint: {
            term: "Speed at the lowest point, from conservation of mechanical energy on the way down",
            lines: ["$*v* = √(2 *g* *L* (1 − cos *θ*_{0}))$"],
          },
          momentum: {
            term: "Momentum",
            lines: [
              "$*p* = *m* *v*$, conserved in every collision",
              "$*m* *v*_{1} + *m* *v*_{2} = *m* *v*_{1}′ + *m* *v*_{2}′$",
            ],
          },
          energy: {
            term: "Kinetic energy",
            lines: ["$*KE* = ½ *m* *v*^{2}$, conserved only in a perfectly elastic collision"],
          },
          restitution: {
            term: "Coefficient of restitution",
            lines: ["$*e* = (*v*_{2}′ − *v*_{1}′) / (*v*_{1} − *v*_{2})$"],
          },
          twoBalls: {
            term: "Two identical balls, the second at rest",
            lines: [
              "$*v*_{1}′ = (1 − *e*) *v*_{1} / 2$",
              "$*v*_{2}′ = (1 + *e*) *v*_{1} / 2$",
              "for $*e* = 1$ the speeds swap",
              "$*v*_{1}′ = 0$",
              "$*v*_{2}′ = *v*_{1}$",
            ],
          },
          lost: {
            term: "Kinetic energy lost in that collision",
            lines: ["the fraction $(1 − *e*^{2}) / 2$"],
          },
        },
      },
      assumptions: {
        title: "Assumptions",
        text: "The balls are identical. The strings don’t stretch and their mass is negligible, and air resistance is neglected. Each collision is instantaneous and involves only two neighbouring balls, so collisions pass from ball to ball. A real Newton’s cradle is subtler, because its balls are touching; this simple model captures the essentials.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          twoBalls: {
            question: "Pull back two balls. Why do you never see a single ball fly out twice as fast?",
            answer:
              "a single ball at 2v would conserve momentum (m · 2v = 2 m v), but its kinetic energy would be ½ m (2v)² = 2 m v² instead of 2 × ½ m v² = m v². Together, the two laws require two balls to swing out, at speed v.",
          },
          restitution: {
            question:
              "Set the coefficient of restitution to 0.8 and let go of one ball. What happens to momentum and to kinetic energy?",
            answer:
              "total momentum stays the same; kinetic energy drops with every collision, and eventually all the balls move a little.",
          },
          angle: {
            question:
              "Change the release angle from 20° to 40°. Does the speed at the lowest point double?",
            answer:
              "almost. Since 1 − cos θ₀ = 2 sin² (θ₀/2), v = 2 sin (θ₀/2) √(g L). And sin 20° / sin 10° ≈ 1.97, so the speed is multiplied by 1.97. For small angles, it is almost proportional to the angle.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 1*, section 8.3 “Conservation of Energy” (Example 8.7: the simple pendulum)",
          href: "https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 1*, section 9.3 “Conservation of Linear Momentum”",
          href: "https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 1*, section 9.4 “Types of Collisions”",
          href: "https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions",
          english: true,
        },
        {
          text: "Wikipedia, “Coefficient of restitution”",
          href: "https://en.wikipedia.org/wiki/Coefficient_of_restitution",
          english: true,
        },
        {
          text: "S. Hutzler, G. Delaney, D. Weaire and F. MacLeod, “Rocking Newton’s cradle”, *American Journal of Physics*, vol. 72, no. 12, pp. 1508–1516, 2004",
          href: "https://doi.org/10.1119/1.1783898",
          english: true,
        },
      ],
    },
  },
};

export default en;
