import { useSyncExternalStore } from "react";

/**
 * Representación visual del núcleo del Hero.
 * - "pending": servidor y primera hidratación (siempre la versión estática).
 * - "static": SVG/CSS, sin descargar Three.js.
 * - "webgl": candidato a la escena 3D (aún sujeto a la verificación de WebGL).
 */
export type HeroSceneMode = "pending" | "static" | "webgl";

const WIDE_QUERY = "(min-width: 1024px)";
const FINE_POINTER_QUERY = "(pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REDUCED_DATA_QUERY = "(prefers-reduced-data: reduce)";

type ConnectionLike = Partial<EventTarget> & { saveData?: boolean };

function getConnection(): ConnectionLike | undefined {
  return (navigator as Navigator & { connection?: ConnectionLike }).connection;
}

function getMediaQuery(query: string): MediaQueryList | null {
  return typeof window.matchMedia === "function" ? window.matchMedia(query) : null;
}

function matches(query: string): boolean {
  return getMediaQuery(query)?.matches ?? false;
}

/**
 * WebGL solo en pantallas de al menos 1024 px con puntero principal preciso, sin
 * movimiento reducido ni ahorro de datos. Si una API no existe, se asume la opción
 * ligera: una consulta no soportada nunca devuelve `true`.
 */
function getSnapshot(): HeroSceneMode {
  const prefersWebGL =
    matches(WIDE_QUERY) &&
    matches(FINE_POINTER_QUERY) &&
    !matches(REDUCED_MOTION_QUERY) &&
    !matches(REDUCED_DATA_QUERY) &&
    getConnection()?.saveData !== true;

  return prefersWebGL ? "webgl" : "static";
}

function getServerSnapshot(): HeroSceneMode {
  return "pending";
}

function subscribe(onChange: () => void) {
  const lists = [WIDE_QUERY, FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, REDUCED_DATA_QUERY]
    .map(getMediaQuery)
    .filter((list): list is MediaQueryList => list !== null);

  for (const list of lists) {
    if (typeof list.addEventListener === "function") {
      list.addEventListener("change", onChange);
    } else {
      list.addListener?.(onChange);
    }
  }

  const connection = getConnection();
  connection?.addEventListener?.("change", onChange);

  return () => {
    for (const list of lists) {
      if (typeof list.removeEventListener === "function") {
        list.removeEventListener("change", onChange);
      } else {
        list.removeListener?.(onChange);
      }
    }

    connection?.removeEventListener?.("change", onChange);
  };
}

/**
 * Decide la representación del núcleo después de la hidratación, sin diferencias
 * de HTML entre servidor y cliente, y la actualiza si cambian el viewport, el tipo
 * de puntero o las preferencias del usuario durante la sesión.
 */
export function useHeroSceneMode(): HeroSceneMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
