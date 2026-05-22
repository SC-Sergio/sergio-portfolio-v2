import { CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { services } from "@/data/skills";

export default function Services() {
  return (
    <AnimatedSection id="services" className="border-y border-white/10 bg-[#080a0a] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-amber-200">Servicios y experiencia</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Ayudo a convertir procesos dispersos en herramientas claras y mantenibles.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="flex min-h-72 flex-col rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-zinc-300">{service.description}</p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-zinc-200">
                    <CheckCircle2 size={17} className="shrink-0 text-emerald-300" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
