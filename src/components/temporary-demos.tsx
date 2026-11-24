import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { portfolioPage } from "@/lib/site";
import { Card } from "./ui/card";
import { Reveal } from "./ui/reveal";

/** Bloc provisoire de l'accueil. Retiré à l’étape L2 (cahier, section 8). */
export function TemporaryDemos({ locale, t }: { locale: Locale; t: Messages }) {
  const { temporary } = t.home;

  return (
    <section aria-labelledby="titre-provisoire">
      <Reveal>
        <Card className="md:p-10">
          <h2 id="titre-provisoire" className="text-2xl md:text-3xl">
            {temporary.title}
          </h2>
          <p className="mt-4 max-w-prose text-ink-muted">{temporary.text}</p>
          <p className="mt-4">
            <a href={portfolioPage(locale, "/demos")}>{temporary.link}</a>
          </p>
        </Card>
      </Reveal>
    </section>
  );
}
