import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/components/PrintButton";
import { education, experience, languages, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { stackGroups } from "@/data/skills";

export const metadata: Metadata = {
  title: "CV",
  description: `Currículum de ${profile.fullName}, ${profile.title}: experiencia, formación, stack y proyectos.`,
  alternates: { canonical: "/cv" },
};

const cvProjects = projects.filter((project) => ["pegasus", "carey-assistant", "fastlaundry", "literalura"].includes(project.slug));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6 print:border-slate-300 print:pt-3">
      <h2 className="break-after-avoid font-mono text-xs uppercase tracking-[0.18em] text-cyan-soft print:text-slate-600">{title}</h2>
      <div className="mt-4 print:mt-2.5">{children}</div>
    </section>
  );
}

export default function CvPage() {
  return (
    <div className="min-h-svh bg-bg print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-line bg-bg/95">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al portafolio
          </Link>
          <PrintButton />
        </div>
      </div>

      <main id="main" className="mx-auto max-w-4xl space-y-8 px-4 py-10 text-ink sm:px-6 sm:py-14 print:max-w-none print:space-y-4 print:p-0 print:text-slate-900">
        <header>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl print:text-3xl">{profile.fullName}</h1>
          <p className="mt-2 text-lg text-cyan-soft print:text-base print:text-slate-700">
            {profile.title} · {profile.role}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft print:text-slate-700">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} className="underline underline-offset-4">
                github.com/{profile.githubHandle}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} className="underline underline-offset-4">
                LinkedIn
              </a>
            </li>
          </ul>
          <p className="mt-5 max-w-3xl leading-relaxed text-ink-soft print:text-slate-800">{profile.summary}</p>
        </header>

        <Section title="Experiencia">
          <ol className="space-y-5 print:space-y-3">
            {experience.map((item) => (
              <li key={`${item.organization}-${item.title}`} className="grid break-inside-avoid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <p className="font-mono text-xs text-muted print:text-slate-500">{item.period}</p>
                <div>
                  <p className="font-medium">
                    {item.title} · <span className="text-ink-soft print:text-slate-700">{item.organization}</span>
                  </p>
                  {item.detail ? <p className="mt-1 text-sm leading-relaxed text-ink-soft print:text-slate-700">{item.detail}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Proyectos seleccionados">
          <ul className="space-y-4 print:space-y-3">
            {cvProjects.map((project) => (
              <li key={project.slug} className="break-inside-avoid">
                <p className="font-medium">
                  {project.name} <span className="font-mono text-xs text-muted print:text-slate-500">· {project.status}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft print:text-slate-700">{project.summary}</p>
                <p className="mt-1 font-mono text-xs text-muted print:text-slate-500">{project.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Formación">
          <ul className="space-y-3">
            {education.map((item) => (
              <li key={item.title} className="grid break-inside-avoid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <p className="font-mono text-xs text-muted print:text-slate-500">{item.period}</p>
                <p>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-ink-soft print:text-slate-700"> · {item.organization}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Stack técnico">
          <dl className="grid gap-3 sm:grid-cols-2">
            {stackGroups.map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <dt className="text-sm font-medium">{group.title}</dt>
                <dd className="mt-0.5 text-sm text-ink-soft print:text-slate-700">{group.items.map((item) => item.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Idiomas">
          <p className="text-sm text-ink-soft print:text-slate-700">
            {languages.map((language) => `${language.name} (${language.level.toLowerCase()})`).join(" · ")}
          </p>
        </Section>
      </main>
    </div>
  );
}
