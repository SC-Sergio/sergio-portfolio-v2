"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Copia el correo al portapapeles y anuncia el resultado a lectores de pantalla. */
export default function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 2500);
  };

  return (
    <>
      <button type="button" onClick={copy} className="btn btn-ghost" data-copy-state={state}>
        {state === "copied" ? <Check size={16} aria-hidden="true" className="text-emerald" /> : <Copy size={16} aria-hidden="true" />}
        {state === "copied" ? "Copiado" : "Copiar correo"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "copied" ? "Correo copiado al portapapeles" : state === "error" ? `No se pudo copiar. El correo es ${email}` : ""}
      </span>
    </>
  );
}
