import type { CSSProperties } from "react";

/** Rang d'arrivée d'un élément (décalage de 80 ms par rang, globals.css). */
const rise = (i: number) => ({ "--i": i }) as CSSProperties;

/** Taille du grand titre : page intérieure, ou accueil. */
const titleSizes = { page: "text-page-title", display: "text-display" } as const;

/**
 * En-tête de page : petite étiquette (nom de l'espace),
 * grand titre en Space Grotesk, sous-titre, introduction, puis un contenu facultatif (boutons…).
 * Animations d'arrivée : une fois, coupées avec prefers-reduced-motion.
 * Étiquette, sous-titre et introduction sont facultatifs : sans texte dans le cahier, ils n'existent pas.
 */
export function PageHero({
  eyebrow,
  title,
  size = "page",
  subtitle,
  intro,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  size?: keyof typeof titleSizes;
  subtitle?: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  let rank = 0;
  return (
    <header className="max-w-3xl pt-8 md:pt-12">
      {eyebrow && (
        <p style={rise(rank++)} className="hero-rise font-mono text-sm text-accent">
          {eyebrow}
        </p>
      )}
      <h1 style={rise(rank++)} className={`hero-rise ${titleSizes[size]} break-words ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </h1>
      {subtitle && (
        <p style={rise(rank++)} className="hero-rise mt-3 text-lg font-semibold">
          {subtitle}
        </p>
      )}
      {intro && (
        <p style={rise(rank++)} className="hero-rise mt-5 max-w-prose text-lg text-ink-muted">
          {intro}
        </p>
      )}
      {children && (
        <div style={rise(rank++)} className="hero-rise mt-6">
          {children}
        </div>
      )}
    </header>
  );
}
