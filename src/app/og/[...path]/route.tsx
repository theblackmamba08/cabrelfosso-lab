import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { pageTexts, shareImagePath } from "@/i18n/metadata";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";
import { publishedPages } from "@/i18n/published";
import { shareImage } from "@/lib/og/share-image";

/*
 * Images de partage (Open Graph, Twitter), une par page publiée et par langue, à l'adresse
 * /og/<adresse publique de la page>.png. Toutes sont générées à la construction.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const messages = { fr, en };
const images = new Map(
  locales.flatMap((locale) =>
    publishedPages.map((page) => [
      shareImagePath(page, locale),
      { locale, title: pageTexts(page, messages[locale]).heading },
    ]),
  ),
);

export function generateStaticParams() {
  return [...images.keys()].map((path) => ({ path: path.split("/").slice(2) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[...path]">) {
  const { path } = await params;
  const image = images.get(`/og/${path.join("/")}`);
  if (!image) notFound();
  return shareImage({ title: image.title, lang: image.locale });
}
