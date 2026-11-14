import { expect, test } from "@playwright/test";
import { navSections } from "../../data/navigation";
import { collectProblems, waitForScrollEnd } from "./helpers";

test.describe("portada", () => {
  test("carga sin errores de consola ni avisos de hidratación", async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sergio Carey");
    await expect(page.locator("h1")).toHaveCount(1);
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(1500);
    expect(problems).toEqual([]);
  });

  test("el Hero es visible desde el HTML inicial (sin opacity 0)", async ({ page }) => {
    await page.goto("/");
    const opacity = await page.locator("#hero-title").evaluate((element) => {
      let node: Element | null = element;
      let value = 1;
      while (node) {
        value *= Number(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return value;
    });
    expect(opacity).toBe(1);
  });

  test("los CTAs del Hero apuntan a destinos válidos", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#home");
    await expect(hero.getByRole("link", { name: /Ver proyectos/ })).toHaveAttribute("href", "#projects");
    await expect(hero.getByRole("link", { name: "Contactar", exact: true })).toHaveAttribute("href", "#contact");
    await expect(hero.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/SC-Sergio");
    await expect(hero.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com\/in\//);
    await expect(hero.getByRole("link", { name: "CV" })).toHaveAttribute("href", "/cv");
  });

  test("todas las secciones existen con su encabezado", async ({ page }) => {
    await page.goto("/");
    for (const section of navSections) {
      await expect(page.locator(`#${section.id} h2`).first()).toBeVisible();
    }
  });

  test("la altura del documento no cambia al recorrer la página", async ({ page }) => {
    await page.goto("/");
    const heights = await page.evaluate(async () => {
      const values: number[] = [document.documentElement.scrollHeight];
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.7) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        values.push(document.documentElement.scrollHeight);
      }
      return values;
    });
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(2);
  });

  test("Home y End llegan al inicio y al final", async ({ page, isMobile }) => {
    test.skip(isMobile, "teclado físico solo en desktop");
    await page.goto("/");
    await page.locator("body").click({ position: { x: 5, y: 300 } });
    await page.keyboard.press("End");
    await waitForScrollEnd(page);
    const atEnd = await page.evaluate(() => Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) <= 2);
    expect(atEnd).toBe(true);
    await page.keyboard.press("Home");
    await waitForScrollEnd(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("recargar en una posición intermedia conserva la sección", async ({ page }) => {
    const titleTop = () => page.locator("#projects").evaluate((element) => Math.round(element.getBoundingClientRect().top));
    await page.goto("/#projects");
    await expect.poll(titleTop, { timeout: 10_000 }).toBeLessThan(120);
    await page.reload();
    await waitForScrollEnd(page);
    await expect.poll(titleTop, { timeout: 10_000 }).toBeLessThan(120);
    expect(await titleTop()).toBeGreaterThanOrEqual(40);
  });

  test("sin desbordamiento horizontal", async ({ page }) => {
    test.setTimeout(120_000);
    for (const width of [320, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `ancho ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("navegación por anclas", () => {
  for (const section of navSections) {
    test(`#${section.id} queda visible bajo el navbar`, async ({ page, isMobile }) => {
      await page.goto("/");
      if (isMobile) {
        await page.getByRole("button", { name: "Abrir menú" }).click();
        await page.locator("#mobile-menu").getByRole("link", { name: section.label, exact: true }).click();
        await expect(page.locator("#mobile-menu")).toBeHidden();
      } else {
        await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: section.label, exact: true }).click();
      }
      await waitForScrollEnd(page);
      const navBottom = await page.locator("header").first().evaluate((element) => element.getBoundingClientRect().bottom);
      // La sección queda justo bajo el navbar (scroll-margin) y su título dentro de la vista.
      const sectionTop = await page.locator(`#${section.id}`).evaluate((element) => element.getBoundingClientRect().top);
      expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 1);
      const atBottom = await page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2);
      if (!atBottom) expect(sectionTop).toBeLessThan(navBottom + 40);
      const heading = await page.locator(`#${section.id} h2`).first().evaluate((element) => element.getBoundingClientRect());
      expect(heading.top).toBeGreaterThanOrEqual(navBottom);
      expect(heading.bottom).toBeLessThan(await page.evaluate(() => window.innerHeight));
    });
  }

  test("el enlace de la sección activa se marca", async ({ page, isMobile }) => {
    test.skip(isMobile, "los enlaces de escritorio están ocultos en móvil");
    await page.goto("/#projects");
    await waitForScrollEnd(page);
    await expect(
      page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Proyectos", exact: true }),
    ).toHaveAttribute("aria-current", "true");
  });
});

test.describe("menú móvil", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, "solo móvil");
  });

  test("abre, enfoca, cierra con Escape y devuelve el foco", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Abrir menú" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(page.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link")).toHaveCount(navSections.length + 4);
    await expect(menu.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  });

  test("se cierra al tocar fuera", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.mouse.click(200, 760);
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });
});
