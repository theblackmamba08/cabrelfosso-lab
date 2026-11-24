import { demosOf } from "@/demos/registry";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { localizedPath } from "@/i18n/routes";
import { ExperimentCards } from "./experiment-cards";
import { PageTrail } from "./page-trail";
import { PageHero } from "./ui/page-hero";
import { Reveal } from "./ui/reveal";

/** Page Physique (cahier, annexe C.1). */
export function PhysicsPage({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <article>
      <PageTrail
        label={t.nav.breadcrumb}
        steps={[
          { label: t.site.name, href: localizedPath("home", locale) },
          { label: t.physics.title, href: localizedPath("physics", locale) },
        ]}
      />
      <PageHero title={t.physics.title} intro={t.physics.intro} />
      <div className="mt-14">
        <Reveal>
          <ExperimentCards locale={locale} t={t} demos={demosOf("physics")} headingLevel={2} />
        </Reveal>
      </div>
    </article>
  );
}
