import { describe, expect, it } from "vitest";
import { parseWranglerConfig } from "./wrangler-config.mjs";

describe("lecture de wrangler.jsonc", () => {
  it("ignore les commentaires sur des lignes à part", () => {
    expect(parseWranglerConfig('{\n  // note\n  "name": "x"\n}')).toEqual({ name: "x" });
  });
});
