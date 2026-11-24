/* eslint-disable @next/next/no-html-link-for-pages -- liens <a> voulus : voir GlobalNotFound. */
import type { Metadata } from "next";
import { WebAnalytics } from "@/components/web-analytics";
import { buttonClassName } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { fontVariables } from "@/design/fonts";
import { themeInitScript } from "@/design/theme";
import fr from "@/i18n/messages/fr";
import en from "@/i18n/messages/en";
import { webAnalyticsToken } from "@/lib/analytics";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: `404 — ${fr.notFound.title} / ${en.notFound.title}`,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }] },
};

/**
 * Page 404 de toutes les adresses inconnues (out/404.html) : elle ne connaît pas la langue du
 * visiteur, elle est donc bilingue. Next.js y ajoute lui-même la balise noindex. Liens ordinaires
 * <a> : la mise en page racine change, et le script de <head> doit être relancé.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <main className="mx-auto w-full max-w-page px-4 pt-8 pb-20 md:px-8">
          <PageHero title={fr.notFound.title} intro={fr.notFound.body}>
            <a href="/fr" className={buttonClassName("primary")}>
              {fr.notFound.backHome}
            </a>
          </PageHero>
          <div lang="en" className="mt-14 max-w-3xl border-t border-line pt-10">
            <h2 className="text-2xl md:text-3xl">{en.notFound.title}</h2>
            <p className="mt-4 text-lg text-ink-muted">{en.notFound.body}</p>
            <p className="mt-6">
              <a href="/en" className={buttonClassName("outline")}>{en.notFound.backHome}</a>
            </p>
          </div>
        </main>
        <WebAnalytics token={webAnalyticsToken} />
      </body>
    </html>
  );
}
