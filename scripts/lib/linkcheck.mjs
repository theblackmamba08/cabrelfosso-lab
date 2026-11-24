/**
 * Vérification des liens d'un site servi : logique sans processus ni réseau réel, voir
 * scripts/linkcheck.mjs. Part du sitemap, relève les liens de chaque page, demande chaque adresse
 * interne une seule fois (200 attendu), vérifie
 * les ancres #id, et liste les liens externes sans les compter comme des échecs.
 */
import { PRODUCTION_HOST, normalizeBase } from "./smoke.mjs";

export const USER_AGENT = "cabrelfosso-lab-linkcheck/1.0 (+https://lab.cabrelfosso.com)";
const CONCURRENCY = 4;
const SPACING_MS = 150;
const TIMEOUT_MS = 15_000;

const ENTITIES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };

function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const point = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Retire commentaires, contenu des scripts et des styles (les balises <script src> restent). */
function stripInert(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, "$1</script>")
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style\s*>/gi, "$1</style>");
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    const name = match[1].toLowerCase();
    if (!(name in result)) result[name] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function srcsetUrls(value) {
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

/** Liens d'une page : [{ url (absolue), kind }], dans l'ordre du document. */
export function extractLinks(html, pageUrl) {
  const found = [];
  const add = (value, kind) => {
    const raw = value?.trim();
    if (!raw || /^(javascript|data):/i.test(raw)) return;
    try {
      found.push({ url: new URL(raw, pageUrl).href, kind });
    } catch {
      found.push({ url: raw, kind });
    }
  };
  for (const match of stripInert(html).matchAll(/<(a|img|source|link|meta|script)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    const attrs = attributes(match[2]);
    if (tag === "a") add(attrs.href, "a");
    else if (tag === "img" || tag === "source") {
      if (tag === "img") add(attrs.src, "img");
      for (const url of srcsetUrls(attrs.srcset ?? "")) add(url, "srcset");
    } else if (tag === "script") add(attrs.src, "script");
    else if (tag === "link") {
      const rel = (attrs.rel ?? "").toLowerCase().split(/\s+/);
      if (rel.includes("canonical")) add(attrs.href, "canonical");
      else if (rel.includes("alternate")) add(attrs.href, "alternate");
      else if (rel.some((token) => token === "icon" || token.endsWith("-icon"))) add(attrs.href, "icon");
      else if (rel.includes("stylesheet")) add(attrs.href, "stylesheet");
    } else if (tag === "meta") {
      const property = (attrs.property ?? attrs.name ?? "").toLowerCase();
      if (property === "og:image" || property === "twitter:image") add(attrs.content, property);
    }
  }
  return found;
}

/** id des éléments d'une page, cibles possibles des ancres. */
export function extractIds(html) {
  const ids = new Set();
  for (const match of stripInert(html).matchAll(/<[a-z][a-z0-9-]*\b([^>]*)>/gi)) {
    const id = attributes(match[1]).id;
    if (id) ids.add(id);
  }
  return ids;
}

/** internal, external, mailto, tel ou other. */
export function classify(url, base) {
  if (/^mailto:/i.test(url)) return "mailto";
  if (/^tel:/i.test(url)) return "tel";
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "other";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "other";
  const baseHost = new URL(base).host;
  if (parsed.host === baseHost || parsed.hostname === PRODUCTION_HOST) return "internal";
  return "external";
}

/** Exécute les tâches avec un parallélisme limité, chaque départ espacé du précédent. */
async function pool(items, worker, sleep) {
  let next = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
      await sleep(SPACING_MS);
    }
  });
  await Promise.all(runners);
}

const withoutHash = (url) => url.split("#")[0];
const label = (url) => {
  const { pathname, search } = new URL(url);
  return `${pathname}${search}`;
};

export async function runLinkcheck({
  baseUrl,
  fetchFn = fetch,
  log = () => {},
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  const base = normalizeBase(baseUrl);
  const production = new URL(base).hostname === PRODUCTION_HOST;
  // Hors production, les adresses absolues du domaine de production pointent vers l'adresse testée.
  const target = (url) => {
    const parsed = new URL(url);
    if (!production && parsed.hostname === PRODUCTION_HOST) {
      return `${base}${parsed.pathname}${parsed.search}`;
    }
    return parsed.href;
  };

  const request = async (url, redirect) => {
    try {
      const response = await fetchFn(url, {
        redirect,
        headers: { "user-agent": USER_AGENT, accept: "text/html,*/*" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const type = response.headers.get("content-type") ?? "";
      const html = type.includes("text/html");
      const body = response.status === 200 && (html || type.includes("xml")) ? await response.text() : null;
      if (body === null) await response.body?.cancel();
      return { status: response.status, location: response.headers.get("location"), body, html };
    } catch (error) {
      return { status: error instanceof Error ? error.message : String(error), location: null, body: null, html: false };
    }
  };

  // Réponses internes : une seule demande par adresse (sans ancre).
  const responses = new Map();
  const getInternal = (url) => {
    const key = target(url);
    if (!responses.has(key)) responses.set(key, request(key, "manual"));
    return responses.get(key);
  };

  // 1. Sitemap.
  const sitemap = await getInternal(`${base}/sitemap.xml`);
  const locs = [...(sitemap.body ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeEntities(m[1].trim()));
  if (locs.length === 0) throw new Error(`sitemap.xml : statut ${sitemap.status}, aucune adresse`);
  const sitemapPaths = new Set(locs.map((loc) => new URL(target(loc)).pathname));

  // Sources de chaque lien (adresse complète, ancre comprise) : pages qui le contiennent.
  const sources = new Map();
  const addSource = (url, from) => {
    if (!sources.has(url)) sources.set(url, []);
    const list = sources.get(url);
    if (!list.includes(from)) list.push(from);
  };

  // 2. Pages du sitemap, et liens relevés dans chacune.
  for (const loc of locs) addSource(loc, "sitemap.xml");
  await pool(
    locs,
    async (loc) => {
      const page = await getInternal(loc);
      if (!page.html || page.body === null) return;
      for (const link of extractLinks(page.body, loc)) addSource(link.url, label(loc));
    },
    sleep,
  );

  // Pages qui contiennent un lien vers cette adresse, quelle que soit l’ancre.
  function sourcesOf(page) {
    const list = [];
    for (const [url, from] of sources) {
      if (withoutHash(url) !== page) continue;
      for (const source of from) if (!list.includes(source)) list.push(source);
    }
    return list;
  }

  const failures = [];
  const outOfSitemap = [];
  const external = [];
  const mailto = [];
  const tel = [];
  const fail = (url, reason, from = sources.get(url) ?? []) => {
    failures.push({ url, reason, from });
    log(`  ✗ ${url} : ${reason}`);
  };

  const all = [...sources.keys()];
  const kinds = new Map(all.map((url) => [url, classify(url, base)]));
  const of = (kind) => all.filter((url) => kinds.get(url) === kind);

  // 3. Liens internes (sans ancre), une demande chacun.
  const internalUrls = [...new Set(of("internal").map(withoutHash))];
  await pool(internalUrls, getInternal, sleep);
  const checked = new Set();
  for (const url of of("internal")) {
    const page = withoutHash(url);
    const response = await getInternal(page);
    if (!checked.has(page)) {
      checked.add(page);
      if (response.status !== 200) {
        const where = response.location ? ` vers ${response.location}` : "";
        fail(page, `statut ${response.status}${where}`, sourcesOf(page));
      } else if (response.html && !sitemapPaths.has(new URL(target(page)).pathname)) {
        outOfSitemap.push({ url: page, from: sourcesOf(page) });
      }
    }
    // 4. Ancres.
    const hash = url.includes("#") ? decodeURIComponent(url.slice(url.indexOf("#") + 1)) : "";
    if (!hash || hash.startsWith(":~:") || !response.html || response.body === null) continue;
    if (!extractIds(response.body).has(hash)) fail(url, `ancre #${hash} absente`);
  }

  // 5. Liens externes : listés avec leur statut.
  const externalUrls = [...new Set(of("external").map(withoutHash))];
  await pool(
    externalUrls,
    async (url) => {
      const response = await request(url, "follow");
      external.push({ url, status: response.status, ok: response.status === 200, from: sourcesOf(url) });
    },
    sleep,
  );
  external.sort((a, b) => a.url.localeCompare(b.url));
  for (const url of of("mailto")) mailto.push(url);
  for (const url of of("tel")) tel.push(url);

  return {
    failures,
    outOfSitemap,
    external,
    mailto,
    tel,
    pages: locs.length,
    internal: internalUrls.length,
    production,
  };
}
