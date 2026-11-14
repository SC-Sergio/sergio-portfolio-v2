/**
 * URL pública canónica. En Vercel se define NEXT_PUBLIC_SITE_URL para Production;
 * si falta, se usa la URL de producción de Vercel para que canonical, sitemap y
 * Open Graph nunca apunten a localhost en un despliegue.
 */
const PRODUCTION_FALLBACK = "https://sergio-portfolio-v2-roan.vercel.app";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production" ? PRODUCTION_FALLBACK : undefined) ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_FALLBACK : "http://localhost:3000")
).replace(/\/$/, "");
