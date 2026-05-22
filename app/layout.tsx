import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sergio Carey | Ingeniero Informático",
  description:
    "Portafolio de Sergio Enrique Carey Alegre, Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial, automatización, chatbots y desarrollo web.",
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
  openGraph: {
    title: "Sergio Carey | Ingeniero Informático",
    description:
      "Portafolio profesional de Sergio Enrique Carey Alegre: desarrollo web, automatización, chatbots e IA aplicada con Python y Django.",
    locale: "es_CL",
    siteName: "Sergio Carey",
    type: "website",
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
