import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { formatQuantity } from "./format";
import { apexHeight, launchRange, type Launch } from "./physics";

export type SummaryTexts = Messages["demos"]["projectile"]["summary"];

function describe(template: string, launch: Launch, locale: Locale) {
  return template
    .replace("{range}", formatQuantity(launchRange(launch), "m", locale))
    .replace("{height}", formatQuantity(apexHeight(launch), "m", locale));
}

/** Résumé textuel de la figure, pour les lecteurs d'écran (annexe C.2). */
export function figureSummary(
  launch: Launch,
  kept: Launch | null,
  texts: SummaryTexts,
  locale: Locale,
): string {
  const current = describe(texts.current, launch, locale);
  return kept ? `${current} ${describe(texts.kept, kept, locale)}` : current;
}
