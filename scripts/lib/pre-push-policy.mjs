/** Décision du hook pre-push : voir https://git-scm.com/docs/githooks#_pre_push */
const PROTECTED_REF = "refs/heads/main";

/** Chaque ligne reçue : <réf. locale> <objet local> <réf. distante> <objet distant>. */
export function findProtectedPushes(stdin) {
  return stdin
    .split("\n")
    .map((line) => line.trim().split(/\s+/)[2])
    .filter((remoteRef) => remoteRef === PROTECTED_REF);
}

export function refusalMessage() {
  return [
    "Envoi refusé : la branche main est protégée.",
    "Travaillez sur une branche etape/<numéro>-<sujet>, puis ouvrez une pull request.",
  ].join("\n");
}
