import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";

const pathname = vi.hoisted(() => ({ current: "/fr" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

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

  it("masque « Cabrel FOSSO » à la vue seulement sur les petits écrans", () => {
    const author = html.match(/<span class="([^"]*)">Cabrel FOSSO<\/span>/)?.[1].split(" ");
    expect(author).toEqual(expect.arrayContaining(["text-ink-muted", "sr-only", "sm:not-sr-only"]));
  });

  it("a le sélecteur de langue, le bouton de thème et le lien vers le portfolio de la langue", () => {
    expect(html).toContain(`aria-label="${t.site.languageSwitcher}"`);
    expect(html).toContain(`aria-label="${t.site.themeToggle}"`);
    const link = html.match(/<a [^>]*href="https:\/\/cabrelfosso\.com\/(fr|en)"[^>]*>(.*?)<\/a>/);
    expect(link?.[1]).toBe(locale);
    expect(link?.[2]).toBe("Portfolio");
  });

  it("n’a que deux zones de navigation (menu, langue), sans bouton flottant ni bandeau", () => {
    expect(html.match(/<nav/g)).toHaveLength(2);
    expect(html).not.toMatch(/<dialog|whatsapp|data-news|data-motion-toggle/i);
  });
});

describe.each([
  ["fr", 0, "/fr/physique", "/fr/physique/pendule-de-newton"],
  ["en", 0, "/en/physics", "/en/physics/newtons-cradle"],
  ["fr", 1, "/fr/informatique", "/fr/informatique/transition-de-phase-3-sat"],
  ["en", 1, "/en/computing", "/en/computing/3-sat-phase-transition"],
] as const)("menu (%s, entrée %i)", (locale, index, category, experiment) => {
  const t = messages[locale];
  const entry = (path: string) => {
    pathname.current = path;
    const html = renderToStaticMarkup(<SiteHeader locale={locale} t={t} />);
    pathname.current = "/fr";
    const nav = html.match(new RegExp(`<nav aria-label="${t.nav.label}"[^>]*>(.*?)</nav>`))?.[1] ?? "";
    expect([...nav.matchAll(/<a [^>]*>(.*?)<\/a>/g)].map((m) => m[1])).toEqual([t.nav.physics, t.nav.computing]);
    const all = nav.match(/<a [^>]*>/g) ?? [];
    const link = all[index] ?? "";
    const other = all[1 - index];
    expect(other).not.toContain('aria-current');
    expect(other).not.toContain("bg-accent-soft text-ink\"");
    expect(link).toContain(`href="${category}"`);
    return { current: link.includes('aria-current="page"'), active: link.includes("bg-accent-soft text-ink") };
  };

  it("est un lien, sans style de page courante sur l’accueil", () => {
    expect(entry(`/${locale}`)).toEqual({ current: false, active: false });
  });

  it("est la page courante sur la page de sa catégorie", () => {
    expect(entry(category)).toEqual({ current: true, active: true });
  });

  it("garde le style, sans aria-current, sur une expérience", () => {
    expect(entry(experiment)).toEqual({ current: false, active: true });
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
