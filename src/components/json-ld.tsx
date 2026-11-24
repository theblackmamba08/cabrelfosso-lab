import { serializeJsonLd } from "@/lib/seo/structured-data";

/** Données structurées d'une page, dans une balise <script type="application/ld+json">. */
export function JsonLd({ things }: { things: Parameters<typeof serializeJsonLd>[0] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(things) }} />;
}
