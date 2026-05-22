export type Project = {
  name: string;
  summary: string;
  result: string;
  stack: string[];
  focus: string;
};

export const projects: Project[] = [
  {
    name: "FASTLAUNDRY",
    summary:
      "Sistema Django para gestión operativa de lavandería, caja, pedidos, guías, pagos, trazabilidad y flujos internos.",
    result:
      "Digitaliza operaciones diarias con foco en control de caja, auditoría y continuidad del servicio.",
    stack: ["Python", "Django", "SQLite", "Bootstrap", "Automatización"],
    focus: "Operación interna",
  },
  {
    name: "Tome Assistant",
    summary:
      "Chatbot para atención automatizada usando Flask, Twilio y OpenAI.",
    result:
      "Centraliza respuestas, captura información clave y reduce fricción en la primera atención.",
    stack: ["Python", "Flask", "Twilio", "OpenAI", "Webhooks"],
    focus: "Chatbots IA",
  },
  {
    name: "Bot examen clase B Chile",
    summary:
      "Asistente automatizado de práctica para examen de conducción, con preguntas, gamificación y pagos.",
    result:
      "Convierte el estudio en una experiencia guiada, medible y disponible bajo demanda.",
    stack: ["Python", "Bots", "Pagos", "Gamificación", "Automatización"],
    focus: "Educación digital",
  },
  {
    name: "Tesoro Americano",
    summary:
      "Ecommerce Django para venta de ropa, con flujo de compra por transferencia y contacto vía WhatsApp.",
    result:
      "Entrega una vitrina boutique con proceso de compra simple, administrable y orientado a conversión.",
    stack: ["Python", "Django", "Ecommerce", "WhatsApp", "UX"],
    focus: "Comercio web",
  },
];
