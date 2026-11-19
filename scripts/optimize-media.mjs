// Convierte una captura a WebP optimizado para public/media.
// Uso: node scripts/optimize-media.mjs <entrada> <salida.webp> [--crop-top=N] [--width=1600] [--quality=80]
// Imprime ancho, alto y bytes del resultado para registrarlos en data/media.ts.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error("Uso: node scripts/optimize-media.mjs <entrada> <salida.webp> [--crop-top=N] [--width=1600] [--quality=80]");
  process.exit(1);
}
const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, "").split("=")).map(([k, v]) => [k, Number(v)]));
const maxWidth = opt.width ?? 1600;
const quality = opt.quality ?? 80;

let image = sharp(input);
const meta = await image.metadata();
if (opt["crop-top"]) {
  image = sharp(await image.extract({ left: 0, top: opt["crop-top"], width: meta.width, height: meta.height - opt["crop-top"] }).toBuffer());
}
mkdirSync(dirname(output), { recursive: true });
const info = await image.resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output);
console.log(JSON.stringify({ output, width: info.width, height: info.height, bytes: statSync(output).size }));
