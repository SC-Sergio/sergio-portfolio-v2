import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { BrandMark, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/data/profile";

type Crumb = { href: string; label: string };

type SubpageShellProps = {
  children: React.ReactNode;
  /** Migas de pan después de «Inicio»; la última es la página actual. */
  crumbs: Crumb[];
  /** Enlace de regreso principal (por defecto, a la sección de proyectos). */
  back?: Crumb;
};

/**
 * Marco común de los casos de estudio y las demos: cabecera fija liviana (sin JS), migas de pan,
 * regreso explícito al portafolio y pie con contacto. El navbar de la portada no se reutiliza porque
 * sus anclas apuntan a secciones que aquí no existen.
 */
export default function SubpageShell({ children, crumbs, back = { href: "/#projects", label: "Volver a proyectos" } }: SubpageShellProps) {
  return (
    <div className="min-h-svh bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <nav aria-label="Principal" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-md">
            <BrandMark size={28} />
            <span className="font-display text-[0.95rem] font-semibold tracking-tight text-ink">Sergio Carey</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Link href={back.href} className="btn btn-ghost h-9 px-3 text-[0.8125rem]">
              <ArrowLeft size={15} aria-hidden="true" />
              <span className="hidden min-[400px]:inline">{back.label}</span>
              <span className="min-[400px]:hidden">Volver</span>
            </Link>
            {/* .btn fija display, así que el ocultamiento en móvil va en un contenedor. */}
            <span className="hidden sm:inline-flex">
              <Link href="/#contact" className="btn btn-primary h-9 px-3.5 text-[0.8125rem]">
                Contactar
              </Link>
            </span>
          </div>
        </nav>
      </header>

      <nav aria-label="Ruta de navegación" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Inicio
            </Link>
          </li>
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="text-ink-soft">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-ink">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <footer className="mt-24 border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {profile.name} · {profile.title}
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <Link href="/#projects" className="rounded-md px-2.5 py-2 hover:text-ink">
              Todos los proyectos
            </Link>
            <Link href="/cv" className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 hover:text-ink">
              <FileText size={15} aria-hidden="true" />
              CV
            </Link>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (se abre en una pestaña nueva)" className="grid size-10 place-items-center rounded-md hover:text-ink">
              <GitHubIcon size={17} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (se abre en una pestaña nueva)" className="grid size-10 place-items-center rounded-md hover:text-ink">
              <LinkedInIcon size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
