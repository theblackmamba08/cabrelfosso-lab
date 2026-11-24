import "server-only";
import type { Locale } from "./config";
import type { Messages } from "./messages/fr";

const loaders: Record<Locale, () => Promise<Messages>> = {
  fr: () => import("./messages/fr").then((m) => m.default),
  en: () => import("./messages/en").then((m) => m.default),
};

/** Charge les textes d'une langue côté serveur uniquement. */
export function getMessages(locale: Locale): Promise<Messages> {
  return loaders[locale]();
}

export type { Messages };
