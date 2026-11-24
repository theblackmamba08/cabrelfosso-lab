import { PageSection } from "@/components/page-section";
import { Card } from "@/components/ui/card";
import type { Messages } from "@/i18n/messages/fr";
import { MathText } from "../projectile/math-text";

/** Phrase avec ses formules : ce qui est entre deux `$` s'écrit comme une formule. */
export function LawText({ source }: { source: string }) {
  return source.split("$").map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-mono text-sm whitespace-nowrap">
        <MathText source={part} />
      </span>
    ) : (
      part
    ),
  );
}

export function CradleLaws({ laws }: { laws: Messages["demos"]["newtons-cradle"]["laws"] }) {
  return (
    <PageSection id="lois" title={laws.title}>
      <Card lift={false} className="max-w-3xl md:p-8">
        <dl className="grid gap-6">
          {Object.values(laws.items).map(({ term, lines }) => (
            <div key={term}>
              <dt className="font-semibold">{term}</dt>
              <dd className="mt-1">
                {lines.map((line) => (
                  // Le cahier écrit « la fraction » à la suite du libellé.
                  <p key={line} className={line.startsWith("$") ? undefined : "first-letter:uppercase"}>
                    <LawText source={line} />
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </PageSection>
  );
}
