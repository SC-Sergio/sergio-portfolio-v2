import { useEffect, useState } from "react";

const IDLE_TIMEOUT_MS = 2000;
const IDLE_FALLBACK_DELAY_MS = 300;
const MAX_WAIT_MS = 4000;

/**
 * Indica cuándo solicitar la escena 3D: tras el evento `load` y en un momento
 * ocioso del navegador (requestIdleCallback, o un setTimeout si no existe). Para
 * no dejar sin 3D a un escritorio con recursos lentos, se solicita como máximo a
 * los 4 s del montaje. Una vez solicitada no se vuelve a diferir, y las tareas
 * pendientes se cancelan al desmontar o al desactivarse.
 */
export function useDeferredSceneRequest(enabled: boolean): boolean {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!enabled || requested) {
      return;
    }

    let cancelled = false;
    let idleHandle: number | undefined;
    let fallbackHandle: number | undefined;

    const request = () => {
      if (!cancelled) {
        cancelled = true;
        setRequested(true);
      }
    };

    const scheduleIdle = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(request, { timeout: IDLE_TIMEOUT_MS });
      } else {
        fallbackHandle = window.setTimeout(request, IDLE_FALLBACK_DELAY_MS);
      }
    };

    if (document.readyState === "complete") {
      scheduleIdle();
    } else {
      window.addEventListener("load", scheduleIdle, { once: true });
    }

    const maxWaitHandle = window.setTimeout(request, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleIdle);
      window.clearTimeout(maxWaitHandle);

      if (fallbackHandle !== undefined) {
        window.clearTimeout(fallbackHandle);
      }

      if (idleHandle !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, [enabled, requested]);

  return requested;
}
