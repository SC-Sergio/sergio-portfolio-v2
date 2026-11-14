"use client";

import { ArrowDown, FileText, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
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
import { profile } from "@/data/profile";

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

const specs = [
  { label: "Formación", value: "Ingeniero en Informática · INACAP" },
  { label: "Foco", value: "Backend · IA aplicada · Automatización" },
  { label: "Stack base", value: "Python · Django · PostgreSQL" },
  { label: "Base", value: "Arica, Chile · abierto a remoto" },
];

// Etiquetas HUD alrededor del núcleo (solo desktop, decorativas).
const coreTags = [
  { text: "rag.pipeline", className: "left-[53%] top-[24%]" },
  { text: "django.api", className: "left-[81%] top-[30%]" },
  { text: "llm.local", className: "left-[51%] top-[68%]" },
  { text: "automation", className: "left-[79%] top-[72%]" },
];

const iconLink =
  "grid size-11 place-items-center rounded-md text-ink-soft transition-colors hover:bg-white/5 hover:text-ink";

// Entrada solo con desplazamiento, resuelta por CSS (@starting-style) en el primer
// pintado: el contenido nunca se oculta, no espera a la hidratación de React y no
// genera layout shift (solo transform). Con prefers-reduced-motion no hay transición.
const heroEnter = "transition-transform duration-700 ease-out motion-reduce:transition-none";

// Fundido entre capas; visibility se oculta al final de la transición para que la
// capa SVG deje de pintarse (y de animar su pulso) mientras se ve la escena 3D.
const sceneLayerFade = "transition-[opacity,visibility] duration-700 ease-out motion-reduce:transition-none";

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
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <div className="absolute inset-0 -z-30" data-hero-scene-mode={sceneMode}>
        <div className={`absolute inset-0 ${sceneLayerFade} ${sceneVisible ? "invisible opacity-0" : "visible opacity-100"}`}>
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

      {/* Velos: legibilidad del texto, fundido inferior y cuadrícula técnica. */}
      <div className="grid-bg absolute inset-0 -z-20 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(4,6,10,0.2)_0%,rgba(4,6,10,0.72)_42%,var(--bg)_100%)] lg:bg-[linear-gradient(90deg,var(--bg)_0%,rgba(4,6,10,0.93)_34%,rgba(4,6,10,0.5)_62%,rgba(4,6,10,0.12)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" aria-hidden="true">
        {coreTags.map((tag) => (
          <span key={tag.text} className={`absolute font-mono text-[0.68rem] tracking-wider text-cyan-soft/60 ${tag.className}`}>
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald/70 align-middle" />
            {tag.text}
          </span>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-2xl py-12 lg:py-20 ${heroEnter} starting:translate-y-6`}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-ink-soft">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-emerald-soft">
              <span className="size-1.5 rounded-full bg-emerald" aria-hidden="true" />
              {profile.title}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" />
              {profile.location}
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(3rem,10vw,6.25rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-ink"
          >
            Sergio Carey
            <span className="gradient-text mt-3 block pb-1 text-[clamp(1.45rem,4.2vw,2.6rem)] font-medium leading-tight tracking-[-0.02em]">
              Software, IA aplicada y automatización.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Construyo backends con Python y Django, asistentes con IA que citan sus fuentes y herramientas que reemplazan
            procesos manuales por sistemas confiables.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#projects" className="btn btn-primary">
              Ver proyectos
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contactar
            </a>
            <div className="flex items-center gap-1 sm:ml-2">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (se abre en una pestaña nueva)" className={iconLink}>
                <GitHubIcon size={20} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (se abre en una pestaña nueva)" className={iconLink}>
                <LinkedInIcon size={19} />
              </a>
              <a
                href="/cv"
                className="inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-white/5 hover:text-ink"
              >
                <FileText size={17} aria-hidden="true" />
                CV
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <dl
          className={`grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line min-[480px]:grid-cols-2 lg:grid-cols-4 ${heroEnter} delay-150 starting:translate-y-4`}
        >
          {specs.map((spec) => (
            <div key={spec.label} className="bg-bg/90 px-4 py-3.5">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">{spec.label}</dt>
              <dd className="mt-1.5 text-sm font-medium text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
