/**
 * Apparition au défilement, sans retarder l'affichage :
 * - rien n'est masqué avant la première mesure de l'IntersectionObserver, qui arrive après le
 *   premier affichage et ne force aucun recalcul de mise en page ;
 * - un élément déjà dans la fenêtre (ou au-dessus) à cette mesure n'est jamais masqué : le plus
 *   grand élément visible s'affiche dès le premier rendu, sans attendre JavaScript (LCP) ;
 * - un élément sous la ligne de flottaison reçoit `data-reveal-pending` (masqué par globals.css,
 *   hors de la vue), puis `data-revealed` quand il entre dans la fenêtre.
 * Sans IntersectionObserver, tout apparaît tout de suite. Renvoie de quoi arrêter l'observation.
 */
export function observeReveal(
  element: Element,
  Observer: typeof IntersectionObserver | undefined,
  viewportHeight: number,
): () => void {
  const reveal = () => {
    element.removeAttribute("data-reveal-pending");
    element.setAttribute("data-revealed", "");
  };
  if (!Observer) {
    reveal();
    return () => {};
  }
  let measured = false;
  const observer = new Observer(
    (entries) => {
      const first = !measured;
      measured = true;
      const shown = entries.some(
        (entry) => entry.isIntersecting || (first && entry.boundingClientRect.top < viewportHeight),
      );
      if (shown) {
        reveal();
        observer.disconnect();
      } else if (first) {
        element.setAttribute("data-reveal-pending", "");
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
