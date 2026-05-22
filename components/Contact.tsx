import { ArrowUpRight, Mail, MessageSquareText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-lg border border-white/10 bg-white/[0.06] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Contacto</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Conversemos sobre el sistema, bot o automatización que quieres construir.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            Puedo ayudarte a definir alcance, priorizar una primera versión y convertir una operación manual en una herramienta digital estable.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-lg border border-white/10 bg-[#050607]/[0.72] p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-1 text-cyan-200" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-white">Correo directo</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">Ideal para proyectos, soporte y propuestas de automatización.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquareText size={20} className="mt-1 text-amber-200" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-white">Primer diagnóstico</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">Reviso el flujo actual y propongo un camino simple para avanzar.</p>
              </div>
            </div>
          </div>

          <a
            href="mailto:"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 text-sm font-semibold text-[#05110c] transition-colors hover:bg-emerald-200"
          >
            Enviar correo
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
