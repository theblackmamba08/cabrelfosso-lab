import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { installHooks } from "./install-hooks.mjs";

const folders: string[] = [];

function tempFolder() {
  const folder = mkdtempSync(join(tmpdir(), "install-hooks-"));
  folders.push(folder);
  return folder;
}

afterEach(() => {
  for (const folder of folders.splice(0)) {
    rmSync(folder, { recursive: true, force: true });
  }
});

describe("installHooks", () => {
  it("pointe core.hooksPath vers .githooks dans un dépôt Git", () => {
    const repo = tempFolder();
    execFileSync("git", ["init", "-q"], { cwd: repo });

    expect(installHooks(repo)).toBe(true);

    const value = execFileSync("git", ["config", "core.hooksPath"], {
      cwd: repo,
      encoding: "utf8",
    });
    expect(value.trim()).toBe(".githooks");
  });

  it("ne fait rien hors d'un dépôt Git, par exemple dans une archive", () => {
    expect(installHooks(tempFolder())).toBe(false);
  });
});
