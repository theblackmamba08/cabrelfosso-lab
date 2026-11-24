"use client";

import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { pathInLocale } from "@/i18n/routes";

/**
 * Sélecteur de langue. Liens ordinaires <a>, jamais <Link> : changer de langue remonte la mise en
 * page racine [lang], et une navigation côté client ne relancerait pas le script de <head>
 * (classe js, thème). Le navigateur recharge donc la page dans l'autre langue.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1 text-sm">
        {locales.map((target) => (
          <li key={target}>
            {target === locale ? (
              <span
                aria-current="true"
                aria-label={localeNames[target]}
                className="block rounded-full px-2.5 py-1 font-semibold text-ink"
              >
                {target.toUpperCase()}
              </span>
            ) : (
              <a
                href={pathInLocale(pathname, locale, target)}
                hrefLang={target}
                lang={target}
                aria-label={localeNames[target]}
                className="block rounded-full px-2.5 py-1 text-ink-muted no-underline hover:bg-accent-soft hover:text-ink"
              >
                {target.toUpperCase()}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
