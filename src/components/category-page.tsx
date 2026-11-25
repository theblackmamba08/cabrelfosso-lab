import { demosOf } from "@/demos/registry";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import type { PublishedCategory } from "@/i18n/published";
import { localizedPath } from "@/i18n/routes";
import { ExperimentCards } from "./experiment-cards";
import { PageTrail } from "./page-trail";
import { PageHero } from "./ui/page-hero";
import { Reveal } from "./ui/reveal";

/** Page d'une catégorie : Physique (cahier, annexe C.1), Informatique (annexe D.1). */
export function CategoryPage({ category, locale, t }: { category: PublishedCategory; locale: Locale; t: Messages }) {
  const { title, intro } = t[category];

  return (
    <article>
      <PageTrail
        label={t.nav.breadcrumb}
        steps={[
          { label: t.site.name, href: localizedPath("home", locale) },
          { label: title, href: localizedPath(category, locale) },
        ]}
      />
      <PageHero title={title} intro={intro} />
      <div className="mt-14">
        <Reveal>
          <ExperimentCards locale={locale} t={t} demos={demosOf(category)} headingLevel={2} />
        </Reveal>
      </div>
    </article>
  );
}
