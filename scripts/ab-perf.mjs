// A/B de rendimiento intercalado (perfil móvil: CPU ×4, 150 ms RTT, 1,6 Mbps).
// Uso: node scripts/ab-perf.mjs <rondas> A=http://localhost:3301/ B=http://localhost:3302/ ...
// Cada ronda mide todas las variantes en orden rotado para neutralizar efectos de orden
// y de calentamiento. Reporta mediana y rango intercuartil de FCP, LCP y TBT, el
// elemento LCP, los bytes de fuentes y el instante en que termina la última fuente.
import { chromium } from "@playwright/test";

const rounds = Number(process.argv[2] ?? 7);
const variants = process.argv.slice(3).map((arg) => {
  const [label, ...rest] = arg.split("=");
  return { label, url: rest.join("=") };
});

const network = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };

const observer = () => {
  window.__perf = { lcp: 0, lcpNode: "", longTasks: [] };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__perf.lcp = entry.startTime;
      const node = entry.element;
      window.__perf.lcpNode = node ? `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}` : "?";
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__perf.longTasks.push([entry.startTime, entry.duration]);
  }).observe({ type: "longtask", buffered: true });
};

async function measure(browser, url) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", network);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(observer);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(4000);
  const result = await page.evaluate(() => {
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    const tbt = window.__perf.longTasks.filter(([s]) => s >= fcp).reduce((sum, [, d]) => sum + Math.max(0, d - 50), 0);
    const fonts = performance.getEntriesByType("resource").filter((entry) => /\.woff2/.test(entry.name));
    const css = performance.getEntriesByType("resource").filter((entry) => entry.initiatorType === "link" && /\.css/.test(entry.name));
    return {
      fcp,
      lcp: window.__perf.lcp,
      tbt,
      lcpNode: window.__perf.lcpNode,
      fontKB: Math.round(fonts.reduce((sum, entry) => sum + entry.encodedBodySize, 0) / 1024),
      fontsDone: Math.round(Math.max(0, ...fonts.map((entry) => entry.responseEnd))),
      cssDone: Math.round(Math.max(0, ...css.map((entry) => entry.responseEnd))),
    };
  });
  await context.close();
  return result;
}

const quantile = (values, q) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
};

const browser = await chromium.launch();
const samples = Object.fromEntries(variants.map((variant) => [variant.label, []]));
for (let round = 0; round < rounds; round += 1) {
  const order = variants.map((_, index) => variants[(index + round) % variants.length]);
  for (const variant of order) samples[variant.label].push(await measure(browser, variant.url));
}
await browser.close();

for (const variant of variants) {
  const list = samples[variant.label];
  const fmt = (key) => `${Math.round(quantile(list.map((s) => s[key]), 0.5))} [${Math.round(quantile(list.map((s) => s[key]), 0.25))}–${Math.round(quantile(list.map((s) => s[key]), 0.75))}]`;
  const nodes = [...new Set(list.map((s) => s.lcpNode))].join(",");
  console.log(
    `${variant.label.padEnd(3)} FCP ${fmt("fcp")} | LCP ${fmt("lcp")} | TBT ${fmt("tbt")} | cssDone ${fmt("cssDone")} | fontsDone ${fmt("fontsDone")} | fonts ${list[0].fontKB} KB | LCP el ${nodes}`,
  );
}
