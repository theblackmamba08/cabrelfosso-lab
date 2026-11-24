import type { Locale } from "../../i18n/config";
import en from "../../i18n/messages/en";
import fr from "../../i18n/messages/fr";
import { localizedPath } from "../../i18n/routes";
import { absolute, portfolioUrl } from "../site";

type Thing = { "@type": string; [key: string]: unknown };

const messages = { fr, en };

/** Données structurées du site (JSON-LD, schema.org), sur l'accueil (cahier, section 6). */
export function websiteLd(locale: Locale) {
  const { site } = messages[locale];
  return {
    "@type": "WebSite",
    name: site.ogName,
    url: absolute(localizedPath("home", locale)),
    inLanguage: locale,
    author: { "@type": "Person", name: site.author, url: portfolioUrl },
  } satisfies Thing;
}

/**
 * Contenu de la balise <script type="application/ld+json"> : un graphe schema.org.
 * « < » est échappé (guide JSON-LD de Next.js) : aucun texte ne peut fermer le script.
 */
export function serializeJsonLd(things: readonly Thing[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": things }).replace(/</g, "\\u003c");
}
