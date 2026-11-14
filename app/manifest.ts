import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sergio Carey — Portafolio",
    short_name: "Sergio Carey",
    description: "Ingeniero en Informática: software, IA aplicada y automatización.",
    start_url: "/",
    display: "browser",
    background_color: "#04060a",
    theme_color: "#04060a",
    lang: "es-CL",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
