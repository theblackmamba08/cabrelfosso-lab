import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr" }));

const { SiteHeader } = await import("./site-header");
const { SiteFooter } = await import("./site-footer");
const { WebAnalytics } = await import("./web-analytics");

/** Texte lu par un lecteur d'écran : balises retirées, espaces réduits. */
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const messages = { fr, en };

describe.each(["fr", "en"] as const)("en-tête (%s)", (locale) => {
  const t = messages[locale];
  const html = renderToStaticMarkup(<SiteHeader locale={locale} t={t} />);

  it("mène à l’accueil de la langue, avec un nom accessible complet", () => {
    const home = html.match(new RegExp(`<a [^>]*href="/${locale}"[^>]*data-home-link[^>]*>(.*?)</a>|<a [^>]*data-home-link[^>]*href="/${locale}"[^>]*>(.*?)</a>`));
    expect(text(home?.[1] ?? home?.[2] ?? "")).toBe(`${t.site.name} Cabrel FOSSO`);
    expect(home?.[0]).not.toContain("aria-label");
  });

  it("masque « Cabrel FOSSO » sous 480 px à la vue seulement", () => {
    const author = html.match(/<span class="([^"]*)">Cabrel FOSSO<\/span>/)?.[1].split(" ");
    expect(author).toEqual(expect.arrayContaining(["text-ink-muted", "sr-only", "min-[480px]:not-sr-only"]));
  });

  it("a le sélecteur de langue, le bouton de thème et le lien vers le portfolio de la langue", () => {
    expect(html).toContain(`aria-label="${t.site.languageSwitcher}"`);
    expect(html).toContain(`aria-label="${t.site.themeToggle}"`);
    const link = html.match(/<a [^>]*href="https:\/\/cabrelfosso\.com\/(fr|en)"[^>]*>(.*?)<\/a>/);
    expect(link?.[1]).toBe(locale);
    expect(link?.[2]).toBe("Portfolio");
  });

  it("n’a ni menu, ni boutons flottants, ni bandeau", () => {
    expect(html.match(/<nav/g)).toHaveLength(1);
    expect(html).not.toMatch(/<dialog|whatsapp|data-news|data-motion-toggle/i);
  });
});

describe.each(["fr", "en"] as const)("pied de page (%s)", (locale) => {
  const t = messages[locale];
  const html = renderToStaticMarkup(<SiteFooter locale={locale} t={t} />);
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map((m) => [m[1], m[2]]);

  it("a ses liens et ceux des licences", () => {
    expect(links).toEqual([
      [`https://cabrelfosso.com/${locale}`, t.footer.portfolio],
      ["https://github.com/theblackmamba08/cabrelfosso-lab", t.footer.code],
      [locale === "fr" ? "/fr/confidentialite" : "/en/privacy", t.footer.privacy],
      ["https://github.com/theblackmamba08/cabrelfosso-lab/blob/main/LICENSE", t.footer.codeLicense.link],
      [`https://creativecommons.org/licenses/by/4.0/deed.${locale}`, "CC BY 4.0"],
    ]);
    expect(html).toContain(`<nav aria-label="${t.footer.label}"`);
  });

  it("affiche les licences et les droits", () => {
    expect(text(html)).toContain(
      locale === "fr"
        ? "Code sous licence MIT · Textes et figures sous licence CC BY 4.0"
        : "Code under the MIT license · Text and figures under CC BY 4.0",
    );
    expect(text(html)).toContain(`© ${new Date().getFullYear()} Cabrel FOSSO`);
  });
});

describe("Cloudflare Web Analytics", () => {
  it("avec un jeton : l’extrait officiel, avec ce jeton", () => {
    const html = renderToStaticMarkup(<WebAnalytics token="jeton-de-test" />);
    expect(html).toMatch(/^<script [^>]*type="module"/);
    expect(html).toContain('src="https://static.cloudflareinsights.com/beacon.min.js"');
    const beacon = html.match(/data-cf-beacon="([^"]*)"/)?.[1].replace(/&quot;/g, '"');
    expect(JSON.parse(beacon ?? "")).toEqual({ token: "jeton-de-test" });
  });

  it("sans jeton : rien", () => {
    expect(renderToStaticMarkup(<WebAnalytics token={null} />)).toBe("");
  });
});
