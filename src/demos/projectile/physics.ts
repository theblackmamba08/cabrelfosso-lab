/**
 * Mouvement d'un projectile sans frottement (formules de l'annexe C.2).
 * Repère : origine au sol à la verticale du lancement, Ox horizontal, Oy vers le haut.
 */

/** Valeurs affichées et valeurs de calcul sont identiques : un élève peut refaire le calcul. */
export const gravities = { earth: 9.8, moon: 1.6, mars: 3.7 } as const;

export type Launch = {
  /** Vitesse initiale v₀, en m/s. */
  speed: number;
  /** Angle de tir α, en degrés. */
  angle: number;
  /** Hauteur de départ h₀, en mètres. */
  height: number;
  /** Pesanteur g, en m/s². */
  gravity: number;
};

export type Point = { x: number; y: number };

/** Composante horizontale de v₀ ; exactement nulle à 90°, où cos π/2 laisse un reste flottant. */
export function horizontalSpeed({ speed, angle }: Launch): number {
  return angle === 90 ? 0 : speed * Math.cos((angle * Math.PI) / 180);
}

/** Composante verticale de v₀. */
export function verticalSpeed({ speed, angle }: Launch): number {
  return speed * Math.sin((angle * Math.PI) / 180);
}

/** x(t) = v₀ cos α · t ; y(t) = −½ g t² + v₀ sin α · t + h₀ */
export function position(launch: Launch, t: number): Point {
  return {
    x: horizontalSpeed(launch) * t,
    y: -0.5 * launch.gravity * t * t + verticalSpeed(launch) * t + launch.height,
  };
}

/** t_v = [v₀ sin α + √(v₀² sin² α + 2 g h₀)] / g */
export function flightTime(launch: Launch): number {
  const vy = verticalSpeed(launch);
  return (vy + Math.sqrt(vy * vy + 2 * launch.gravity * launch.height)) / launch.gravity;
}

/** D = v₀ cos α · t_v */
export function launchRange(launch: Launch): number {
  return horizontalSpeed(launch) * flightTime(launch);
}

/** H = h₀ + v₀² sin² α / (2g) */
export function apexHeight(launch: Launch): number {
  const vy = verticalSpeed(launch);
  return launch.height + (vy * vy) / (2 * launch.gravity);
}

/** v = √(v₀² + 2 g h₀) */
export function impactSpeed({ speed, height, gravity }: Launch): number {
  return Math.sqrt(speed * speed + 2 * gravity * height);
}

/**
 * Points de la trajectoire, régulièrement espacés dans le temps.
 * Une courbe de 64 segments reste lisse à la plus grande taille de la figure.
 */
export function trajectoryPoints(launch: Launch, segments = 64): Point[] {
  const duration = flightTime(launch);
  if (duration === 0) return [{ x: 0, y: 0 }];
  const points = Array.from({ length: segments }, (_, i) =>
    position(launch, (duration * i) / segments),
  );
  // Le dernier point est posé sur le sol, sans reste flottant.
  return [...points, { x: launchRange(launch), y: 0 }];
}
