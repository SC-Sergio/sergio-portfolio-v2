import type { Metadata } from "next";
import Link from "next/link";
import DemoPage from "@/components/demos/DemoPage";
import SpaceXDashboard from "@/components/demos/SpaceXDashboard";
import { projects } from "@/data/projects";

const project = projects.find((item) => item.slug === "spacex")!;

export const metadata: Metadata = {
  title: "Dashboard SpaceX Falcon 9",
  description: "Lanzamientos por sitio, éxito por órbita y comparación de clasificadores, con las cifras almacenadas en el notebook del proyecto.",
  alternates: { canonical: "/demos/spacex" },
  openGraph: { title: "Dashboard SpaceX Falcon 9", url: "/demos/spacex", images: [{ url: "/media/spacex/sitio-vs-carga.webp", width: 1054, height: 495 }] },
};

export default function Page() {
  return (
    <DemoPage
      project={project}
      title="Aterrizajes de Falcon 9 en cifras"
      points={[
        "Cifras copiadas de las salidas del notebook (consultas SQL y reportes de clasificación).",
        "Nada se recalcula: los datasets originales no están en el repositorio.",
        "El conjunto de prueba tiene 18 lanzamientos: las diferencias entre modelos son orientativas.",
      ]}
    >
      <SpaceXDashboard />
      <p className="mt-6 text-sm text-muted">
        Los gráficos originales del notebook (matplotlib y seaborn) están en la{" "}
        <Link href="/proyectos/spacex#galeria" className="link-arrow">
          galería del caso de estudio
        </Link>
        .
      </p>
    </DemoPage>
  );
}
