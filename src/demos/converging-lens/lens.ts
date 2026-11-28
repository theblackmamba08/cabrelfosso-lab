/** Hauteur de l'objet AB, en cm (annexe F.1). */
export const objectHeight = 2;

/** Distance focale f′ et distance objet-lentille d, en cm. */
export type Setup = { focal: number; distance: number };

export type Nature = "smaller" | "same" | "larger" | "virtual" | "none";

/** Position de l'image OA′ = f′ d / (d − f′) (d_i en anglais) ; `null` si l'objet est au foyer. */
export function imageDistance({ focal, distance }: Setup): number | null {
  return distance === focal ? null : (focal * distance) / (distance - focal);
}

/** Grandissement γ = −f′ / (d − f′) (m en anglais). */
export function magnification({ focal, distance }: Setup): number | null {
  return distance === focal ? null : -focal / (distance - focal);
}

/** Taille algébrique de l'image A′B′ = γ × AB (h_i en anglais). */
export function imageHeight(setup: Setup): number | null {
  const ratio = magnification(setup);
  return ratio === null ? null : ratio * objectHeight;
}

/** Nature de l'image, décidée en comparant d à f′ et à 2f′ (valeurs réglées, exactes), jamais par γ. */
export function nature({ focal, distance }: Setup): Nature {
  if (distance > 2 * focal) return "smaller";
  if (distance === 2 * focal) return "same";
  if (distance > focal) return "larger";
  return distance === focal ? "none" : "virtual";
}
