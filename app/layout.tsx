import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sergio Carey | Ingeniero Informático",
  description:
    "Portafolio de Sergio Carey, Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial, automatización, chatbots y desarrollo web.",
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
