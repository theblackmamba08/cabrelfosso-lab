import { PageSection } from "@/components/page-section";
import { Card } from "@/components/ui/card";
import type { Messages } from "@/i18n/messages/fr";
import { RichText } from "./rich-text";

type Texts = Pick<Messages["demos"]["three-sat"], "problem" | "threshold" | "complexity">;

function Paragraphs({ items }: { items: readonly string[] }) {
  return items.map((item) => (
    <p key={item}>
      <RichText text={item} />
    </p>
  ));
}

/** « Le problème et l'algorithme », « Que sait-on du seuil ? », « P, NP et cette expérience ». */
export function ThreeSatTheory({ problem, threshold, complexity }: Texts) {
  return (
    <>
      <PageSection id="probleme" title={problem.title}>
        <Card lift={false} className="max-w-3xl md:p-8">
          <div className="grid gap-5">
            <Paragraphs items={problem.paragraphs} />
            <div>
              <p>
                <RichText text={problem.solver} />
              </p>
              <ol data-solver-steps="" className="mt-2 grid list-decimal gap-2 pl-6 marker:text-ink-muted">
                {problem.solverSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <Paragraphs items={problem.after} />
          </div>
        </Card>
      </PageSection>

      {[
        { id: "seuil", ...threshold },
        { id: "p-np", ...complexity },
      ].map(({ id, title, items }) => (
        <PageSection key={id} id={id} title={title}>
          <ul className="grid max-w-prose list-disc gap-3 pl-5 marker:text-ink-muted">
            {items.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        </PageSection>
      ))}
    </>
  );
}
