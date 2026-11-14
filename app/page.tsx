import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PortfolioAssistant from "@/components/PortfolioAssistant";
import Projects from "@/components/Projects";
import RenderGate from "@/components/RenderGate";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.fullName,
      alternateName: profile.name,
      jobTitle: profile.title,
      url: siteUrl,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Arica", addressCountry: "CL" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "INACAP" },
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: ["Python", "Django", "PostgreSQL", "Inteligencia artificial aplicada", "RAG", "Automatización", "APIs REST"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: `${profile.name} — Portafolio`,
      inLanguage: "es-CL",
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
      <PortfolioAssistant />
      <RenderGate />
    </>
  );
}
