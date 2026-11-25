/** Indices de réfraction, exactement ceux affichés (annexe E.2). */
export const indices = { air: 1, water: 1.33, glass: 1.52, diamond: 2.42 } as const;

export type Medium = keyof typeof indices;

/** Milieux 1 et 2, et angle d'incidence en degrés. */
export type Setup = { from: Medium; to: Medium; angle: number };

const radians = (degrees: number) => (degrees * Math.PI) / 180;
const degrees = (radians: number) => (radians * 180) / Math.PI;

/** s = n₁ sin i₁ / n₂ ; au-delà de 1, aucun angle i₂ ne convient. */
export function sineOfRefraction({ from, to, angle }: Setup): number {
  return (indices[from] * Math.sin(radians(angle))) / indices[to];
}

/** Angle de réfraction en degrés, ou `null` en cas de réflexion totale. */
export function refract(setup: Setup): number | null {
  const sine = sineOfRefraction(setup);
  return sine > 1 ? null : degrees(Math.asin(sine));
}

/** Angle de réflexion : r = i₁. */
export function reflectionAngle({ angle }: Setup): number {
  return angle;
}

/** Angle limite en degrés, ou `null` si n₁ ≤ n₂. */
export function criticalAngle({ from, to }: Pick<Setup, "from" | "to">): number | null {
  return indices[from] > indices[to] ? degrees(Math.asin(indices[to] / indices[from])) : null;
}
