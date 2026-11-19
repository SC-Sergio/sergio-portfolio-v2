import type { Metadata } from "next";
import DemoPage from "@/components/demos/DemoPage";
import PegasusDemo from "@/components/demos/PegasusDemo";
import { projects } from "@/data/projects";

const project = projects.find((item) => item.slug === "pegasus")!;

export const metadata: Metadata = {
  title: "Demo de Pegasus · recuperación RAG",
  description: "Explora la recuperación real de Pegasus Knowledge Center: fuentes, páginas, distancias coseno y abstención sobre un corpus ficticio.",
  alternates: { canonical: "/demos/pegasus" },
  openGraph: { title: "Demo de Pegasus · recuperación RAG", url: "/demos/pegasus", images: [{ url: "/media/pegasus/local-inicio.webp", width: 1440, height: 900 }] },
};

export default function Page() {
  return (
    <DemoPage
      project={project}
      title="Recuperación RAG con fuentes y abstención"
      points={[
        "Las 23 consultas predefinidas muestran lo que devolvió el pipeline real el 19-nov-2026.",
        "Las preguntas fuera del corpus terminan en abstención, igual que en la app.",
        "No se genera texto con IA: se muestra la evidencia que recibiría Gemini.",
        "Corpus: 5 PDF de la empresa ficticia del challenge, públicos en el repositorio.",
      ]}
    >
      <PegasusDemo />
    </DemoPage>
  );
}
