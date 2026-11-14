// Asistente local y determinista del portafolio: sin API externa ni almacenamiento
// remoto. Clasifica la intención por términos normalizados (con raíces para cubrir
// conjugaciones como "contactarlo") y responde solo sobre el perfil profesional.

import { profile } from "@/data/profile";

export const ASSISTANT_LIMITS = {
  maxQuestions: 10,
  maxCharacters: 280,
  cooldownMs: 1200,
  maxOutOfScope: 2,
} as const;

export const ASSISTANT_SESSION_KEY = "sergio-portfolio-assistant-limits";

export const assistantInitialMessage =
  "Hola, soy el asistente del portafolio de Sergio. Respondo sobre su perfil, experiencia, proyectos, tecnologías, servicios y contacto.";

export const assistantQuickPrompts = [
  "¿Quién es Sergio Carey?",
  "¿Qué proyectos ha desarrollado?",
  "¿Qué tecnologías domina?",
  "Explícame Carey Assistant",
  "¿Cómo puedo contactarlo?",
] as const;

const emailLink = `[${profile.email}](mailto:${profile.email})`;

export const outOfScopeMessage = `Solo puedo responder sobre el perfil profesional de Sergio: experiencia, proyectos, tecnologías, servicios y contacto. Para otro tema puedes escribirle a ${emailLink}.`;

export const limitReachedMessage = `Llegaste al límite de ${ASSISTANT_LIMITS.maxQuestions} preguntas de esta sesión. Para seguir conversando, escríbele directamente a ${emailLink}.`;

export const blockedMessage =
  "Pausé la conversación porque recibió varias preguntas fuera del portafolio. Usa «Reiniciar chat» para volver a consultar sobre Sergio.";

export type AssistantIntent =
  | "blocked"
  | "pricing"
  | "contact"
  | "cv"
  | "pegasus"
  | "carey-assistant"
  | "fastlaundry"
  | "spacex"
  | "literalura"
  | "forohub"
  | "experience"
  | "education"
  | "projects"
  | "stack"
  | "services"
  | "profile"
  | "assistant"
  | "greeting"
  | "out-of-scope";

export type AssistantReply = {
  text: string;
  status: "answer" | "out-of-scope";
  intent: AssistantIntent;
};

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return text.split(/[^a-z0-9+#]+/).filter(Boolean);
}

/**
 * Un término puede ser una frase ("carey assistant", se busca como subcadena),
 * una raíz terminada en "*" ("contact*", prefijo de una palabra) o una palabra
 * exacta ("ia"). Así "ia" no coincide con "historia".
 */
function matches(text: string, tokens: string[], terms: readonly string[]): boolean {
  return terms.some((term) => {
    if (term.includes(" ")) return text.includes(term);
    if (term.endsWith("*")) return tokens.some((token) => token.startsWith(term.slice(0, -1)));
    return tokens.includes(term);
  });
}

type IntentRule = { intent: Exclude<AssistantIntent, "out-of-scope">; terms: readonly string[]; text: string };

const contactText = `Puedes escribirle a ${emailLink}. También está en [GitHub](${profile.github}) y [LinkedIn](${profile.linkedin}). La sección [Contacto](#contact) reúne todos los enlaces.`;

// El orden importa: la primera regla que coincide define la respuesta.
const rules: IntentRule[] = [
  {
    intent: "blocked",
    terms: [
      "api key", "apikey", "clave api", "api token", "token de acceso", "password*", "contrasena*", "secret*", "prompt interno",
      "system prompt", "ignora*", "jailbreak", "hackear", "hackeo", "hacking", "malware", "phishing", "exploit*",
      "politico*", "medico*", "medicina", "salud", "abogad*", "inversion*", "credito*", "prestamo*", "apuesta*",
      "criptomoneda*",
    ],
    text: "",
  },
  {
    intent: "pricing",
    terms: ["precio*", "tarifa*", "cobra*", "cuesta", "costo*", "presupuesto*", "sueldo*", "salario*", "disponib*", "contrat*"],
    text: `No manejo precios, disponibilidad ni compromisos comerciales. Para conversar un alcance concreto, lo mejor es escribirle directamente. ${contactText}`,
  },
  {
    intent: "contact",
    terms: [
      "contact*", "correo*", "email*", "mail", "e-mail", "escrib*", "comunic*", "hablar", "hablemos",
      "ubicar*", "linkedin", "github", "redes sociales",
    ],
    text: contactText,
  },
  {
    intent: "cv",
    terms: ["cv", "curriculum*", "resume", "hoja de vida"],
    text: "Su CV está disponible en [/cv](/cv), en una versión imprimible con experiencia, formación, stack y proyectos verificados.",
  },
  {
    intent: "pegasus",
    terms: ["pegasus", "rag", "chromadb", "gemini", "knowledge center"],
    text: "Pegasus Knowledge Center es un asistente RAG (Challenge final de Alura Agente) que responde sobre documentación técnica en PDF citando documento, página y fragmento. Usa Sentence Transformers, ChromaDB y Gemini, se abstiene cuando no hay evidencia relevante y tiene Docker, pytest y CI. Repositorio: [pegasus-knowledge-center](https://github.com/SC-Sergio/pegasus-knowledge-center).",
  },
  {
    intent: "carey-assistant",
    terms: ["carey assistant", "ollama", "tauri", "rust", "escritorio", "desktop", "ia local"],
    text: "Carey Assistant es un asistente de escritorio para Windows construido con Tauri, Rust, React y TypeScript. Usa modelos locales con Ollama, recomienda e instala modelos y permite un proveedor en la nube opcional con respaldo local. El código es privado; los instaladores están en [GitHub Releases](https://github.com/SC-Sergio/carey-assistant-releases/releases).",
  },
  {
    intent: "fastlaundry",
    terms: ["fastlaundry", "fast laundry", "lavanderia*", "tupoclick"],
    text: "FASTLAUNDRY es un sistema web en Django y PostgreSQL para gestionar los pedidos de una lavandería: órdenes, estados, caja, pagos y roles. Lo desarrolla en Tupoclick Softwares; el código es privado porque el sistema está en operación.",
  },
  {
    intent: "spacex",
    terms: ["spacex", "falcon*", "machine learning", "data science", "ciencia de datos", "scikit*", "tensorflow"],
    text: "SpaceX Falcon 9 Landing es un notebook de ciencia de datos: SQL, mapas con Folium, dashboard con Dash y comparación de clasificadores (regresión logística, SVM, árbol de decisión, KNN y una red en Keras). Sus resultados son exploratorios. [Ver repositorio](https://github.com/SC-Sergio/SpaceX_Falcon9_Landing_Prediction).",
  },
  {
    intent: "literalura",
    terms: ["literalura", "gutendex", "libro*"],
    text: "LiterAlura es una aplicación de consola con Java 17 y Spring Boot que consulta Gutendex y persiste libros y autores en PostgreSQL con JPA, evitando duplicados. Incluye pruebas con JUnit 5 y Mockito en GitHub Actions. [Ver repositorio](https://github.com/SC-Sergio/Challengeliteralura).",
  },
  {
    intent: "forohub",
    terms: ["forohub", "foro hub", "foro", "flyway"],
    text: "ForoHub es un backend REST educativo con Java 17, Spring Boot, Spring Data JPA, MySQL y migraciones Flyway, organizado por capas. [Ver repositorio](https://github.com/SC-Sergio/ChallengeForoHub).",
  },
  {
    intent: "experience",
    terms: ["experiencia*", "trabaj*", "empresa*", "laboral*", "empleo*", "practica*", "vending"],
    text: "Desde nov. 2025 desarrolla en Tupoclick Softwares un sistema Django para la gestión de pedidos de una lavandería. Antes fue desarrollador Python en Vending Store Limitada (sep. 2024 – abr. 2025), creando chatbots con herramientas de IA, donde también hizo su práctica profesional. Detalle en [/cv](/cv).",
  },
  {
    intent: "education",
    terms: ["estudi*", "formacion", "titul*", "inacap", "universidad*", "carrera", "educacion", "certific*"],
    text: "Es Ingeniero en Informática (INACAP, 2022–2024, titulado) y Técnico de Nivel Superior Analista Programador (INACAP Arica, titulado). Además cursó la especialización en Arquitectura Cloud de INACAP y Ciberseguridad básica en Cisco Networking Academy.",
  },
  {
    intent: "projects",
    terms: ["proyecto*", "portafolio", "desarroll*", "construi*", "hecho", "repositorio*", "trabajos"],
    text: "Proyectos destacados: Pegasus Knowledge Center (RAG con Gemini y ChromaDB), Carey Assistant (escritorio con IA local), FASTLAUNDRY (sistema Django en operación), LiterAlura y ForoHub (backend Java/Spring Boot) y SpaceX Falcon 9 (ciencia de datos). Están en la sección [Proyectos](#projects).",
  },
  {
    intent: "stack",
    terms: [
      "tecnologia*", "stack", "lenguaje*", "herramienta*", "domina", "sabe", "python", "django", "java", "spring",
      "postgres*", "mysql", "typescript", "react", "next*", "docker", "sql", "ia", "inteligencia artificial", "api", "apis",
    ],
    text: "Su stack: Python y Django; Java 17 y Spring Boot; PostgreSQL, MySQL y ChromaDB; RAG con Gemini y modelos locales con Ollama; scikit-learn y TensorFlow; TypeScript, React, Next.js y Tauri; Docker y GitHub Actions. Cada tecnología está ligada a un proyecto en [Tecnologías](#stack).",
  },
  {
    intent: "services",
    terms: ["servicio*", "ayud*", "ofrece*", "automatiz*", "chatbot*", "integracion*", "soluci*"],
    text: "Puede ayudar con backend y sistemas web, IA aplicada (RAG, modelos locales), automatización de procesos, integraciones y APIs, bases de datos y aplicaciones de escritorio. Más detalle en [Servicios](#services).",
  },
  {
    intent: "profile",
    terms: ["perfil", "sergio", "carey", "presenta*", "sobre el", "arica"],
    text: `${profile.fullName} (Sergio Carey) es Ingeniero en Informática titulado en INACAP, ubicado en Arica, Chile. Se enfoca en desarrollo de software con Python y Django, IA aplicada y automatización.`,
  },
  {
    intent: "assistant",
    terms: ["asistente", "bot", "eres", "funciona*", "puedes"],
    text: "Soy un asistente local del portafolio: respondo con información predefinida y verificada, sin enviar tus preguntas a ningún servidor ni usar APIs externas.",
  },
  {
    intent: "greeting",
    terms: ["hola", "buenas", "buenos", "gracias", "saludos", "hey"],
    text: "¡Hola! Pregúntame por la experiencia de Sergio, sus proyectos, su stack o cómo contactarlo.",
  },
];

export function classifyIntent(question: string): AssistantIntent {
  const text = normalize(question);
  const tokens = tokenize(text);
  return rules.find((rule) => matches(text, tokens, rule.terms))?.intent ?? "out-of-scope";
}

export function getPortfolioAssistantReply(question: string): AssistantReply {
  const intent = classifyIntent(question);

  if (intent === "blocked" || intent === "out-of-scope") {
    return { text: outOfScopeMessage, status: "out-of-scope", intent };
  }

  const rule = rules.find((candidate) => candidate.intent === intent);
  return { text: rule?.text ?? outOfScopeMessage, status: "answer", intent };
}

/** Enlaces que el asistente puede renderizar; cualquier otro se muestra como texto. */
export function isAllowedAssistantHref(href: string): boolean {
  return (
    /^#[a-z-]+$/.test(href) ||
    href === "/cv" ||
    href === `mailto:${profile.email}` ||
    href === profile.github ||
    href.startsWith(`${profile.github}/`) ||
    href === profile.linkedin
  );
}
