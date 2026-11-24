import Link from "next/link";
import { DemoFigure } from "@/demos/demo-figure";
import type { PublishedDemo } from "@/demos/registry";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/fr";
import { localizedPath } from "@/i18n/routes";
import { Card } from "./ui/card";
import { stagger } from "./ui/stagger";

/** Cartes d'expériences (accueil et page de catégorie), dans l'ordre du registre. */
export function ExperimentCards({
  locale,
  t,
  demos,
  headingLevel,
}: {
  locale: Locale;
  t: Messages;
  demos: readonly PublishedDemo[];
  headingLevel: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {demos.map((demo, i) => {
        const { card } = t.demos[demo.id];
        return (
          <Card key={demo.id} as="li" className="flex flex-col md:p-8" {...stagger(i)}>
            <div className="rounded-2xl border border-line bg-paper/60 px-6 py-4">
              <DemoFigure id={demo.id} />
            </div>
            <Heading id={`experience-${demo.id}`} className="mt-6 text-xl md:text-2xl">
              {card.title}
            </Heading>
            <p className="mt-3 text-ink-muted">{card.text}</p>
            <p className="mt-auto pt-5">
              {/* « Ouvrir l'expérience » se répète : le titre de la carte complète le nom du lien. */}
              <Link
                id={`ouvrir-${demo.id}`}
                href={localizedPath(demo.category, locale, demo.slugs)}
                aria-labelledby={`ouvrir-${demo.id} experience-${demo.id}`}
              >
                {t.home.physics.open}
              </Link>
            </p>
          </Card>
        );
      })}
    </ul>
  );
}
