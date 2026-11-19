import { mediaKindLabel, type MediaKind } from "@/data/media";
import type { DemoKind } from "@/data/projects";

const tone: Record<MediaKind | DemoKind, string> = {
  "captura-local": "border-emerald/35 bg-emerald/10 text-emerald-soft",
  "captura-historica": "border-cyan/35 bg-cyan/10 text-cyan-soft",
  "resultado-notebook": "border-cyan/35 bg-cyan/10 text-cyan-soft",
  "demo-simulada": "border-amber-300/40 bg-amber-300/10 text-amber-200",
  funcional: "border-emerald/35 bg-emerald/10 text-emerald-soft",
  simulada: "border-amber-300/40 bg-amber-300/10 text-amber-200",
};

const demoLabel: Record<DemoKind, string> = {
  funcional: "Demo funcional · datos reales del proyecto",
  simulada: "Demo simulada · datos ficticios",
};

/** Etiqueta visible del tipo de evidencia: nunca se presenta una simulación como captura real. */
export default function EvidenceBadge({ kind }: { kind: MediaKind | DemoKind }) {
  const text = kind === "funcional" || kind === "simulada" ? demoLabel[kind] : mediaKindLabel[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] ${tone[kind]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {text}
    </span>
  );
}
