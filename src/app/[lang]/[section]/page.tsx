import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { PrivacyPage } from "@/components/privacy-page";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages, type Messages } from "@/i18n/messages";
import { pageMetadata } from "@/i18n/metadata";
import { publishedSection, sectionParams, type PublishedSection } from "@/i18n/published";

/** Seules les pages publiées existent, chacune sous le nom d'adresse de sa langue. */
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLocale(params.lang) ? sectionParams(params.lang) : [];
}

/** Contenu de chaque page publiée ; une page de catégorie s'ajoute ici (étape L2). */
const pages: Record<PublishedSection, ComponentType<{ locale: Locale; t: Messages }>> = {
  privacy: PrivacyPage,
};

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]">): Promise<Metadata> {
  const { lang, section } = await params;
  const page = isLocale(lang) && publishedSection(lang, section);
  return page ? pageMetadata(page, lang, await getMessages(lang)) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/[section]">) {
  const { lang, section } = await params;
  if (!isLocale(lang)) notFound();
  const page = publishedSection(lang, section);
  if (!page) notFound();
  const Content = pages[page];
  return <Content locale={lang} t={await getMessages(lang)} />;
}
