import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WebAnalytics } from "@/components/web-analytics";
import { fontVariables } from "@/design/fonts";
import { themeInitScript } from "@/design/theme";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { webAnalyticsToken } from "@/lib/analytics";
import { siteUrl } from "@/lib/site";
import "../globals.css";

/** Seules les langues listées existent : toute autre valeur donne une 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: siteUrl,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  // Fond du thème sombre, thème par défaut.
  themeColor: "#060A14",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getMessages(lang);

  return (
    // data-theme est posé par le script ci-dessous avant l'affichage : React doit l'ignorer.
    <html lang={htmlLang[lang]} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <a
          href="#contenu"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-accent px-4 py-2 whitespace-nowrap text-on-accent no-underline focus:translate-y-0"
        >
          {t.site.skipToContent}
        </a>
        <SiteHeader locale={lang} t={t} />
        <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-page flex-1 px-4 pb-20 md:px-8">
          {children}
        </main>
        <SiteFooter locale={lang} t={t} />
        <WebAnalytics token={webAnalyticsToken} />
      </body>
    </html>
  );
}
