"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import EvidenceBadge from "@/components/EvidenceBadge";
import type { MediaItem } from "@/data/media";

type GalleryProps = {
  items: MediaItem[];
  /** Nombre del proyecto, para las etiquetas accesibles. */
  label: string;
};

/**
 * Galería con miniaturas y visor ampliado. El visor usa <dialog> nativo (foco atrapado, Escape y
 * fondo inerte los resuelve el navegador); las flechas navegan y el foco vuelve a la miniatura.
 * Las imágenes grandes solo se piden al abrir el visor.
 */
export default function Gallery({ items, label }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const lastIndex = useRef(0);

  const open = (i: number) => {
    lastIndex.current = i;
    setLoaded(false);
    setIndex(i);
  };

  const close = useCallback(() => dialogRef.current?.close(), []);

  const go = useCallback(
    (delta: number) => {
      setLoaded(false);
      setIndex((current) => (current === null ? current : (current + delta + items.length) % items.length));
    },
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) dialog.showModal();
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // El foco vuelve a la miniatura que abrió el visor (no a la imagen que se estaba viendo).
    const onClose = () => {
      setIndex(null);
      requestAnimationFrame(() => triggerRefs.current[lastIndex.current]?.focus());
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={`Galería de ${label}`}>
        {items.map((item, i) => (
          <li key={item.id}>
            <figure className="group overflow-hidden rounded-xl border border-line bg-surface">
              <button
                ref={(node) => {
                  triggerRefs.current[i] = node;
                }}
                type="button"
                onClick={() => open(i)}
                className={`relative block aspect-[16/10] w-full overflow-hidden ${item.light ? "bg-white" : "bg-bg"}`}
                aria-label={`Ampliar imagen ${i + 1} de ${items.length}: ${item.caption}`}
                aria-haspopup="dialog"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                  className={`transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none ${item.light ? "object-contain p-2" : "object-cover object-top"}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-md border border-line-strong bg-bg/85 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  <Maximize2 size={14} />
                </span>
              </button>
              <figcaption className="space-y-2 border-t border-line p-3.5">
                <EvidenceBadge kind={item.kind} />
                <p className="text-sm leading-relaxed text-ink-soft">{item.caption}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        aria-label={current ? `Imagen ${index! + 1} de ${items.length} de ${label}` : `Visor de ${label}`}
        className="m-auto max-h-[100dvh] w-full max-w-6xl bg-transparent p-2 text-ink backdrop:bg-black/85 sm:p-4"
      >
        {current ? (
          <div className="flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-xl border border-line-strong bg-bg-raised">
            <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 sm:px-4">
              <p className="font-mono text-xs text-muted" aria-live="polite">
                {index! + 1} / {items.length}
              </p>
              <button type="button" onClick={close} className="grid size-10 place-items-center rounded-md text-ink-soft hover:bg-white/5 hover:text-ink" aria-label="Cerrar visor">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className={`relative min-h-0 flex-1 ${current.light ? "bg-white" : "bg-bg"}`}>
              {!loaded ? (
                <div className="absolute inset-0 grid place-items-center" role="status">
                  <span className="font-mono text-xs text-muted">Cargando imagen…</span>
                </div>
              ) : null}
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1152px) 1120px, 100vw"
                onLoad={() => setLoaded(true)}
                className="mx-auto h-auto max-h-[70dvh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-line p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="min-w-0 space-y-1.5">
                <EvidenceBadge kind={current.kind} />
                <p className="text-sm text-ink-soft">{current.caption}</p>
                <p className="text-xs text-muted">{current.origin}</p>
              </div>
              {items.length > 1 ? (
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => go(-1)} className="btn btn-ghost h-10 px-3" aria-label="Imagen anterior">
                    <ChevronLeft size={16} aria-hidden="true" />
                    Anterior
                  </button>
                  <button type="button" onClick={() => go(1)} className="btn btn-ghost h-10 px-3" aria-label="Imagen siguiente">
                    Siguiente
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
