import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { services } from "@/data/skills";

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative border-y border-line bg-bg-raised py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="services-title"
          index="04"
          eyebrow="Servicios"
          title="Problemas que puedo ayudarte a resolver."
          lede="Cada capacidad enlaza al proyecto donde ya la apliqué."
        />

        <ol className="mt-14 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <li key={service.title} className="reveal group grid gap-4 py-7 md:grid-cols-12 md:gap-8">
              <div className="flex items-baseline gap-4 md:col-span-4">
                <span className="font-mono text-sm text-violet">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-cyan-soft">
                  {service.title}
                </h3>
              </div>
              <p className="text-ink-soft md:col-span-3">
                <span className="sr-only">Problema: </span>
                {service.problem}
              </p>
              <p className="text-muted md:col-span-3">
                <span className="sr-only">Enfoque: </span>
                {service.approach}
              </p>
              <div className="md:col-span-2 md:text-right">
                <a href={service.evidence.href} className="link-arrow font-mono text-xs">
                  <span className="sr-only">Ver proyecto de referencia: </span>
                  {service.evidence.label}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
        <p className="reveal mt-6 font-mono text-xs text-muted">
          Sin precios publicados: cada alcance se conversa según el problema y sus restricciones.
        </p>
      </div>
    </section>
  );
}
