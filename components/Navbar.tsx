import { ArrowUpRight, Code2 } from "lucide-react";

const links = [
  { href: "#about", label: "Sobre mí" },
  { href: "#tech", label: "Tecnologías" },
  { href: "#projects", label: "Proyectos" },
  { href: "#services", label: "Servicios" },
  { href: "#contact", label: "Contacto" },
];

const socialLinks = [
  {
    href: "https://github.com/SC-Sergio",
    label: "GitHub de Sergio Carey",
    shortLabel: "GitHub",
    icon: ArrowUpRight,
  },
  {
    href: "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
    label: "LinkedIn de Sergio Carey",
    shortLabel: "LinkedIn",
    icon: ArrowUpRight,
  },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.12] bg-[#050607]/[0.76] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#home" className="group flex items-center gap-3 text-sm font-semibold text-white">
          <span className="grid size-9 place-items-center rounded-md border border-emerald-300/[0.35] bg-emerald-300/10 text-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.12)] transition-colors group-hover:border-cyan-200/40 group-hover:text-cyan-100">
            <Code2 size={18} aria-hidden="true" />
          </span>
          <span>Sergio Carey</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 lg:flex" aria-label="Perfiles profesionales">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  title={link.shortLabel}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-zinc-300 transition-colors hover:border-cyan-200/40 hover:bg-cyan-200/[0.08] hover:text-white"
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{link.shortLabel}</span>
                </a>
              );
            })}
          </div>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md border border-emerald-300/40 bg-emerald-300/[0.06] px-3 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-300/[0.12]"
          >
            Hablemos
          </a>
        </div>
      </nav>
    </header>
  );
}
