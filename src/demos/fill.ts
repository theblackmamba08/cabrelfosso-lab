/** Remplace les champs {nom} d'un texte. */
export function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{([^}]+)\}/g, (field, name: string) => values[name] ?? field);
}
