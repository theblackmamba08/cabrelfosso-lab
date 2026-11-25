export type Point = { x: number; y: number };

const radians = (degrees: number) => (degrees * Math.PI) / 180;

/** Directions de la lumière (vecteurs unitaires, repère du SVG : y vers le bas) ; angles en degrés. */
export function rays(i1: number, i2: number | null): { incident: Point; reflected: Point; refracted: Point | null } {
  const [sin, cos] = [Math.sin(radians(i1)), Math.cos(radians(i1))];
  return {
    incident: { x: sin, y: cos },
    reflected: { x: sin, y: -cos },
    refracted: i2 === null ? null : { x: Math.sin(radians(i2)), y: Math.cos(radians(i2)) },
  };
}

/** Point situé à `distance` du point d'incidence, dans l'angle du rayon incident ou réfracté. */
export function pointAt(center: Point, distance: number, angle: number, ray: "incident" | "refracted"): Point {
  const side = ray === "incident" ? -1 : 1;
  return {
    x: center.x + side * distance * Math.sin(radians(angle)),
    y: center.y + side * distance * Math.cos(radians(angle)),
  };
}

/** Arc d'un angle, de la normale jusqu'au rayon. */
export function arcPath(center: Point, radius: number, angle: number, ray: "incident" | "refracted"): string {
  const [from, to] = [0, angle].map((a) => pointAt(center, radius, a, ray));
  return `M${from.x.toFixed(2)} ${from.y.toFixed(2)}A${radius} ${radius} 0 0 0 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
}

/** Où écrire le nom d'un angle : au milieu de l'arc, ou juste après le rayon si l'arc est étroit. */
export function labelAngle(angle: number): number {
  return angle < 40 ? angle + 18 : angle / 2;
}
