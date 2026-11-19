import { ArrowUpRight, BookOpen, Download, Images, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import type { Project } from "@/data/projects";

type ProjectActionsProps = {
  project: Project;
  /** En la tarjeta de portada se enlaza al caso de estudio; en el caso de estudio, a la galería. */
  context: "card" | "case-study";
  hasGallery?: boolean;
  size?: "sm" | "md";
};

/**
 * Acciones de un proyecto con verbos distintos para cada destino: caso de estudio, demo (con su
 * tipo), capturas, código público o descarga. Nunca se enlaza una demo que no existe.
 */
export default function ProjectActions({ project, context, hasGallery = false, size = "md" }: ProjectActionsProps) {
  const height = size === "sm" ? "h-10 px-3.5" : "h-11 px-4";

  return (
    <div className="flex flex-wrap gap-2">
      {context === "card" ? (
        <Link href={`/proyectos/${project.slug}`} className={`btn btn-primary ${height}`} aria-label={`Ver caso de estudio de ${project.name}`}>
          <BookOpen size={15} aria-hidden="true" />
          Caso de estudio
        </Link>
      ) : null}

      {project.demo ? (
        <Link
          href={project.demo.href}
          className={`btn ${context === "case-study" ? "btn-primary" : "btn-ghost"} ${height}`}
          aria-label={`${project.demo.label}: demo ${project.demo.kind} de ${project.name}`}
        >
          <PlayCircle size={15} aria-hidden="true" />
          Ver demo
          <span className="font-mono text-[0.65rem] font-normal opacity-75">{project.demo.kind === "funcional" ? "· funcional" : "· simulada"}</span>
        </Link>
      ) : null}

      {context === "case-study" && hasGallery ? (
        <a href="#galeria" className={`btn btn-ghost ${height}`}>
          <Images size={15} aria-hidden="true" />
          Ver capturas
        </a>
      ) : null}

      {project.links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-ghost ${height}`}
          aria-label={`${link.kind === "release" ? "Descargar aplicación" : "Ver código"} de ${project.name} en GitHub (se abre en una pestaña nueva)`}
        >
          {link.kind === "release" ? <Download size={15} aria-hidden="true" /> : <GitHubIcon size={15} />}
          {link.kind === "release" ? "Descargar app" : "Ver código"}
          <ArrowUpRight size={14} aria-hidden="true" className="text-muted" />
        </a>
      ))}

      {project.links.length === 0 ? (
        <p className="inline-flex items-center gap-2 px-1 font-mono text-xs text-muted">
          <Lock size={13} aria-hidden="true" />
          Código privado
        </p>
      ) : null}
    </div>
  );
}
