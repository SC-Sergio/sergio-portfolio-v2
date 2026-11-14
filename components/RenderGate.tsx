"use client";

import { useEffect } from "react";

/**
 * Las secciones bajo el Hero usan `content-visibility: auto` solo durante la carga
 * inicial, para que el primer pintado no tenga que maquetar toda la página. Tras
 * `load`, se renderizan de a una por cada momento ocioso del navegador (tareas
 * cortas, sin bloquear el hilo principal) y al final se marca data-render="all":
 * desde ahí la altura del documento queda fija. Ante la primera interacción del
 * usuario se renderiza todo lo que falte de inmediato. El script en línea del layout
 * hace lo mismo antes del primer pintado al recargar, volver atrás o entrar con un ancla.
 */
export default function RenderGate() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.render === "all") return;

    const pending = Array.from(document.querySelectorAll<HTMLElement>(".defer-render"));
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      root.dataset.render = "all";
      cleanup();
    };

    const next = () => {
      const section = pending.shift();
      if (!section) return finish();
      section.dataset.rendered = "";
      schedule();
    };

    function schedule() {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(next, { timeout: 1000 });
      } else {
        timeoutHandle = window.setTimeout(next, 50);
      }
    }

    function cleanup() {
      window.removeEventListener("load", schedule);
      for (const type of events) window.removeEventListener(type, finish, { capture: true });
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    }

    for (const type of events) window.addEventListener(type, finish, { capture: true, passive: true });
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return cleanup;
  }, []);

  return null;
}
