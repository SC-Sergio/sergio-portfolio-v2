"use client";

import { Ban, CheckCircle2, FileText, Loader2, Search, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Source = { source: string; page: number; chunk: number; distance: number; text: string };
type Rejected = Omit<Source, "text">;
type Result = { question: string; inScope: boolean; sources: Source[]; rejected: Rejected[] };
type Meta = {
  generatedAt: string;
  embeddingModel: string;
  topK: number;
  maxCosineDistance: number;
  documents: string[];
  pages: number;
  chunks: number;
};
type Dataset = { meta: Meta; results: Result[] };
type Chunk = { s: string; p: number; c: number; t: string };
type LexicalHit = { source: string; page: number; chunk: number; score: number; text: string };

type View =
  | { mode: "real"; result: Result }
  | { mode: "lexical"; question: string; hits: LexicalHit[] }
  | { mode: "loading"; question: string }
  | { mode: "error"; message: string };

const groups: { label: string; range: [number, number] }[] = [
  { label: "Arquitectura y microservicios", range: [0, 5] },
  { label: "Onboarding", range: [5, 9] },
  { label: "Incidentes y SRE", range: [9, 14] },
  { label: "Front-end", range: [14, 17] },
  { label: "Back-end", range: [17, 20] },
  { label: "Fuera del corpus (prueba de abstención)", range: [20, 23] },
];

const docTitle = (name: string) => name.replace(/\.pdf$/i, "");

function relevance(distance: number) {
  if (distance <= 0.25) return { label: "Alta", tone: "text-emerald-soft border-emerald/40 bg-emerald/10" };
  if (distance <= 0.5) return { label: "Media", tone: "text-amber-200 border-amber-300/40 bg-amber-300/10" };
  return { label: "Baja", tone: "text-red-300 border-red-400/40 bg-red-400/10" };
}

// ─── Búsqueda léxica BM25 (solo para preguntas libres) ─────────────────────
const STOP = new Set(
  "a al algo como con cual cuales cuál cuáles de del el en es esta este esto la las lo los mas más me mi no o para por que qué se sin sobre su sus un una uno unos y ya debe deben hace hacer tiene tienen hay son ser".split(" "),
);
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
const tokenize = (text: string) => normalize(text).match(/[a-z0-9ñ]{2,}/g)?.filter((token) => !STOP.has(token)) ?? [];

type Index = { docs: { chunk: Chunk; tf: Map<string, number>; len: number }[]; df: Map<string, number>; avg: number };

function buildIndex(chunks: Chunk[]): Index {
  const df = new Map<string, number>();
  const docs = chunks.map((chunk) => {
    const tokens = tokenize(chunk.t);
    const tf = new Map<string, number>();
    for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
    for (const token of tf.keys()) df.set(token, (df.get(token) ?? 0) + 1);
    return { chunk, tf, len: tokens.length };
  });
  const avg = docs.reduce((sum, doc) => sum + doc.len, 0) / Math.max(docs.length, 1);
  return { docs, df, avg };
}

function bm25(index: Index, query: string, k = 4): LexicalHit[] {
  const terms = [...new Set(tokenize(query))];
  const n = index.docs.length;
  const scored = index.docs.map((doc) => {
    let score = 0;
    for (const term of terms) {
      const f = doc.tf.get(term);
      if (!f) continue;
      const df = index.df.get(term) ?? 0;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (doc.len / index.avg))));
    }
    return { doc, score };
  });
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ doc, score }) => ({ source: doc.chunk.s, page: doc.chunk.p, chunk: doc.chunk.c, score: Math.round(score * 100) / 100, text: doc.chunk.t }));
}

/** Umbral léxico mínimo: por debajo, la demo también se abstiene. Calibrado a mano, no es el gate real. */
const LEXICAL_MIN_SCORE = 6;

// ─── Interfaz ───────────────────────────────────────────────────────────────
function Pipeline({ abstained, lexical }: { abstained: boolean; lexical: boolean }) {
  const steps = lexical
    ? ["Pregunta", "Tokens", "BM25 en el navegador", "Top-4", abstained ? "Abstención" : "Fragmentos"]
    : ["Pregunta", "Embedding", "ChromaDB Top-4", "Gate coseno ≤ 0,65", abstained ? "Abstención" : "Contexto trazable"];
  return (
    <ol aria-label="Etapas de la consulta" className="flex flex-wrap items-center gap-y-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center">
          <span
            className={`rounded-md border px-2.5 py-1 font-mono text-[0.7rem] ${
              i === steps.length - 1
                ? abstained
                  ? "border-amber-300/50 bg-amber-300/10 text-amber-200"
                  : "border-emerald/50 bg-emerald/10 text-emerald-soft"
                : "border-line-strong bg-bg/70 text-ink-soft"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 ? <span aria-hidden="true" className="mx-1.5 h-px w-4 bg-cyan/60" /> : null}
        </li>
      ))}
    </ol>
  );
}

function SourceCard({ index, title, meta, badge, text, bar }: { index: number; title: string; meta: string; badge?: React.ReactNode; text: string; bar?: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-line bg-surface/70">
      <details className="group" open={index === 0}>
        <summary className="flex cursor-pointer list-none flex-col gap-2 p-4 [&::-webkit-details-marker]:hidden">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
              <FileText size={15} className="shrink-0 text-cyan-soft" aria-hidden="true" />
              <span className="min-w-0 [overflow-wrap:anywhere]">
                Fuente {index + 1}: {title}
              </span>
            </span>
            {badge}
          </span>
          <span className="font-mono text-xs text-muted">{meta}</span>
          {bar}
        </summary>
        <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-soft">{text}</p>
      </details>
    </li>
  );
}

export default function PegasusDemo() {
  const [data, setData] = useState<Dataset | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const indexRef = useRef<Index | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/demos/pegasus/retrieval.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Dataset>;
      })
      .then((json) => {
        if (!alive) return;
        setData(json);
        setSelected("11");
        setView({ mode: "real", result: json.results[11] });
      })
      .catch(() => alive && setLoadError("No se pudieron cargar las recuperaciones precalculadas. Recarga la página para reintentar."));
    return () => {
      alive = false;
    };
  }, []);

  const options = useMemo(() => data?.results ?? [], [data]);

  const pick = (value: string) => {
    setSelected(value);
    const result = options[Number(value)];
    if (result) setView({ mode: "real", result });
  };

  const runCustom = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = custom.trim().replace(/\s+/g, " ");
    if (!question) return;
    if (question.length > 300) {
      setView({ mode: "error", message: "La pregunta supera 300 caracteres. Acórtala para buscar." });
      return;
    }
    setSelected("");
    setView({ mode: "loading", question });
    try {
      if (!indexRef.current) {
        const response = await fetch("/demos/pegasus/chunks.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        indexRef.current = buildIndex((await response.json()) as Chunk[]);
      }
      const hits = bm25(indexRef.current, question);
      setView({ mode: "lexical", question, hits: hits.length && hits[0].score >= LEXICAL_MIN_SCORE ? hits : [] });
    } catch {
      setView({ mode: "error", message: "No se pudo cargar el corpus de chunks. Revisa tu conexión y vuelve a intentar." });
    }
  };

  const threshold = data?.meta.maxCosineDistance ?? 0.65;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="min-w-0 space-y-5 lg:col-span-4">
        <div className="panel rounded-2xl p-5">
          <label htmlFor="pegasus-question" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            Pregunta de prueba (recuperación real)
          </label>
          <select
            id="pegasus-question"
            value={selected}
            onChange={(event) => pick(event.target.value)}
            disabled={!data}
            className="mt-3 w-full rounded-lg border border-line-strong bg-bg p-2.5 text-sm text-ink focus:border-cyan/60 focus:outline-none disabled:opacity-60"
          >
            <option value="" disabled>
              {data ? "Elige una pregunta…" : "Cargando preguntas…"}
            </option>
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {options.slice(group.range[0], group.range[1]).map((result, i) => (
                  <option key={result.question} value={String(group.range[0] + i)}>
                    {result.question}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Resultados calculados con el pipeline real de Pegasus (embeddings + ChromaDB) y guardados tal cual. Tu navegador no ejecuta el modelo.
          </p>
        </div>

        <form onSubmit={runCustom} className="panel rounded-2xl p-5">
          <label htmlFor="pegasus-custom" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            Pregunta libre (búsqueda léxica)
          </label>
          <div className="mt-3 flex gap-2">
            <input
              id="pegasus-custom"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              maxLength={300}
              placeholder="Ej.: rollback durante un incidente"
              className="min-w-0 flex-1 rounded-lg border border-line-strong bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-cyan/60 focus:outline-none"
            />
            <button type="submit" className="btn btn-primary h-auto px-3.5" aria-label="Buscar en el corpus">
              <Search size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Busca con BM25 en tu navegador sobre los {data?.meta.chunks ?? 312} chunks reales. Es una aproximación por palabras, no el modelo de embeddings.
          </p>
        </form>

        {data ? (
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line text-center">
            {[
              ["PDF", data.meta.documents.length],
              ["Páginas", data.meta.pages],
              ["Chunks", data.meta.chunks],
            ].map(([label, value]) => (
              <div key={label} className="bg-bg-raised px-2 py-3">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="mt-1 font-display text-xl text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </aside>

      <section aria-label="Resultado de la consulta" aria-live="polite" className="min-w-0 lg:col-span-8">
        {loadError ? (
          <div role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-5 text-sm text-red-200">
            {loadError}
          </div>
        ) : !view ? (
          <div className="panel grid min-h-64 place-items-center rounded-2xl p-6" role="status">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Cargando recuperaciones reales…
            </span>
          </div>
        ) : view.mode === "error" ? (
          <div role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-5 text-sm text-red-200">
            {view.message}
          </div>
        ) : view.mode === "loading" ? (
          <div className="panel grid min-h-64 place-items-center rounded-2xl p-6" role="status">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Indexando 312 chunks en tu navegador…
            </span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="panel rounded-2xl p-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Pregunta</p>
              <p className="mt-2 font-display text-xl text-ink" data-testid="pegasus-question">
                {view.mode === "real" ? view.result.question : view.question}
              </p>
              <div className="mt-4">
                <Pipeline abstained={view.mode === "real" ? view.result.sources.length === 0 : view.hits.length === 0} lexical={view.mode === "lexical"} />
              </div>
            </div>

            {view.mode === "real" ? (
              view.result.sources.length === 0 ? (
                <div className="rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5" data-testid="pegasus-abstention">
                  <p className="flex items-center gap-2 font-medium text-amber-100">
                    <Ban size={17} aria-hidden="true" />
                    Abstención: no hay evidencia suficientemente relevante
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-100/85">
                    Los 4 vecinos más cercanos superan la distancia máxima de {threshold.toFixed(2).replace(".", ",")}, así que Pegasus no llama a Gemini.
                  </p>
                  <ul className="mt-4 space-y-1.5 font-mono text-xs text-amber-100/80">
                    {view.result.rejected.map((item) => (
                      <li key={`${item.source}-${item.page}-${item.chunk}`}>
                        descartado · {docTitle(item.source)} · p. {item.page} · distancia {item.distance.toFixed(3)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-emerald/30 bg-emerald/5 p-5">
                    <p className="flex items-center gap-2 font-medium text-emerald-soft">
                      <CheckCircle2 size={17} aria-hidden="true" />
                      {view.result.sources.length} fuentes superan el gate
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      En la app, estos fragmentos y sus metadatos forman el contexto que recibe Gemini para redactar la respuesta. Esta demo no genera texto con IA: muestra la evidencia
                      exacta que el modelo recibiría.
                    </p>
                  </div>
                  <ol className="space-y-3" data-testid="pegasus-sources">
                    {view.result.sources.map((source, i) => {
                      const level = relevance(source.distance);
                      return (
                        <SourceCard
                          key={`${source.source}-${source.page}-${source.chunk}`}
                          index={i}
                          title={docTitle(source.source)}
                          meta={`Página ${source.page} · chunk ${source.chunk} · distancia coseno ${source.distance.toFixed(4)}`}
                          badge={<span className={`rounded-full border px-2 py-0.5 font-mono text-[0.65rem] ${level.tone}`}>Relevancia {level.label}</span>}
                          bar={
                            <span className="relative block h-1.5 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
                              <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald to-cyan" style={{ width: `${Math.max(4, (1 - source.distance / threshold) * 100)}%` }} />
                            </span>
                          }
                          text={source.text}
                        />
                      );
                    })}
                  </ol>
                </>
              )
            ) : view.hits.length === 0 ? (
              <div className="rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5" data-testid="pegasus-abstention">
                <p className="flex items-center gap-2 font-medium text-amber-100">
                  <Ban size={17} aria-hidden="true" />
                  Sin coincidencias suficientes en el corpus
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-100/85">
                  La búsqueda léxica no encontró fragmentos con suficientes términos en común. Prueba con palabras del dominio (incidente, onboarding, microservicios, front-end…).
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/5 p-4 text-sm leading-relaxed text-amber-100/90">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Resultado de búsqueda léxica (BM25) en el navegador: sirve para explorar el corpus real, pero no es la recuperación semántica de Pegasus ni aplica su umbral coseno.
                </div>
                <ol className="space-y-3" data-testid="pegasus-sources">
                  {view.hits.map((hit, i) => (
                    <SourceCard
                      key={`${hit.source}-${hit.page}-${hit.chunk}`}
                      index={i}
                      title={docTitle(hit.source)}
                      meta={`Página ${hit.page} · chunk ${hit.chunk} · puntaje BM25 ${hit.score}`}
                      text={hit.text}
                    />
                  ))}
                </ol>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
