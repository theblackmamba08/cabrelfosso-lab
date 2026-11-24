/** Lecture de wrangler.jsonc (commentaires seulement sur des lignes à part). */
export function parseWranglerConfig(source) {
  return JSON.parse(
    source
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n"),
  );
}
