import { ArrowUpRight, Mail } from "lucide-react";

const footerLinks = [
  {
    href: "mailto:sergiocareyhola@gmail.com?subject=Consulta%20desde%20tu%20portafolio",
    label: "Correo",
    ariaLabel: "Enviar correo a Sergio Carey",
    icon: Mail,
  },
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

export default function Footer() {
  return (
    <footer className="cv-auto border-t border-cyan-200/[0.10] bg-[#050607]/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 text-sm text-zinc-400 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium text-zinc-200">Sergio Enrique Carey Alegre - Ingeniero Informático</p>
          <p className="mt-1">Arica, Chile · Python, Django, IA, automatización y desarrollo web.</p>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Enlaces de contacto">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            const isExternal = link.href.startsWith("http");

            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="tech-chip inline-flex h-10 items-center gap-2 rounded-md px-3 text-zinc-300 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.08] hover:text-white"
              >
                <Icon size={16} aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
