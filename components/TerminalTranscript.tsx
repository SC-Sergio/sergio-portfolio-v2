import type { TerminalRun } from "@/data/literalura-run";

/**
 * Transcripción literal de una ejecución real de consola. Las líneas escritas por el usuario
 * (entrada estándar) se destacan; el resto es la salida tal cual la imprimió el programa.
 */
export default function TerminalTranscript({ run }: { run: TerminalRun }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line-strong bg-[#05080d]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-amber-300/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-emerald/70" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-xs text-muted">{run.command}</span>
      </div>
      <pre
        tabIndex={0}
        aria-label={`Transcripción de la ejecución: ${run.command}`}
        className="max-h-[32rem] overflow-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink-soft sm:p-5"
      >
        {run.lines.map((line, i) =>
          line.input ? (
            <span key={i} className="block">
              {line.prompt ? <span>{line.prompt}</span> : null}
              <span className="text-cyan-soft">{line.text}</span>
            </span>
          ) : (
            <span key={i} className="block min-h-[1lh]">
              {line.text}
            </span>
          ),
        )}
      </pre>
      <figcaption className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted">{run.caption}</figcaption>
    </figure>
  );
}
