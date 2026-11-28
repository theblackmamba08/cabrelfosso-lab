import type { PublishedDemo } from "./registry";

/**
 * Petite figure décorative d'une carte d'expérience, dessinée dans le dépôt.
 * Elle n'apporte aucune information que la carte ne donne pas : cachée aux lecteurs d'écran.
 * Couleurs : jetons du thème seulement (accent, ligne, texte secondaire).
 */
export function DemoFigure({ id }: { id: PublishedDemo["id"] }) {
  const Figure = figures[id];
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
      <Figure />
    </svg>
  );
}

const figures: Record<PublishedDemo["id"], () => React.ReactNode> = {
  projectile: Projectile,
  "newtons-cradle": Cradle,
  "three-sat": ThreeSat,
  refraction: Refraction,
  "think-of-a-number": ThinkOfANumber,
  "converging-lens": ConvergingLens,
  "estimating-pi": EstimatingPi,
};

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

/** 3-SAT : une clause, trois pastilles reliées ; une seule est pleine, et elle suffit. */
function ThreeSat() {
  const spots = [
    { x: 60, y: 84 },
    { x: 120, y: 34 },
    { x: 180, y: 84 },
  ];
  return (
    <>
      {spots.map((from, i) => {
        const to = spots[(i + 1) % 3];
        return (
          <line
            key={from.x}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--line)"
            strokeWidth="2"
            strokeDasharray={i === 2 ? "3 5" : undefined}
          />
        );
      })}
      {spots.map(({ x, y }, i) => (
        <circle
          key={x}
          cx={x}
          cy={y}
          r="16"
          fill={i === 1 ? "var(--accent)" : "var(--accent-soft)"}
          stroke="var(--accent)"
          strokeWidth="2"
        />
      ))}
    </>
  );
}

/**
 * Réfraction de l'air vers l'eau : incidence de 48°, réfraction de 34° (sin 34° ≈ sin 48° / 1,33),
 * rayons de 64 et 56 issus du point (120, 60).
 */
function Refraction() {
  const end = (length: number, degrees: number) => ({
    x: (120 + length * Math.sin((degrees * Math.PI) / 180)).toFixed(2),
    y: (60 - length * Math.cos((degrees * Math.PI) / 180)).toFixed(2),
  });
  const [incident, reflected, refracted] = [end(64, -48), end(64, 48), end(56, 180 - 34)];
  return (
    <>
      <rect x="12" y="60" width="216" height="52" rx="4" fill="var(--accent-soft)" />
      <line x1="12" y1="60" x2="228" y2="60" stroke="var(--ink-muted)" strokeWidth="1.5" />
      <line x1="120" y1="10" x2="120" y2="110" stroke="var(--ink-muted)" strokeWidth="1.5" strokeDasharray="3 5" />
      <line x1="120" y1="60" x2={reflected.x} y2={reflected.y} stroke="var(--accent)" strokeWidth="1" />
      <line x1={incident.x} y1={incident.y} x2="120" y2="60" stroke="var(--accent)" strokeWidth="2.5" />
      <line x1="120" y1="60" x2={refracted.x} y2={refracted.y} stroke="var(--ink)" strokeWidth="2.5" />
    </>
  );
}

/** Nombre mystère : à chaque ligne, la moitié des possibilités disparaît. */
function ThinkOfANumber() {
  const rows = [
    { x: 12, width: 216 },
    { x: 120, width: 108 },
    { x: 120, width: 54 },
    { x: 147, width: 27 },
  ];
  return (
    <>
      {rows.map(({ x, width }, i) => (
        <g key={i}>
          <rect x="12" y={14 + 25 * i} width="216" height="16" rx="4" fill="var(--line)" opacity="0.5" />
          <rect
            x={x}
            y={14 + 25 * i}
            width={width}
            height="16"
            rx="4"
            fill={i === 3 ? "var(--accent)" : "var(--accent-soft)"}
            stroke="var(--accent)"
            strokeWidth="2"
          />
        </g>
      ))}
    </>
  );
}

/** Lentille convergente : objet au-delà de 2f′, image renversée plus petite, deux rayons. */
function ConvergingLens() {
  return (
    <>
      <line x1="12" y1="68" x2="228" y2="68" stroke="var(--ink-muted)" strokeWidth="1.5" />
      <line x1="128" y1="14" x2="128" y2="112" stroke="var(--ink)" strokeWidth="2" />
      <path d="M121 22L128 12L135 22M121 104L128 114L135 104" stroke="var(--ink)" strokeWidth="2" />
      <line x1="40" y1="68" x2="40" y2="32" stroke="var(--accent)" strokeWidth="3" />
      <path d="M33 40L40 30L47 40" stroke="var(--accent)" strokeWidth="3" />
      <line x1="40" y1="32" x2="128" y2="32" stroke="var(--line)" strokeWidth="2" />
      <line x1="128" y1="32" x2="200" y2="95" stroke="var(--line)" strokeWidth="2" />
      <line x1="40" y1="32" x2="200" y2="95" stroke="var(--line)" strokeWidth="2" strokeDasharray="3 5" />
      <line x1="184" y1="68" x2="184" y2="88.6" stroke="var(--accent)" strokeWidth="3" />
      <path d="M178.5 82L184 90L189.5 82" stroke="var(--accent)" strokeWidth="3" />
    </>
  );
}

/** π : un carré, un quart de disque, quelques points dedans (pleins) et dehors (croix). */
function EstimatingPi() {
  const inside = [
    [86, 40],
    [100, 82],
    [130, 64],
    [112, 96],
    [146, 90],
    [94, 58],
  ];
  const outside = [
    [158, 22],
    [168, 44],
  ];
  return (
    <>
      <rect x="74" y="12" width="96" height="96" stroke="var(--ink-muted)" strokeWidth="1.5" />
      <path d="M74 108L74 12A96 96 0 0 1 170 108Z" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" />
      {inside.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="var(--accent)" />
      ))}
      {outside.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 4} ${y - 4}L${x + 4} ${y + 4}M${x + 4} ${y - 4}L${x - 4} ${y + 4}`} stroke="var(--ink)" strokeWidth="2" />
      ))}
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
