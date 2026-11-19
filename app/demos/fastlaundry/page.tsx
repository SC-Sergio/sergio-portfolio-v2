import type { Metadata } from "next";
import DemoPage from "@/components/demos/DemoPage";
import FastLaundryDemo from "@/components/demos/FastLaundryDemo";
import { projects } from "@/data/projects";

const project = projects.find((item) => item.slug === "fastlaundry")!;

export const metadata: Metadata = {
  title: "Demo conceptual de gestión de lavandería",
  description: "Prototipo conceptual con datos simulados: pedidos, estados, caja y roles. No conectado al sistema empresarial real.",
  alternates: { canonical: "/demos/fastlaundry" },
  openGraph: { title: "Demo conceptual de gestión de lavandería", url: "/demos/fastlaundry" },
};

export default function Page() {
  return (
    <DemoPage
      project={project}
      title="Pedidos, estados, caja y roles"
      points={[
        "Crea un pedido, cámbiale el estado según el rol y regístralo en caja.",
        "Marca «LavaFlow» y clientes inventados; precios de ejemplo.",
        "Todo ocurre en tu navegador y se borra al recargar: no hay servidor ni base de datos.",
        "No muestra la interfaz, el código ni las reglas exactas del sistema original.",
      ]}
    >
      <FastLaundryDemo />
    </DemoPage>
  );
}
