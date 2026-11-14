"use client";

import { FileText, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { navSections } from "@/data/navigation";
import { profile } from "@/data/profile";

const LG_QUERY = "(min-width: 1024px)";

/** Sección visible bajo el navbar, para marcar el enlace activo. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // La primera sección (en orden de página) que cruza la franja central.
        setActive(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const sectionIds = navSections.map((section) => section.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Borde y fondo más marcados al salir del Hero; un solo listener pasivo.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: Escape cierra y devuelve el foco; un clic fuera o pasar a desktop también cierra.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) close();
    };
    const media = window.matchMedia(LG_QUERY);
    const onMedia = () => media.matches && close();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    media.addEventListener("change", onMedia);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      media.removeEventListener("change", onMedia);
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-bg/95" : "border-transparent bg-bg/70"
      }`}
    >
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <nav aria-label="Principal" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="group flex items-center gap-2.5 rounded-md" onClick={() => close()}>
          <BrandMark size={30} />
          <span className="font-display text-[0.95rem] font-semibold tracking-tight text-ink">
            Sergio Carey
            <span className="ml-2 hidden font-mono text-[0.7rem] font-normal text-muted sm:inline">/ software engineer</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navSections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {section.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-cyan to-emerald transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Sergio Carey (se abre en una pestaña nueva)"
            className="hidden size-10 place-items-center rounded-md text-ink-soft transition-colors hover:bg-white/5 hover:text-ink md:grid"
          >
            <GitHubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Sergio Carey (se abre en una pestaña nueva)"
            className="hidden size-10 place-items-center rounded-md text-ink-soft transition-colors hover:bg-white/5 hover:text-ink md:grid"
          >
            <LinkedInIcon size={17} />
          </a>
          <a href="#contact" className="btn btn-primary ml-1 hidden h-9 px-3.5 text-[0.8125rem] sm:inline-flex">
            Contactar
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-10 place-items-center rounded-md border border-line text-ink transition-colors hover:bg-white/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!open}
        className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-bg px-4 pb-6 pt-2 sm:px-6 lg:hidden"
      >
        <ul className="divide-y divide-line">
          {navSections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                onClick={() => close()}
                className="flex items-center justify-between py-3.5 text-base text-ink aria-[current=true]:text-cyan-soft"
              >
                {section.label}
                <span className="font-mono text-xs text-muted" aria-hidden="true">0{index + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-11 px-2" onClick={() => close()}>
            <GitHubIcon size={16} /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-11 px-2" onClick={() => close()}>
            <LinkedInIcon size={15} /> LinkedIn
          </a>
          <a href="/cv" className="btn btn-ghost h-11 px-2" onClick={() => close()}>
            <FileText size={16} aria-hidden="true" /> CV
          </a>
        </div>
        <a href="#contact" className="btn btn-primary mt-3 w-full" onClick={() => close()}>
          Contactar
        </a>
      </div>
    </header>
  );
}
