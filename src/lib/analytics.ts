/**
 * Jeton public du site Cloudflare Web Analytics de lab.cabrelfosso.com (valeur `token` de
 * l'attribut data-cf-beacon). `null` : aucun extrait n'est ajouté aux pages.
 * TODO(Jospin): jeton Web Analytics
 */
export const webAnalyticsToken: string | null = null;

/**
 * Mesure active : condition unique de l'extrait (web-analytics.tsx) et du paragraphe « Mesure
 * d'audience » de la page Confidentialité, qui apparaissent donc ensemble ou pas du tout.
 */
export const isAnalyticsActive = (token: string | null): token is string => token !== null;
