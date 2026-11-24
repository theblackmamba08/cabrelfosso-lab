export type Theme = "light" | "dark";

/** Clé du choix du visiteur dans le stockage du navigateur. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Thème à appliquer : le choix enregistré s'il est valide, sinon le thème sombre
 * (thème par défaut, section 5 du cahier). La préférence du système n'est pas lue.
 */
export function resolveTheme(stored: string | null): Theme {
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

/**
 * Script exécuté dans <head> avant l'affichage, pour éviter un éclair de mauvais thème.
 * Il reprend la logique de resolveTheme, en JavaScript autonome, et pose la classe `js`
 * sur <html> : les styles qui masquent quelque chose en attendant JavaScript (apparition
 * au défilement) ne s'appliquent qu'avec elle.
 */
export const themeInitScript = `(function(){var d=document.documentElement,s=null;d.classList.add("js");try{s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}d.dataset.theme=(s==="light"||s==="dark")?s:"dark"})()`;
