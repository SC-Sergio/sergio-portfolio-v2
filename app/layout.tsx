import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Sergio Carey | Ingeniero Informático",
  description:
    "Portafolio de Sergio Enrique Carey Alegre, Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial, automatización, chatbots y desarrollo web.",
  metadataBase: new URL(siteUrl),
  authors: [{ name: "Sergio Enrique Carey Alegre" }],
  creator: "Sergio Enrique Carey Alegre",
  keywords: [
    "Sergio Carey",
    "Sergio Enrique Carey Alegre",
    "Ingeniero Informático",
    "Python",
    "Django",
    "Inteligencia Artificial",
    "automatización",
    "chatbots",
    "desarrollo web",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sergio Carey | Ingeniero Informático",
    description:
      "Portafolio profesional de Sergio Enrique Carey Alegre: desarrollo web, automatización, chatbots e IA aplicada con Python y Django.",
    url: "/",
    locale: "es_CL",
    siteName: "Sergio Carey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sergio Carey | Ingeniero Informático",
    description:
      "Portafolio profesional de Sergio Enrique Carey Alegre: Python, Django, IA, automatización y desarrollo web.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
