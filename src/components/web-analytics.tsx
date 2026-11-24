import { isAnalyticsActive } from "@/lib/analytics";

/**
 * Extrait officiel de Cloudflare Web Analytics (installation manuelle), à placer en dernier dans
 * <body> : https://developers.cloudflare.com/web-analytics/faq/. Sans jeton, rien.
 */
export function WebAnalytics({ token }: { token: string | null }) {
  if (!isAnalyticsActive(token)) return null;
  // Un script de type module est toujours différé : il ne bloque pas l’affichage.
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
