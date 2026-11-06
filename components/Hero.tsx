"use client";

import { ArrowDown, ArrowUpRight, Cpu, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Scene3DProps } from "@/components/Scene3D";
import {
  canUseWebGL,
  Scene3DErrorBoundary,
  SceneFailure,
  SceneFallback,
  type SceneFallbackReason,
} from "@/components/Scene3DBoundary";
import { useDeferredSceneRequest } from "@/components/useDeferredSceneRequest";
import { useHeroSceneMode } from "@/components/useHeroSceneMode";

function SceneLoadErrorFallback() {
  return <SceneFailure reason="load-error" />;
}

function SceneNoWebGLFallback() {
  return <SceneFailure reason="no-webgl" />;
}

// La escena 3D es decorativa. Sin WebGL no se descarga Three.js; y si su chunk no
// se descarga o su módulo falla al cargarse, la importación se resuelve con un
// marcador de fallo en lugar de rechazarse, para que el error no llegue al boundary
// global de Next.js. El loader solo corre en el cliente (ssr: false) y solo cuando
// Hero renderiza la escena, nunca en el modo estático.
const Scene3D = dynamic<Scene3DProps>(
  () => {
    if (!canUseWebGL()) {
      console.info("[Scene3D] WebGL no disponible; se muestra el fondo estático.");
      return Promise.resolve({ default: SceneNoWebGLFallback });
    }

    return import("@/components/Scene3D").catch((error: unknown) => {
      console.warn("[Scene3D] No se pudo cargar la escena 3D; se muestra el fondo estático.", error);
      return { default: SceneLoadErrorFallback };
    });
  },
  {
    ssr: false,
    loading: () => null,
  },
);

const highlights = [
  { name: "Python / Django", detail: "Backend operacional" },
  { name: "IA local", detail: "Ollama / LLMs" },
  { name: "Tauri / Rust", detail: "Aplicaciones desktop" },
  { name: "Data / ML", detail: "Análisis y modelos" },
];
const metrics = [
  { value: "4", label: "proyectos destacados" },
  { value: "IA", label: "automatización aplicada" },
  { value: "Web", label: "productos operativos" },
];
const professionalRail = [
  { label: "Base", value: "Arica, Chile" },
  { label: "Formación", value: "Inacap" },
  { label: "Stack", value: "Python / Java / TypeScript" },
  { label: "Foco", value: "Backend / IA / Automatización" },
];

// Entrada solo con desplazamiento, resuelta por CSS (@starting-style) en el primer
// pintado: el contenido nunca se oculta, no espera a la hidratación de React y no
// genera layout shift (solo transform). Con prefers-reduced-motion no hay transición.
const heroEnter =
  "transition-transform duration-700 ease-out motion-reduce:transition-none";

const sceneLayerFade = "transition-opacity duration-700 ease-out motion-reduce:transition-none";

export default function Hero() {
  // El núcleo SVG es la capa base desde el HTML inicial. La escena 3D solo se
  // solicita en modo "webgl" y de forma diferida; en el servidor, durante la
  // hidratación y en el modo estático no se renderiza, por lo que el chunk de
  // Three.js no se descarga. El SVG cede su lugar solo cuando WebGL ya dibujó.
  const sceneMode = useHeroSceneMode();
  const sceneRequested = useDeferredSceneRequest(sceneMode === "webgl");
  const [sceneReady, setSceneReady] = useState(false);
  const renderScene = sceneMode === "webgl" && sceneRequested;
  const sceneVisible = renderScene && sceneReady;
  const baseReason: SceneFallbackReason =
    sceneMode === "static" ? "static" : sceneMode === "webgl" && !sceneRequested ? "deferred" : "loading";

  return (
    <section
      id="home"
      className="tech-frame relative isolate flex min-h-[94svh] items-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-30" data-hero-scene-mode={sceneMode}>
        <div className={`absolute inset-0 ${sceneLayerFade} ${sceneVisible ? "opacity-0" : "opacity-100"}`}>
          <SceneFallback reason={baseReason} />
        </div>
        {renderScene ? (
          <div
            className={`absolute inset-0 ${sceneLayerFade} ${sceneVisible ? "opacity-100" : "opacity-0"}`}
            data-scene-ready={sceneVisible ? "true" : "false"}
          >
            <Scene3DErrorBoundary>
              <Scene3D onReadyChange={setSceneReady} />
            </Scene3DErrorBoundary>
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_28%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_84%_64%,rgba(139,92,246,0.12),transparent_24rem),linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.97)_39%,rgba(5,6,7,0.76)_68%,rgba(5,6,7,0.36)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#050607] to-transparent" />
      <div className="absolute right-[6%] top-28 -z-10 hidden h-56 w-56 rounded-full border border-cyan-200/[0.08] bg-cyan-300/[0.025] blur-xl lg:block" />

      <div className="mx-auto grid w-full max-w-[92rem] gap-8 pb-12 lg:grid-cols-12 lg:items-center 2xl:max-w-[96rem]">
        <div className={`max-w-3xl lg:col-span-6 xl:col-span-5 ${heroEnter} starting:translate-y-6`}>
          <div className="premium-surface mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-200">
            <Sparkles size={16} className="text-cyan-200" aria-hidden="true" />
            Portafolio de desarrollo, IA, automatización y datos
          </div>

          <h1 className="holographic-text inline-block max-w-4xl pb-2 text-5xl font-semibold leading-[1.12] sm:text-6xl lg:text-7xl">
            Sergio Carey
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-cyan-100/70 sm:text-sm">
            Sergio Enrique Carey Alegre · Inacap · Arica, Chile
          </p>
          <p className="mt-5 max-w-2xl text-xl font-medium text-emerald-50 sm:text-2xl">
            Ingeniero Informático enfocado en backend, inteligencia artificial aplicada, automatización y productos digitales para problemas reales.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Desarrollo sistemas mantenibles, asistentes locales, aplicaciones de escritorio y proyectos de datos que conectan procesos, equipos y usuarios sin perder estabilidad.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="glow-button inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 text-sm font-semibold text-[#05110c] transition-all hover:bg-emerald-200 hover:shadow-[0_0_22px_rgba(52,211,153,0.2)]"
            >
              Ver proyectos
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="premium-surface inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-white transition-colors hover:border-cyan-200/30 hover:bg-white/[0.09]"
            >
              Iniciar conversación
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="border-l border-cyan-200/20 pl-3">
                <p className="font-mono text-lg font-semibold text-cyan-100">{metric.value}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
            {highlights.map((item, index) => (
              <div key={item.name} className="premium-card rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <Cpu size={18} className="text-cyan-200" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-zinc-500">0{index + 1}</span>
                </div>
                <p className="mt-5 text-sm font-medium text-zinc-100">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`relative hidden min-h-[27rem] lg:col-span-6 lg:block xl:col-span-5 2xl:min-h-[31rem] ${heroEnter} delay-150 starting:translate-y-[18px]`}
        >
          <div className="hero-orbit-stage absolute inset-y-2 left-0 right-0 rounded-2xl" aria-hidden="true" />
          <div className="absolute left-0 top-8 grid w-44 gap-3 2xl:left-4">
            {highlights.slice(0, 2).map((item, index) => (
              <div key={item.name} className="premium-card rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <Cpu size={18} className="text-cyan-200" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-zinc-500">0{index + 1}</span>
                </div>
                <p className="mt-5 text-sm font-medium text-zinc-100">{item.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-8 right-0 grid w-48 gap-3 2xl:right-4">
            {highlights.slice(2).map((item, index) => (
              <div key={item.name} className="premium-card rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <Cpu size={18} className="text-cyan-200" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-zinc-500">0{index + 3}</span>
                </div>
                <p className="mt-5 text-sm font-medium text-zinc-100">{item.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside
          className={`hidden xl:col-span-2 xl:grid xl:gap-3 ${heroEnter} delay-200 starting:translate-x-[18px]`}
          aria-label="Datos profesionales destacados"
        >
          {professionalRail.map((item) => (
            <div key={item.label} className="tech-chip rounded-lg p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-100">{item.value}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
