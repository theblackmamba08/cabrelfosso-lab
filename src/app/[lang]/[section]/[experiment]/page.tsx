import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentPage } from "@/components/experiment-page";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { pageMetadata } from "@/i18n/metadata";
import { experimentParams, findPage } from "@/i18n/published";

/** Seules les expériences publiées existent, chacune dans sa catégorie et sous le nom de sa langue. */
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLocale(params.lang) ? experimentParams(params.lang) : [];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]/[experiment]">): Promise<Metadata> {
  const { lang, section, experiment } = await params;
  const page = isLocale(lang) && findPage(lang, section, experiment);
  return page ? pageMetadata(page, lang, await getMessages(lang)) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/[section]/[experiment]">) {
  const { lang, section, experiment } = await params;
  if (!isLocale(lang)) notFound();
  const demo = findPage(lang, section, experiment)?.demo;
  if (!demo) notFound();
  return <ExperimentPage locale={lang} t={await getMessages(lang)} demo={demo} />;
}
