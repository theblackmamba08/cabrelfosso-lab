import type { PublishedDemo } from "./registry";

/**
 * Petite figure décorative d'une carte d'expérience, dessinée dans le dépôt.
 * Elle n'apporte aucune information que la carte ne donne pas : cachée aux lecteurs d'écran.
 * Couleurs : jetons du thème seulement (accent, ligne, texte secondaire).
 */
export function DemoFigure({ id }: { id: PublishedDemo["id"] }) {
  return (
    <svg
      viewBox="0 0 240 120"
      aria-hidden="true"
      focusable="false"
      data-demo-figure={id}
      className="h-auto w-full"
      fill="none"
      strokeLinecap="round"
    >
      {id === "projectile" ? <Projectile /> : <Cradle />}
    </svg>
  );
}

/**
 * Trajectoire d'un projectile : la courbe de Bézier quadratique de points (24, 104), (120, −16),
 * (216, 104) est une parabole, de sommet (120, 44). Les points sont pris sur la courbe
 * (t = 0,25 ; 0,5 ; 0,75) : x = 24 + 192 t, y = 104 − 240 t (1 − t).
 */
function Projectile() {
  return (
    <>
      <line x1="12" y1="104" x2="228" y2="104" stroke="var(--line)" strokeWidth="2" />
      <line x1="120" y1="44" x2="120" y2="104" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M24 104Q120 -16 216 104" stroke="var(--accent)" strokeWidth="2.5" />
      {/* Vitesse initiale, tangente à la trajectoire au départ (direction 96, −120). */}
      <line x1="24" y1="104" x2="45" y2="77.5" stroke="var(--ink-muted)" strokeWidth="2" />
      <path d="M45 77.5 L37.6 81.2 L43.3 85.8 Z" fill="var(--ink-muted)" />
      <circle cx="72" cy="59" r="3.5" fill="var(--accent)" opacity="0.35" />
      <circle cx="120" cy="44" r="3.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="168" cy="59" r="5.5" fill="var(--accent)" />
      <circle cx="216" cy="104" r="3" fill="var(--ink-muted)" />
    </>
  );
}

/** Pendule de Newton : cinq billes de rayon 10 sur des fils de 70, la première écartée de 35°. */
function Cradle() {
  // Bille écartée : attache (80, 14), fil de 70 à 35° de la verticale.
  const raised = { x: 80 - 70 * Math.sin((35 * Math.PI) / 180), y: 14 + 70 * Math.cos((35 * Math.PI) / 180) };
  const anchors = [80, 100, 120, 140, 160];
  return (
    <>
      <line x1="56" y1="14" x2="184" y2="14" stroke="var(--ink-muted)" strokeWidth="3" />
      {/* Chemin de la bille écartée jusqu'au point bas. */}
      <path
        d={`M${raised.x.toFixed(2)} ${raised.y.toFixed(2)}A70 70 0 0 0 80 84`}
        stroke="var(--line)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      {anchors.map((x, ball) => {
        const end = ball === 0 ? raised : { x, y: 84 };
        return (
          <g key={x}>
            <line x1={x} y1="14" x2={end.x.toFixed(2)} y2={end.y.toFixed(2)} stroke="var(--line)" strokeWidth="1.5" />
            <circle
              cx={end.x.toFixed(2)}
              cy={end.y.toFixed(2)}
              r="10"
              fill={ball === 0 ? "var(--accent)" : "var(--accent-soft)"}
              stroke="var(--accent)"
              strokeWidth="2"
            />
          </g>
        );
      })}
    </>
  );
}
