import { breadcrumbLd } from "@/lib/seo/structured-data";
import { Breadcrumb } from "./breadcrumb";
import { JsonLd } from "./json-ld";

/** Fil d'Ariane visible et ses données structurées `BreadcrumbList`, à partir des mêmes étapes. */
export function PageTrail({
  label,
  steps,
}: {
  label: string;
  steps: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <>
      <JsonLd things={[breadcrumbLd(steps)]} />
      <div className="pt-6">
        <Breadcrumb label={label} items={steps} />
      </div>
    </>
  );
}
