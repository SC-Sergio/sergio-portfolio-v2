import { ArrowUpRight, FileText, Mail } from "lucide-react";
import CopyEmailButton from "@/components/CopyEmailButton";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { mailtoHref, profile } from "@/data/profile";

const channels = [
  { label: "GitHub", value: `@${profile.githubHandle}`, href: profile.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", value: "Sergio Enrique Carey Alegre", href: profile.linkedin, icon: LinkedInIcon, external: true },
  { label: "CV", value: "Versión imprimible", href: "/cv", icon: FileText, external: false },
];

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="defer-render relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hud reveal relative overflow-hidden rounded-2xl px-5 py-12 sm:px-12 sm:py-16">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.16),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-7">
              <p className="eyebrow flex items-center gap-3">
                <span className="text-muted">05</span>
                <span className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" aria-hidden="true" />
                Contacto
              </p>
              <h2 id="contact-title" className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                ¿Tienes un proceso que <span className="gradient-text">automatizar</span> o un sistema que construir?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                Escríbeme con el contexto del problema. Respondo por correo y podemos seguir por la vía que te acomode.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a href={mailtoHref} className="btn btn-primary">
                  <Mail size={16} aria-hidden="true" />
                  Escribir un correo
                </a>
                <CopyEmailButton email={profile.email} />
              </div>
              <p className="mt-4 font-mono text-sm text-ink-soft">
                <a href={mailtoHref} className="break-all underline decoration-line-strong underline-offset-4 hover:text-ink">
                  {profile.email}
                </a>
              </p>
            </div>

            <ul className="min-w-0 space-y-2 lg:col-span-5">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-xl border border-line bg-bg/70 px-4 py-3.5 transition-colors hover:border-cyan/40"
                    >
                      <span className="grid size-10 place-items-center rounded-lg border border-line text-ink-soft group-hover:text-cyan-soft">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">{channel.label}</span>
                        <span className="block truncate text-sm text-muted">{channel.value}</span>
                      </span>
                      <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-cyan-soft" aria-hidden="true" />
                      {channel.external ? <span className="sr-only">(se abre en una pestaña nueva)</span> : null}
                    </a>
                  </li>
                );
              })}
              <li className="px-1 pt-2 font-mono text-xs text-muted">Base: {profile.location} · abierto a trabajo remoto</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
