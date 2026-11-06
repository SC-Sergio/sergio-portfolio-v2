"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import HeroCoreStatic from "@/components/HeroCoreStatic";

export type SceneFallbackReason = "loading" | "static" | "deferred";
export type SceneFailureReason = "load-error" | "render-error" | "no-webgl";

/**
 * Comprueba si el navegador puede crear un contexto WebGL. React Three Fiber crea
 * su renderer de forma asíncrona, fuera del árbol de React, por lo que un fallo
 * ahí no llega a ningún error boundary; por eso se verifica antes de cargar la escena.
 */
export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    if (!context) {
      return false;
    }

    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Representación estática del Hero: el núcleo neuronal en SVG. Es la capa base:
 * se ve en el modo estático, mientras se difiere o carga la escena 3D y cuando
 * esta falla, de modo que el área visual y las capas del Hero no cambian.
 */
export function SceneFallback({ reason = "loading" }: { reason?: SceneFallbackReason }) {
  return (
    <div aria-hidden="true" data-scene-fallback={reason} className="relative h-full w-full">
      <HeroCoreStatic animated={reason === "static"} />
    </div>
  );
}

/**
 * Marca un fallo de la escena 3D para diagnóstico. No dibuja nada: la capa base
 * (SceneFallback) sigue visible porque la escena nunca llega a estar lista.
 */
export function SceneFailure({ reason }: { reason: SceneFailureReason }) {
  return <div aria-hidden="true" hidden data-scene-failure={reason} />;
}

type Scene3DErrorBoundaryProps = { children: ReactNode };
type Scene3DErrorBoundaryState = { failed: boolean };

/**
 * Aísla los errores de render de la escena 3D (WebGL no disponible, fallos de
 * Three.js o React Three Fiber) para que nunca lleguen al error boundary global.
 * Se usa un boundary propio en lugar de `catchError` de next/error porque este
 * deja propagar el error hasta la raíz cuando el visitante es un bot, y la escena
 * decorativa no debe afectar a rastreadores ni a usuarios. No reintenta: el 3D
 * vuelve a intentarse solo con una nueva carga de la página.
 */
export class Scene3DErrorBoundary extends Component<
  Scene3DErrorBoundaryProps,
  Scene3DErrorBoundaryState
> {
  state: Scene3DErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): Scene3DErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.warn(
      "[Scene3D] La escena 3D falló al renderizar; se muestra el fondo estático.",
      error,
      info.componentStack,
    );
  }

  render() {
    if (this.state.failed) {
      return <SceneFailure reason="render-error" />;
    }

    return this.props.children;
  }
}
