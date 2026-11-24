import { describe, expect, it } from "vitest";
import {
  apexHeight,
  flightTime,
  gravities,
  impactSpeed,
  launchRange,
  position,
  trajectoryPoints,
  type Launch,
} from "./physics";

/** Tableau « Valeurs de contrôle » de l'annexe C.2. */
const controlValues: Array<[Launch, number, number, number, number]> = [
  [{ speed: 10, angle: 45, height: 0, gravity: 9.8 }, 1.4431, 10.2041, 2.551, 10],
  [{ speed: 10, angle: 0, height: 5, gravity: 9.8 }, 1.0102, 10.1015, 5, 14.0712],
  [{ speed: 10, angle: 30, height: 0, gravity: 9.8 }, 1.0204, 8.837, 1.2755, 10],
  [{ speed: 10, angle: 60, height: 0, gravity: 9.8 }, 1.7674, 8.837, 3.8265, 10],
  [{ speed: 10, angle: 45, height: 0, gravity: 1.6 }, 8.8388, 62.5, 15.625, 10],
  [{ speed: 20, angle: 90, height: 0, gravity: 9.8 }, 4.0816, 0, 20.4082, 20],
  [{ speed: 15, angle: 30, height: 2, gravity: 9.8 }, 1.7622, 22.892, 4.8699, 16.2542],
];

const closeTo = (actual: number, expected: number) =>
  expect(Math.abs(actual - expected)).toBeLessThan(1e-3);

describe("valeurs de contrôle de l'annexe C.2", () => {
  it.each(controlValues)("%j", (launch, duration, range, apex, speed) => {
    closeTo(flightTime(launch), duration);
    closeTo(launchRange(launch), range);
    closeTo(apexHeight(launch), apex);
    closeTo(impactSpeed(launch), speed);
  });
});

describe("pesanteur", () => {
  it("utilise exactement les valeurs affichées", () => {
    expect(gravities).toEqual({ earth: 9.8, moon: 1.6, mars: 3.7 });
  });
});

describe("position", () => {
  const launch: Launch = { speed: 10, angle: 30, height: 2, gravity: 9.8 };

  it("part de la hauteur de départ", () => {
    expect(position(launch, 0)).toEqual({ x: 0, y: 2 });
  });

  it("suit les équations horaires", () => {
    const { x, y } = position(launch, 1);
    closeTo(x, 8.6603);
    closeTo(y, -0.5 * 9.8 + 5 + 2);
  });

  it("revient au sol à la fin du vol, à la portée", () => {
    const { x, y } = position(launch, flightTime(launch));
    closeTo(x, launchRange(launch));
    closeTo(y, 0);
  });
});

describe("cas limites", () => {
  it("tir horizontal depuis le sol : durée et portée nulles", () => {
    const launch: Launch = { speed: 10, angle: 0, height: 0, gravity: 9.8 };
    expect(flightTime(launch)).toBe(0);
    expect(launchRange(launch)).toBe(0);
    expect(apexHeight(launch)).toBe(0);
    expect(impactSpeed(launch)).toBe(10);
  });

  it("tir vertical : portée exactement nulle, pas un reste de calcul flottant", () => {
    expect(launchRange({ speed: 20, angle: 90, height: 0, gravity: 9.8 })).toBe(0);
    expect(launchRange({ speed: 30, angle: 90, height: 20, gravity: 1.6 })).toBe(0);
  });

  it("tir vertical : le projectile reste sur l'axe (x = 0)", () => {
    const launch: Launch = { speed: 20, angle: 90, height: 5, gravity: 9.8 };
    expect(trajectoryPoints(launch).every((point) => point.x === 0)).toBe(true);
  });

  it.each([
    [{ speed: 1, angle: 45, height: 0, gravity: 9.8 }, 0.1443, 0.102, 0.0255, 1],
    [{ speed: 30, angle: 45, height: 20, gravity: 1.6 }, 27.428, 581.8354, 160.625, 31.0483],
    [{ speed: 1, angle: 0, height: 20, gravity: 9.8 }, 2.0203, 2.0203, 20, 19.8242],
  ] as Array<[Launch, number, number, number, number]>)(
    "bornes des plages : %j",
    (launch, duration, range, apex, speed) => {
      closeTo(flightTime(launch), duration);
      closeTo(launchRange(launch), range);
      closeTo(apexHeight(launch), apex);
      closeTo(impactSpeed(launch), speed);
    },
  );
});

describe("trajectoryPoints", () => {
  const launch: Launch = { speed: 10, angle: 45, height: 3, gravity: 9.8 };

  it("va du point de lancement au point d'impact", () => {
    const points = trajectoryPoints(launch);
    expect(points[0]).toEqual({ x: 0, y: 3 });
    const last = points[points.length - 1];
    closeTo(last.x, launchRange(launch));
    expect(last.y).toBe(0);
  });

  it("ne passe jamais sous le sol ni au-dessus de la flèche", () => {
    const points = trajectoryPoints(launch);
    expect(Math.min(...points.map((p) => p.y))).toBe(0);
    expect(Math.max(...points.map((p) => p.y))).toBeLessThanOrEqual(apexHeight(launch));
  });

  it("se réduit à un seul point quand le vol est nul", () => {
    expect(trajectoryPoints({ speed: 10, angle: 0, height: 0, gravity: 9.8 })).toEqual([
      { x: 0, y: 0 },
    ]);
  });
});
