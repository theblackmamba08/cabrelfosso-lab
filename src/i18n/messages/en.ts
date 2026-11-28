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
    computing: {
      title: "Computing",
      all: "All computing experiments",
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
    computing: "Computing",
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
      "Physics experiments you can set up yourself: the path of a projectile, the collisions in Newton’s cradle, and the path of light.",
    title: "Physics",
    intro:
      "Physics experiments you can set up yourself: the path of a projectile, the collisions in Newton’s cradle, and the path of light.",
  },
  computing: {
    metaTitle: "Computing — The Lab",
    metaDescription:
      "Computing experiments you can run yourself, starting with 3-SAT logic puzzles: where are the truly hard problems?",
    title: "Computing",
    intro:
      "Computing experiments you can run yourself, starting with 3-SAT logic puzzles: where are the truly hard problems?",
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
    "three-sat": {
      card: {
        title: "Where are the hard problems?",
        text: "Randomly generated logic puzzles: change how constrained they are and see where the solver struggles.",
      },
      metaTitle: "Where are the hard problems? — The Lab",
      metaDescription:
        "Interactive experiment on the 3-SAT phase transition: the share of random logic puzzles that have a solution, and how hard a DPLL solver works, computed in your browser.",
      title: "Where are the hard problems?",
      subtitle: "The 3-SAT phase transition",
      intro:
        "The computer generates random logic puzzles. With few constraints, almost all of them have a solution; with many, almost none do. In between lies a narrow zone where the solver struggles most. Set it up, run it, and see where that zone is.",
      controls: {
        title: "The experiment",
        variables: "Number of variables (n)",
        puzzles: "Puzzles per value of α",
        seed: "Random seed",
        seedHelp: "Same seed, same puzzles: you can rerun exactly the same calculation.",
        seedError: "Enter a whole number from 1 to 999,999.",
      },
      buttons: {
        run: "Run",
        pause: "Pause",
        resume: "Resume",
        stop: "Stop",
        clear: "Clear curves",
      },
      status: {
        progress: "Computing n = {n}: α = {α} ({i} / 26)",
        done: "Done for n = {n}: {total} puzzles solved.",
        stopped: "Calculation stopped.",
        empty: "Choose n, then run the calculation.",
      },
      charts: {
        share: "Puzzles that have a solution (%)",
        choices: "Solver decisions (median, log scale)",
        axis: "α = clauses / variables",
        curve: "n = {n}",
        prediction: "4.27: prediction for very large n",
      },
      summaries: {
        crossing:
          "n = {n}: the share of puzzles with a solution drops below 50% between α = {a} and α = {b}; the solver makes the most decisions at α = {c} (median {d}).",
        above:
          "n = {n}: the share of puzzles with a solution stays at 50% or more across the whole range; the solver makes the most decisions at α = {c} (median {d}).",
        below:
          "n = {n}: the share of puzzles with a solution is below 50% from α = {a}; the solver makes the most decisions at α = {c} (median {d}).",
      },
      table: {
        show: "Show the values",
        alpha: "α",
        share: "n = {n}: have a solution (%)",
        choices: "n = {n}: decisions (median)",
      },
      steps: {
        title: "Step by step: the solver on a small puzzle",
        intro:
          "A puzzle with 6 variables (x₁ to x₆) and 24 clauses, drawn from the same seed. The first puzzle shown is one where the solver has to backtrack at least once. Follow each decision the solver makes.",
        number: "Puzzle no. {number}",
        buttons: {
          next: "Next step",
          restart: "Start over",
          another: "Another puzzle",
        },
        counter: "Decisions: {k}",
        states: {
          satisfied: "satisfied",
          false: "false",
          unit: "unit (only one literal left)",
          pending: "pending",
        },
        words: { or: "or", not: "not" },
        messages: {
          choiceTrue: "Decision: x{i} = true.",
          choiceFalse: "Decision: x{i} = false (trying the other value).",
          propagation: "Propagation: clause {c} has only one literal left, so x{i} = {value}.",
          conflict: "Conflict: clause {c} is false.",
          backtrack: "Backtrack: undo the decision on x{i} and everything after it.",
          solution: "Solution found after {k} decisions: {assignment}.",
          none: "No solution: every possibility has been ruled out, after {k} decisions.",
        },
        values: { true: "true", false: "false", free: "free (any value works)" },
      },
      problem: {
        title: "The problem and the algorithm",
        paragraphs: [
          "**The 3-SAT problem**: A Boolean variable is either true or false. A literal is a variable (x) or its negation (not x, written ¬x). A clause joins three literals with “or”: it is true if at least one of them is true, so it rules out only one of the 8 combinations of its three variables. A puzzle (a 3-SAT formula) asks for all its clauses to be true at once. It is satisfiable if such an assignment exists, and unsatisfiable otherwise.",
          "**Example**: (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃). With x₃ = true, both clauses are true, so the puzzle is satisfiable.",
          "**The α setting** is the number of clauses per variable: with n = 40 and α = 4.2, the puzzle has 168 clauses.",
          "**How the puzzles are drawn**: each clause picks three different variables at random and negates each one with probability one half. Clauses are drawn independently of each other, as in the experiment by Mitchell, Selman and Levesque (1992).",
        ],
        solver: "**The solver (the DPLL algorithm)**, after Davis, Putnam, Logemann and Loveland, in a simple version:",
        solverSteps: [
          "Propagation: if a clause has only one literal left, that literal must be true.",
          "If a clause is false: conflict; go back to the last decision and try the other value.",
          "If every clause is true: solution found.",
          "Otherwise, decide: take the lowest-numbered free variable in a clause that isn’t true yet, and try “true” first, then “false”.",
        ],
        after: [
          "If both values of every decision have failed, the solver has proved that the puzzle has no solution.",
          "**What we measure**: the number of decisions (step 4) for each puzzle. The median is the middle value: half the puzzles need fewer decisions, half need more. On the second chart, each gridline multiplies the number of decisions by 10 (log scale).",
        ],
      },
      threshold: {
        title: "What do we know about the threshold?",
        items: [
          "In 1992, Mitchell, Selman and Levesque observed that the hardest puzzles for this kind of solver lie where half of them have a solution: around α = 4.3 for 50 variables, and around 4.55 for 20 variables.",
          "In 2002, physicists computed a value close to 4.27 for very large n, using a method from the study of spin glasses (the cavity method). It is a calculation, not a proof.",
          "Mathematicians have proved that below 3.52 almost all puzzles have a solution, and above 4.49 almost none do, as n becomes very large. For 3-SAT, nobody has proved that the threshold has one precise value. That was proved in 2022 for much longer clauses.",
        ],
      },
      complexity: {
        title: "P, NP and this experiment",
        items: [
          "**P**: problems an algorithm can solve in a number of steps bounded by a polynomial in the size of the input (such as n² or n³), known as “polynomial time”.",
          "**NP**: problems where a proposed solution can be checked in polynomial time. For 3-SAT, checking an assignment is easy: read through every clause.",
          "**NP-complete**: a problem in NP to which every problem in NP can be reduced in polynomial time. In 1971, Stephen Cook proved that SAT is NP-complete; 3-SAT is too.",
          "The question “P = NP?” asks whether every problem whose solution can be checked quickly can also be solved quickly. It remains open.",
          "NP-completeness is about the worst case. A randomly drawn puzzle isn’t necessarily hard: this experiment looks at typical cases.",
          "This experiment does not answer the P = NP question. It shows where, in practice, the puzzles that are hard for a solver are found.",
        ],
      },
      assumptions: {
        title: "Assumptions",
        text: "The puzzles are random, so the results say nothing directly about puzzles that come from real-world problems. The sizes are small (50 variables at most): the 50% crossing happens above 4.27 and moves closer to it as n grows. The number of decisions depends on the solver: another algorithm would give other numbers, and research has shown that hardness also depends on the solver used.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          size: {
            question:
              "Run n = 20, then n = 50, without clearing. What happens to the curve of puzzles that have a solution?",
            answer:
              "for n = 50 it drops more steeply and falls below 50% closer to 4.27. The bigger the puzzles, the sharper the transition: this is a finite-size effect.",
          },
          peak: {
            question: "Where is the peak in decisions compared with the 50% crossing?",
            answer:
              "almost in the same place. On the left, there are many solutions and the first decisions succeed. On the right, there are so many constraints that conflicts come quickly and the solver soon proves there is no solution. In the middle, it has to explore many paths before it can conclude.",
          },
          seed: {
            question: "With n = 20, run it again with another seed. Why does the curve change?",
            answer:
              "20 puzzles per value of α is a small sample, so the randomness of the draw shows. With 100 puzzles, the curve becomes smoother.",
          },
        },
      },
      sources: [
        {
          text: "D. Mitchell, B. Selman and H. Levesque, “Hard and Easy Distributions of SAT Problems”, *AAAI-92*, pp. 459–465, 1992",
          href: "https://cdn.aaai.org/AAAI/1992/AAAI92-071.pdf",
          english: true,
        },
        {
          text: "M. Mézard, G. Parisi and R. Zecchina, “Analytic and Algorithmic Solution of Random Satisfiability Problems”, *Science*, vol. 297, pp. 812–815, 2002",
          href: "https://doi.org/10.1126/science.1073287",
          english: true,
        },
        {
          text: "M. Mézard and R. Zecchina, “The random K-satisfiability problem: from an analytic solution to an efficient algorithm”, *Physical Review E*, vol. 66, 056126, 2002",
          href: "https://arxiv.org/abs/cond-mat/0207194",
          english: true,
        },
        {
          text: "J. Ding, A. Sly and N. Sun, “Proof of the satisfiability conjecture for large k”, *Annals of Mathematics*, vol. 196, pp. 1–388, 2022",
          href: "https://doi.org/10.4007/annals.2022.196.1.1",
          english: true,
        },
        {
          text: "M. Davis, G. Logemann and D. Loveland, “A machine program for theorem-proving”, *Communications of the ACM*, vol. 5, pp. 394–397, 1962",
          href: "https://doi.org/10.1145/368273.368557",
          english: true,
        },
        {
          text: "S. Cook, “The P versus NP Problem”, Clay Mathematics Institute",
          href: "https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf",
          english: true,
        },
      ],
    },
    refraction: {
      card: {
        title: "Refraction of light",
        text: "Change the angle of a light ray and the materials it crosses: watch it bend, then get trapped.",
      },
      metaTitle: "Refraction of light — The Lab",
      metaDescription:
        "Interactive refraction simulation: Snell’s law, critical angle and total internal reflection, updated live.",
      title: "Refraction of light",
      intro:
        "In a fish tank, a fish can seem to be in two places at once: light changes direction when it passes from water into air. Set up the ray and watch it bend.",
      controls: {
        title: "Controls",
        from: "Material the light comes from",
        to: "Material the light enters",
        angle: "Angle of incidence (°)",
        media: {
          air: "Air (n = 1.00)",
          water: "Water (n = 1.33)",
          glass: "Glass (n = 1.52)",
          diamond: "Diamond (n = 2.42)",
        },
      },
      results: {
        title: "Results",
        reflection: "Angle of reflection",
        refraction: "Angle of refraction",
        critical: "Critical angle",
        total: "none: total internal reflection",
        noCritical: "none: the light enters a material with an equal or higher index",
      },
      legend: {
        incident: "Incident ray",
        reflected: "Reflected ray",
        refracted: "Refracted ray",
        normal: "Normal",
      },
      summary: {
        refracted: "Incident ray at {i₁}; refracted ray at {i₂}.",
        total: "Incident ray at {i₁}; total internal reflection: no refracted ray.",
      },
      laws: {
        title: "The laws",
        intro:
          "Angles are measured from the normal, the line perpendicular to the surface where the ray meets it.",
        items: [
          "Index of refraction of a material: $*n* = *c* / *v*$, where $*c*$ is the speed of light in a vacuum and $*v*$ its speed in the material.",
          "Law of reflection: $*r* = *i*_{1}$",
          "Law of refraction (Snell’s law): $*n*_{1} sin *i*_{1} = *n*_{2} sin *i*_{2}$",
          "With the current settings: $sin *i*_{2} = *n*_{1} sin *i*_{1} / *n*_{2} = {s}$",
          "If this number is greater than 1, no angle $*i*_{2}$ fits: there is no refracted ray and all the light is reflected. This is total internal reflection.",
          "Critical angle, when light passes into a material with a lower index ($*n*_{1} > *n*_{2}$): $sin *i*_{lim} = *n*_{2} / *n*_{1}$. Beyond this angle, the reflection is total.",
        ],
      },
      assumptions: {
        title: "Assumptions",
        text: "The light is a single colour (yellow, 589 nm): a material’s index varies slightly with colour. The materials are transparent and uniform, and the surface between them is flat. The figure doesn’t show how bright each ray is: in reality, some light is always reflected, even when it crosses the surface.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          closer: {
            question:
              "From air into water, increase the angle of incidence from 0° to 89°. Does the refracted ray move towards the normal or away from it?",
            answer:
              "towards it, because water has a higher index than air. Even at 89°, the angle of refraction stays below 48.8°: $sin *i*_{2}$ can’t exceed 1.00 / 1.33.",
          },
          trapped: {
            question: "Swap them: from water into air. At what angle does the refracted ray disappear?",
            answer:
              "between 48° and 49°. The critical angle is 48.8°, since $sin *i*_{lim} = 1.00 / 1.33$. Beyond it, the light stays trapped in the water: this is total internal reflection.",
          },
          diamond: {
            question: "Compare the critical angle from diamond into air with the one from water into air.",
            answer:
              "24.4° for diamond, against 48.8° for water. The higher the index of the first material, the smaller the critical angle, and the more easily light stays trapped inside. Optical fibres use total internal reflection to guide light.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.3 “Refraction”",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.4 “Total Internal Reflection”",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 1.5 “Dispersion”",
          href: "https://openstax.org/books/university-physics-volume-3/pages/1-5-dispersion",
          english: true,
        },
      ],
    },
    "think-of-a-number": {
      card: {
        title: "Think of a number",
        text: "Pick a number between 1 and 1,000: the computer finds it in 10 questions or fewer.",
      },
      metaTitle: "Think of a number — The Lab",
      metaDescription:
        "Interactive game: pick a number, and the computer finds it in just a few questions using binary search.",
      title: "Think of a number",
      subtitle: "Binary search",
      intro:
        "Think of a number, and keep it to yourself. The computer will find it with very few questions. Its secret: each time, it cuts the list of numbers that are still possible in half.",
      controls: { range: "Pick a number between 1 and…" },
      instruction: "Pick a number between 1 and {N}, keep it in mind, then click “I’ve picked”.",
      buttons: {
        ready: "I’ve picked",
        higher: "Higher",
        lower: "Lower",
        found: "That’s it!",
        undo: "Undo last answer",
        replay: "Play again",
      },
      question: "Is your number {g}?",
      counter: "Question {k} of {Q} at most",
      possibilities: {
        many: "{r} numbers are still possible, from {a} to {b}.",
        one: "Only one number is still possible: {a}.",
      },
      history: {
        title: "Questions asked",
        higher: "{g}? Higher",
        lower: "{g}? Lower",
        found: "{g}? That’s it!",
      },
      end: {
        many: "Found it! Your number is {g}, found in {k} questions.",
        one: "Found it! Your number is {g}, found with the very first question.",
      },
      contradiction:
        "Your answers contradict each other: no number from 1 to {N} fits them all. Undo your last answer or play again.",
      bar: "Numbers still possible: from {a} to {b}, out of 1 to {N}.",
      how: {
        title: "How does the computer do it?",
        items: [
          "It always guesses the number in the middle of the numbers that are still possible. Your answer rules out half of them at once.",
          "With 1,000 numbers, at most 500 are left after the first question, then 250, 125, 62, 31, 15, 7, 3, 1. So it needs 10 questions at most.",
          "In general, $*N*$ numbers take at most $⌊log_{2} *N*⌋ + 1$ questions: the number of times $*N*$ can be halved, plus one. For a million numbers, 20 questions are enough, because $2^{20} = 1,048,576$.",
          "This method is called binary search. It works wherever data is kept in order: a word in a dictionary, a name in a sorted list, a value in a table.",
          "If the computer guessed the numbers one by one (1, 2, 3…), it could take up to 1,000 questions for 1,000 numbers.",
        ],
      },
      assumptions: {
        title: "Assumptions",
        text: "You answer honestly and don’t change your number during the game. The possible numbers are in order: that is what lets each answer rule out half of them.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          thousand: {
            question: "Play with 1,000 numbers and pick 1,000. How many questions does it take?",
            answer: "10, the maximum: 500, 750, 875, 938, 969, 985, 993, 997, 999, then 1,000.",
          },
          million: {
            question: "Switch to a million numbers. How many questions at most?",
            answer:
              "20, only twice as many as for 1,000 numbers, even though there are a thousand times more numbers. Each extra question roughly doubles how many numbers can be told apart.",
          },
          lie: {
            question:
              "Lie on purpose: with 100 numbers, answer “Higher” to 50, then “Lower” to 75, then “Higher” to every question after that. What happens?",
            answer:
              "after 62, 68, 71, 73 and 74, no number is left: none can match all your answers, and the computer notices.",
          },
        },
      },
      sources: [
        {
          text: "Wikipedia, “Binary search”",
          href: "https://en.wikipedia.org/wiki/Binary_search",
          english: true,
        },
      ],
    },
    "converging-lens": {
      card: {
        title: "The converging lens",
        text: "Move an object in front of a lens: watch its image grow, flip over, then switch sides.",
      },
      metaTitle: "The converging lens — The Lab",
      metaDescription: "Interactive converging lens simulation: ray diagram, image position and size, updated live.",
      title: "The converging lens",
      intro:
        "A magnifying glass, and even your own eye: both use a converging lens. Move the object and see where its image forms, and how it changes.",
      controls: {
        title: "Controls",
        focal: "Focal length (cm)",
        distance: "Distance from the object to the lens (cm)",
      },
      fixed: "Object height: 2 cm",
      // Notation d'OpenStax : les champs {do}, {di} et {hi} s'écrivent d_o, d_i et h_i dans le cahier.
      results: {
        title: "Results",
        position: "Image distance ($*d*_{i}$)",
        magnification: "Magnification ($*m*$)",
        height: "Image height ($*h*_{i}$)",
        nature: "Type of image",
        none: "none",
        noMagnification: "none",
      },
      natures: {
        smaller: "Real, inverted, smaller than the object.",
        same: "Real, inverted, the same size as the object.",
        larger: "Real, inverted, larger than the object.",
        virtual: "Virtual, upright, larger than the object: this is how a magnifying glass works.",
        none: "No image: the rays leave the lens parallel, so the image is at infinity.",
      },
      outside: "The image forms outside the frame of the figure.",
      legend: {
        object: "Object",
        image: "Image",
        rays: "Rays",
        extensions: "Ray extensions",
        foci: "Focal points F and F′",
      },
      summary: {
        image: "Object {d} from the lens; {type} image, at $*d*_{i}$ = {di}, height {hi}.",
        none: "Object at the focal point F: no image.",
      },
      laws: {
        title: "The laws",
        items: [
          "Thin-lens equation: $1/*d*_{o} + 1/*d*_{i} = 1/*f*$",
          "Magnification: $*m* = *h*_{i} / *h*_{o} = −*d*_{i} / *d*_{o}$",
          "With the current settings: $*d*_{o}$ = {do}; $*f*$ = {f}; $*d*_{i}$ = {di}; $*m*$ = {m}",
          "A positive $*d*_{i}$ means a real image on the other side of the lens, which can be caught on a screen. A negative $*d*_{i}$ means a virtual image, on the same side as the object, seen only by looking through the lens.",
          "A negative magnification means an inverted image, with a negative height $*h*_{i}$; a magnification larger than 1 in absolute value means an image larger than the object.",
        ],
      },
      assumptions: {
        title: "Assumptions",
        text: "The lens is thin: its thickness is neglected. The rays are drawn using the three ray-tracing rules for a converging lens. The object stands perpendicular to the optical axis, with its base A on the axis.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          twice: {
            question: "With f = 5 cm, put the object 10 cm from the lens. What do you notice?",
            answer:
              "the image is inverted, the same size as the object, 10 cm away on the other side. With the object at twice the focal length, m = −1.",
          },
          focus: {
            question: "Move the object to 5 cm, then to 5.5 cm. What happens to the image?",
            answer:
              "at 5 cm the object is at the focal point: the rays leave parallel and there is no image. At 5.5 cm the image is very far away (55 cm) and very large (m = −10).",
          },
          magnifier: {
            question: "Put the object at 2.5 cm, closer than the focal point. Where is the image?",
            answer:
              "on the same side as the object, upright and twice as large (m = 2). It is virtual: you see it through the lens. This is how a magnifying glass works.",
          },
        },
      },
      sources: [
        {
          text: "OpenStax, *University Physics Volume 3*, section 2.4 “Thin Lenses”",
          href: "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses",
          english: true,
        },
        {
          text: "OpenStax, *University Physics Volume 3*, section 2.7 “The Simple Magnifier”",
          href: "https://openstax.org/books/university-physics-volume-3/pages/2-7-the-simple-magnifier",
          english: true,
        },
      ],
    },
    "estimating-pi": {
      card: {
        title: "Estimating π by chance",
        text: "Throw random points into a square, and π slowly appears.",
      },
      metaTitle: "Estimating π by chance — The Lab",
      metaDescription:
        "Interactive experiment: estimate π by throwing random points into a square, using the Monte Carlo method.",
      title: "Estimating π by chance",
      subtitle: "The Monte Carlo method",
      intro:
        "Throw random points into a square and count the ones that land in the quarter disc. That simple count gives an approximate value of π, which gets closer as the points pile up.",
      buttons: {
        add100: "Add 100 points",
        add1000: "Add 1,000 points",
        add10000: "Add 10,000 points",
        restart: "Start over",
      },
      seed: {
        label: "Random seed",
        help: "Same seed, same points: you can rerun exactly the same experiment.",
        error: "Enter a whole number from 1 to 999,999.",
      },
      results: {
        title: "Results",
        total: "Points thrown",
        inside: "Points in the quarter disc",
        estimate: "Estimate of π (4 × points in the quarter disc ÷ points thrown)",
        difference: "Difference from π (π = 3.14159…)",
      },
      empty: "Add some points to get started.",
      maximum: "Maximum reached: 100,000 points. Start over for a new run.",
      note: "The figure shows the first 2,000 points; the calculations use all of them.",
      legend: {
        inside: "Point in the quarter disc",
        outside: "Point outside",
      },
      summary: "{N} points thrown, {n} of them in the quarter disc: π ≈ {estimate}.",
      how: {
        title: "How does it work?",
        items: [
          "The square has sides of length 1, so its area is 1. The quarter disc has radius 1, so its area is π / 4.",
          "So a point thrown at random into the square has a probability of π / 4, about 0.785, of landing in the quarter disc.",
          "Over many points, the share of points in the quarter disc gets closer to π / 4. Multiplying it by 4 gives an approximate value of π.",
          "A point is in the quarter disc if $*x*^{2} + *y*^{2} ≤ 1$, where $*x*$ and $*y*$ are its coordinates.",
          "Using chance to calculate a value like this is called the Monte Carlo method. It is slow: with 100 times more points, the error is on average about 10 times smaller.",
        ],
      },
      assumptions: {
        title: "Assumptions",
        text: "The points are spread evenly across the square. The computer doesn’t use true randomness: it uses a pseudorandom generator, which always gives the same sequence for the same seed.",
      },
      tryThis: {
        title: "Try this",
        show: "Show the explanation",
        items: {
          growth: {
            question: "With seed 2026, add 100 points, then go up to 100,000. How does the estimate change?",
            answer:
              "3.2000 with 100 points, 3.1760 with 1,000, 3.1632 with 10,000, 3.1422 with 100,000. It gets closer to π, but not necessarily at every step: that’s chance.",
          },
          seed: {
            question: "Change the seed and do 100 points again. Why does the estimate change?",
            answer:
              "different points are drawn. With seed 1, you get 3.0000 with 100 points. With few points, the estimate varies a lot from one seed to another; with many points, much less.",
          },
          decimal: {
            question: "How many points would you need to gain one more correct decimal place?",
            answer:
              "about 100 times more, because the error only shrinks by a factor of 10 on average when you multiply the number of points by 100. That is why π isn’t calculated this way in practice.",
          },
        },
      },
      sources: [
        {
          text: "Wikipedia, “Monte Carlo method”",
          href: "https://en.wikipedia.org/wiki/Monte_Carlo_method",
          english: true,
        },
      ],
    },
  },
};

export default en;
