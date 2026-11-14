import { Briefcase, GraduationCap } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { education, experience, type TimelineItem } from "@/data/profile";

const principles = [
  {
    title: "Entender el proceso antes del código",
    text: "Primero ordeno el flujo real: roles, estados, datos críticos y puntos de control. El software viene después.",
  },
  {
    title: "Cambios pequeños y verificables",
    text: "Pruebas, integración continua y documentación honesta: lo que el README dice es lo que el código hace.",
  },
  {
    title: "IA con límites claros",
    text: "Modelos que citan sus fuentes, se abstienen sin evidencia o corren localmente cuando la privacidad importa.",
  },
];

function Timeline({ items, label, icon: Icon }: { items: TimelineItem[]; label: string; icon: typeof Briefcase }) {
  return (
    <div>
      <h3 className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <Icon size={15} className="text-cyan-soft" aria-hidden="true" />
        {label}
      </h3>
      <ol className="mt-5 space-y-0">
        {items.map((item) => (
          <li key={`${item.organization}-${item.title}`} className="relative border-l border-line pb-6 pl-5 last:pb-0">
            <span className="absolute -left-[4.5px] top-1.5 size-2 rounded-full border border-cyan/60 bg-bg" aria-hidden="true" />
            <p className="font-mono text-[0.72rem] text-cyan-soft/80">{item.period}</p>
            <p className="mt-1 font-medium text-ink">{item.title}</p>
            <p className="text-sm text-ink-soft">{item.organization}</p>
            {item.detail ? <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{item.detail}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="about-title"
          index="01"
          eyebrow="Perfil"
          title={
            <>
              Ingeniero en Informática que construye <span className="gradient-text">software útil</span> para problemas
              reales.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="reveal space-y-5 text-[1.0625rem] leading-relaxed text-ink-soft lg:col-span-7">
            <p>
              Soy Sergio Enrique Carey Alegre, Ingeniero en Informática titulado en INACAP y Técnico Analista Programador.
              Vivo en Arica, Chile, y desarrollo software con foco en backend, inteligencia artificial aplicada y
              automatización.
            </p>
            <p>
              Hoy desarrollo un sistema Django en operación para la gestión de pedidos de una lavandería. Antes construí
              chatbots con herramientas de IA en Python y, en paralelo, proyectos propios: un asistente RAG con fuentes
              trazables, una aplicación de escritorio con modelos locales y backends en Java y Spring Boot.
            </p>
            <p>
              Me gusta el trabajo que deja procesos más claros que antes: modelos de datos ordenados, flujos explícitos y
              herramientas que el equipo puede mantener.
            </p>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line pt-0 sm:grid-cols-3">
              {principles.map((principle, index) => (
                <li key={principle.title} className="bg-bg-raised p-5">
                  <span className="font-mono text-xs text-violet">0{index + 1}</span>
                  <p className="mt-2 font-medium leading-snug text-ink">{principle.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{principle.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hud reveal space-y-9 rounded-xl p-6 sm:p-8 lg:col-span-5">
            <Timeline items={experience} label="Experiencia" icon={Briefcase} />
            <div className="glow-rule" aria-hidden="true" />
            <Timeline items={education} label="Formación" icon={GraduationCap} />
          </div>
        </div>
      </div>
    </section>
  );
}
