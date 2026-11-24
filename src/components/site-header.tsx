import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { localizedPath } from "@/i18n/routes";
import { portfolioPage } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { ButtonLink } from "./ui/button";

/**
 * Barre flottante (cahier, section 5) : collante, détachée des bords, en verre dépoli, sur une
 * ligne de 360 à 1920 px. Pas de menu tant qu'aucune catégorie n'est publiée.
 */
export function SiteHeader({ locale, t }: { locale: Locale; t: Messages }) {
  // Fondu du fond de page au-dessus de la barre : le texte qui défile ne dépasse pas en haut.
  return (
    <header className="sticky top-0 z-40 bg-linear-to-b from-paper from-25% to-transparent px-3 pt-3 md:px-6">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-2 gap-y-2 rounded-[1.75rem] border border-line/80 bg-surface-raised/90 px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-md min-[480px]:gap-x-4 min-[480px]:px-4 md:px-5">
        <Link
          href={localizedPath("home", locale)}
          data-home-link=""
          className="flex items-baseline gap-x-2 font-heading text-lg font-semibold tracking-tight whitespace-nowrap text-ink no-underline"
        >
          <span>{t.site.name}</span>{" "}
          <span className="text-base font-medium text-ink-muted sr-only min-[480px]:not-sr-only">{t.site.author}</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher locale={locale} label={t.site.languageSwitcher} />
          <ThemeToggle label={t.site.themeToggle} />
          {/* Pilule plus étroite sur les petits écrans : la barre tient sur une ligne à 360 px. */}
          <span className="max-[479px]:[&>a]:px-3 max-[479px]:[&>a]:text-sm min-[480px]:ml-2">
            <ButtonLink href={portfolioPage(locale)}>{t.header.portfolio}</ButtonLink>
          </span>
        </div>
      </div>
    </header>
  );
}
