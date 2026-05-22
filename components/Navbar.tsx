import { Code2 } from "lucide-react";

const links = [
  { href: "#about", label: "Sobre mí" },
  { href: "#tech", label: "Tecnologías" },
  { href: "#projects", label: "Proyectos" },
  { href: "#services", label: "Servicios" },
  { href: "#contact", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050607]/[0.82] backdrop-blur-xl">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#home" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="grid size-9 place-items-center rounded-md border border-emerald-300/[0.35] bg-emerald-300/10 text-emerald-200">
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

        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-md border border-emerald-300/40 px-3 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-300/[0.12]"
        >
          Hablemos
        </a>
      </nav>
    </header>
  );
}
