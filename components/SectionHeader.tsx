type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  id: string;
};

/** Encabezado editorial de sección: índice, etiqueta, título (h2) y bajada opcional. */
export default function SectionHeader({ index, eyebrow, title, lede, id }: SectionHeaderProps) {
  return (
    <header className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-muted">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id} className="mt-4 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
          {title}
        </h2>
      </div>
      {lede ? <p className="max-w-md text-base leading-relaxed text-ink-soft lg:col-span-5 lg:justify-self-end">{lede}</p> : null}
    </header>
  );
}
