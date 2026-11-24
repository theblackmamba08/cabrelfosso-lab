import { spawnSync } from "node:child_process";

function git(cwd, ...args) {
  return spawnSync("git", args, { cwd, stdio: "ignore" });
}

/** Renvoie false hors d'un dépôt Git : `npm ci` doit y réussir quand même. */
export function installHooks(cwd) {
  if (git(cwd, "rev-parse", "--is-inside-work-tree").status !== 0) return false;
  return git(cwd, "config", "core.hooksPath", ".githooks").status === 0;
}
