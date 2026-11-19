import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import EvidenceBadge from "@/components/EvidenceBadge";
import Gallery from "@/components/Gallery";
import ProjectActions from "@/components/ProjectActions";
import ProjectFlow from "@/components/ProjectFlow";
import SubpageShell from "@/components/SubpageShell";
import ForoHubExplorer from "@/components/demos/ForoHubExplorer";
import TerminalTranscript from "@/components/TerminalTranscript";
import { literaluraRun } from "@/data/literalura-run";
import { mediaById, mediaFor } from "@/data/media";
import { projects, type Project } from "@/data/projects";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const cover = project.cover ? mediaById(project.cover) : undefined;
  const title = `${project.name} · Caso de estudio`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `/proyectos/${project.slug}`,
      ...(cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

function Block({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Material propio de cada proyecto (demo embebida o transcripción) cuando existe. */
function ProjectExtra({ project }: { project: Project }) {
  if (project.slug === "forohub") {
    return (
      <Block id="api-title" eyebrow="Consola de API" title="Probar los endpoints (simulación)">
        <ForoHubExplorer />
      </Block>
    );
  }
  if (project.slug === "literalura") {
    return (
      <Block id="terminal-title" eyebrow="Ejecución real" title="Sesión de consola">
        <TerminalTranscript run={literaluraRun} />
      </Block>
    );
  }
  return null;
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const gallery = mediaFor(project.slug);
  const cover = project.cover ? mediaById(project.cover) : undefined;
  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const { caseStudy } = project;

  return (
    <SubpageShell crumbs={[{ href: "/#projects", label: "Proyectos" }, { href: `/proyectos/${project.slug}`, label: project.name }]}>
      <article aria-labelledby="project-title">
        <header className="relative overflow-hidden">
          <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pt-14">
            <div className="lg:col-span-6">
              <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
                <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-ink-soft">{project.category}</span>
                <span>{project.context}</span>
              </p>
              <h1 id="project-title" className="mt-5 font-display text-[clamp(2.2rem,6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                {project.name}
              </h1>
              <p className="mt-2 font-mono text-sm text-cyan-soft/85">{project.status}</p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{project.summary}</p>
              <div className="mt-8">
                <ProjectActions project={project} context="case-study" hasGallery={gallery.length > 0} />
              </div>
              {project.demo ? (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                  <span className="mr-2 align-middle">
                    <EvidenceBadge kind={project.demo.kind} />
                  </span>
                  {project.demo.description}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-6">
              {cover ? (
                <figure className="hud overflow-hidden rounded-2xl p-2">
                  <div className={`relative aspect-[16/10] overflow-hidden rounded-xl ${cover.light ? "bg-white" : "bg-bg"}`}>
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      preload
                      sizes="(min-width: 1024px) 600px, 100vw"
                      className={cover.light ? "object-contain p-3" : "object-cover object-top"}
                    />
                  </div>
                  <figcaption className="flex flex-wrap items-center gap-2 px-2 pb-1 pt-3 text-xs text-muted">
                    <EvidenceBadge kind={cover.kind} />
                    {cover.caption}
                  </figcaption>
                </figure>
              ) : (
                <div className="hud rounded-2xl p-6 sm:p-8">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Arquitectura</p>
                  <div className="mt-5">
                    <ProjectFlow steps={project.flow} label={project.name} />
                  </div>
                  <p className="mt-6 flex gap-2 text-sm leading-relaxed text-muted">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald" aria-hidden="true" />
                    {project.links.length === 0
                      ? "Sin capturas del sistema original: es un sistema privado y no hay autorización para difundir su interfaz."
                      : "Sin capturas: es un proyecto de backend o consola; abajo está su evidencia técnica."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <section aria-labelledby="problem-title" className="panel rounded-2xl p-6 sm:p-8">
              <h2 id="problem-title" className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Problema
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{project.problem}</p>
            </section>
            <section aria-labelledby="contribution-title" className="panel rounded-2xl p-6 sm:p-8">
              <h2 id="contribution-title" className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Mi contribución
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{project.contribution}</p>
            </section>
          </div>

          <Block id="architecture-title" eyebrow="Arquitectura" title="Cómo funciona">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ol className="space-y-3">
                  {caseStudy.architecture.map((step, i) => (
                    <li key={step} className="flex gap-4 rounded-xl border border-line bg-surface/60 p-4">
                      <span className="font-mono text-xs text-cyan-soft" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed text-ink-soft">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-xl border border-line bg-bg-raised p-5">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Flujo</p>
                  <div className="mt-4">
                    <ProjectFlow steps={project.flow} label={project.name} />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Tecnologías</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tecnologías">
                    {project.stack.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Características</p>
                  <ul className="mt-3 space-y-2">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Block>

          <Block id="decisions-title" eyebrow="Decisiones" title="Decisiones de ingeniería">
            <ul className="grid gap-4 md:grid-cols-2">
              {caseStudy.decisions.map((decision) => (
                <li key={decision.title} className="panel card-hover rounded-xl p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{decision.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{decision.detail}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="results-title" eyebrow="Resultados" title="Resultados y pruebas">
            <ul className="space-y-3">
              {caseStudy.results.map((result) => (
                <li key={result} className="flex gap-3 text-ink-soft">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald" aria-hidden="true" />
                  <span className="leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </Block>

          <ProjectExtra project={project} />

          {gallery.length > 0 ? (
            <section id="galeria" aria-labelledby="gallery-title" className="scroll-mt-24">
              <p className="eyebrow">Galería</p>
              <h2 id="gallery-title" className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Capturas
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">Cada imagen indica si es una captura real (y de qué entorno) o un resultado del notebook.</p>
              <div className="mt-6">
                <Gallery items={gallery} label={project.name} />
              </div>
            </section>
          ) : null}

          <Block id="limits-title" eyebrow="Estado real" title="Limitaciones">
            <ul className="space-y-3">
              {caseStudy.limitations.map((limit) => (
                <li key={limit} className="flex gap-3 text-ink-soft">
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                  <span className="leading-relaxed">{limit}</span>
                </li>
              ))}
            </ul>
            {project.note ? <p className="mt-6 border-l border-violet/40 pl-3 text-sm text-muted">{project.note}</p> : null}
            <p className="mt-6 font-mono text-xs leading-relaxed text-muted">Fuentes: {caseStudy.sources}</p>
          </Block>

          <nav aria-label="Otros proyectos" className="grid gap-3 border-t border-line pt-10 sm:grid-cols-2">
            <Link href={`/proyectos/${prev.slug}`} className="panel card-hover group rounded-xl p-5">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                <ArrowLeft size={13} aria-hidden="true" /> Anterior
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-ink">{prev.name}</span>
            </Link>
            <Link href={`/proyectos/${next.slug}`} className="panel card-hover group rounded-xl p-5 text-right">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                Siguiente <ArrowRight size={13} aria-hidden="true" />
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-ink">{next.name}</span>
            </Link>
          </nav>
        </div>
      </article>
    </SubpageShell>
  );
}
