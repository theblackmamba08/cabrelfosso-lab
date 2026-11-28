import { imageDistance, imageHeight, objectHeight, type Setup } from "./lens";

export type Point = { x: number; y: number };

/** Cadre de la figure, en cm (annexe F.1). */
export const frame = { left: -42, right: 42, bottom: -14, top: 14 } as const;

/** Partie d'un segment qui est dans le cadre (algorithme de Liang-Barsky), ou `null`. */
export function clipToFrame(from: Point, to: Point): [Point, Point] | null {
  const [dx, dy] = [to.x - from.x, to.y - from.y];
  let [enter, leave] = [0, 1];
  for (const [p, q] of [
    [-dx, from.x - frame.left],
    [dx, frame.right - from.x],
    [-dy, from.y - frame.bottom],
    [dy, frame.top - from.y],
  ]) {
    if (p === 0) {
      if (q < 0) return null;
      continue;
    }
    const t = q / p;
    if (p < 0) enter = Math.max(enter, t);
    else leave = Math.min(leave, t);
  }
  if (enter > leave) return null;
  const at = (t: number) => ({ x: from.x + t * dx, y: from.y + t * dy });
  return [at(enter), at(leave)];
}

/** Ligne brisée coupée au cadre : elle s'arrête là où elle en sort. */
function clipPath(points: readonly Point[]): Point[] {
  const kept: Point[] = [];
  for (let i = 1; i < points.length; i++) {
    const clipped = clipToFrame(points[i - 1], points[i]);
    if (!clipped) break;
    if (kept.length === 0) kept.push(clipped[0]);
    kept.push(clipped[1]);
    if (clipped[1].x !== points[i].x || clipped[1].y !== points[i].y) break;
  }
  return kept;
}

/** Point lointain dans une direction, hors du cadre : le découpage l'arrête au bord. */
function beyond({ x, y }: Point, dx: number, dy: number): Point {
  const scale = 1000 / Math.hypot(dx, dy);
  return { x: x + dx * scale, y: y + dy * scale };
}

export type Ray = { id: 1 | 2 | 3; points: Point[] };

/**
 * Construction de l'image (annexe F.1), en cm ; axe optique horizontal, lentille en x = 0.
 * Trois rayons partent de B : (1) parallèle à l'axe puis par F′ ; (2) par O ; (3) par F puis
 * parallèle à l'axe (absent si l'objet est au foyer). Image virtuelle : prolongements vers B′.
 */
export function lensDiagram(setup: Setup) {
  const { focal, distance } = setup;
  const b: Point = { x: -distance, y: objectHeight };
  const position = imageDistance(setup);
  const height = imageHeight(setup);

  const top: Point = { x: 0, y: objectHeight };
  const rays: Ray[] = [
    { id: 1, points: clipPath([b, top, beyond(top, focal, -objectHeight)]) },
    { id: 2, points: clipPath([b, beyond(b, distance, -objectHeight)]) },
  ];
  const extensions: Array<[Point, Point]> = [];

  if (position === null || height === null) return { rays, extensions, image: null };

  const exit: Point = { x: 0, y: height };
  rays.push({ id: 3, points: clipPath([b, exit, beyond(exit, 1, 0)]) });

  const image: Point = { x: position, y: height };
  if (position < 0) {
    const lines: Array<[Point, Point]> = [
      [top, image],
      [b, image],
      [exit, image],
      [{ x: -focal, y: 0 }, b],
    ];
    for (const [from, to] of lines) {
      const clipped = clipToFrame(from, to);
      if (clipped) extensions.push(clipped);
    }
  }
  const inFrame = Math.abs(position) <= frame.right && Math.abs(height) <= frame.top;
  return { rays, extensions, image: { x: position, top: height, inFrame } };
}
