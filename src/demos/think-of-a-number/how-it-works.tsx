import { PageSection } from "@/components/page-section";
import { Card } from "@/components/ui/card";
import type { Messages } from "@/i18n/messages/fr";
import { LawText } from "../newtons-cradle/cradle-laws";

/** « Comment fait l'ordinateur ? » */
export function HowItWorks({ how }: { how: Messages["demos"]["think-of-a-number"]["how"] }) {
  return (
    <PageSection id="methode" title={how.title}>
      <Card lift={false} className="max-w-3xl md:p-8">
        <ul className="grid list-disc gap-3 pl-5 marker:text-ink-muted">
          {how.items.map((item) => (
            <li key={item}>
              <LawText source={item} />
            </li>
          ))}
        </ul>
      </Card>
    </PageSection>
  );
}
