import { describe, expect, it } from "vitest";
import {
  ballMass,
  collide,
  firstImpact,
  gravity,
  lowestPointSpeed,
  maxSweeps,
  settleCollisions,
  stringLength,
  totalKineticEnergy,
  totalMomentum,
} from "./physics";

describe("montage de la section 4.1 du cahier", () => {
  it("utilise les valeurs affichées", () => {
    expect([ballMass, stringLength, gravity]).toEqual([0.05, 0.2, 9.8]);
  });
});

describe("vitesse au point bas : valeurs de contrôle de l'annexe C.3", () => {
  it.each([
    [10, 0.244, 0.0122, 0.001489],
    [30, 0.7247, 0.03623, 0.01313],
    [45, 1.0715, 0.05358, 0.028704],
  ])("θ₀ = %d°", (angle, speed, momentum, energy) => {
    const v = lowestPointSpeed(angle);
    expect(Math.abs(v - speed)).toBeLessThan(1e-4);
    expect(Math.abs(totalMomentum([v]) - momentum)).toBeLessThan(1e-4);
    expect(Math.abs(totalKineticEnergy([v]) - energy)).toBeLessThan(1e-4);
  });

  it("garde les valeurs à leur dernière décimale publiée", () => {
    expect(totalMomentum([lowestPointSpeed(30)])).toBeCloseTo(0.03623, 5);
    expect(totalKineticEnergy([lowestPointSpeed(45)])).toBeCloseTo(0.028704, 6);
  });
});

describe("choc de deux billes identiques", () => {
  it("donne les valeurs du choc isolé pour e = 0,8", () => {
    const [after1, after2] = collide(1, 0, 0.8);
    expect(after1).toBeCloseTo(0.1, 12);
    expect(after2).toBeCloseTo(0.9, 12);
    expect(totalKineticEnergy([after1, after2]) / totalKineticEnergy([1, 0])).toBeCloseTo(0.82, 12);
  });

  it("échange les vitesses pour e = 1", () => {
    expect(collide(0.7, -0.2, 1)).toEqual([-0.2, 0.7]);
  });

  it.each([0.5, 0.65, 0.8, 0.95, 1])("conserve la quantité de mouvement pour e = %d", (e) => {
    const [after1, after2] = collide(0.73, -0.31, e);
    expect(after1 + after2).toBeCloseTo(0.73 - 0.31, 14);
  });

  it("respecte la définition du coefficient de restitution", () => {
    const [after1, after2] = collide(0.73, -0.31, 0.65);
    expect((after2 - after1) / (0.73 + 0.31)).toBeCloseTo(0.65, 12);
  });
});

describe("chocs au point bas : second tableau de l'annexe C.3", () => {
  it.each([
    [1, 1, [0, 0, 0, 0, 1], 1],
    [2, 1, [0, 0, 0, 1, 1], 1],
    [1, 0.9, [0.0435, 0.0454, 0.0473, 0.0493, 0.8145], 0.672],
    [1, 0.8, [0.0775, 0.0829, 0.0887, 0.0948, 0.6561], 0.46],
    [2, 0.8, [0.1604, 0.1723, 0.1849, 0.7314, 0.7509], 0.594],
  ])("%d bille(s) écartée(s), e = %d", (pulled, e, expected, energyRatio) => {
    const before = [0, 1, 2, 3, 4].map((ball) => (ball < pulled ? 1 : 0));
    const { velocities } = settleCollisions(before, e);
    velocities.forEach((speed, ball) => {
      expect(Math.abs(speed - expected[ball])).toBeLessThan(1e-4);
    });
    expect(totalMomentum(velocities) / totalMomentum(before)).toBeCloseTo(1, 10);
    expect(
      Math.abs(totalKineticEnergy(velocities) / totalKineticEnergy(before) - energyRatio),
    ).toBeLessThan(1e-3);
  });

  it("fait repartir autant de billes qu'on en a écartées, pour e = 1", () => {
    expect(settleCollisions([1, 1, 1, 0, 0], 1).velocities).toEqual([0, 0, 1, 1, 1]);
    expect(settleCollisions([1, 1, 1, 1, 0], 1).velocities).toEqual([0, 1, 1, 1, 1]);
  });
});

describe("terminaison des balayages", () => {
  it.each([
    [[1, 0, 0, 0, 0]],
    [[1, 1, 1, 1, 0]],
    [[1, -1, 0.5, -0.5, 0.2]],
    [[3, 2, 1, 0, -1]],
  ])("se termine pour e = 0,5, à partir de %j", (before) => {
    const { velocities, sweeps } = settleCollisions(before, 0.5);
    expect(sweeps).toBeLessThan(maxSweeps);
    velocities.slice(1).forEach((speed, index) => {
      expect(velocities[index]).toBeLessThanOrEqual(speed + 1e-9);
    });
  });

  it("n'essaie jamais plus de balayages que la borne", () => {
    expect(settleCollisions([1, 0, 0, 0, 0], 0.999).sweeps).toBeLessThanOrEqual(maxSweeps);
  });

  it("ignore les billes qui ne se touchent pas", () => {
    const untouched = settleCollisions([1, 0, 0], 1, (left) => left === 1);
    expect(untouched.velocities).toEqual([1, 0, 0]);
  });

  it("ne change rien quand les billes s'éloignent", () => {
    expect(settleCollisions([-1, 0, 1], 0.8).velocities).toEqual([-1, 0, 1]);
  });
});

describe("ordre des chocs : dans le sens du mouvement (cahier, section 4.1)", () => {
  /** Image dans un miroir : billes dans l'ordre inverse, vitesses opposées. */
  const mirror = (velocities: readonly number[]) => velocities.map((v) => -v).reverse();

  const situations: number[][] = [
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0.5, 0, 0, 0],
    [0.7, 0, 0, -0.2, -0.1],
    [1, -1, 0.5, -0.5, 0.2],
  ];

  it.each([0.8, 0.9])("donne des résultats symétriques pour une situation et son miroir, e = %d", (e) => {
    for (const before of situations) {
      const direct = settleCollisions(before, e).velocities;
      const reflected = settleCollisions(mirror(before), e).velocities;
      mirror(reflected).forEach((speed, ball) => {
        expect(speed, `${JSON.stringify(before)}, bille ${ball}`).toBeCloseTo(direct[ball], 12);
      });
    }
  });

  it("balaye de droite à gauche quand la quantité de mouvement totale est négative", () => {
    // Une bille arrive de la droite : les chocs doivent remonter vers la gauche en un balayage.
    const { velocities, sweeps } = settleCollisions([0, 0, 0, 0, -1], 1);
    expect(velocities).toEqual([-1, 0, 0, 0, 0]);
    expect(sweeps).toBe(2);
  });

  it("garde les valeurs de contrôle de l'annexe C.3 (billes écartées à gauche)", () => {
    const { velocities } = settleCollisions([1, 0, 0, 0, 0], 0.8);
    expect(velocities.map((v) => Number(v.toFixed(4)))).toEqual([0.0775, 0.0829, 0.0887, 0.0948, 0.6561]);
  });

  it("garde la signature : billes en contact facultatives, nombre de balayages renvoyé", () => {
    const untouched = settleCollisions([0, 0, -1], 1, (left) => left === 0);
    expect(untouched.velocities).toEqual([0, 0, -1]);
    expect(untouched.sweeps).toBe(1);
  });
});

describe("firstImpact : mesures du premier passage au point bas", () => {
  it("donne les grandeurs avant et après pour une bille à e = 0,8", () => {
    const impact = firstImpact(1, 30, 0.8);
    expect(impact.speed).toBeCloseTo(lowestPointSpeed(30), 12);
    expect(impact.before.momentum).toBeCloseTo(impact.after.momentum, 12);
    expect(impact.after.energy / impact.before.energy).toBeCloseTo(0.46, 2);
    expect(impact.velocities[4] / impact.speed).toBeCloseTo(0.6561, 4);
  });

  it("compte toutes les billes lâchées avant le choc", () => {
    const impact = firstImpact(3, 45, 1);
    const speed = lowestPointSpeed(45);
    expect(impact.before.momentum).toBeCloseTo(3 * ballMass * speed, 12);
    expect(impact.before.energy).toBeCloseTo(1.5 * ballMass * speed * speed, 12);
    expect(impact.after.energy).toBeCloseTo(impact.before.energy, 12);
  });
});
