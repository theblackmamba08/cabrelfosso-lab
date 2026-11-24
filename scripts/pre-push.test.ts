/**
 * Vrai `git push` vers un dépôt distant jetable, avec le hook versionné.
 * Aucun envoi ne vise le dépôt GitHub.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const hooksPath = fileURLToPath(new URL("../.githooks", import.meta.url));
let folder: string;
let work: string;
let origin: string;

function git(cwd: string, ...args: string[]) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

function push(refspec: string) {
  return spawnSync(
    "git",
    ["-c", `core.hooksPath=${hooksPath}`, "push", "origin", refspec],
    { cwd: work, encoding: "utf8" },
  );
}

function originHas(ref: string) {
  const result = spawnSync("git", ["rev-parse", "--verify", "-q", ref], {
    cwd: origin,
  });
  return result.status === 0;
}

beforeAll(() => {
  folder = mkdtempSync(join(tmpdir(), "pre-push-"));
  origin = join(folder, "origin.git");
  work = join(folder, "work");
  git(folder, "init", "-q", "--bare", "-b", "trunk", origin);
  git(folder, "init", "-q", "-b", "etape/essai", work);
  git(work, "remote", "add", "origin", origin);
  writeFileSync(join(work, "fichier.txt"), "contenu\n");
  git(work, "add", "fichier.txt");
  git(
    work,
    "-c",
    "user.name=Test",
    "-c",
    "user.email=test@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-q",
    "-m",
    "essai",
  );
});

afterAll(() => {
  rmSync(folder, { recursive: true, force: true });
});

describe("hook pre-push", () => {
  it("refuse git push origin HEAD:main", () => {
    const result = push("HEAD:main");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Envoi refusé");
    expect(originHas("refs/heads/main")).toBe(false);
  }, 30_000);

  it("laisse passer une branche d'étape", () => {
    const result = push("HEAD:etape/essai");

    expect(result.status).toBe(0);
    expect(originHas("refs/heads/etape/essai")).toBe(true);
  }, 30_000);
});
