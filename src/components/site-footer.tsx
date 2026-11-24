import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { localizedPath } from "@/i18n/routes";
import { contentLicenseUrl, portfolioPage, repositoryUrl } from "@/lib/site";

const linkClassName = "text-ink-muted no-underline hover:text-accent hover:underline";

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  const { codeLicense, contentLicense } = t.footer;

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pt-10 pb-24 text-sm md:px-8 md:pb-10">
        <nav aria-label={t.footer.label}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={portfolioPage(locale)} className={linkClassName}>
                {t.footer.portfolio}
              </a>
            </li>
            <li>
              <a href={repositoryUrl} className={linkClassName}>
                {t.footer.code}
              </a>
            </li>
            <li>
              <Link href={localizedPath("privacy", locale)} className={linkClassName}>
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Liens au milieu d'une phrase : soulignés (WCAG 1.4.1). */}
        <p className="text-ink-muted">
          {codeLicense.before}
          <a href={`${repositoryUrl}/blob/main/LICENSE`} className="text-ink-muted underline hover:text-accent">
            {codeLicense.link}
          </a>
          {" · "}
          {contentLicense.before}
          <a href={contentLicenseUrl(locale)} className="text-ink-muted underline hover:text-accent">
            {contentLicense.link}
          </a>
        </p>
        <p className="text-ink-muted">
          © {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
