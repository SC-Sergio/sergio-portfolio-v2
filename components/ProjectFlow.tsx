/** Flujo técnico del proyecto como cadena de nodos (HTML accesible, se adapta al ancho). */
export default function ProjectFlow({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={`Flujo técnico de ${label}`} className="flex flex-wrap items-center gap-y-2">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center">
          <span className="rounded-md border border-line-strong bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] text-ink-soft">{step}</span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="mx-1.5 flex items-center text-cyan/70">
              <span className="h-px w-3 bg-current sm:w-5" />
              <span className="size-0 border-y-[3px] border-l-[5px] border-y-transparent border-l-current" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
