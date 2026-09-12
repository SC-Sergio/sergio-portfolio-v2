import { BrainCircuit, ShieldCheck, Workflow } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { profileCredentials } from "@/data/skills";

const principles = [
  {
    icon: Workflow,
    title: "Procesos primero",
    text: "Antes de programar, ordeno el flujo real: roles, estados, datos críticos, integraciones y puntos de control.",
  },
  {
    icon: ShieldCheck,
    title: "Estabilidad visible",
    text: "Priorizo cambios incrementales, trazabilidad, CI y experiencias entendibles para usuarios y equipos operativos.",
  },
  {
    icon: BrainCircuit,
    title: "IA con propósito",
    text: "Uso modelos locales, asistentes y automatización para resolver tareas concretas, no como una capa decorativa del producto.",
  },
];

export default function About() {
  return (
    <AnimatedSection id="about" className="cv-auto mx-auto w-full max-w-[92rem] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:grid-cols-12">
        <div className="xl:col-span-5">
          <p className="text-sm font-semibold text-emerald-200">Sobre mí</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Desarrollo software útil para problemas que necesitan orden, automatización y continuidad.
          </h2>
        </div>

        <div className="max-w-3xl space-y-6 text-base leading-8 text-zinc-300 xl:col-span-7 xl:ml-auto">
          <p>
            Soy Sergio Enrique Carey Alegre, Ingeniero Informático formado en Inacap. Mi trabajo combina backend con Python/Django y Java/Spring Boot, bases de datos, automatización, IA aplicada y desarrollo de productos web y de escritorio.
          </p>
          <p>
            Me interesa convertir necesidades reales en sistemas mantenibles: desde plataformas operativas y proyectos de datos hasta asistentes locales, integraciones de APIs y herramientas de productividad.
          </p>
        </div>
      </div>

      <div className="premium-surface mt-12 rounded-lg p-5 md:p-6 xl:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Perfil profesional</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Credenciales y foco técnico</h3>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-400">
            Backend, datos, IA aplicada y producto conectados por una forma de trabajo incremental y verificable.
          </p>
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profileCredentials.map((credential) => (
            <div key={credential.label} className="tech-chip rounded-lg p-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                {credential.label}
              </dt>
              <dd className="mt-2 text-sm font-medium leading-6 text-zinc-100">{credential.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3 xl:gap-5">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article key={principle.title} className="premium-card rounded-lg p-5 xl:p-6">
              <Icon size={22} className="text-cyan-200" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">{principle.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{principle.text}</p>
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
