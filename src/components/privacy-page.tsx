import { lastUpdated, privacyLastUpdated } from "@/content/privacy";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { isAnalyticsActive, webAnalyticsToken } from "@/lib/analytics";
import { portfolioPage } from "@/lib/site";
import { Card } from "./ui/card";
import { PageHero } from "./ui/page-hero";
import { Reveal } from "./ui/reveal";

/** Une rubrique : le terme, puis le texte. */
function Entry({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-heading text-xl font-semibold tracking-tight">{term}</dt>
      {/* Le cahier donne ces phrases à la suite de leur terme : majuscule à l'affichage seulement. */}
      <dd className="mt-2 first-letter:uppercase">{children}</dd>
    </div>
  );
}

/**
 * Page Confidentialité (cahier, annexe B.3). Le paragraphe « Mesure d'audience » n'existe que si la
 * mesure est active (section 6) : la page ne décrit jamais une mesure qui n'existe pas.
 */
export function PrivacyPage({
  locale,
  t,
  analyticsToken = webAnalyticsToken,
}: {
  locale: Locale;
  t: Messages;
  analyticsToken?: string | null;
}) {
  const { controller, entries, updated, title, intro } = t.privacy;

  const { analytics, ...others } = entries;
  const shown = [...(isAnalyticsActive(analyticsToken) ? [analytics] : []), ...Object.values(others)];

  return (
    <article>
      <PageHero title={title} intro={intro} />

      {/* Carte de lecture : largeur de ligne limitée. */}
      <Reveal>
        <Card lift={false} className="mt-14 max-w-prose md:p-10">
          <dl className="grid gap-8">
            <Entry term={controller.term}>
              {controller.text.before}
              <a href={portfolioPage(locale, "/contact")} className="underline">
                {controller.text.link}
              </a>
              {controller.text.after}
            </Entry>
            {shown.map((entry) => (
              <Entry key={entry.term} term={entry.term}>
                {entry.text}
              </Entry>
            ))}
            <Entry term={updated.term}>
              <time dateTime={privacyLastUpdated}>{lastUpdated(locale)}</time>
            </Entry>
          </dl>
        </Card>
      </Reveal>
    </article>
  );
}
