import { describe, expect, it } from "vitest";
import { findProtectedPushes, refusalMessage } from "./pre-push-policy.mjs";

const local = "a".repeat(40);
const remote = "b".repeat(40);
const zero = "0".repeat(40);

function line(localRef: string, remoteRef: string) {
  return `${localRef} ${local} ${remoteRef} ${remote}\n`;
}

describe("findProtectedPushes", () => {
  it("repère un envoi vers main", () => {
    const stdin = line("refs/heads/etape/g-socle-git", "refs/heads/main");
    expect(findProtectedPushes(stdin)).toEqual(["refs/heads/main"]);
  });

  it("laisse passer un envoi vers une branche d'étape", () => {
    const stdin = line("refs/heads/etape/g", "refs/heads/etape/g");
    expect(findProtectedPushes(stdin)).toEqual([]);
  });

  it("repère main parmi plusieurs références", () => {
    const stdin =
      line("refs/heads/etape/g", "refs/heads/etape/g") +
      line("refs/heads/main", "refs/heads/main");
    expect(findProtectedPushes(stdin)).toEqual(["refs/heads/main"]);
  });

  it("repère la suppression de main", () => {
    const stdin = `(delete) ${zero} refs/heads/main ${remote}\n`;
    expect(findProtectedPushes(stdin)).toEqual(["refs/heads/main"]);
  });

  it("ne confond pas main avec un nom proche", () => {
    const stdin =
      line("refs/heads/main-test", "refs/heads/main-test") +
      line("refs/heads/x", "refs/heads/etape/main") +
      line("refs/tags/main", "refs/tags/main");
    expect(findProtectedPushes(stdin)).toEqual([]);
  });

  it("accepte une entrée vide", () => {
    expect(findProtectedPushes("")).toEqual([]);
  });

  it("tolère des fins de ligne CRLF", () => {
    const stdin = line("refs/heads/x", "refs/heads/main").replace("\n", "\r\n");
    expect(findProtectedPushes(stdin)).toEqual(["refs/heads/main"]);
  });
});

describe("refusalMessage", () => {
  it("explique le refus et la marche à suivre, en français", () => {
    const message = refusalMessage();
    expect(message).toContain("Envoi refusé");
    expect(message).toContain("main");
    expect(message).toContain("etape/<numéro>-<sujet>");
    expect(message).toContain("pull request");
  });

  it("respecte la typographie française", () => {
    const message = refusalMessage();
    expect(message).not.toContain("'");
    expect(message).not.toMatch(/[^ ][:;!?](\s|$)/);
  });
});
