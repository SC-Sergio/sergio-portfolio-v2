import { BrainCircuit, Database, LayoutTemplate, Server, Wrench } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { stackGroups } from "@/data/skills";

const icons: Record<string, typeof Server> = {
  backend: Server,
  data: Database,
  ai: BrainCircuit,
  frontend: LayoutTemplate,
  devops: Wrench,
};

// Disposición tipo bento: IA ocupa más espacio porque es el eje del perfil.
const spans: Record<string, string> = {
  backend: "lg:col-span-4",
  data: "lg:col-span-4",
  ai: "lg:col-span-4 lg:row-span-2",
  frontend: "lg:col-span-4",
  devops: "lg:col-span-4",
};

export default function TechStack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="defer-render relative border-y border-line bg-bg-raised py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="stack-title"
          index="02"
          eyebrow="Stack"
          title="Tecnologías que he usado en proyectos concretos."
          lede="Sin barras ni porcentajes: cada tecnología indica dónde puedes verla en uso."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {stackGroups.map((group) => {
            const Icon = icons[group.id] ?? Server;
            return (
              <article key={group.id} className={`panel card-hover reveal rounded-xl p-6 ${spans[group.id] ?? "lg:col-span-4"}`}>
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan-soft">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{group.description}</p>
                  </div>
                </div>
                <ul className="mt-5 divide-y divide-line/70">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
                      <span className="text-[0.9375rem] font-medium text-ink">{item.name}</span>
                      <span className="font-mono text-[0.7rem] text-muted">{item.evidence}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
