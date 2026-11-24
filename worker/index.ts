import { chooseLocale } from "../src/i18n/negotiate";
import { securityHeaders } from "../src/lib/security-headers";

/** En-têtes communs aux réponses produites ici : _headers ne vaut que pour les fichiers statiques. */
function responseHeaders(extra: Record<string, string>): Headers {
  const headers = new Headers(extra);
  for (const { key, value } of securityHeaders) headers.set(key, value);
  headers.set("Cache-Control", "no-store");
  return headers;
}

/**
 * Worker de la racine (cahier, section 2) : il ne s'exécute d'abord que pour `/`
 * (`run_worker_first`, wrangler.jsonc) et envoie vers la langue du navigateur. Toute autre adresse
 * qui l'atteindrait est servie par les fichiers statiques.
 */
const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname, search } = new URL(request.url);
    if (pathname !== "/") return env.ASSETS.fetch(request);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405, headers: responseHeaders({ Allow: "GET, HEAD" }) });
    }
    const locale = chooseLocale(request.headers.get("Accept-Language"));
    return new Response(null, {
      status: 302,
      headers: responseHeaders({ Location: `/${locale}${search}`, Vary: "Accept-Language" }),
    });
  },
};

export default worker;
