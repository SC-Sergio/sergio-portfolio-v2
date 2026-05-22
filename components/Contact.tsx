import { ArrowUpRight, Mail, MessageSquareText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const email = "sergiocareyhola@gmail.com";
const mailHref = `mailto:${email}?subject=Consulta%20desde%20tu%20portafolio`;
const contactLinks = [
  {
    href: "https://github.com/SC-Sergio",
    label: "GitHub",
    ariaLabel: "Abrir GitHub de Sergio Carey",
    icon: ArrowUpRight,
  },
  {
    href: "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
    label: "LinkedIn",
    ariaLabel: "Abrir LinkedIn de Sergio Carey",
    icon: ArrowUpRight,
  },
];

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="cv-auto mx-auto w-full max-w-[86rem] px-4 py-20 sm:px-6 lg:px-8">
      <div className="premium-surface grid gap-8 rounded-lg p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8 xl:gap-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-emerald-200">Contacto</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Conversemos sobre el sistema, bot o automatización que quieres construir.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            Puedo ayudarte a definir alcance, priorizar una primera versión y convertir una operación manual en una herramienta digital estable.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="tech-chip rounded-lg p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Contacto profesional</p>
              <p className="mt-2 text-sm font-medium text-zinc-100">Sergio Enrique Carey Alegre</p>
            </div>
            <div className="tech-chip rounded-lg p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Base</p>
              <p className="mt-2 text-sm font-medium text-zinc-100">Arica, Chile · Inacap</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-1 text-cyan-200" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-white">Correo directo</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Ideal para proyectos, soporte y propuestas de automatización.
                </p>
                <a
                  href={mailHref}
                  className="mt-2 inline-flex text-sm font-medium text-emerald-100 underline decoration-emerald-300/50 transition-colors hover:text-white"
                >
                  {email}
                </a>
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

          <address className="flex flex-wrap gap-2 not-italic" aria-label="Perfiles de contacto">
            {contactLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.ariaLabel}
                  target="_blank"
                  rel="noreferrer"
                  className="tech-chip inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.08] hover:text-white"
                >
                  <Icon size={16} aria-hidden="true" />
                  {link.label}
                </a>
              );
            })}
          </address>

          <a
            href={mailHref}
            aria-label={`Enviar correo a ${email}`}
            className="glow-button inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 text-sm font-semibold text-[#05110c] transition-colors hover:bg-emerald-200"
          >
            Enviar correo
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
