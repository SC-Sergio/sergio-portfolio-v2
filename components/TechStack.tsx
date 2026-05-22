import { Boxes, TerminalSquare, Wrench } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { skillGroups } from "@/data/skills";

const icons = [TerminalSquare, Boxes, Wrench];

export default function TechStack() {
  return (
    <AnimatedSection id="tech" className="cv-auto tech-frame border-y border-cyan-200/[0.10] bg-white/[0.018] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-cyan-200">Tecnologías</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Stack práctico para crear, integrar y mantener productos digitales.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 xl:gap-5">
          {skillGroups.map((group, index) => {
            const Icon = icons[index] ?? TerminalSquare;

            return (
              <article key={group.title} className="premium-card rounded-lg p-5 xl:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md border border-cyan-200/[0.16] bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.08)]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="tech-chip rounded-md px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-cyan-200/30 hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
