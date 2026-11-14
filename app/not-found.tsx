import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-svh place-items-center bg-bg px-4">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-60" aria-hidden="true" />
      <div className="relative text-center">
        <p className="font-mono text-sm text-cyan-soft">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Esta página no existe.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">El enlace puede estar desactualizado. Vuelve al inicio para ver el portafolio.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
