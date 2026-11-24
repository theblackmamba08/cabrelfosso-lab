import {
  ballCount,
  ballMass,
  gravity,
  settleCollisions,
  stringLength,
} from "./physics";

/** Diamètre d'affichage : 2 cm, un dixième de la longueur des fils, comme sur un vrai pendule. */
export const ballDiameter = 0.02;

/**
 * Tolérance de contact : 1 µm. Elle absorbe les arrondis de calcul entre deux billes au repos,
 * et reste très en dessous de ce qu'une bille parcourt pendant un pas (0,13 mm au plus).
 */
export const contactTolerance = 1e-6;

/**
 * Pas de temps : 1/8000 s. Le mouvement seul n'en demande pas tant (ω Δt ≈ 10⁻³) ; c'est le choc
 * qui le fixe : détecté à la fin d'un pas, il laisse une bille à l'arrêt un peu avant le point
 * bas, et ce décalage fait trembler les billes du milieu au fil des allers-retours.
 */
export const timeStep = 1 / 8000;

/** Angle en radians, compté depuis la verticale ; vitesse angulaire en rad/s. */
export type BallState = { angle: number; velocity: number };

export type Cradle = {
  angles: readonly number[];
  velocities: readonly number[];
  /** Temps déjà demandé, trop court pour un pas : il s'ajoute à la demande suivante. */
  pending: number;
};

const angularAcceleration = (angle: number) => -(gravity / stringLength) * Math.sin(angle);

/** θ″ = −(g/L) sin θ, par la méthode de Runge-Kutta d'ordre 4, sans approximation des petits angles. */
export function rungeKuttaStep({ angle, velocity }: BallState, step: number): BallState {
  const a1 = angularAcceleration(angle);
  const v2 = velocity + (step / 2) * a1;
  const a2 = angularAcceleration(angle + (step / 2) * velocity);
  const v3 = velocity + (step / 2) * a2;
  const a3 = angularAcceleration(angle + (step / 2) * v2);
  const v4 = velocity + step * a3;
  const a4 = angularAcceleration(angle + step * v3);
  return {
    angle: angle + (step / 6) * (velocity + 2 * v2 + 2 * v3 + v4),
    velocity: velocity + (step / 6) * (a1 + 2 * a2 + 2 * a3 + a4),
  };
}

export function mechanicalEnergy({ angle, velocity }: BallState): number {
  const speed = velocity * stringLength;
  return (ballMass * speed * speed) / 2 + ballMass * gravity * stringLength * (1 - Math.cos(angle));
}

/** Billes écartées à gauche, immobiles, à l'angle de départ (en degrés). */
export function releaseState(pulled: number, angle: number): Cradle {
  const pulledAngle = (-angle * Math.PI) / 180;
  return {
    angles: Array.from({ length: ballCount }, (_, ball) => (ball < pulled ? pulledAngle : 0)),
    velocities: Array.from({ length: ballCount }, () => 0),
    pending: 0,
  };
}

/** Attache d'une bille, comptée depuis le milieu de la barre. */
const anchorOf = (ball: number) => (ball - (ballCount - 1) / 2) * ballDiameter;

const horizontal = (angle: number, ball: number) =>
  anchorOf(ball) + stringLength * Math.sin(angle);

/** Attaches et centres des billes en mètres : origine au milieu de la barre, y vers le haut. */
export function ballPositions(angles: readonly number[]) {
  return angles.map((angle, ball) => ({
    anchor: anchorOf(ball),
    x: horizontal(angle, ball),
    y: -stringLength * Math.cos(angle),
  }));
}

/** Deux voisines se touchent quand leurs positions horizontales sont à un diamètre l'une de l'autre. */
export function touching(angles: readonly number[], left: number): boolean {
  const gap = horizontal(angles[left + 1], left + 1) - horizontal(angles[left], left);
  return gap - ballDiameter <= contactTolerance;
}

/**
 * Fait avancer le pendule de `seconds`, par pas fixes : le résultat ne dépend pas du nombre
 * d'images par seconde. Deux billes en contact sont au même angle : leurs vitesses sont portées
 * par la même tangente, et les formules du choc s'appliquent aux vitesses angulaires.
 */
export function advance(cradle: Cradle, seconds: number, e: number): Cradle {
  const total = cradle.pending + seconds;
  const steps = Math.floor(total / timeStep);
  const angles = [...cradle.angles];
  let velocities = [...cradle.velocities];

  for (let step = 0; step < steps; step++) {
    for (let ball = 0; ball < ballCount; ball++) {
      const next = rungeKuttaStep({ angle: angles[ball], velocity: velocities[ball] }, timeStep);
      angles[ball] = next.angle;
      velocities[ball] = next.velocity;
    }
    velocities = settleCollisions(velocities, e, (left) => touching(angles, left)).velocities;
  }

  return { angles, velocities, pending: total - steps * timeStep };
}
