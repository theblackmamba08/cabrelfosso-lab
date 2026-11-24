import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

/**
 * Fil d'Ariane (cahier, section 5) : liste ordonnée dans un nav nommé. Les étapes
 * précédentes sont des liens ; la dernière est la page courante, sans lien, avec aria-current.
 * Le séparateur « › » est décoratif : les lecteurs d'écran annoncent déjà une liste.
 */
export function Breadcrumb({ label, items }: { label: string; items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label={label} data-breadcrumb="">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink-muted/70">
                  ›
                </span>
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="text-ink-muted underline-offset-4 hover:text-accent">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
