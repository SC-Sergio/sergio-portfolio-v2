"use client";

import { ArrowDown, ArrowUpRight, Cpu, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(34,197,94,0.12),transparent_55%)]" />
  ),
});

const highlights = ["Python", "Django", "IA aplicada", "Automatización"];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-20">
        <Scene3D />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.95)_38%,rgba(5,6,7,0.72)_68%,rgba(5,6,7,0.38)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,#050607_96%)]" />

      <div className="mx-auto grid w-full max-w-6xl gap-10 pb-12">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.07] px-3 py-2 text-sm text-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
            <Sparkles size={16} className="text-amber-300" aria-hidden="true" />
            Portafolio de desarrollo, IA y automatización
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
            Sergio Carey
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-medium text-emerald-100 sm:text-2xl">
            Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial y soluciones web para operaciones reales.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Desarrollo sistemas claros, automatizaciones útiles y asistentes conversacionales que conectan procesos, equipos y clientes sin perder estabilidad.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 text-sm font-semibold text-[#05110c] transition-colors hover:bg-emerald-200"
            >
              Ver proyectos
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.07] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.12]"
            >
              Iniciar conversación
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.18 }}
        >
          {highlights.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
              <Cpu size={18} className="mb-3 text-cyan-200" aria-hidden="true" />
              <p className="text-sm font-medium text-zinc-100">{item}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
