import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const pathname = vi.hoisted(() => ({ current: "/fr/confidentialite" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const { LanguageSwitcher } = await import("./language-switcher");

type Props = { hrefLang?: string; children?: ReactNode };

/** Éléments de l'arbre rendu par le composant (sans exécuter les composants enfants). */
function elements(node: ReactNode): ReactElement<Props>[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<Props>(node)) return [];
  return [node, ...elements(node.props.children)];
}

describe("LanguageSwitcher", () => {
  // Bug C1 : un <Link> de Next.js fait une navigation côté client (preventDefault sur le clic),
  // qui remonte la mise en page racine [lang] sans relancer le script de <head> : <html> perd
  // la classe js, le thème et les classes de polices. Le lien doit être une balise <a> ordinaire,
  // dont le clic n'est jamais intercepté : le navigateur recharge la page dans l'autre langue.
  it("change de langue par un lien ordinaire <a>, pas par un <Link> de Next.js", () => {
    const tree = LanguageSwitcher({ locale: "fr", label: "Langue" });
    const links = elements(tree).filter((element) => element.props.hrefLang !== undefined);
    expect(links).toHaveLength(1);
    expect(links[0].type).toBe("a");
  });

  it("garde l'adresse de la même page dans l'autre langue et ses attributs", () => {
    pathname.current = "/fr/confidentialite";
    const html = renderToStaticMarkup(<LanguageSwitcher locale="fr" label="Langue" />);
    expect(html).toMatch(/<a [^>]*href="\/en\/privacy"/);
    expect(html).toContain('hrefLang="en"');
    expect(html).toContain('lang="en"');
    expect(html).toContain('aria-label="English"');
    expect(html).toContain("text-ink-muted no-underline");
    expect(html).toContain('aria-current="true"');
  });
});
