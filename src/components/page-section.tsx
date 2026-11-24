import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

/** Section de page : titre en SectionHeading, contenu, le tout apparaissant au défilement. */
export function PageSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <Reveal>
        <SectionHeading id={id}>{title}</SectionHeading>
        <div className="mt-6">{children}</div>
      </Reveal>
    </section>
  );
}
