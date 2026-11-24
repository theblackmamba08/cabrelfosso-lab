import { spawn } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import {
  isTreeAlive,
  stopInstruction,
  stopProcessTree,
  treeOptions,
} from "./process-tree.mjs";

const hang = "setInterval(() => {}, 1000);";
const startedPids = new Set<number>();

/** Lance un vrai processus qui démarre un petit-enfant et annonce son PID. */
async function startTree(parentPrelude = "") {
  const parentCode = `${parentPrelude}
    const { spawn } = require("node:child_process");
    const grandchild = spawn(process.execPath, ["-e", ${JSON.stringify(hang)}], { stdio: "ignore" });
    console.log(grandchild.pid);
    ${hang}`;
  const parent = spawn(process.execPath, ["-e", parentCode], {
    ...treeOptions(),
    stdio: ["ignore", "pipe", "inherit"],
  });
  const grandchildPid = await new Promise<number>((resolve) => {
    parent.stdout.once("data", (chunk) => resolve(Number(String(chunk))));
  });
  startedPids.add(parent.pid!);
  startedPids.add(grandchildPid);
  return { parentPid: parent.pid!, grandchildPid };
}

function isProcessAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function eventually(condition: () => boolean, timeoutMs = 3_000) {
  const deadline = Date.now() + timeoutMs;
  while (!condition() && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return condition();
}

afterEach(() => {
  for (const pid of startedPids) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Déjà arrêté : c'est le cas normal.
    }
  }
  startedPids.clear();
});

describe("treeOptions", () => {
  it("place le processus dans son propre groupe sous Linux", () => {
    expect(treeOptions("linux")).toMatchObject({ detached: true });
  });

  it("n'ouvre pas de console séparée sous Windows", () => {
    expect(treeOptions("win32")).toMatchObject({
      detached: false,
      windowsHide: true,
    });
  });
});

describe("stopInstruction", () => {
  it("vise tout l'arbre avec taskkill sous Windows", () => {
    expect(stopInstruction(1234, { platform: "win32" })).toEqual({
      command: "taskkill",
      args: ["/PID", "1234", "/T", "/F"],
    });
  });

  it("envoie SIGTERM à tout le groupe sous Linux", () => {
    expect(stopInstruction(1234, { platform: "linux" })).toEqual({
      target: -1234,
      signal: "SIGTERM",
    });
  });

  it("passe à SIGKILL quand l'arrêt est forcé sous Linux", () => {
    expect(stopInstruction(1234, { platform: "linux", force: true })).toEqual({
      target: -1234,
      signal: "SIGKILL",
    });
  });
});

describe("stopProcessTree", () => {
  it("arrête le processus et ses descendants", async () => {
    const { parentPid, grandchildPid } = await startTree();
    expect(isProcessAlive(parentPid)).toBe(true);
    expect(isProcessAlive(grandchildPid)).toBe(true);

    await stopProcessTree(parentPid);

    expect(await eventually(() => !isProcessAlive(parentPid))).toBe(true);
    expect(await eventually(() => !isProcessAlive(grandchildPid))).toBe(true);
  });

  it("ne lève pas d'erreur si l'arbre est déjà arrêté", async () => {
    const child = spawn(process.execPath, ["-e", ""], {
      ...treeOptions(),
      stdio: "ignore",
    });
    await new Promise((resolve) => child.once("exit", resolve));

    await expect(stopProcessTree(child.pid!)).resolves.toBeUndefined();
    expect(isTreeAlive(child.pid!)).toBe(false);
  });

  it.skipIf(process.platform === "win32")(
    "force l'arrêt d'un arbre qui ignore SIGTERM",
    async () => {
      const { parentPid, grandchildPid } = await startTree(
        'process.on("SIGTERM", () => {});',
      );

      await stopProcessTree(parentPid, { graceMs: 200 });

      expect(await eventually(() => !isProcessAlive(parentPid))).toBe(true);
      expect(await eventually(() => !isProcessAlive(grandchildPid))).toBe(true);
    },
  );
});
