import { expect, test } from "@playwright/test";
import { media, mediaFor } from "../../data/media";
import { projects } from "../../data/projects";
import { collectProblems } from "./helpers";

const demoRoutes = projects.flatMap((project) => (project.demo ? [project.demo.href] : []));

test.describe("casos de estudio", () => {
  for (const project of projects) {
    test(`/proyectos/${project.slug} muestra su caso completo y vuelve al portafolio`, async ({ page }) => {
      const problems = collectProblems(page);
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("heading", { level: 1, name: project.name })).toBeVisible();
      for (const heading of ["Cómo funciona", "Decisiones de ingeniería", "Resultados y pruebas", "Limitaciones"]) {
        await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      }
      // Enlaces externos seguros y solo los declarados.
      for (const link of project.links) {
        const anchor = page.locator(`main a[href="${link.href}"]`).first();
        await expect(anchor).toHaveAttribute("target", "_blank");
        await expect(anchor).toHaveAttribute("rel", /noopener/);
      }
      // La demo, si existe, se enlaza con su tipo explícito.
      if (project.demo) {
        await expect(page.locator(`main a[href="${project.demo.href}"]`).first()).toBeVisible();
        await expect(page.getByText(project.demo.kind === "funcional" ? /Demo funcional/ : /Demo simulada/).first()).toBeVisible();
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/proyectos/${project.slug}$`));
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(project.name));

      await page.getByRole("link", { name: /Volver/ }).first().click();
      await expect(page).toHaveURL(/\/#projects$/);
      await expect(page.locator("#projects")).toBeInViewport();
      expect(problems).toEqual([]);
    });
  }

  test("FastLaundry no expone enlaces externos ni capturas del sistema real", async ({ page }) => {
    await page.goto("/proyectos/fastlaundry");
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);
    await expect(page.getByText("Código privado").first()).toBeVisible();
  });

  test("un slug inexistente responde 404", async ({ page }) => {
    const response = await page.goto("/proyectos/no-existe");
    expect(response?.status()).toBe(404);
  });

  test("navegación entre proyectos con anterior y siguiente", async ({ page }) => {
    await page.goto(`/proyectos/${projects[0].slug}`);
    await page.getByRole("navigation", { name: "Otros proyectos" }).getByRole("link", { name: new RegExp(projects[1].name) }).click();
    await expect(page.getByRole("heading", { level: 1, name: projects[1].name })).toBeVisible();
  });
});

test.describe("galerías", () => {
  test("el manifiesto de medios apunta a archivos existentes y con texto alternativo", async ({ request }) => {
    for (const item of media) {
      expect(item.alt.length, item.id).toBeGreaterThan(20);
      const response = await request.get(item.src);
      expect(response.status(), item.src).toBe(200);
    }
  });

  test("abre, navega con flechas, cierra con Escape y devuelve el foco", async ({ page }) => {
    const items = mediaFor("carey-assistant");
    await page.goto("/proyectos/carey-assistant");
    const gallery = page.getByRole("list", { name: /Galería de Carey Assistant/ });
    const first = gallery.getByRole("button").first();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`1 / ${items.length}`)).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveAttribute("alt", items[0].alt);
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(`2 / ${items.length}`)).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveAttribute("alt", items[1].alt);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText(`${items.length} / ${items.length}`)).toBeVisible();
    await expect(dialog.getByText(/Captura real/).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(first).toBeFocused();
  });

  test("se opera solo con teclado y el botón Cerrar funciona", async ({ page, isMobile }) => {
    test.skip(isMobile, "el recorrido con Tab se valida en desktop");
    await page.goto("/proyectos/pegasus");
    const first = page.getByRole("list", { name: /Galería de/ }).getByRole("button").first();
    await first.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cerrar visor" }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(first).toBeFocused();
  });

  test("la portada no descarga imágenes de galerías antes de llegar a proyectos", async ({ page }) => {
    const requested: string[] = [];
    page.on("request", (request) => {
      // Solo capturas (public/media/<proyecto>/) o el optimizador de imágenes; las fuentes viven en _next/static/media.
      if (/\/media\/(pegasus|carey-assistant|spacex)\/|_next\/image/.test(request.url())) requested.push(request.url());
    });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(requested).toEqual([]);
  });
});

test.describe("demos", () => {
  test("Pegasus: recuperación real con fuentes, abstención y búsqueda libre", async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto("/demos/pegasus");
    await expect(page.getByTestId("pegasus-sources").locator("li")).toHaveCount(4);
    await expect(page.getByTestId("pegasus-sources")).toContainText("Protocolo de respuesta a incidentes");

    await page.getByLabel("Pregunta de prueba (recuperación real)").selectOption({ label: "¿Cuál es la capital de Francia?" });
    await expect(page.getByTestId("pegasus-abstention")).toContainText("Abstención");

    await page.getByLabel("Pregunta libre (búsqueda léxica)").fill("rollback durante un incidente");
    await page.getByRole("button", { name: "Buscar en el corpus" }).click();
    await expect(page.getByTestId("pegasus-sources").locator("li")).toHaveCount(4);
    await expect(page.getByText(/búsqueda léxica \(BM25\)/).first()).toBeVisible();

    await page.getByLabel("Pregunta libre (búsqueda léxica)").fill("receta de cocina italiana");
    await page.getByRole("button", { name: "Buscar en el corpus" }).click();
    await expect(page.getByTestId("pegasus-abstention")).toBeVisible();
    expect(problems).toEqual([]);
  });

  test("Pegasus: muestra un error comprensible si los datos no cargan", async ({ page }) => {
    await page.route("**/demos/pegasus/retrieval.json", (route) => route.abort());
    await page.goto("/demos/pegasus");
    await expect(page.getByRole("alert").filter({ hasText: "No se pudieron cargar" })).toBeVisible();
  });

  test("FastLaundry: aviso visible, roles, caja y entrega", async ({ page }) => {
    await page.goto("/demos/fastlaundry");
    await expect(page.getByTestId("fastlaundry-notice")).toHaveText(
      "Demostración conceptual con datos simulados. No conectada al sistema empresarial real.",
    );

    // Validación: sin cliente no se crea el pedido.
    await page.getByRole("button", { name: "Crear pedido" }).click();
    await expect(page.getByTestId("fastlaundry-message")).toContainText("nombre de cliente");

    await page.getByLabel("Cliente (ficticio)").fill("Cliente Prueba E2E");
    await page.getByRole("button", { name: "Crear pedido" }).click();
    const order = page.getByTestId("order-1044");
    await expect(order).toContainText("Cliente Prueba E2E");
    await expect(order.getByTestId("order-status")).toHaveText("Recibido");

    // Recepción no avanza el proceso.
    await order.getByRole("button", { name: /Pasar a/ }).click();
    await expect(page.getByTestId("fastlaundry-message")).toContainText("Solo Operario");

    await page.getByRole("button", { name: "Operario", exact: true }).click();
    for (let i = 0; i < 3; i += 1) await order.getByRole("button", { name: /Pasar a/ }).click();
    await expect(order.getByTestId("order-status")).toHaveText("Listo para retiro");
    await expect(page.getByLabel("Cliente (ficticio)")).toBeDisabled();

    await page.getByRole("button", { name: "Recepción", exact: true }).click();
    await order.getByRole("button", { name: "Entregar" }).click();
    await expect(page.getByTestId("fastlaundry-message")).toContainText("saldo pendiente");
    await order.getByRole("button", { name: "Cobrar efectivo" }).click();
    await order.getByRole("button", { name: "Entregar" }).click();
    await expect(order.getByTestId("order-status")).toHaveText("Entregado");

    await expect(page.getByTestId("fastlaundry-collected")).toHaveCount(0);
    await page.getByRole("button", { name: "Administración", exact: true }).click();
    await expect(page.getByTestId("fastlaundry-collected")).toBeVisible();
  });

  test("SpaceX: el selector de modelo cambia la matriz de confusión", async ({ page }) => {
    await page.goto("/demos/spacex");
    const matrix = page.getByTestId("spacex-confusion");
    await expect(matrix.getByLabel("Fallo predicho fallo: 5")).toBeVisible();
    await page.getByLabel("KNN").check();
    await expect(matrix.getByLabel("Fallo predicho fallo: 2")).toBeVisible();
    await page.getByRole("button", { name: "Por tasa" }).click();
    await expect(page.getByRole("button", { name: "Por tasa" })).toHaveAttribute("aria-pressed", "true");
  });

  test("ForoHub: la consola simulada lista, crea y reporta errores", async ({ page }) => {
    await page.goto("/proyectos/forohub");
    await page.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.getByTestId("forohub-status")).toHaveText("200 OK");
    await page.getByLabel(/POST/).check();
    await page.getByLabel("Cuerpo JSON").fill("{ roto");
    await page.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.getByTestId("forohub-status")).toHaveText("400 Bad Request");
    await page.getByLabel("Cuerpo JSON").fill('{"title":"Hola","content":"Prueba","author":"e2e"}');
    await page.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.getByTestId("forohub-status")).toHaveText("200 OK");
  });

  test("LiterAlura muestra la transcripción real de consola", async ({ page }) => {
    await page.goto("/proyectos/literalura");
    await expect(page.getByLabel(/Transcripción de la ejecución/)).toContainText("Libro registrado correctamente desde Gutendex.");
    await expect(page.getByLabel(/Transcripción de la ejecución/)).toContainText("Ese libro ya está registrado.");
  });

  for (const route of demoRoutes) {
    test(`${route} no descarga Three.js y no desborda a 320 px`, async ({ page }) => {
      let threeLoaded = false;
      page.on("response", async (response) => {
        if (!response.url().endsWith(".js")) return;
        const body = await response.text().catch(() => "");
        if (body.includes("WebGLRenderer")) threeLoaded = true;
      });
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(threeLoaded).toBe(false);
    });
  }
});

test.describe("portada V3.5", () => {
  test("cada tarjeta enlaza a su caso de estudio y a su demo cuando existe", async ({ page }) => {
    await page.goto("/#projects");
    for (const project of projects) {
      const card = page.locator(`#project-${project.slug}`);
      await expect(card.locator(`a[href="/proyectos/${project.slug}"]`)).toHaveCount(1);
      if (project.demo) await expect(card.locator(`a[href="${project.demo.href}"]`)).toHaveCount(1);
    }
  });

  test("los rieles del Hero aparecen solo en pantallas anchas y no tapan el contenido", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo aplica a desktop");
    const index = page.getByRole("navigation", { name: "Índice de la página" });
    const demos = page.getByRole("complementary", { name: "Demos en vivo" });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(index).toBeHidden();
    await expect(demos).toBeHidden();

    for (const [width, height] of [
      [1920, 1080],
      [2560, 1440],
      [3840, 2160],
    ]) {
      await page.setViewportSize({ width, height });
      await expect(index).toBeVisible();
      await expect(demos).toBeVisible();
      const boxes = await page.evaluate(() => {
        const rect = (el: Element | null) => el!.getBoundingClientRect();
        const pick = (r: DOMRect) => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
        return {
          index: pick(rect(document.querySelector('nav[aria-label="Índice de la página"]'))),
          demos: pick(rect(document.querySelector('aside[aria-labelledby="hero-demos-title"]'))),
          content: pick(rect(document.querySelector("#home .max-w-7xl"))),
        };
      });
      expect(boxes.index.right, `${width}px`).toBeLessThan(boxes.content.left);
      expect(boxes.demos.left, `${width}px`).toBeGreaterThan(boxes.content.right);
    }
    await expect(demos.getByRole("link", { name: /Pegasus/ })).toHaveAttribute("href", "/demos/pegasus");
  });

  test("el sitemap incluye casos de estudio y demos", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const project of projects) expect(xml).toContain(`/proyectos/${project.slug}`);
    for (const route of demoRoutes) expect(xml).toContain(route);
  });
});
