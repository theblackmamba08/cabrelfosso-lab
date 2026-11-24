import { CradleLaws } from "@/demos/newtons-cradle/cradle-laws";
import { NewtonsCradleDemoLazy } from "@/demos/newtons-cradle/newtons-cradle-demo-lazy";
import { ProjectileDemoLazy } from "@/demos/projectile/projectile-demo-lazy";
import type { PublishedDemo } from "@/demos/registry";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { localizedPath } from "@/i18n/routes";
import { portfolioPage } from "@/lib/site";
import { PageSection } from "./page-section";
import { PageTrail } from "./page-trail";
import { ButtonLink } from "./ui/button";
import { Card } from "./ui/card";
import { PageHero } from "./ui/page-hero";

/** Simulation de chaque expérience : son code n'est chargé que sur sa page (import dynamique). */
function Simulation({ demo, locale, t }: { demo: PublishedDemo; locale: Locale; t: Messages }) {
  if (demo.id === "projectile") {
    const { controls, buttons, results, legend, summary, equations } = t.demos.projectile;
    return <ProjectileDemoLazy locale={locale} texts={{ controls, buttons, results, legend, summary, equations }} />;
  }
  const { controls, fixed, buttons, readings, summary } = t.demos["newtons-cradle"];
  return <NewtonsCradleDemoLazy locale={locale} texts={{ controls, fixed, buttons, readings, summary }} />;
}

/** Texte d'une source : ce qui est entre deux `*` est un titre d'ouvrage, en italique. */
function SourceText({ text }: { text: string }) {
  return text.split("*").map((part, index) => (index % 2 === 1 ? <i key={index}>{part}</i> : part));
}

/**
 * Page d'une expérience (cahier, section 3, gabarit ; textes de l'annexe C).
 * TODO(Jospin): classe concernée. La mention « Au programme de… » reste absente tant qu'elle manque.
 */
export function ExperimentPage({ locale, t, demo }: { locale: Locale; t: Messages; demo: PublishedDemo }) {
  const { title, intro, assumptions, tryThis, sources } = t.demos[demo.id];

  return (
    <article>
      <PageTrail
        label={t.nav.breadcrumb}
        steps={[
          { label: t.site.name, href: localizedPath("home", locale) },
          { label: t[demo.category].title, href: localizedPath(demo.category, locale) },
          { label: title, href: localizedPath(demo.category, locale, demo.slugs) },
        ]}
      />
      <PageHero title={title} intro={intro} />

      <Simulation demo={demo} locale={locale} t={t} />

      <div className="mt-20 grid gap-20">
        {demo.id === "newtons-cradle" && <CradleLaws laws={t.demos["newtons-cradle"].laws} />}

        <PageSection id="hypotheses" title={assumptions.title}>
          <Card className="max-w-3xl md:p-8">
            <p>{assumptions.text}</p>
          </Card>
        </PageSection>

        <PageSection id="a-essayer" title={tryThis.title}>
          <Card className="max-w-3xl md:p-8">
            <ol className="grid list-decimal gap-5 pl-5 marker:text-ink-muted">
              {Object.values(tryThis.items).map(({ question, answer }) => (
                <li key={question}>
                  <p>{question}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-accent">{tryThis.show}</summary>
                    {/* Le cahier écrit l'explication à la suite de « Explication : ». */}
                    <p className="mt-2 text-ink-muted first-letter:uppercase">{answer}</p>
                  </details>
                </li>
              ))}
            </ol>
          </Card>
        </PageSection>

        <PageSection id="pour-aller-plus-loin" title={t.experiment.sources}>
          <ul className="grid max-w-prose list-disc gap-3 pl-5 marker:text-ink-muted">
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} hrefLang={source.english ? "en" : locale}>
                  <SourceText text={source.text} />
                </a>
                {source.english && t.experiment.inEnglish && ` ${t.experiment.inEnglish}`}
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <ButtonLink href={portfolioPage(locale)}>{t.experiment.portfolio}</ButtonLink>
          </p>
        </PageSection>
      </div>
    </article>
  );
}
