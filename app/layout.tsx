import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Fuentes autoalojadas por next/font en el build: sin peticiones a Google en runtime
// y con métricas de respaldo ajustadas para evitar desplazamientos al cargar.
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display-face", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap", preload: false });

const title = `${profile.name} · ${profile.title}`;
const description =
  "Portafolio de Sergio Carey, Ingeniero en Informática en Arica, Chile: desarrollo de software con Python y Django, IA aplicada (RAG, modelos locales) y automatización.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: `${profile.name} — Portafolio`,
  authors: [{ name: profile.fullName, url: profile.github }],
  creator: profile.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: profile.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body className="min-h-svh bg-bg font-sans text-ink">{children}</body>
    </html>
  );
}
