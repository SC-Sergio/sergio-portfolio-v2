import { Boxes, TerminalSquare, Wrench } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { skillGroups } from "@/data/skills";

const icons = [TerminalSquare, Boxes, Wrench];

export default function TechStack() {
  return (
    <AnimatedSection id="tech" className="border-y border-white/10 bg-white/[0.025] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-cyan-200">Tecnologías</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Stack práctico para crear, integrar y mantener productos digitales.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = icons[index] ?? TerminalSquare;

            return (
              <article key={group.title} className="rounded-lg border border-white/10 bg-[#0b0f0d] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-1.5 text-sm text-zinc-200"
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
