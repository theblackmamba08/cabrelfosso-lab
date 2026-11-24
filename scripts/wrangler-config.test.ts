import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseWranglerConfig } from "./lib/wrangler-config.mjs";

/** Configuration de production du Worker (cahier, sections 2 et 4). */
const source = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
const config = parseWranglerConfig(source);

describe("wrangler.jsonc : production sur lab.cabrelfosso.com", () => {
  it("nomme le Worker et son point d’entrée", () => {
    expect(config.name).toBe("cabrelfosso-lab");
    expect(config.main).toBe("worker/index.ts");
    expect(config.compatibility_date).toBe("2026-11-24");
  });

  it("sert les fichiers statiques ; le Worker ne s’exécute d’abord que pour /", () => {
    expect(config.assets).toEqual({
      directory: "./out",
      binding: "ASSETS",
      not_found_handling: "404-page",
      html_handling: "auto-trailing-slash",
      run_worker_first: ["/"],
    });
  });

  it("n’est publié que sur le domaine personnalisé", () => {
    expect(config.routes).toEqual([{ pattern: "lab.cabrelfosso.com", custom_domain: true }]);
    expect(config.workers_dev).toBe(false);
    expect(config.preview_urls).toBe(false);
  });

  it("n’enregistre aucun journal", () => {
    expect(config.observability).toEqual({ enabled: false });
  });

  it("ne contient ni secret ni variable", () => {
    expect(config).not.toHaveProperty("vars");
    expect(JSON.stringify(config)).not.toMatch(/SECRET|api[_-]?key|token/i);
  });
});
