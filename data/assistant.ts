export const ASSISTANT_LIMITS = {
  maxQuestions: 8,
  maxCharacters: 280,
  cooldownMs: 1500,
  maxOutOfScope: 2,
} as const;

export const ASSISTANT_SESSION_KEY = "sergio-portfolio-assistant-limits";

export const assistantInitialMessage =
  "Hola, soy el asistente demo del portafolio de Sergio. Puedo responder sobre su perfil, proyectos, stack, servicios y contacto.";

export const assistantQuickPrompts = [
  "¿Quién es Sergio Carey?",
  "¿Qué proyectos ha desarrollado?",
  "¿Qué tecnologías domina?",
  "Explícame Carey Assistant",
  "¿Cómo puedo contactarlo?",
] as const;

export const outOfScopeMessage =
  "Soy un asistente demo local del portafolio de Sergio Carey. Puedo responder sobre sus proyectos, tecnologías, servicios y contacto. Para otro tema, puedes escribirle directamente a [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com).";

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
  "java",
  "spring boot",
  "postgresql",
  "mysql",
  "typescript",
  "react",
  "next.js",
  "nextjs",
  "rust",
  "tauri",
  "ollama",
  "llm",
  "rag",
  "machine learning",
  "data science",
  "inteligencia artificial",
  "ia",
  "automatizacion",
  "chatbot",
  "chatbots",
  "api",
  "apis",
  "desarrollo web",
  "fastlaundry",
  "carey assistant",
  "spacex",
  "falcon 9",
  "literalura",
  "forohub",
  "canchaclara",
  "challenge encriptador",
  "programacionavanzadainacap",
  "programacion avanzada",
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
      text: "FASTLAUNDRY es un sistema Django de uso real para una lavandería. Gestiona clientes, pedidos, caja, pagos, guías, estados y trazabilidad operativa sobre PostgreSQL. El código es privado porque forma parte de una operación productiva.",
      status: "answer",
    };
  }

  if (includesAny(text, ["carey assistant", "ollama", "tauri", "rust", "ia local"])) {
    return {
      text: "Carey Assistant es una aplicación de escritorio para Windows construida con Tauri, React, TypeScript y Rust. Integra IA local con Ollama, selección de modelos, utilidades, noticias, notificaciones y automatización. El código principal es privado y sus releases se publican en GitHub.",
      status: "answer",
    };
  }

  if (includesAny(text, ["spacex", "falcon 9", "falcon9", "machine learning", "data science"])) {
    return {
      text: "SpaceX Falcon 9 Landing Prediction es un proyecto de ciencia de datos con Python. Incluye análisis tabular, SQL, visualizaciones, mapas, dashboard y experimentos de clasificación con scikit-learn y TensorFlow.",
      status: "answer",
    };
  }

  if (includesAny(text, ["literalura", "gutendex", "spring boot", "jpa"])) {
    return {
      text: "LiterAlura es una aplicación CLI con Java 17 y Spring Boot que integra Gutendex con PostgreSQL/JPA. Permite buscar y persistir libros y autores, consultar por idioma y evaluar autores vivos en un año, con pruebas y CI en GitHub Actions.",
      status: "answer",
    };
  }

  if (includesAny(text, ["forohub", "foro hub", "flyway"])) {
    return {
      text: "ChallengeForoHub es un backend educativo con Java, Spring Boot, Spring Data JPA, MySQL y Flyway. Expone operaciones reales de lectura y creación de posts y está documentado como proyecto de aprendizaje backend.",
      status: "answer",
    };
  }

  if (
    includesAny(text, [
      "canchaclara",
      "challenge encriptador",
      "programacionavanzadainacap",
      "programacion avanzada",
      "laboratorio",
    ])
  ) {
    return {
      text: "En laboratorio y proyectos secundarios aparecen ChallengeForoHub, CanchaClara, Challenge Encriptador y ProgramacionAvanzadaInacap. Funcionan como muestras complementarias de backend, frontend, lógica de producto y formación técnica.",
      status: "answer",
    };
  }

  if (includesAny(text, ["proyecto", "proyectos", "desarrollado", "construido"])) {
    return {
      text: "Los proyectos destacados son FASTLAUNDRY, Carey Assistant, SpaceX Falcon 9 Landing Prediction y LiterAlura. En conjunto muestran sistemas reales de negocio, aplicaciones desktop con IA local, data science y backend Java/Spring Boot.",
      status: "answer",
    };
  }

  if (
    includesAny(text, [
      "tecnologia",
      "tecnologias",
      "stack",
      "python",
      "django",
      "java",
      "spring boot",
      "postgresql",
      "typescript",
      "react",
      "rust",
      "ia",
      "api",
      "apis",
    ])
  ) {
    return {
      text: "El stack actual de Sergio combina Python/Django, Java/Spring Boot, PostgreSQL/MySQL, TypeScript/React/Next.js, Tauri/Rust, Ollama y LLMs, además de automatización, GitHub Actions, Heroku y Vercel.",
      status: "answer",
    };
  }

  if (includesAny(text, ["servicio", "servicios", "automatizacion", "chatbot", "soporte"])) {
    return {
      text: "Sergio puede aportar en sistemas web y backend operacional, automatización e IA aplicada, integraciones de APIs y desarrollo de productos web o desktop con foco en estabilidad y mantenimiento.",
      status: "answer",
    };
  }

  if (includesAny(text, ["contacto", "correo", "email", "github", "linkedin", "hablemos"])) {
    return { text: contactText, status: "answer" };
  }

  if (includesAny(text, ["quien", "perfil", "sergio", "carey", "inacap", "arica"])) {
    return {
      text: "Sergio Enrique Carey Alegre, visible profesionalmente como Sergio Carey, es Ingeniero Informático formado en Inacap y ubicado en Arica, Chile. Su foco está en backend, IA aplicada, automatización, datos y desarrollo de productos digitales.",
      status: "answer",
    };
  }

  if (includesAny(text, ["asistente", "bot", "portafolio", "puedes hacer"])) {
    return {
      text: "Soy una demo local del portafolio. Puedo orientar sobre el perfil de Sergio, sus proyectos principales, tecnologías, servicios y formas de contacto. No uso API externa ni guardo conversaciones en un servidor.",
      status: "answer",
    };
  }

  return {
    text: "Puedo ayudarte con una vista rápida del perfil de Sergio, sus proyectos, tecnologías, servicios o contacto. Prueba preguntando por Carey Assistant, FASTLAUNDRY, LiterAlura, SpaceX o su stack.",
    status: "answer",
  };
}
