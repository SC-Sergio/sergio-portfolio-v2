"use client";

import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import EvidenceBadge from "@/components/EvidenceBadge";

type Post = { id: number; title: string; content: string; author: string; createdAt: string };

// Datos ficticios. Los campos siguen la entidad Post del repositorio (id, title, content, author, createdAt).
const seed: Post[] = [
  {
    id: 1,
    title: "¿Cómo versionar el esquema con Flyway?",
    content: "Probé con ddl-auto=update y prefiero migraciones explícitas. ¿Alguna convención para nombrarlas?",
    author: "ana.dev",
    createdAt: "2026-11-02T10:15:00",
  },
  {
    id: 2,
    title: "Separar controlador y servicio",
    content: "¿Vale la pena una capa de servicio si el controlador solo llama al repositorio?",
    author: "luis.backend",
    createdAt: "2026-11-03T18:40:00",
  },
];

type Endpoint = "list" | "create";
type Exchange = { request: string; status: string; body: string };

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

/**
 * Simulación en el navegador de los dos endpoints reales de ForoHub (GET y POST /api/posts).
 * No hay red: el estado vive en memoria de la pestaña y se pierde al recargar.
 */
export default function ForoHubExplorer() {
  const [posts, setPosts] = useState<Post[]>(seed);
  const [endpoint, setEndpoint] = useState<Endpoint>("list");
  const [draft, setDraft] = useState(pretty({ title: "Mi primera publicación", content: "Hola, ForoHub.", author: "invitado" }));
  const [exchange, setExchange] = useState<Exchange | null>(null);

  const send = () => {
    if (endpoint === "list") {
      setExchange({ request: "GET /api/posts", status: "200 OK", body: pretty(posts) });
      return;
    }
    let payload: Partial<Post>;
    try {
      payload = JSON.parse(draft);
    } catch {
      setExchange({
        request: "POST /api/posts",
        status: "400 Bad Request",
        body: pretty({ error: "JSON mal formado", detalle: "Revisa comas y comillas del cuerpo." }),
      });
      return;
    }
    // El backend real no valida campos; aquí se avisa para que la simulación no oculte esa limitación.
    const missing = ["title", "content", "author"].filter((key) => typeof payload[key as keyof Post] !== "string" || !(payload[key as keyof Post] as string).trim());
    if (missing.length > 0) {
      setExchange({
        request: "POST /api/posts",
        status: "500 Internal Server Error",
        body: pretty({
          error: "La columna no admite NULL",
          campos: missing,
          nota: "Simulación del comportamiento esperado: el backend no valida la entrada y la restricción NOT NULL de la migración V1 rechaza el INSERT.",
        }),
      });
      return;
    }
    const created: Post = {
      id: posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1,
      title: String(payload.title).slice(0, 255),
      content: String(payload.content),
      author: String(payload.author).slice(0, 100),
      createdAt: new Date().toISOString().slice(0, 19),
    };
    setPosts((current) => [...current, created]);
    setExchange({ request: "POST /api/posts", status: "200 OK", body: pretty(created) });
  };

  const reset = () => {
    setPosts(seed);
    setExchange(null);
  };

  return (
    <div className="panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <EvidenceBadge kind="simulada" />
        <p className="text-xs text-muted">Sin conexión a ningún servidor · datos en memoria de esta pestaña</p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="space-y-4 border-b border-line p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <fieldset>
            <legend className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Endpoint</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["list", "GET", "Listar publicaciones"],
                  ["create", "POST", "Crear publicación"],
                ] as const
              ).map(([value, method, text]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 has-[:checked]:border-cyan/50 has-[:checked]:bg-cyan/5"
                >
                  <input type="radio" name="forohub-endpoint" value={value} checked={endpoint === value} onChange={() => setEndpoint(value)} className="accent-cyan-400" />
                  <span>
                    <span className={`font-mono text-xs font-semibold ${method === "GET" ? "text-emerald-soft" : "text-cyan-soft"}`}>{method}</span>{" "}
                    <span className="font-mono text-xs text-ink">/api/posts</span>
                    <span className="block text-xs text-muted">{text}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {endpoint === "create" ? (
            <div>
              <label htmlFor="forohub-body" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Cuerpo JSON
              </label>
              <textarea
                id="forohub-body"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={6}
                spellCheck={false}
                className="mt-2 w-full rounded-lg border border-line-strong bg-bg p-3 font-mono text-xs text-ink focus:border-cyan/60 focus:outline-none"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={send} className="btn btn-primary h-10 px-4">
              <Play size={15} aria-hidden="true" />
              Enviar solicitud
            </button>
            <button type="button" onClick={reset} className="btn btn-ghost h-10 px-3.5">
              <RotateCcw size={15} aria-hidden="true" />
              Reiniciar datos
            </button>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5" aria-live="polite">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Respuesta</p>
          {exchange ? (
            <div className="mt-3">
              <p className="font-mono text-xs text-ink-soft">
                {exchange.request} →{" "}
                <span className={exchange.status.startsWith("200") ? "text-emerald-soft" : "text-amber-200"} data-testid="forohub-status">
                  {exchange.status}
                </span>
              </p>
              <pre tabIndex={0} className="mt-3 max-h-80 overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-xs leading-relaxed text-ink-soft">
                {exchange.body}
              </pre>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Elige un endpoint y envía la solicitud para ver la respuesta simulada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
