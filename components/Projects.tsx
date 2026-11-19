import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EvidenceBadge from "@/components/EvidenceBadge";
import ProjectActions from "@/components/ProjectActions";
import ProjectFlow from "@/components/ProjectFlow";
import SectionHeader from "@/components/SectionHeader";
import { mediaById } from "@/data/media";
import { labProjects, projects, type Project, type ProjectCategory } from "@/data/projects";
import { profile } from "@/data/profile";

const categoryTone: Record<ProjectCategory, string> = {
  "IA aplicada": "border-violet/35 bg-violet/10 text-violet-soft",
  Backend: "border-emerald/35 bg-emerald/10 text-emerald-soft",
  Datos: "border-cyan/35 bg-cyan/10 text-cyan-soft",
  Escritorio: "border-sky-300/35 bg-sky-300/10 text-sky-200",
};

/** Portada real (o rotulada) del proyecto; diferida porque la sección está bajo el pliegue. */
function ProjectCover({ project, sizes }: { project: Project; sizes: string }) {
  const cover = project.cover ? mediaById(project.cover) : undefined;
  if (!cover) return null;
  return (
    <Link href={`/proyectos/${project.slug}#galeria`} className="group block overflow-hidden rounded-xl border border-line" aria-label={`Ver capturas de ${project.name}`}>
      <span className={`relative block aspect-[16/9] overflow-hidden ${cover.light ? "bg-white" : "bg-bg"}`}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          className={`transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none ${cover.light ? "object-contain p-2" : "object-cover object-top"}`}
        />
      </span>
      <span className="flex items-center justify-between gap-2 border-t border-line bg-bg-raised px-3 py-2">
        <EvidenceBadge kind={cover.kind} />
        <span className="font-mono text-[0.68rem] text-muted transition-colors group-hover:text-cyan-soft">Ver capturas →</span>
      </span>
    </Link>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] ${categoryTone[project.category]}`}>
        {project.category}
      </span>
      <span className="font-mono text-[0.7rem] text-muted">{project.context}</span>
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article
      id={`project-${project.slug}`}
      aria-labelledby={`project-${project.slug}-title`}
      className="hud reveal relative grid gap-10 overflow-hidden rounded-2xl p-6 sm:p-10 lg:grid-cols-12"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProjectMeta project={project} />
          <span className="chip">{project.status}</span>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-cyan-soft/80">Proyecto destacado</p>
        <h3 id={`project-${project.slug}-title`} className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{project.summary}</p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Problema</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Mi contribución</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{project.contribution}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <ProjectActions project={project} context="card" size="sm" />
        </div>
      </div>

      <div className="relative space-y-7 lg:col-span-5">
        <ProjectCover project={project} sizes="(min-width: 1024px) 460px, 100vw" />
        <div className="rounded-xl border border-line bg-bg/60 p-5">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Arquitectura</p>
          <div className="mt-4">
            <ProjectFlow steps={project.flow} label={project.name} />
          </div>
        </div>
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Características</p>
          <ul className="mt-3 space-y-2.5">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologías">
          {project.stack.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
        {project.note ? <p className="border-l border-violet/40 pl-3 text-xs leading-relaxed text-muted">{project.note}</p> : null}
      </div>
    </article>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      id={`project-${project.slug}`}
      aria-labelledby={`project-${project.slug}-title`}
      className="panel card-hover reveal flex flex-col rounded-2xl p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ProjectMeta project={project} />
        <span className="font-mono text-xs text-muted" aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 id={`project-${project.slug}-title`} className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
        {project.name}
      </h3>
      <p className="mt-1 font-mono text-[0.72rem] text-cyan-soft/80">{project.status}</p>
      <p className="mt-4 leading-relaxed text-ink-soft">{project.summary}</p>

      {project.cover ? (
        <div className="mt-5">
          <ProjectCover project={project} sizes="(min-width: 768px) 560px, 100vw" />
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border border-line bg-bg/50 p-4">
        <ProjectFlow steps={project.flow} label={project.name} />
      </div>

      <details className="group mt-5 rounded-lg border border-line open:bg-bg/40">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
          Problema, contribución y características
          <span aria-hidden="true" className="font-mono text-cyan-soft transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="space-y-4 px-4 pb-4 text-sm leading-relaxed text-ink-soft">
          <p>
            <span className="font-medium text-ink">Problema. </span>
            {project.problem}
          </p>
          <p>
            <span className="font-medium text-ink">Contribución. </span>
            {project.contribution}
          </p>
          <ul className="space-y-1.5">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologías">
        {project.stack.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>

      {project.note ? <p className="mt-4 text-xs leading-relaxed text-muted">{project.note}</p> : null}

      <div className="mt-auto pt-6">
        <ProjectActions project={project} context="card" size="sm" />
      </div>
    </article>
  );
}

export default function Projects() {
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const rest = projects.filter((project) => project !== featured);

  return (
    <section id="projects" aria-labelledby="projects-title" className="defer-render relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="projects-title"
          index="03"
          eyebrow="Proyectos"
          title="Proyectos reales, con su contexto y estado tal como son."
          lede="Cada proyecto tiene su caso de estudio con evidencia rotulada: capturas reales, demos funcionales o simulaciones, y los privados se marcan como tales."
        />

        <div className="mt-14 space-y-5">
          <FeaturedProject project={featured} />
          <div className="grid gap-5 md:grid-cols-2">
            {rest.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index + 2} />
            ))}
          </div>
        </div>

        <div className="reveal mt-16 rounded-2xl border border-dashed border-line-strong p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Laboratorio</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">Ejercicios y proyectos de formación</h3>
            </div>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-arrow text-sm">
              Todo en GitHub
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {labProjects.map((project) => (
              <li key={project.name}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-lg border border-line bg-bg-raised p-4 transition-colors hover:border-cyan/35"
                >
                  <span className="flex items-center justify-between gap-3 font-medium text-ink">
                    <span className="min-w-0 [overflow-wrap:anywhere]">{project.name}</span>
                    <ArrowUpRight size={15} className="shrink-0 text-muted transition-colors group-hover:text-cyan-soft" aria-hidden="true" />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{project.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
