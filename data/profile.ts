// Identidad profesional y datos de contacto públicos. Fuente única para la página,
// el CV, el asistente, el JSON-LD y las imágenes sociales.
// Experiencia y formación: CV del propio autor (nov. 2025), sin teléfono ni carta.

export const profile = {
  name: "Sergio Carey",
  fullName: "Sergio Enrique Carey Alegre",
  title: "Ingeniero en Informática",
  role: "Desarrollo de software · IA aplicada · Automatización",
  location: "Arica, Chile",
  email: "sergiocareyhola@gmail.com",
  github: "https://github.com/SC-Sergio",
  githubHandle: "SC-Sergio",
  linkedin: "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
  summary:
    "Ingeniero en Informática titulado en INACAP. Construyo backends con Python y Django, sistemas con IA aplicada y automatizaciones que resuelven problemas operativos concretos.",
} as const;

export const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent("Contacto desde tu portafolio")}`;

export type TimelineItem = {
  title: string;
  organization: string;
  period: string;
  detail?: string;
};

export const experience: TimelineItem[] = [
  {
    title: "Desarrollador",
    organization: "Tupoclick Softwares",
    period: "Desde nov. 2025",
    detail:
      "Sistema web en Django para la gestión de pedidos de una lavandería: órdenes, estados, caja y pagos, acceso por roles y validaciones para la operación diaria.",
  },
  {
    title: "Desarrollador Python",
    organization: "Vending Store Limitada",
    period: "Sep. 2024 – abr. 2025",
    detail: "Chatbots con herramientas de IA para apoyar a usuarios en distintas áreas de la empresa.",
  },
  {
    title: "Práctica profesional",
    organization: "Vending Store Limitada",
    period: "Jun. – ago. 2024",
    detail: "Práctica del plan especial de titulación de Ingeniería en Informática.",
  },
];

export const education: TimelineItem[] = [
  { title: "Ingeniero en Informática", organization: "INACAP", period: "2022 – 2024 · Titulado" },
  {
    title: "Técnico de Nivel Superior Analista Programador",
    organization: "INACAP Arica",
    period: "2019 – 2024 · Titulado",
  },
  { title: "Especialización en Arquitectura Cloud", organization: "INACAP", period: "2024" },
  { title: "Ciberseguridad básica", organization: "Cisco Networking Academy", period: "2020 – 2021" },
];

export const languages = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "Básico" },
];
