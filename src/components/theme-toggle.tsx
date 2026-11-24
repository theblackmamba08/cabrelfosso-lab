"use client";

import { nextTheme, resolveTheme, THEME_STORAGE_KEY } from "@/design/theme";

/**
 * Bouton clair/sombre. L'état vit sur <html data-theme>, posé avant l'affichage
 * par le script de <head> : le rendu serveur et le rendu navigateur sont identiques,
 * l'icône affichée est choisie en CSS.
 */
export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = nextTheme(resolveTheme(root.dataset.theme ?? null));
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage bloqué (navigation privée) : le choix vaut pour cette page seulement.
    }
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-theme-toggle=""
      onClick={toggle}
      className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-accent-soft"
    >
      {/* Soleil : affiché en thème sombre (pour revenir au clair). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Lune : affichée en thème clair. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
