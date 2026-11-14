import type { Page } from "@playwright/test";

/** Registra errores de consola, avisos de hidratación y excepciones no capturadas. */
export function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" || /hydrat/i.test(text)) problems.push(`[${message.type()}] ${text}`);
  });
  page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));
  return problems;
}

/** Espera a que termine el scroll (suave o no): dos lecturas iguales de scrollY. */
export async function waitForScrollEnd(page: Page) {
  // Margen para que un scroll suave alcance a comenzar antes de medir.
  await page.waitForTimeout(300);
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const first = window.scrollY;
        setTimeout(() => resolve(Math.abs(window.scrollY - first) < 1), 150);
      }),
    undefined,
    { timeout: 10_000 },
  );
}
