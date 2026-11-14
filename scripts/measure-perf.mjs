// Medición de laboratorio reproducible (no es Lighthouse).
// Uso: node scripts/measure-perf.mjs <url> [runs=3]
// Perfiles: desktop 1440x900 sin throttling y móvil 390x844 con CPU x4 + red 4G lenta.
// Reporta mediana de FCP, LCP, CLS, TBT (long tasks tras FCP), JS transferido,
// si se descargó Three.js y la variación de altura del documento al recorrerlo.
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3100/";
const runs = Number(process.argv[3] ?? 3);

const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, cpu: 1, network: null, mobile: false },
  mobile: {
    viewport: { width: 390, height: 844 },
    cpu: 4,
    network: { latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
    mobile: true,
  },
};

const observerScript = () => {
  window.__perf = { lcp: 0, cls: 0, longTasks: [] };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__perf.cls += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__perf.longTasks.push([entry.startTime, entry.duration]);
  }).observe({ type: "longtask", buffered: true });
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

async function measure(browser, name, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.mobile,
    hasTouch: profile.mobile,
    deviceScaleFactor: profile.mobile ? 2 : 1,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (profile.network) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...profile.network });
  if (profile.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });

  let jsBytes = 0;
  let threeLoaded = false;
  const scriptRequests = new Map();
  cdp.on("Network.responseReceived", ({ requestId, type, response }) => {
    if (type === "Script") scriptRequests.set(requestId, response.url);
  });
  cdp.on("Network.loadingFinished", async ({ requestId, encodedDataLength }) => {
    if (!scriptRequests.has(requestId)) return;
    jsBytes += encodedDataLength;
    try {
      const { body } = await cdp.send("Network.getResponseBody", { requestId });
      if (/WebGLRenderer/.test(body)) threeLoaded = true;
    } catch {
      /* cuerpo no disponible */
    }
  });

  await page.addInitScript(observerScript);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(5000);

  const result = await page.evaluate(() => {
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    const tbt = window.__perf.longTasks
      .filter(([start]) => start >= fcp)
      .reduce((sum, [, duration]) => sum + Math.max(0, duration - 50), 0);
    return { fcp, lcp: window.__perf.lcp, cls: window.__perf.cls, tbt };
  });

  // Altura del documento al recorrerlo de arriba a abajo (saltos por content-visibility, etc.).
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const heights = await page.evaluate(async () => {
    const values = [document.documentElement.scrollHeight];
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      values.push(document.documentElement.scrollHeight);
    }
    return values;
  });

  await context.close();
  return { ...result, jsKB: Math.round(jsBytes / 1024), threeLoaded, heightMin: Math.min(...heights), heightMax: Math.max(...heights) };
}

const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
for (const [name, profile] of Object.entries(profiles)) {
  const samples = [];
  for (let i = 0; i < runs; i += 1) samples.push(await measure(browser, name, profile));
  const summary = {
    fcp: Math.round(median(samples.map((s) => s.fcp))),
    lcp: Math.round(median(samples.map((s) => s.lcp))),
    cls: Number(median(samples.map((s) => s.cls)).toFixed(4)),
    tbt: Math.round(median(samples.map((s) => s.tbt))),
    jsKB: median(samples.map((s) => s.jsKB)),
    threeLoaded: samples.map((s) => s.threeLoaded),
    docHeight: `${samples[0].heightMin}→${samples[0].heightMax}`,
  };
  console.log(name, JSON.stringify(summary));
}
await browser.close();
