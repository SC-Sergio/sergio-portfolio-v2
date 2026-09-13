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
  { label: "Especialidad", value: "Backend, IA aplicada, automatización y datos" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend y Datos",
    items: [
      "Python",
      "Django",
      "Flask",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "MySQL",
      "SQL",
    ],
  },
  {
    title: "IA, Automatización y Desktop",
    items: [
      "Ollama",
      "LLMs",
      "RAG",
      "OpenAI",
      "Tauri",
      "Rust",
      "Webhooks",
      "GitHub Actions",
    ],
  },
  {
    title: "Frontend e Infraestructura",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Three.js",
      "Vercel",
      "Heroku",
      "Git / GitHub",
    ],
  },
];

export const services: Service[] = [
  {
    title: "Sistemas web y backend operacional",
    description:
      "Aplicaciones mantenibles para equipos que trabajan con pedidos, clientes, estados, pagos, datos y reglas de negocio reales.",
    points: ["Django / Spring Boot", "APIs e integraciones", "PostgreSQL / MySQL"],
  },
  {
    title: "IA aplicada y automatización",
    description:
      "Asistentes, modelos locales e integraciones que reducen tareas repetitivas y conectan servicios con procesos concretos.",
    points: ["Ollama / LLMs", "Chatbots", "Automatización y webhooks"],
  },
  {
    title: "Productos desktop, web y mejora continua",
    description:
      "Interfaces y herramientas digitales pensadas para evolucionar sin perder claridad, estabilidad ni trazabilidad técnica.",
    points: ["Tauri / React", "Next.js", "CI y documentación"],
  },
];
