import { describe, expect, it } from "vitest";
import {
  advance,
  ballDiameter,
  ballPositions,
  contactTolerance,
  mechanicalEnergy,
  releaseState,
  rungeKuttaStep,
  timeStep,
  touching,
  type Cradle,
} from "./motion";
import {
  firstImpact,
  gravity,
  lowestPointSpeed,
  stringLength,
  totalMomentum,
} from "./physics";

const radians = (degrees: number) => (degrees * Math.PI) / 180;
const smallAnglePeriod = 2 * Math.PI * Math.sqrt(stringLength / gravity);

/** Période d'une bille seule : deux passages successifs par θ = 0 dans le même sens. */
function period(angle: number) {
  let state = { angle: radians(angle), velocity: 0 };
  let elapsed = 0;
  const crossings: number[] = [];
  while (crossings.length < 2) {
    const next = rungeKuttaStep(state, timeStep);
    if (state.angle < 0 && next.angle >= 0) {
      crossings.push(elapsed + (timeStep * -state.angle) / (next.angle - state.angle));
    }
    state = next;
    elapsed += timeStep;
  }
  return crossings[1] - crossings[0];
}

function energy({ angles, velocities }: Cradle) {
  return angles.reduce(
    (sum, angle, ball) => sum + mechanicalEnergy({ angle, velocity: velocities[ball] }),
    0,
  );
}

function speeds(cradle: Cradle) {
  return cradle.velocities.map((velocity) => velocity * stringLength);
}

describe("mouvement d'une bille seule", () => {
  it("conserve l'énergie mécanique à 10⁻⁶ près sur 10 périodes", () => {
    for (const angle of [10, 30, 45]) {
      let state = { angle: radians(angle), velocity: 0 };
      const initial = mechanicalEnergy(state);
      const steps = Math.ceil((10 * period(angle)) / timeStep);
      for (let step = 0; step < steps; step++) {
        state = rungeKuttaStep(state, timeStep);
        expect(Math.abs(mechanicalEnergy(state) / initial - 1)).toBeLessThan(1e-6);
      }
    }
  });

  it("donne une période proche de 2π √(L/g) pour θ₀ = 10°", () => {
    expect(smallAnglePeriod).toBeCloseTo(0.898, 3);
    expect(Math.abs(period(10) / smallAnglePeriod - 1)).toBeLessThan(0.01);
  });

  it("donne une période plus longue pour θ₀ = 45°", () => {
    expect(period(45)).toBeGreaterThan(period(10) * 1.03);
  });

  it("arrive au point bas à la vitesse donnée par l'énergie", () => {
    let state = { angle: radians(-30), velocity: 0 };
    while (state.angle < 0) state = rungeKuttaStep(state, timeStep);
    expect(state.velocity * stringLength).toBeCloseTo(lowestPointSpeed(30), 3);
  });
});

describe("releaseState : position de départ", () => {
  it("écarte vers la gauche les billes demandées, toutes au même angle", () => {
    const { angles, velocities } = releaseState(2, 30);
    expect(angles).toEqual([radians(-30), radians(-30), 0, 0, 0]);
    expect(velocities).toEqual([0, 0, 0, 0, 0]);
  });
});

describe("ballPositions : un diamètre entre deux billes voisines au repos", () => {
  it("place les billes au repos en contact, centrées sur la barre", () => {
    const xs = ballPositions(releaseState(1, 10).angles.map(() => 0)).map(({ x }) => x);
    expect(xs).toEqual([
      -2 * ballDiameter,
      -ballDiameter,
      0,
      ballDiameter,
      2 * ballDiameter,
    ]);
  });

  it("soulève une bille écartée sur son cercle", () => {
    const [ball] = ballPositions(releaseState(1, 90).angles);
    expect(ball.x).toBeCloseTo(-2 * ballDiameter - stringLength, 12);
    expect(ball.y).toBeCloseTo(0, 12);
  });

  it("met le point bas à une longueur de fil sous l'attache", () => {
    expect(ballPositions([0, 0, 0, 0, 0])[2].y).toBeCloseTo(-stringLength, 12);
  });
});

describe("détection des chocs", () => {
  it("voit deux billes au repos en contact", () => {
    expect(touching([0, 0, 0, 0, 0], 2)).toBe(true);
  });

  it("voit en contact deux billes écartées du même angle", () => {
    expect(touching(releaseState(2, 45).angles, 0)).toBe(true);
  });

  it("sépare une bille écartée de sa voisine", () => {
    expect(touching(releaseState(1, 10).angles, 0)).toBe(false);
  });

  it("accepte un écart inférieur à la tolérance, et le refuse au-delà", () => {
    const within = Math.asin((0.5 * contactTolerance) / stringLength);
    const beyond = Math.asin((2 * contactTolerance) / stringLength);
    expect(touching([0, within, 0, 0, 0], 0)).toBe(true);
    expect(touching([0, beyond, 0, 0, 0], 0)).toBe(false);
  });

  it("n'applique pas de choc à deux billes en contact qui s'éloignent", () => {
    const apart: Cradle = {
      angles: [0, 0, 0, 0, 0],
      velocities: [-1, 1, 1, 1, 1],
      pending: 0,
    };
    const { velocities } = advance(apart, timeStep, 1);
    expect(velocities[0]).toBeLessThan(0);
    expect(velocities[1]).toBeGreaterThan(0.99);
  });
});

/** Avance jusqu'au premier instant où la dernière bille part. */
function untilImpact(start: Cradle, e: number) {
  let cradle = start;
  while (cradle.velocities[4] === 0) cradle = advance(cradle, timeStep, e);
  return cradle;
}

describe("simulation complète", () => {
  it.each([
    [1, 30, 1],
    [2, 30, 1],
    [3, 45, 1],
    [4, 10, 1],
    [1, 30, 0.8],
    [2, 45, 0.8],
  ])("%d bille(s) à %d°, e = %d : le premier choc suit les mesures", (pulled, angle, e) => {
    const after = speeds(untilImpact(releaseState(pulled, angle), e));
    const expected = firstImpact(pulled, angle, e).velocities;
    after.forEach((speed, ball) => {
      expect(Math.abs(speed - expected[ball])).toBeLessThan(2e-3);
    });
  });

  it("conserve l'énergie mécanique pour e = 1, chocs compris", () => {
    const start = releaseState(2, 40);
    const after = advance(start, 20, 1);
    expect(Math.abs(energy(after) / energy(start) - 1)).toBeLessThan(1e-6);
  });

  it("garde pour e = 1 les billes du milieu presque immobiles pendant une minute", () => {
    let cradle = advance(releaseState(1, 30), 59, 1);
    const positions: number[] = [];
    for (let frame = 0; frame < 100; frame++) {
      cradle = advance(cradle, 0.01, 1);
      positions.push(ballPositions(cradle.angles)[2].x);
    }
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(0.1 * ballDiameter);
  });

  it("perd de l'énergie à chaque rebond pour e = 0,8, sans jamais en créer", () => {
    let cradle = releaseState(1, 45);
    let previous = energy(cradle);
    for (let second = 0; second < 8; second++) {
      cradle = advance(cradle, 1, 0.8);
      const current = energy(cradle);
      expect(current).toBeLessThanOrEqual(previous * (1 + 1e-9));
      previous = current;
    }
    expect(previous).toBeLessThan(energy(releaseState(1, 45)));
  });

  it("garde les billes dans l'ordre, sans qu'une en traverse une autre", () => {
    for (const [pulled, e] of [
      [1, 1],
      [3, 1],
      [2, 0.8],
      [4, 0.5],
    ]) {
      let cradle = releaseState(pulled, 45);
      for (let frame = 0; frame < 600; frame++) {
        cradle = advance(cradle, 1 / 60, e);
        const xs = ballPositions(cradle.angles).map(({ x }) => x);
        xs.slice(1).forEach((x, index) => {
          expect(x - xs[index]).toBeGreaterThan(0.95 * ballDiameter);
        });
      }
    }
  });

  it("donne le même état quel que soit le découpage en images", () => {
    const start = releaseState(2, 30);
    const once = advance(start, 1, 0.8);
    let frames = start;
    for (let frame = 0; frame < 144; frame++) frames = advance(frames, 1 / 144, 0.8);
    once.angles.forEach((angle, ball) => {
      expect(frames.angles[ball]).toBeCloseTo(angle, 3);
    });
  });

  it("reste symétrique au retour : 20 s à e = 0,9, une bille lâchée à gauche ou à droite", () => {
    // Le pendule et son image dans un miroir (bille de droite écartée vers la droite).
    const left = releaseState(1, 30);
    const right: Cradle = { ...left, angles: left.angles.map((angle) => -angle).reverse() };
    let direct = left;
    let mirrored = right;
    let largest = 0;
    for (let frame = 0; frame < 20 * 60; frame++) {
      direct = advance(direct, 1 / 60, 0.9);
      mirrored = advance(mirrored, 1 / 60, 0.9);
      const reflected = mirrored.angles.map((angle) => -angle).reverse();
      reflected.forEach((angle, ball) => {
        largest = Math.max(largest, Math.abs(angle - direct.angles[ball]));
      });
    }
    // Tolérance : 10⁻⁹ rad, soit 0,2 nm au bout d'un fil de 20 cm, très en dessous de la
    // tolérance de contact (1 µm). Chaque opération a son image exacte dans le miroir (opposés,
    // additions commutatives, sinus impair) : l'écart mesuré sous Node.js 22 est nul. La marge
    // couvre un moteur JavaScript dont Math.sin ne serait pas impair au bit près. Avec l'ancien
    // ordre (toujours de gauche à droite), l'écart atteint 3·10⁻⁴ rad dès le premier retour.
    expect(largest).toBeLessThan(1e-9);
  });

  it("ne modifie pas l'état reçu", () => {
    const start = releaseState(1, 30);
    const copy = structuredClone(start);
    advance(start, 0.1, 1);
    expect(start).toEqual(copy);
  });

  it("conserve la quantité de mouvement pendant un choc", () => {
    let before = releaseState(2, 30);
    let after = advance(before, timeStep, 0.8);
    while (after.velocities[4] === 0) {
      before = after;
      after = advance(before, timeStep, 0.8);
    }
    const momentum = totalMomentum(after.velocities) / totalMomentum(before.velocities);
    expect(Math.abs(momentum - 1)).toBeLessThan(1e-3);
  });
});
