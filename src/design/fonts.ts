import localFont from "next/font/local";

/*
 * Polices hébergées avec le site (fichiers WOFF2 variables, sous-ensemble latin,
 * licence SIL OFL 1.1, voir src/fonts/). Aucun appel à un service externe.
 */

export const inter = localFont({
  // Romain seulement : aucun texte du site n'est en italique (phase 5 : 52 Kio de moins
  // préchargés sur chaque page).
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

/*
 * Titres : Space Grotesk (fichier du paquet @fontsource-variable/space-grotesk 5.3.0,
 * projet github.com/floriankarsten/space-grotesk). Préchargée : elle sert sur toutes les pages.
 */
export const spaceGrotesk = localFont({
  src: [
    {
      path: "../fonts/space-grotesk-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: [
    {
      path: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // Utilisée seulement pour les formules : pas de préchargement.
  preload: false,
  // Le repli généré (Arial) contient α : il masquerait la police grecque qui suit dans la pile.
  adjustFontFallback: false,
});

/*
 * Lettres grecques des formules (α) : un fichier à part, placé après le latin dans la pile
 * de --font-mono. Le navigateur ne le télécharge que si une page en a besoin.
 */
export const jetbrainsMonoGreek = localFont({
  src: [
    {
      path: "../fonts/jetbrains-mono-greek-wght-normal.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono-greek",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const fontVariables = [
  inter.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  jetbrainsMonoGreek.variable,
].join(" ");
