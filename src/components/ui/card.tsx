/** Fond, bordure et coins d'une carte, sans rembourrage (pour un rembourrage sur mesure). */
export const panelSurfaceClassName = "rounded-card border border-line bg-surface";

/** Apparence d'une carte immobile : aussi utilisée telle quelle par les panneaux des démos. */
export const panelClassName = `${panelSurfaceClassName} p-6`;

type CardElement = "div" | "article" | "li" | "section" | "figure";

/**
 * Carte : fond surface, bordure fine, coins arrondis ; au survol, léger soulèvement et halo
 * d'accent (le halo vaut aussi quand un élément de la carte a le focus ; le focus, lui, garde
 * son contour propre). Les autres attributs (data-reveal-item, style) sont transmis.
 * `lift={false}` : carte immobile, pour un panneau qu'on manipule (réglages d'une démo, figure)
 * et qui ne doit pas bouger sous le pointeur.
 */
export function Card({
  as: Element = "div",
  lift = true,
  className,
  children,
  ...rest
}: {
  as?: CardElement;
  lift?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const base = lift
    ? "rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow,translate] hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow focus-within:border-accent/50 focus-within:shadow-glow"
    : panelClassName;
  return (
    <Element className={className ? `${base} ${className}` : base} {...rest}>
      {children}
    </Element>
  );
}
