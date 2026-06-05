"use client";

import { ArrowDown, ArrowUpRight, Cpu, Download, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[radial-gradient(circle_at_72%_42%,rgba(34,211,238,0.16),transparent_34rem)]" />
  ),
});

const highlights = [
  { name: "Python", detail: "Backend" },
  { name: "Django", detail: "Sistemas web" },
  { name: "IA aplicada", detail: "Asistentes" },
  { name: "Automatización", detail: "Flujos reales" },
];
const metrics = [
  { value: "4", label: "proyectos destacados" },
  { value: "IA", label: "automatización aplicada" },
  { value: "Web", label: "productos operativos" },
];
const professionalRail = [
  { label: "Base", value: "Arica, Chile" },
  { label: "Formación", value: "Inacap" },
  { label: "Stack", value: "Python / Django / IA" },
  { label: "Foco", value: "Automatización / Chatbots" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="tech-frame relative isolate flex min-h-[94svh] items-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-30">
        <Scene3D />
      </div>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_28%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_84%_64%,rgba(139,92,246,0.12),transparent_24rem),linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.97)_39%,rgba(5,6,7,0.76)_68%,rgba(5,6,7,0.36)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#050607] to-transparent" />
      <div className="absolute right-[6%] top-28 -z-10 hidden h-56 w-56 rounded-full border border-cyan-200/[0.08] bg-cyan-300/[0.025] blur-xl lg:block" />

      <div className="mx-auto grid w-full max-w-[92rem] gap-8 pb-12 lg:grid-cols-12 lg:items-center 2xl:max-w-[96rem]">
        <motion.div
          className="max-w-3xl lg:col-span-6 xl:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div className="premium-surface mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-200">
            <Sparkles size={16} className="text-cyan-200" aria-hidden="true" />
            Portafolio de desarrollo, IA y automatización
          </div>

          <h1 className="holographic-text inline-block max-w-4xl pb-2 text-5xl font-semibold leading-[1.12] sm:text-6xl lg:text-7xl">
            Sergio Carey
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-cyan-100/70 sm:text-sm">
            Sergio Enrique Carey Alegre · Inacap · Arica, Chile
          </p>
          <p className="mt-5 max-w-2xl text-xl font-medium text-emerald-50 sm:text-2xl">
            Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial y soluciones web para operaciones reales.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Desarrollo sistemas claros, automatizaciones útiles y asistentes conversacionales que conectan procesos, equipos y clientes sin perder estabilidad.
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
            <a
              href="/sergio-carey-cv.pdf"
              download
              aria-label="Descargar CV de Sergio Carey en PDF"
              className="premium-surface inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-white transition-colors hover:border-emerald-200/35 hover:bg-white/[0.09]"
            >
              Descargar CV
              <Download size={17} aria-hidden="true" />
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
        </motion.div>

        <motion.div
          className="relative hidden min-h-[27rem] lg:col-span-6 lg:block xl:col-span-5 2xl:min-h-[31rem]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.18 }}
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
        </motion.div>

        <motion.aside
          className="hidden xl:col-span-2 xl:grid xl:gap-3"
          aria-label="Datos profesionales destacados"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.25 }}
        >
          {professionalRail.map((item) => (
            <div key={item.label} className="tech-chip rounded-lg p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-100">{item.value}</p>
            </div>
          ))}
        </motion.aside>
      </div>
    </section>
  );
}
