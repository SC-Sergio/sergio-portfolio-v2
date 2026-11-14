// Capturas del sitio: node scripts/screenshots.mjs <url> <carpeta>
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3200/";
const out = process.argv[3] ?? "docs/screenshots";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const shots = [
  { name: "desktop-1440", context: { viewport: { width: 1440, height: 900 } } },
  { name: "mobile-390", context: { ...devices["iPhone 13"] } },
];
for (const shot of shots) {
  const context = await browser.newContext(shot.context);
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" }); // capturas sin animaciones a medias
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${shot.name}-hero.png` });
  await page.screenshot({ path: `${out}/${shot.name}-full.png`, fullPage: true });
  await context.close();
}
// Hero desktop con WebGL (sin movimiento reducido)
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("[data-scene-ready='true']", { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/desktop-1440-hero-webgl.png` });
await browser.close();
console.log("ok");
