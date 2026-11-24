import { describe, expect, it } from "vitest";
import { lastUpdated, privacyLastUpdated } from "./privacy";

describe("page Confidentialité : date de dernière mise à jour", () => {
  it("est celle de l'étape L1", () => {
    expect(privacyLastUpdated).toBe("2026-11-24");
  });

  it("s'écrit en toutes lettres dans chaque langue", () => {
    expect(lastUpdated("fr")).toBe("24 novembre 2026");
    expect(lastUpdated("en")).toBe("24 November 2026");
  });
});
