import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PortfolioAssistant from "@/components/PortfolioAssistant";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sergio Enrique Carey Alegre",
  alternateName: "Sergio Carey",
  jobTitle: "Ingeniero Informático",
  email: "mailto:sergiocareyhola@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Arica, Chile",
  },
  sameAs: [
    "https://github.com/SC-Sergio",
    "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
  ],
  knowsAbout: [
    "Python",
    "Django",
    "Inteligencia Artificial",
    "automatización",
    "chatbots",
    "APIs",
    "desarrollo web",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
      <PortfolioAssistant />
    </div>
  );
}
