export const ASSISTANT_LIMITS = {
  maxQuestions: 8,
  maxCharacters: 280,
  cooldownMs: 1500,
  maxOutOfScope: 2,
} as const;

export const ASSISTANT_SESSION_KEY = "sergio-portfolio-assistant-limits";

export const assistantInitialMessage =
  "Hola, soy el asistente demo del portafolio de Sergio. Puedo responder sobre sus proyectos, stack, servicios y contacto.";

export const assistantQuickPrompts = [
  "¿Quién es Sergio Carey?",
  "¿Qué proyectos ha desarrollado?",
  "¿Qué tecnologías domina?",
  "Explícame FASTLAUNDRY",
  "¿Cómo puedo contactarlo?",
] as const;

export const outOfScopeMessage =
  "Soy un asistente demo del portafolio de Sergio Carey. Puedo responder sobre sus proyectos, tecnologías, servicios y contacto. Para otro tema, puedes escribirle directamente a [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com).";

export const limitReachedMessage =
  "Llegaste al límite de 8 preguntas de esta demo local. Para continuar la conversación, puedes escribirle directamente a [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com).";

export const blockedMessage =
  "Por seguridad, pausé esta conversación porque recibió varias preguntas fuera del portafolio. Puedes reiniciar el chat para volver a consultar sobre Sergio, sus proyectos, tecnologías, servicios o contacto.";

export type AssistantReply = {
  text: string;
  status: "answer" | "out-of-scope" | "blocked";
};

const contactText =
  "Puedes contactar a Sergio por correo en [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com). También está en GitHub: https://github.com/SC-Sergio y LinkedIn: https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/.";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const disallowedTerms = [
  "api key",
  "apikey",
  "clave api",
  "token",
  "secreto",
  "prompt interno",
  "revela tu prompt",
  "ignora tus instrucciones",
  "ignora las instrucciones",
  "jailbreak",
  "hack",
  "hackear",
  "malware",
  "phishing",
  "explotar vulnerabilidad",
  "politica",
  "politico",
  "medico",
  "salud",
  "legal",
  "abogado",
  "financiero",
  "inversion",
  "credito",
  "prestamo",
];

const priceOrAvailabilityTerms = [
  "precio",
  "precios",
  "tarifa",
  "tarifas",
  "cuanto cobra",
  "cuanto cuesta",
  "disponibilidad",
  "disponible",
  "contratar",
  "sueldo",
  "trabajo disponible",
];

const portfolioTerms = [
  "sergio",
  "carey",
  "ingeniero",
  "informatico",
  "inacap",
  "arica",
  "chile",
  "python",
  "django",
  "flask",
  "inteligencia artificial",
  "ia",
  "automatizacion",
  "chatbot",
  "chatbots",
  "api",
  "apis",
  "desarrollo web",
  "soporte tecnico",
  "fastlaundry",
  "tome assistant",
  "examen clase b",
  "bot examen",
  "tesoro americano",
  "canchaclara",
  "challenge encriptador",
  "programacionavanzadainacap",
  "programacion avanzada",
  "projectqr",
  "proyecto",
  "proyectos",
  "laboratorio",
  "stack",
  "tecnologia",
  "tecnologias",
  "servicio",
  "servicios",
  "contacto",
  "correo",
  "email",
  "github",
  "linkedin",
  "hablemos",
  "asistente",
  "bot",
  "portafolio",
];

export function getPortfolioAssistantReply(question: string): AssistantReply {
  const text = normalize(question);

  if (includesAny(text, disallowedTerms)) {
    return { text: outOfScopeMessage, status: "out-of-scope" };
  }

  if (includesAny(text, priceOrAvailabilityTerms)) {
    return {
      text: `No manejo precios, disponibilidad laboral ni compromisos comerciales desde esta demo. Para conversar un alcance real, lo mejor es escribirle directamente a Sergio. ${contactText}`,
      status: "answer",
    };
  }

  if (!includesAny(text, portfolioTerms)) {
    return { text: outOfScopeMessage, status: "out-of-scope" };
  }

  if (includesAny(text, ["fastlaundry", "lavanderia", "caja", "trazabilidad"])) {
    return {
      text: "FASTLAUNDRY es un sistema Django para gestión operativa de lavandería. Cubre caja, pedidos, guías, pagos, trazabilidad y flujos internos, con foco en ordenar la operación diaria y hacer más claro el seguimiento de cada pedido.",
      status: "answer",
    };
  }

  if (includesAny(text, ["tome assistant", "twilio", "flask"])) {
    return {
      text: "Tome Assistant es un chatbot para atención automatizada desarrollado con Flask, Twilio y OpenAI. Refuerza el enfoque de Sergio en asistentes conversacionales, automatización y conexión entre APIs.",
      status: "answer",
    };
  }

  if (includesAny(text, ["clase b", "conduccion", "examen"])) {
    return {
      text: "Bot examen clase B Chile es un asistente de práctica para el examen de conducción. Incluye preguntas, dinámica de práctica, gamificación y flujo de pagos, orientado a estudiar de forma más guiada.",
      status: "answer",
    };
  }

  if (includesAny(text, ["tesoro americano", "ecommerce", "ropa", "whatsapp"])) {
    return {
      text: "Tesoro Americano es un ecommerce Django para venta de ropa, con flujo de compra por transferencia y contacto vía WhatsApp. Muestra experiencia en comercio web, catálogo, compra y presentación de producto.",
      status: "answer",
    };
  }

  if (
    includesAny(text, [
      "canchaclara",
      "challenge encriptador",
      "programacionavanzadainacap",
      "programacion avanzada",
      "projectqr",
      "laboratorio",
    ])
  ) {
    return {
      text: "En laboratorio y proyectos secundarios aparecen CanchaClara, Challenge Encriptador, ProgramacionAvanzadaInacap y ProjectQR. Funcionan como muestras complementarias de práctica, lógica de producto, frontend, formación técnica y utilidades digitales.",
      status: "answer",
    };
  }

  if (includesAny(text, ["proyecto", "proyectos", "desarrollado", "construido"])) {
    return {
      text: "Los proyectos principales son FASTLAUNDRY, Tome Assistant, Bot examen clase B Chile y Tesoro Americano. Cubren sistemas Django, automatización, chatbots, pagos, ecommerce, APIs y flujos operativos reales.",
      status: "answer",
    };
  }

  if (includesAny(text, ["tecnologia", "tecnologias", "stack", "python", "django", "ia", "api", "apis"])) {
    return {
      text: "El stack principal de Sergio se centra en Python, Django, Flask, Inteligencia Artificial aplicada, automatización, chatbots, APIs, desarrollo web y soporte técnico. Su perfil combina backend, producto y operación.",
      status: "answer",
    };
  }

  if (includesAny(text, ["servicio", "servicios", "automatizacion", "chatbot", "soporte"])) {
    return {
      text: "Sergio puede aportar en desarrollo web con Python/Django, automatización de procesos, chatbots, integración de APIs, soporte técnico y construcción de sistemas internos claros para operación.",
      status: "answer",
    };
  }

  if (includesAny(text, ["contacto", "correo", "email", "github", "linkedin", "hablemos"])) {
    return { text: contactText, status: "answer" };
  }

  if (includesAny(text, ["quien", "perfil", "sergio", "carey", "inacap", "arica"])) {
    return {
      text: "Sergio Enrique Carey Alegre, visible profesionalmente como Sergio Carey, es Ingeniero Informático formado en Inacap y ubicado en Arica, Chile. Su foco está en Python, Django, IA, automatización, chatbots, APIs, desarrollo web y soporte técnico.",
      status: "answer",
    };
  }

  if (includesAny(text, ["asistente", "bot", "portafolio", "puedes hacer"])) {
    return {
      text: "Soy una demo local del portafolio. Puedo orientar sobre el perfil de Sergio, sus proyectos principales, tecnologías, servicios y formas de contacto. No uso API externa ni guardo datos personales.",
      status: "answer",
    };
  }

  return {
    text: "Puedo ayudarte con una vista rápida del perfil de Sergio, sus proyectos, tecnologías, servicios o contacto. Prueba preguntando por FASTLAUNDRY, su stack o cómo contactarlo.",
    status: "answer",
  };
}
