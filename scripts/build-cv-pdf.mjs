// Genera el PDF del CV (A4) a partir de la ruta /cv con los estilos de impresión.
// Uso: node scripts/build-cv-pdf.mjs <url-base> <salida.pdf>
// Ejemplo: node scripts/build-cv-pdf.mjs http://localhost:3200 public/sergio-carey-cv.pdf
// No publicar el PDF hasta que el autor confirme los datos marcados como pendientes
// en docs/PORTFOLIO_V3_EXECUTION.md.
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const output = process.argv[3] ?? "sergio-carey-cv.pdf";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/cv`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: output,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});
await browser.close();
console.log(`PDF generado: ${output}`);
