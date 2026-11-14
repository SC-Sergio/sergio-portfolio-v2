"use client";

import { Printer } from "lucide-react";

/** Abre el diálogo de impresión; desde ahí se puede guardar el CV como PDF. */
export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary h-9 px-3.5 text-[0.8125rem]">
      <Printer size={15} aria-hidden="true" />
      Imprimir / PDF
    </button>
  );
}
