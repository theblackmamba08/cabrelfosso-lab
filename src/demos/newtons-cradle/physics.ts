/** Montage de la démo (section 4.1 du cahier) : valeurs choisies et affichées, unités SI. */
export const ballMass = 0.05;
export const stringLength = 0.2;
export const gravity = 9.8;
export const ballCount = 5;

/** Borne des balayages, très au-dessus de ce que demandent cinq billes (un test le vérifie). */
export const maxSweeps = 64;

/** Écart de vitesse sous lequel une bille n'en rattrape plus une autre (arrondis de calcul). */
const catchingUp = 1e-12;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Vitesse au point bas, par conservation de l'énergie mécanique : √(2 g L (1 − cos θ₀)). */
export function lowestPointSpeed(angle: number): number {
  return Math.sqrt(2 * gravity * stringLength * (1 - Math.cos(toRadians(angle))));
}

export function totalMomentum(velocities: readonly number[]): number {
  return velocities.reduce((sum, velocity) => sum + ballMass * velocity, 0);
}

export function totalKineticEnergy(velocities: readonly number[]): number {
  return velocities.reduce((sum, velocity) => sum + (ballMass * velocity * velocity) / 2, 0);
}

/** Choc de deux billes identiques ; e = 1 : choc parfaitement élastique. */
export function collide(v1: number, v2: number, e: number): [number, number] {
  return [((1 - e) * v1 + (1 + e) * v2) / 2, ((1 + e) * v1 + (1 - e) * v2) / 2];
}

/**
 * Somme des vitesses, calculée par paires symétriques (première et dernière bille, puis
 * deuxième et avant-dernière…) : l'image d'une situation dans un miroir donne exactement
 * l'opposé, arrondis compris. Une somme de gauche à droite pourrait, près de zéro, ne pas
 * changer de signe avec le miroir, et le balayage partirait du même côté dans les deux cas.
 */
function mirrorSafeSum(velocities: readonly number[]): number {
  let sum = 0;
  const last = velocities.length - 1;
  for (let ball = 0; ball < last - ball; ball++) sum += velocities[ball] + velocities[last - ball];
  return velocities.length % 2 === 1 ? sum + velocities[last / 2] : sum;
}

/**
 * Chocs par balayages successifs dans le sens du mouvement (cahier, section 4.1) : de gauche
 * à droite quand la quantité de mouvement totale est positive ou nulle, de droite à gauche
 * quand elle est négative, jusqu'à ce qu'aucune bille n'en rattrape une autre. Les valeurs de
 * contrôle de l'annexe C.3 (billes écartées à gauche) gardent l'ordre de gauche à droite.
 * `touching(i)` dit si les billes i et i + 1 sont en contact ; par défaut, toutes le sont.
 */
export function settleCollisions(
  before: readonly number[],
  e: number,
  touching: (left: number) => boolean = () => true,
): { velocities: number[]; sweeps: number } {
  const velocities = [...before];
  // Masses identiques : le signe de la quantité de mouvement est celui de la somme des vitesses.
  const pairs = Array.from({ length: Math.max(velocities.length - 1, 0) }, (_, left) => left);
  if (mirrorSafeSum(velocities) < 0) pairs.reverse();
  for (let sweeps = 1; sweeps <= maxSweeps; sweeps++) {
    let collided = false;
    for (const left of pairs) {
      if (touching(left) && velocities[left] > velocities[left + 1] + catchingUp) {
        [velocities[left], velocities[left + 1]] = collide(
          velocities[left],
          velocities[left + 1],
          e,
        );
        collided = true;
      }
    }
    if (!collided) return { velocities, sweeps };
  }
  return { velocities, sweeps: maxSweeps };
}

/** Mesures du premier passage au point bas, billes écartées à gauche. */
export function firstImpact(pulled: number, angle: number, e: number) {
  const speed = lowestPointSpeed(angle);
  const before = Array.from({ length: ballCount }, (_, ball) => (ball < pulled ? speed : 0));
  const { velocities } = settleCollisions(before, e);
  return {
    speed,
    velocities,
    before: { momentum: totalMomentum(before), energy: totalKineticEnergy(before) },
    after: { momentum: totalMomentum(velocities), energy: totalKineticEnergy(velocities) },
  };
}

export type Impact = ReturnType<typeof firstImpact>;
