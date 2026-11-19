import { BookOpen } from "lucide-react";
import Link from "next/link";
import EvidenceBadge from "@/components/EvidenceBadge";
import SubpageShell from "@/components/SubpageShell";
import type { Project } from "@/data/projects";

type DemoPageProps = {
  project: Project;
  title: string;
  /** Qué demuestra y qué no, en lenguaje directo. */
  points: string[];
  children: React.ReactNode;
};

/** Marco de una demo: título, tipo de evidencia visible, alcance y regreso al caso de estudio. */
export default function DemoPage({ project, title, points, children }: DemoPageProps) {
  const demo = project.demo!;
  return (
    <SubpageShell
      crumbs={[
        { href: "/#projects", label: "Proyectos" },
        { href: `/proyectos/${project.slug}`, label: project.name },
        { href: demo.href, label: "Demo" },
      ]}
      back={{ href: `/proyectos/${project.slug}`, label: "Volver al caso de estudio" }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <header className="grid gap-6 border-b border-line pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <EvidenceBadge kind={demo.kind} />
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">{title}</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{demo.description}</p>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <ul className="space-y-2 text-sm text-ink-soft">
              {points.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href={`/proyectos/${project.slug}`} className="link-arrow text-sm">
              <BookOpen size={15} aria-hidden="true" />
              Caso de estudio de {project.name}
            </Link>
          </div>
        </header>
        <div className="pt-8">{children}</div>
      </div>
    </SubpageShell>
  );
}
