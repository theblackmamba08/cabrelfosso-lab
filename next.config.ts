import type { NextConfig } from "next";

/**
 * Site entièrement statique (cahier, section 4) : `next build` produit toutes les pages dans out/.
 * Ni headers, ni redirects, ni rewrites : l'export ne les prend pas en charge. En-têtes :
 * public/_headers ; redirection de la racine : worker/index.ts.
 * https://nextjs.org/docs/app/guides/static-exports
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
  experimental: {
    // Page 404 bilingue : la mise en page racine est sous [lang], il n'y en a pas d'autre.
    // https://nextjs.org/docs/app/api-reference/file-conventions/not-found
    globalNotFound: true,
  },
};

export default nextConfig;
