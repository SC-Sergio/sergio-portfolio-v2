import { ArrowUpRight, Bot, BrainCircuit, Database, Truck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { labProjects, projects } from "@/data/projects";

const projectIcons = [Truck, Bot, BrainCircuit, Database];
const accentClasses = [
  "text-emerald-200 bg-emerald-300/10",
  "text-cyan-200 bg-cyan-300/10",
  "text-violet-200 bg-violet-300/10",
  "text-amber-200 bg-amber-300/10",
];

export default function Projects() {
  return (
    <AnimatedSection id="projects" className="cv-auto relative mx-auto w-full max-w-[92rem] px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end xl:grid xl:grid-cols-12">
        <div className="max-w-3xl xl:col-span-7">
          <p className="text-sm font-semibold text-emerald-200">Proyectos</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Sistemas con foco en operación, IA aplicada, datos y experiencia de usuario.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-zinc-400 xl:col-span-4 xl:col-start-9">
          Una selección de proyectos reales y académicos que muestran backend, desktop, data science, integración de APIs y automatización.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:gap-5">
        {projects.map((project, index) => {
          const Icon = projectIcons[index] ?? ArrowUpRight;
          const accent = accentClasses[index] ?? accentClasses[0];
          const hasLinks = Boolean(project.repositoryUrl || project.demoUrl);

          return (
            <article
              key={project.name}
              className="premium-card group rounded-lg p-5 xl:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`grid size-11 place-items-center rounded-md border border-white/10 shadow-[0_0_28px_rgba(34,211,238,0.06)] ${accent}`}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className="flex flex-col items-end gap-2">
                  <span className="tech-chip rounded-md px-3 py-1 font-mono text-xs font-medium text-zinc-300">
                    {project.focus}
                  </span>
                  <span className="rounded-md border border-cyan-200/[0.18] bg-cyan-200/[0.05] px-3 py-1 font-mono text-[11px] text-cyan-100/80">
                    {project.status}
                  </span>
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-white">{project.name}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{project.summary}</p>
              <div className="mt-5 grid gap-3 2xl:grid-cols-3">
                <div className="border-l-2 border-violet-200/[0.35] pl-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Problema</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{project.problem}</p>
                </div>
                <div className="border-l-2 border-cyan-200/[0.45] pl-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Resultado</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-200">{project.result}</p>
                </div>
                <div className="border-l-2 border-emerald-200/[0.38] pl-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Impacto</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{project.impact}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="tech-chip rounded-md px-2.5 py-1 text-xs text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>

              {project.accessNote ? (
                <p className="mt-5 font-mono text-xs text-zinc-500">{project.accessNote}</p>
              ) : null}

              {hasLinks ? (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.08] pt-5">
                  {project.repositoryUrl ? (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="tech-chip inline-flex h-10 items-center gap-2 rounded-md px-3.5 text-sm font-medium text-zinc-100 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.08] hover:text-white"
                    >
                      Ver repositorio
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-300 px-3.5 text-sm font-semibold text-[#05110c] transition-colors hover:bg-emerald-200"
                    >
                      Ver demo
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="premium-surface mt-8 rounded-lg p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Laboratorio / más proyectos</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Repositorios y exploraciones públicas</h3>
          </div>
          <a
            href="https://github.com/SC-Sergio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100 transition-colors hover:text-white"
          >
            Ver GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {labProjects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="tech-chip rounded-lg p-4 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.08]"
              aria-label={`Ver ${project.name} en GitHub`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-semibold text-white">{project.name}</span>
                <ArrowUpRight size={15} className="text-cyan-200" aria-hidden="true" />
              </span>
              <span className="mt-3 block text-sm leading-6 text-zinc-400">{project.description}</span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
