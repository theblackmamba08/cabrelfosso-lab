import { demosOf } from "@/demos/registry";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { localizedPath } from "@/i18n/routes";
import { portfolioPage } from "@/lib/site";
import { websiteLd } from "@/lib/seo/structured-data";
import { ExperimentCards } from "./experiment-cards";
import { JsonLd } from "./json-ld";
import { PageSection } from "./page-section";
import { ButtonLink } from "./ui/button";
import { Card } from "./ui/card";
import { PageHero } from "./ui/page-hero";
import { Reveal } from "./ui/reveal";
import { stagger } from "./ui/stagger";

/** Accueil du Labo (cahier, annexe B.2). */
export function HomePage({ locale, t }: { locale: Locale; t: Messages }) {
  const { home } = t;
  const colon = locale === "fr" ? " : " : ": ";

  return (
    <>
      <JsonLd things={[websiteLd(locale)]} />
      <PageHero
        size="display"
        eyebrow={home.eyebrow}
        title={
          <>
            {home.title.before}
            <span className="text-highlight">{home.title.highlight}</span>
          </>
        }
        intro={home.intro}
      />

      <div className="mt-20 grid gap-20 md:mt-28 md:gap-28">
        <PageSection id="titre-physique" title={home.physics.title}>
          <ExperimentCards locale={locale} t={t} demos={demosOf("physics")} headingLevel={3} />
          <p className="mt-8">
            <ButtonLink href={localizedPath("physics", locale)}>{home.physics.all}</ButtonLink>
          </p>
        </PageSection>

        <PageSection id="titre-comment" title={home.how.title}>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {Object.values(home.how.steps).map((step, i) => (
              <Card key={step.title} as="li" {...stagger(i)}>
                <h3 className="text-xl">{step.title}</h3>
                <p className="mt-3 text-ink-muted">{step.text}</p>
              </Card>
            ))}
          </ul>
        </PageSection>

        <PageSection id="titre-publics" title={home.audiences.title}>
          <ul className="grid max-w-prose list-disc gap-3 pl-5 marker:text-ink-muted">
            {Object.values(home.audiences.items).map((item) => (
              <li key={item.title}>
                <strong className="font-semibold">{item.title}</strong>
                {colon}
                {item.text}
              </li>
            ))}
          </ul>
        </PageSection>

        <Reveal>
          <div className="max-w-prose">
            <p>{home.signature.text}</p>
            <p className="mt-6">
              <ButtonLink href={portfolioPage(locale)} variant="primary">
                {home.signature.link}
              </ButtonLink>
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
