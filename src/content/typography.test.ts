import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import fr from "@/i18n/messages/fr";

/** Toutes les chaînes d'un objet, avec leur chemin, pour des messages d'erreur lisibles. */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe("typographie française", () => {
  it.each(strings(fr, "fr"))("%s : espace insécable avant « : ; ! ? » et dans les guillemets", (_path, value) => {
    expect(value).not.toMatch(/ [:;!?»]/);
    expect(value).not.toMatch(/« /);
  });

  it.each(strings(fr, "fr"))("%s : apostrophe typographique", (_path, value) => {
    expect(value).not.toContain("'");
  });
});

describe("typographie anglaise", () => {
  it.each(strings(en, "en"))("%s : apostrophe et guillemets typographiques", (_path, value) => {
    expect(value).not.toMatch(/['"]/);
  });
});
