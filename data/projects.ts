export type Project = {
  name: string;
  summary: string;
  problem: string;
  solution: string;
  result: string;
  impact: string;
  stack: string[];
  focus: string;
  status: string;
  repositoryUrl?: string;
  demoUrl?: string;
  caseUrl?: string;
};

export type LabProject = {
  name: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  caseUrl?: string;
};

export const projects: Project[] = [
  {
    name: "FASTLAUNDRY",
    summary:
      "Sistema Django para gestión operativa de lavandería, caja, pedidos, guías, pagos, trazabilidad y flujos internos.",
    problem:
      "Operaciones diarias con múltiples estados, pagos y decisiones internas que necesitan orden y trazabilidad.",
    solution:
      "Construir un sistema interno en Django que ordena pedidos, caja, guías, pagos y trazabilidad en pantallas operativas.",
    result:
      "Digitaliza operaciones con foco en control de caja, auditoría y continuidad del servicio.",
    impact:
      "Reduce fricción operativa y permite revisar pedidos, pagos y flujos internos con mayor claridad.",
    stack: ["Python", "Django", "SQLite", "Bootstrap", "Automatización"],
    focus: "Operación interna",
    status: "Sistema operacional",
  },
  {
    name: "Tome Assistant",
    summary:
      "Chatbot para atención automatizada usando Flask, Twilio y OpenAI.",
    problem:
      "Atención inicial repetitiva que requiere capturar contexto y responder de forma consistente.",
    solution:
      "Implementar un asistente conversacional con Flask, Twilio y OpenAI para estructurar mensajes, contexto inicial y derivación humana.",
    result:
      "Centraliza respuestas, captura información clave y reduce fricción en la primera atención.",
    impact:
      "Acelera el contacto inicial y deja una base más ordenada para seguimiento humano.",
    stack: ["Python", "Flask", "Twilio", "OpenAI", "Webhooks"],
    focus: "Chatbots IA",
    status: "Asistente conversacional",
  },
  {
    name: "Bot examen clase B Chile",
    summary:
      "Asistente automatizado de práctica para examen de conducción, con preguntas, gamificación y pagos.",
    problem:
      "Práctica dispersa y poco guiada para usuarios que necesitan estudiar de forma constante.",
    solution:
      "Crear una experiencia de práctica guiada con bot, preguntas, dinámica de avance, gamificación y flujo de pagos.",
    result:
      "Convierte el estudio en una experiencia guiada, medible y disponible bajo demanda.",
    impact:
      "Mejora la continuidad de práctica con interacción simple, motivación y acceso directo.",
    stack: ["Python", "Bots", "Pagos", "Gamificación", "Automatización"],
    focus: "Educación digital",
    status: "Producto educativo",
  },
  {
    name: "Tesoro Americano",
    summary:
      "Ecommerce Django para venta de ropa, con flujo de compra por transferencia y contacto vía WhatsApp.",
    problem:
      "Venta online que requiere vitrina clara, compra simple y contacto directo sin sobrecargar la operación.",
    solution:
      "Desarrollar una vitrina ecommerce Django con catálogo, compra por transferencia y contacto vía WhatsApp.",
    result:
      "Entrega una vitrina boutique con proceso de compra simple, administrable y orientado a conversión.",
    impact:
      "Facilita publicar productos, recibir solicitudes y mantener una experiencia de compra cercana.",
    stack: ["Python", "Django", "Ecommerce", "WhatsApp", "UX"],
    focus: "Comercio web",
    status: "Ecommerce Django",
  },
];

export const labProjects: LabProject[] = [
  {
    name: "CanchaClara",
    description: "Experimentos web y lógica de producto para gestión deportiva.",
    repositoryUrl: "https://github.com/SC-Sergio/canchaclara",
  },
  {
    name: "Challenge Encriptador",
    description: "Ejercicio frontend enfocado en interacción, lógica y presentación.",
    repositoryUrl: "https://github.com/SC-Sergio/challenge-encriptador",
    demoUrl: "https://sc-sergio.github.io/challenge-encriptador/",
  },
  {
    name: "ProgramacionAvanzadaInacap",
    description: "Repositorio académico vinculado a formación y práctica técnica.",
    repositoryUrl: "https://github.com/SC-Sergio/ProgramacionAvanzadaInacap",
  },
  {
    name: "ProjectQR",
    description: "Exploración de utilidades digitales y flujos basados en códigos QR.",
    repositoryUrl: "https://github.com/SC-Sergio/ProjectQR",
  },
];
