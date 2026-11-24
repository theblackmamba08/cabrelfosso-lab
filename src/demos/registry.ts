import type { Locale } from "../i18n/config";

/** Catégories d'expériences (cahier, section 2) : aussi des pages de `src/i18n/routes.ts`. */
export type Category = "physics" | "computing";

type DemoEntry = { id: string; category: Category; slugs: Record<Locale, string>; published: boolean };

/**
 * Registre des expériences : identifiant, catégorie, nom d'adresse par langue (cahier, section 2),
 * état. Une expérience n'est publiée que lorsque sa page est prête : c'est ce qui l'ajoute aux
 * cartes, au sitemap et aux images de partage. Chemins relatifs : les tests d'intégration chargent
 * ce fichier sans l'alias `@/`.
 */
export const demos = [
  { id: "projectile", category: "physics", slugs: { fr: "projectile", en: "projectile" }, published: true },
  {
    id: "newtons-cradle",
    category: "physics",
    slugs: { fr: "pendule-de-newton", en: "newtons-cradle" },
    published: true,
  },
] as const satisfies readonly DemoEntry[];

export type Demo = (typeof demos)[number];
export type PublishedDemo = Extract<Demo, { published: true }>;

/** Expériences publiées d'une catégorie, dans l'ordre du registre. */
export function demosOf<T extends DemoEntry = PublishedDemo>(
  category: Category,
  list: readonly T[] = demos as readonly DemoEntry[] as readonly T[],
): T[] {
  return list.filter((demo) => demo.published && demo.category === category);
}

export const publishedDemos = demos.filter((demo): demo is PublishedDemo => demo.published);

/** Expérience publiée correspondant à un nom d'adresse dans une langue. */
export function findPublishedDemo(locale: Locale, slug: string): PublishedDemo | undefined {
  return publishedDemos.find((demo) => demo.slugs[locale] === slug);
}
