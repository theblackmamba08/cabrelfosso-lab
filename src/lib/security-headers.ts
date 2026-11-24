/**
 * En-têtes de sécurité (cahier, section 4) : seule source, pour
 * - les fichiers statiques : public/_headers en contient exactement la même liste
 *   (vérifié par security-headers.test.ts) ;
 * - les réponses du Worker de la racine, auxquelles _headers ne s'applique pas
 *   (https://developers.cloudflare.com/workers/static-assets/headers/).
 * Le Worker charge ce fichier : aucun import avec l'alias `@/`.
 *
 * script-src 'unsafe-inline' : les pages exportées contiennent des scripts en ligne de Next.js et le
 * script de thème ; un nonce exigerait un rendu à chaque requête. style-src 'unsafe-inline' :
 * attributs style de React. Web Analytics : script sur static.cloudflareinsights.com, envois vers
 * cloudflareinsights.com (https://developers.cloudflare.com/web-analytics/faq/).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
] as const;
