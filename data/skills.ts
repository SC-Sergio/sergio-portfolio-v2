export type SkillGroup = {
  title: string;
  items: string[];
};

export type Service = {
  title: string;
  description: string;
  points: string[];
};

export type ProfileCredential = {
  label: string;
  value: string;
};

export const profileCredentials: ProfileCredential[] = [
  { label: "Nombre profesional", value: "Sergio Enrique Carey Alegre" },
  { label: "Formación", value: "Ingeniería Informática · Inacap" },
  { label: "Ubicación", value: "Arica, Chile" },
  { label: "Especialidad", value: "Python, Django, IA y automatización" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend y Web",
    items: ["Python", "Django", "Flask", "APIs", "SQL", "TypeScript"],
  },
  {
    title: "IA y Automatización",
    items: ["OpenAI", "Chatbots", "Twilio", "Webhooks", "Flujos internos"],
  },
  {
    title: "Producto y Soporte",
    items: ["Soporte técnico", "Diagnóstico", "Operaciones", "Documentación", "UX"],
  },
];

export const services: Service[] = [
  {
    title: "Desarrollo web operacional",
    description:
      "Aplicaciones internas claras, trazables y pensadas para equipos que trabajan todos los días con datos reales.",
    points: ["Django", "Paneles administrativos", "Flujos de caja y pedidos"],
  },
  {
    title: "Automatización e IA aplicada",
    description:
      "Chatbots y asistentes que capturan contexto, responden con criterio y conectan servicios externos.",
    points: ["OpenAI", "Twilio", "Flask", "Webhooks"],
  },
  {
    title: "Soporte técnico y mejora continua",
    description:
      "Diagnóstico de problemas, ordenamiento de procesos y mejoras incrementales sin perder estabilidad.",
    points: ["Auditoría", "Mantenimiento", "Capacitación operativa"],
  },
];
