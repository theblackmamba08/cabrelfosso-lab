import { describe, expect, it } from "vitest";
import { securityHeaders } from "../src/lib/security-headers";
import worker from "./index";

/** Fausse liaison ASSETS : note les requêtes reçues et répond toujours « fichier ». */
async function call(path: string, init?: RequestInit) {
  const served: string[] = [];
  const env = {
    ASSETS: {
      fetch: async (request: Request) => {
        served.push(new URL(request.url).pathname);
        return new Response("fichier");
      },
    },
  } as unknown as Env;
  const response = await worker.fetch(new Request(`https://lab.cabrelfosso.com${path}`, init), env);
  return { response, served };
}

const english = { headers: { "accept-language": "en-US,en;q=0.9" } };

function expectSecurity(response: Response) {
  for (const { key, value } of securityHeaders) expect(response.headers.get(key), key).toBe(value);
}

describe("Worker de la racine", () => {
  it.each(["GET", "HEAD"])("%s / : redirection temporaire vers la langue du navigateur", async (method) => {
    const { response, served } = await call("/", { ...english, method });
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/en");
    expect(served).toEqual([]);
  });

  it("sans en-tête Accept-Language : vers /fr", async () => {
    expect((await call("/")).response.headers.get("location")).toBe("/fr");
  });

  it("conserve la chaîne de requête", async () => {
    expect((await call("/?a=1&b=%C3%A9")).response.headers.get("location")).toBe("/fr?a=1&b=%C3%A9");
  });

  it("n’est jamais mise en cache, dépend de la langue et porte les en-têtes de sécurité", async () => {
    const { response } = await call("/");
    expect(response.headers.get("vary")).toBe("Accept-Language");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expectSecurity(response);
  });

  it.each(["POST", "PUT", "DELETE", "OPTIONS"])("%s / : 405", async (method) => {
    const { response, served } = await call("/", { method });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
    expectSecurity(response);
    expect(served).toEqual([]);
  });

  it.each(["/fr", "/en/privacy", "/sitemap.xml", "/n-importe-quoi", "//"])(
    "%s : laissé aux fichiers statiques",
    async (path) => {
      const { response, served } = await call(path);
      expect(await response.text()).toBe("fichier");
      expect(served).toEqual([path]);
    },
  );
});
