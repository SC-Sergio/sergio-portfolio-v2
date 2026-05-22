import { BrainCircuit, ShieldCheck, Workflow } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const principles = [
  {
    icon: Workflow,
    title: "Procesos primero",
    text: "Antes de programar, ordeno el flujo real: roles, estados, datos críticos y puntos de control.",
  },
  {
    icon: ShieldCheck,
    title: "Estabilidad visible",
    text: "Priorizo cambios incrementales, trazabilidad y pantallas entendibles para usuarios operativos.",
  },
  {
    icon: BrainCircuit,
    title: "IA con propósito",
    text: "Uso automatización e inteligencia artificial para resolver tareas concretas, no para decorar productos.",
  },
];

export default function About() {
  return (
    <AnimatedSection id="about" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Sobre mí</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Desarrollo soluciones sobrias para problemas que necesitan orden y continuidad.
          </h2>
        </div>

        <div className="space-y-6 text-base leading-8 text-zinc-300">
          <p>
            Soy Sergio Carey, Ingeniero Informático. Trabajo principalmente con Python y Django, combinando desarrollo web, automatización, chatbots, IA aplicada y soporte técnico.
          </p>
          <p>
            Mi enfoque está en construir herramientas que ayuden a operar mejor: sistemas internos, flujos de atención, ecommerce simples, integraciones y asistentes que reduzcan trabajo manual.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article key={principle.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <Icon size={22} className="text-amber-300" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">{principle.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{principle.text}</p>
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
