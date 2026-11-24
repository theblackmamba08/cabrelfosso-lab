"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { localizedPath, routeKeyFromPath } from "@/i18n/routes";

/**
 * Menu (cahier, section 5) : une entrée par catégorie publiée. Elle garde le style de page courante
 * sur ses expériences, mais `aria-current` ne vaut que pour la page de catégorie elle-même.
 */
export function MainNav({ locale, labels }: { locale: Locale; labels: { label: string; physics: string } }) {
  const pathname = usePathname();
  const items = [{ key: "physics", label: labels.physics }] as const;

  return (
    <nav aria-label={labels.label}>
      <ul className="flex flex-wrap gap-1">
        {items.map(({ key, label }) => {
          const href = localizedPath(key, locale);
          const active = routeKeyFromPath(pathname, locale) === key;
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`block rounded-full px-3 py-1.5 no-underline transition-colors ${
                  active ? "bg-accent-soft text-ink" : "text-ink-muted hover:bg-accent-soft hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
