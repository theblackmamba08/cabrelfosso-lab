import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cahier } from "../test/cahier";
import { securityHeaders } from "./security-headers";

/** Politique attendue : celle de la section 4 du cahier, mot pour mot. */
const expectedCsp =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'";

const headersFile = readFileSync(new URL("../../public/_headers", import.meta.url), "utf8");

/** En-têtes d'un bloc du fichier _headers (Cloudflare Workers, fichiers statiques). */
function block(path: string): Record<string, string> {
  const lines = headersFile.split(/\r?\n/);
  const start = lines.indexOf(path);
  expect(start, `bloc ${path}`).toBeGreaterThan(-1);
  const entries: Array<[string, string]> = [];
  for (const line of lines.slice(start + 1)) {
    if (!/^\s+\S/.test(line)) break;
    const [name, ...value] = line.trim().split(":");
    entries.push([name, value.join(":").trim()]);
  }
  return Object.fromEntries(entries);
}

describe("en-têtes de sécurité", () => {
  it("sont ceux de la section 4 du cahier", () => {
    expect(cahier).toContain(expectedCsp);
    expect(Object.fromEntries(securityHeaders.map((h) => [h.key, h.value]))).toEqual({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": expectedCsp,
    });
  });

  it("s’appliquent à tous les fichiers statiques (public/_headers)", () => {
    expect(block("/*")).toEqual(Object.fromEntries(securityHeaders.map((h) => [h.key, h.value])));
  });

  it("donnent un cache long aux fichiers de construction", () => {
    expect(block("/_next/static/*")).toEqual({ "Cache-Control": "public, max-age=31536000, immutable" });
  });
});
