import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, ButtonLink, buttonClassName } from "./button";

describe("buttonClassName", () => {
  it.each(["primary", "outline", "ghost"] as const)("%s : bouton pilule, cible tactile de 44 px", (variant) => {
    const classes = buttonClassName(variant).split(" ");
    expect(classes).toContain("rounded-full");
    expect(classes).toContain("min-h-11");
  });

  it("primary a le fond accent, outline une bordure, ghost ni fond ni bordure visible", () => {
    const classes = (variant: "primary" | "outline" | "ghost") => buttonClassName(variant).split(" ");
    expect(classes("primary")).toEqual(expect.arrayContaining(["bg-accent", "text-on-accent"]));
    expect(classes("outline")).toContain("border-line");
    expect(classes("ghost")).not.toContain("bg-accent");
    expect(classes("ghost")).toContain("border-transparent");
  });
});

describe("ButtonLink", () => {
  it("rend un lien, en contour par défaut", () => {
    const html = renderToStaticMarkup(<ButtonLink href="/fr/contact">Me contacter</ButtonLink>);
    expect(html).toMatch(/^<a [^>]*href="\/fr\/contact"/);
    expect(html).toContain(buttonClassName("outline"));
    expect(html).toContain(">Me contacter</a>");
  });

  it("accepte les variantes et transmet les attributs (lien externe, téléchargement)", () => {
    const external = renderToStaticMarkup(
      <ButtonLink href="https://example.org" variant="primary" target="_blank" rel="noopener noreferrer">
        x
      </ButtonLink>,
    );
    expect(external).toContain(buttonClassName("primary"));
    expect(external).toContain('target="_blank"');
    expect(external).toContain('rel="noopener noreferrer"');
    const file = renderToStaticMarkup(
      <ButtonLink href="/cv/cv.pdf" variant="ghost" download>
        CV
      </ButtonLink>,
    );
    expect(file).toContain('href="/cv/cv.pdf"');
    expect(file).toContain("download");
  });
});

describe("Button", () => {
  it("rend un vrai bouton, de type button par défaut", () => {
    const html = renderToStaticMarkup(<Button variant="ghost">Fermer</Button>);
    expect(html).toMatch(/^<button [^>]*type="button"/);
    expect(html).toContain(buttonClassName("ghost"));
  });

  it("accepte un type submit et des classes en plus", () => {
    const html = renderToStaticMarkup(
      <Button type="submit" variant="primary" className="w-full">
        Envoyer
      </Button>,
    );
    expect(html).toContain('type="submit"');
    expect(html).toContain(`${buttonClassName("primary")} w-full`);
  });
});
