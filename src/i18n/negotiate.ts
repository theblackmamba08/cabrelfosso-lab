import { defaultLocale, isLocale, type Locale } from "./config";

/** Poids d'une entrée (RFC 9110, section 12.4.2 : de 0 à 1) ; 0 s'il est illisible. */
function weight(parameters: string[]): number {
  const parameter = parameters.find((value) => /^\s*q\s*=/i.test(value));
  if (parameter === undefined) return 1;
  const value = parameter.slice(parameter.indexOf("=") + 1).trim();
  return /^(0(\.\d*)?|1(\.0*)?)$/.test(value) ? Number(value) : 0;
}

/**
 * Langue du site pour un en-tête Accept-Language : celle de plus grand poids parmi le français et
 * l'anglais, la première citée en cas d'égalité, le français par défaut.
 */
export function chooseLocale(acceptLanguage: string | null): Locale {
  let best: { locale: Locale; q: number } | undefined;
  for (const entry of (acceptLanguage ?? "").split(",")) {
    const [tag, ...parameters] = entry.split(";");
    const locale = tag.trim().toLowerCase().split("-")[0];
    const q = weight(parameters);
    if (isLocale(locale) && q > (best?.q ?? 0)) best = { locale, q };
  }
  return best?.locale ?? defaultLocale;
}
