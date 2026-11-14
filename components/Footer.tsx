import { BrandMark, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { navSections } from "@/data/navigation";
import { mailtoHref, profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <a href="#home" className="inline-flex items-center gap-2.5 rounded-md">
            <BrandMark size={30} />
            <span className="font-display font-semibold text-ink">Sergio Carey</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {profile.title} · {profile.location}. Desarrollo de software con Python y Django, IA aplicada y automatización.
          </p>
        </div>

        <nav aria-label="Secciones" className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Secciones</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm md:grid-cols-1">
            {navSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-ink-soft transition-colors hover:text-ink">
                  {section.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/cv" className="text-ink-soft transition-colors hover:text-ink">
                CV
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Contacto</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={mailtoHref} className="break-all text-ink-soft transition-colors hover:text-ink">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink">
                <GitHubIcon size={15} /> GitHub<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink">
                <LinkedInIcon size={14} /> LinkedIn<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {profile.fullName}
          </p>
          <p>
            Next.js · TypeScript · Three.js —{" "}
            <a
              href="https://github.com/SC-Sergio/sergio-portfolio-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              código fuente
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
