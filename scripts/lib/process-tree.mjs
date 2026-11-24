/**
 * Démarrage et arrêt d'un arbre de processus, sous Windows comme sous Linux.
 *
 * Linux : le processus devient chef d'un groupe (équivalent de `setsid`), qu'un
 * PID négatif permet de viser en entier. Windows : pas de groupes de ce type,
 * `taskkill /T` parcourt les descendants à partir du PID racine.
 */
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

export function treeOptions(platform = process.platform) {
  return { detached: platform !== "win32", windowsHide: true };
}

export function stopInstruction(
  pid,
  { platform = process.platform, force = false } = {},
) {
  if (platform === "win32") {
    return { command: "taskkill", args: ["/PID", String(pid), "/T", "/F"] };
  }
  return { target: -pid, signal: force ? "SIGKILL" : "SIGTERM" };
}

/** Envoie l'ordre d'arrêt de façon synchrone : utilisable pendant `exit`. */
export function sendStop(pid, { platform = process.platform, force = false } = {}) {
  const instruction = stopInstruction(pid, { platform, force });
  if (instruction.command) {
    spawnSync(instruction.command, instruction.args, {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }
  try {
    process.kill(instruction.target, instruction.signal);
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
}

export function isTreeAlive(pid, platform = process.platform) {
  try {
    process.kill(platform === "win32" ? pid : -pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Demande l'arrêt, laisse `graceMs` à l'arbre, puis force si besoin. */
export async function stopProcessTree(
  pid,
  { platform = process.platform, graceMs = 5_000, pollMs = 50 } = {},
) {
  sendStop(pid, { platform });
  const deadline = Date.now() + graceMs;
  while (isTreeAlive(pid, platform)) {
    if (Date.now() >= deadline) {
      sendStop(pid, { platform, force: true });
      return;
    }
    await sleep(pollMs);
  }
}
