import { expect, test } from "@playwright/test";
import { projects } from "../../data/projects";
import { assistantQuickPrompts } from "../../data/assistant";
import { collectProblems } from "./helpers";

test.describe("proyectos", () => {
  test("cada proyecto se muestra con su estado y enlaces seguros", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      const card = page.locator(`#project-${project.slug}`);
      await expect(card.getByRole("heading", { name: project.name })).toBeVisible();
      await expect(card).toContainText(project.status);
      for (const link of project.links) {
        const anchor = card.locator(`a[href="${link.href}"]`);
        await expect(anchor).toHaveAttribute("target", "_blank");
        await expect(anchor).toHaveAttribute("rel", /noopener/);
      }
    }
  });

  test("los proyectos privados no exponen enlaces", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#project-fastlaundry a")).toHaveCount(0);
    await expect(page.locator("#project-fastlaundry")).toContainText("Código privado");
  });
});

test.describe("asistente", () => {
  test("responde todas las preguntas rápidas dentro del alcance", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir asistente del portafolio" }).click();
    const dialog = page.getByRole("dialog", { name: "Asistente del portafolio" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("#portfolio-assistant-input")).toBeFocused();

    for (const [index, prompt] of assistantQuickPrompts.entries()) {
      await dialog.getByRole("button", { name: prompt }).click();
      // Mensaje inicial + (pregunta, respuesta) por cada prompt.
      await expect(dialog.locator('[data-role="assistant"]')).toHaveCount(index + 2);
      await expect(dialog.locator('[data-role="assistant"]').last()).not.toHaveClass(/amber|red/);
      await page.waitForTimeout(1300); // cooldown entre preguntas
    }

    // Regresión: «¿Cómo puedo contactarlo?» entrega el correo como enlace.
    await expect(dialog.locator('[data-role="assistant"]').last().locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(dialog.getByTestId("assistant-remaining")).toContainText(`${10 - assistantQuickPrompts.length}/10`);
  });

  test("Escape cierra y devuelve el foco al botón", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Abrir asistente del portafolio" });
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Abrir asistente del portafolio" })).toBeFocused();
  });

  test("bloquea tras preguntas fuera de tema y se puede reiniciar", async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir asistente del portafolio" }).click();
    const input = page.locator("#portfolio-assistant-input");
    for (const question of ["¿Quién ganará el mundial?", "Receta de pan", "Clima de mañana"]) {
      await input.fill(question);
      await input.press("Enter");
      await page.waitForTimeout(1300);
    }
    await expect(input).toBeDisabled();
    await page.getByRole("button", { name: "Reiniciar chat" }).click();
    await expect(input).toBeEnabled();
  });
});

test.describe("contacto", () => {
  test("enlaces de contacto correctos", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.locator('a[href^="mailto:sergiocareyhola@gmail.com"]').first()).toBeVisible();
    await expect(contact.locator('a[href="https://github.com/SC-Sergio"]')).toBeVisible();
    await expect(contact.locator('a[href*="linkedin.com/in/"]')).toBeVisible();
    await expect(contact.locator('a[href="/cv"]')).toBeVisible();
    await expect(page.locator("footer")).toContainText(String(new Date().getFullYear()));
  });

  test("no publica números de teléfono", async ({ page }) => {
    for (const path of ["/", "/cv"]) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text, path).not.toMatch(/\+?56\s?9\s?\d{4}\s?\d{4}|\b9\d{8}\b/);
    }
  });
});

test.describe("núcleo del Hero", () => {
  test("móvil o movimiento reducido: SVG sin descargar Three.js", async ({ browser }) => {
    test.setTimeout(90_000);
    for (const options of [
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
      { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" as const },
    ]) {
      const context = await browser.newContext(options);
      const page = await context.newPage();
      const problems = collectProblems(page);
      let threeLoaded = false;
      page.on("response", async (response) => {
        if (response.request().resourceType() !== "script") return;
        const body = await response.text().catch(() => "");
        if (body.includes("WebGLRenderer")) threeLoaded = true;
      });
      await page.goto("/");
      await expect(page.locator("[data-hero-scene-mode]")).toHaveAttribute("data-hero-scene-mode", "static");
      await expect(page.locator("[data-hero-core-static]")).toBeVisible();
      await page.waitForTimeout(5000);
      expect(threeLoaded).toBe(false);
      expect(problems).toEqual([]);
      await context.close();
    }
  });

  test("desktop: WebGL dibuja y reemplaza al SVG", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo desktop");
    await page.goto("/");
    await expect(page.locator("[data-hero-scene-mode]")).toHaveAttribute("data-hero-scene-mode", "webgl");
    await expect(page.locator("[data-scene-ready]")).toHaveAttribute("data-scene-ready", "true", { timeout: 15_000 });
    await expect(page.locator("#home canvas")).toHaveCount(1);
  });

  test("desktop sin WebGL: queda el SVG y la página sigue funcionando", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo desktop");
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (/webgl/.test(type)) return null;
        return (original as (...a: unknown[]) => unknown).call(this, type, ...args);
      } as typeof original;
    });
    await page.goto("/");
    await expect(page.locator("[data-scene-failure='no-webgl']")).toHaveCount(1, { timeout: 15_000 });
    await expect(page.locator("[data-hero-core-static]")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("desktop: si el chunk 3D falla al descargarse, la página sobrevive", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo desktop");
    let loaded = false;
    page.on("load", () => {
      loaded = true;
    });
    // Todo chunk pedido después de `load` es la escena diferida: se aborta.
    await page.route("**/_next/static/chunks/**", (route) => (loaded ? route.abort() : route.continue()));
    await page.goto("/");
    await expect(page.locator("[data-scene-failure='load-error']")).toHaveCount(1, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-hero-core-static]")).toBeVisible();
  });
});

test.describe("SEO y rutas", () => {
  test("metadata, Open Graph y JSON-LD", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sergio Carey/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\//);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{60,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("html")).toHaveAttribute("lang", "es-CL");
    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(jsonLd["@graph"][0]["@type"]).toBe("Person");
  });

  test("robots, sitemap, manifest e imágenes sociales responden", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/cv");
    expect((await request.get("/manifest.webmanifest")).ok()).toBe(true);
    const og = await request.get("/opengraph-image");
    expect(og.ok()).toBe(true);
    expect(og.headers()["content-type"]).toContain("image/png");
    expect((await request.get("/icon.svg")).ok()).toBe(true);
  });

  test("CV disponible y 404 para rutas inexistentes", async ({ page }) => {
    const cv = await page.goto("/cv");
    expect(cv?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sergio Enrique Carey Alegre");
    await expect(page.getByRole("button", { name: /Imprimir/ })).toBeVisible();

    const missing = await page.goto("/no-existe");
    expect(missing?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página no existe.");
  });
});

test("regresión: el panel del asistente no queda bajo el navbar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir asistente del portafolio" }).click();
  const navBottom = await page.locator("header").first().evaluate((element) => element.getBoundingClientRect().bottom);
  const dialogTop = await page.getByRole("dialog").evaluate((element) => element.getBoundingClientRect().top);
  expect(dialogTop).toBeGreaterThanOrEqual(navBottom);
});
