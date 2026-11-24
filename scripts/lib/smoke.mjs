/**
 * Vérification d'un site servi (après mise en ligne, ou build local) : logique sans processus ni
 * réseau réel, voir scripts/smoke.mjs. Seulement des GET et des HEAD, plus un POST / refusé (405).
 */
import { readFileSync } from "node:fs";

export const PRODUCTION_HOST = "lab.cabrelfosso.com";

const UNKNOWN_PATH = "/adresse-inconnue";

export function normalizeBase(value) {
  let url;
  try {
    url = new URL(value ?? "");
  } catch {
    throw new Error(`Adresse invalide : ${value ?? "(aucune)"}. Exemple : npm run smoke -- http://localhost:8787`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Adresse invalide (http ou https attendu) : ${value}`);
  }
  return url.origin;
}

/** En-têtes de sécurité attendus : bloc « /* » de public/_headers (même liste que le Worker). */
function expectedHeaders() {
  const source = readFileSync(new URL("../../public/_headers", import.meta.url), "utf8");
  const [block] = source.split(/\r?\n\r?\n/);
  return block
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim()];
    });
}

export async function runSmoke({ baseUrl, fetchFn = fetch, log = () => {} }) {
  const base = normalizeBase(baseUrl);
  const security = expectedHeaders();
  const failures = [];
  /** Une vérification : réussie si la liste des problèmes est vide. */
  const report = (label, problems) => {
    if (problems.length === 0) {
      log(`  ✓ ${label}`);
      return;
    }
    const message = `${label} : ${problems.join(", ")}`;
    failures.push(message);
    log(`  ✗ ${message}`);
  };
  const request = (path, init = {}) => fetchFn(new URL(path, base).href, { redirect: "manual", ...init });
  const expectStatus = (response, status) =>
    response.status === status ? [] : [`statut ${response.status} (${status} attendu)`];
  const expectHeaders = (response, entries) =>
    entries
      .filter(([name, value]) => response.headers.get(name) !== value)
      .map(([name]) => `en-tête ${name} incorrect : ${response.headers.get(name) ?? "absent"}`);

  // 1. robots.txt
  const robots = await request("/robots.txt");
  const hasSitemap = /Sitemap: https:\/\/\S+\/sitemap\.xml/.test(await robots.text());
  report("robots.txt", [...expectStatus(robots, 200), ...(hasSitemap ? [] : ["ligne Sitemap absente"])]);

  // 2. Toutes les adresses du sitemap : HTTPS, 200, en-têtes ; image de partage de chacune.
  const sitemap = await request("/sitemap.xml");
  const locs = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  report("sitemap.xml", [...expectStatus(sitemap, 200), ...(locs.length > 0 ? [] : ["aucune adresse"])]);
  for (const loc of locs) {
    if (!loc.startsWith("https://")) {
      report(loc, ["adresse du sitemap qui n'est pas en HTTPS"]);
      continue;
    }
    const { pathname } = new URL(loc);
    const page = await request(pathname);
    report(pathname, [...expectStatus(page, 200), ...expectHeaders(page, security)]);

    const image = await request(`/og${pathname}.png`);
    report(`/og${pathname}.png`, [...expectStatus(image, 200), ...expectHeaders(image, [["content-type", "image/png"]])]);
  }

  // 3. Racine : redirection selon la langue, chaîne de requête conservée.
  const rootHeaders = [["cache-control", "no-store"], ...security];
  for (const { method = "GET", language, target } of [
    { language: "en-US,en;q=0.9", target: "/en?a=1" },
    { method: "HEAD", language: "en-US,en;q=0.9", target: "/en?a=1" },
    { language: "fr-CM", target: "/fr?a=1" },
    { target: "/fr?a=1" },
  ]) {
    const response = await request("/?a=1", { method, headers: language ? { "accept-language": language } : {} });
    const location = response.headers.get("location");
    const { pathname, search } = new URL(location ?? "", base);
    const label = `${method} /?a=1 (${language ?? "sans langue"})`;
    const vary = /accept-language/i.test(response.headers.get("vary") ?? "") ? [] : ["en-tête vary incorrect"];
    report(label, [
      ...expectStatus(response, 302),
      ...(pathname + search === target ? [] : [`vers ${location ?? "(aucune adresse)"} (${target} attendu)`]),
      ...vary,
      ...expectHeaders(response, rootHeaders),
    ]);
  }
  const post = await request("/", { method: "POST" });
  report("POST /", [...expectStatus(post, 405), ...expectHeaders(post, [["allow", "GET, HEAD"], ...security])]);

  // 4. Page 404 bilingue, non indexée.
  const missing = await request(UNKNOWN_PATH);
  const html = await missing.text();
  const absent = ["Page introuvable", "Page not found", "noindex"].filter((text) => !html.includes(text));
  report("page 404", [
    ...expectStatus(missing, 404),
    ...absent.map((text) => `« ${text} » absent`),
    ...expectHeaders(missing, security),
  ]);

  return { failures };
}
