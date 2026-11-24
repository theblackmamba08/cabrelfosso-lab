import type { Locale } from "@/i18n/config";

/**
 * Date de dernière mise à jour de la page Confidentialité (annexe B.3) : étape L1. À changer à
 * chaque modification du texte de la page.
 */
export const privacyLastUpdated = "2026-11-24";

const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

/** Date en toutes lettres : « 15 novembre 2026 », « 15 November 2026 ». */
export function lastUpdated(locale: Locale): string {
  const [year, month, day] = privacyLastUpdated.split("-").map(Number);
  // Midi UTC : évite tout décalage de jour selon le fuseau de la machine qui compile.
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
