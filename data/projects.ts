// Proyectos verificados contra sus repositorios públicos (README, topics, releases)
// o, en el caso de FASTLAUNDRY, contra la experiencia declarada en el CV del autor.
// No se publican detalles internos de repositorios privados.

export type ProjectCategory = "IA aplicada" | "Backend" | "Datos" | "Escritorio";

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "release";
};

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  context: string;
  status: string;
  summary: string;
  problem: string;
  contribution: string;
  features: string[];
  stack: string[];
  /** Flujo técnico simplificado, dibujado como diagrama en la tarjeta. */
  flow: string[];
  links: ProjectLink[];
  note?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "pegasus",
    name: "Pegasus Knowledge Center",
    category: "IA aplicada",
    context: "Challenge final Alura Agente",
    status: "Repositorio público · CI",
    summary:
      "Asistente RAG que responde preguntas sobre documentación técnica en PDF citando documento, página y fragmento de origen.",
    problem:
      "La documentación de un equipo de ingeniería se reparte entre manuales de onboarding, arquitectura e incidentes; encontrar una respuesta confiable toma tiempo y una IA sin control puede inventarla.",
    contribution:
      "Diseño e implementación completos: ingesta de PDF, chunking con overlap, embeddings locales, recuperación vectorial, umbral de relevancia, interfaz, contenedor y CI.",
    features: [
      "Abstención cuando no hay evidencia suficientemente relevante",
      "Trazabilidad de cada respuesta a documento, página y chunk",
      "Docker sin privilegios con healthcheck y pruebas con pytest",
      "CI con Ruff, pytest, pip-audit y build de Docker",
    ],
    stack: ["Python 3.12", "Gemini", "ChromaDB", "Sentence Transformers", "Streamlit", "Docker", "GitHub Actions"],
    flow: ["PDF", "Chunks", "Embeddings", "ChromaDB", "Relevance gate", "Gemini"],
    links: [{ label: "Ver repositorio", href: "https://github.com/SC-Sergio/pegasus-knowledge-center", kind: "repo" }],
    note: "Se desplegó en Oracle Cloud para la evaluación; esa instancia hoy está apagada.",
    featured: true,
  },
  {
    slug: "carey-assistant",
    name: "Carey Assistant",
    category: "Escritorio",
    context: "Producto personal",
    status: "Releases públicas · v0.1.19",
    summary:
      "Asistente de escritorio para Windows con IA local mediante Ollama, proveedores en la nube opcionales y herramientas de productividad.",
    problem:
      "Usar modelos locales a diario exige instalar, elegir y cambiar modelos manualmente, y combinar varias herramientas sin una experiencia unificada.",
    contribution:
      "Desarrollo del producto de punta a punta: interfaz, capa nativa, integración con modelos locales y distribución por GitHub Releases.",
    features: [
      "Recomendaciones e instalación guiada de modelos locales",
      "Selección rápida del modelo activo desde el chat",
      "Proveedor en la nube opcional con respaldo local",
      "Flujos de permisos y consentimiento de memoria",
    ],
    stack: ["Tauri", "Rust", "React", "TypeScript", "Ollama"],
    flow: ["React UI", "Tauri · Rust", "Ollama local", "Nube opcional"],
    links: [{ label: "Ver releases", href: "https://github.com/SC-Sergio/carey-assistant-releases/releases", kind: "release" }],
    note: "El código fuente es privado; el repositorio público distribuye instaladores y notas de versión.",
  },
  {
    slug: "fastlaundry",
    name: "FASTLAUNDRY",
    category: "Backend",
    context: "Desarrollo en Tupoclick Softwares",
    status: "Código privado · uso operativo",
    summary:
      "Sistema web para la gestión de pedidos de una lavandería: órdenes, estados, caja, pagos y acceso por roles.",
    problem:
      "La operación diaria registraba pedidos, pagos y estados de forma dispersa, sin una fuente única ni control por rol.",
    contribution:
      "Desarrollo del sistema en Django: modelo de datos, flujos de órdenes y estados, caja y pagos, roles y validaciones.",
    features: [
      "Creación y seguimiento de órdenes con estados explícitos",
      "Control de caja y registro de pagos",
      "Acceso diferenciado por roles",
      "Validaciones y manejo de errores orientados a la operación",
    ],
    stack: ["Python", "Django", "PostgreSQL", "Bootstrap"],
    flow: ["Pedido", "Estados", "Caja · pagos", "Roles"],
    links: [],
    note: "Repositorio privado por tratarse de un sistema en operación; no se publica código ni datos.",
  },
  {
    slug: "literalura",
    name: "LiterAlura",
    category: "Backend",
    context: "Challenge Alura Latam",
    status: "Repositorio público · CI",
    summary:
      "Aplicación de consola con Spring Boot que consulta la API de Gutendex y persiste libros y autores en PostgreSQL.",
    problem:
      "Convertir respuestas de una API externa en un catálogo persistente sin duplicados exige mapeo explícito, reglas de negocio y consultas coherentes.",
    contribution:
      "Implementación y refactorización para que el comportamiento documentado coincida con el código, con pruebas unitarias y CI.",
    features: [
      "Búsqueda por título y registro sin duplicados (ID de Gutenberg)",
      "Consultas por idioma y autores vivos en un año dado",
      "Cliente HTTP con manejo de errores de la API",
      "Pruebas con JUnit 5 y Mockito en GitHub Actions",
    ],
    stack: ["Java 17", "Spring Boot", "Spring Data JPA", "PostgreSQL", "JUnit 5", "GitHub Actions"],
    flow: ["CLI", "Gutendex API", "JPA", "PostgreSQL"],
    links: [{ label: "Ver repositorio", href: "https://github.com/SC-Sergio/Challengeliteralura", kind: "repo" }],
  },
  {
    slug: "spacex",
    name: "SpaceX Falcon 9 Landing",
    category: "Datos",
    context: "Proyecto de ciencia de datos",
    status: "Notebook exploratorio",
    summary:
      "Análisis de lanzamientos de Falcon 9 y comparación de modelos de clasificación para predecir el aterrizaje de la primera etapa.",
    problem:
      "Entender qué variables se relacionan con un aterrizaje exitoso requiere combinar exploración, SQL, mapas y modelos sobre datos heterogéneos.",
    contribution:
      "Análisis completo en un notebook: limpieza, consultas SQL, visualización geoespacial, dashboard y entrenamiento de clasificadores.",
    features: [
      "Consultas con SQLite y SQLAlchemy",
      "Mapas con Folium y dashboard con Dash/Plotly",
      "Regresión logística, SVM, árbol de decisión y KNN",
      "Experimento adicional con una red neuronal en Keras",
    ],
    stack: ["Python", "Pandas", "SQL", "scikit-learn", "TensorFlow", "Plotly"],
    flow: ["CSV", "SQL", "Mapas · dashboard", "Clasificadores"],
    links: [{ label: "Ver repositorio", href: "https://github.com/SC-Sergio/SpaceX_Falcon9_Landing_Prediction", kind: "repo" }],
    note: "Resultados exploratorios: dos datasets del notebook no están en el repositorio.",
  },
  {
    slug: "forohub",
    name: "ForoHub API",
    category: "Backend",
    context: "Challenge Alura Latam",
    status: "Repositorio público",
    summary:
      "Backend REST educativo con arquitectura por capas, persistencia en MySQL y migraciones versionadas con Flyway.",
    problem:
      "Practicar el diseño de una API mantenible: separación de capas, persistencia relacional y evolución controlada del esquema.",
    contribution: "Implementación del backend, el modelo de datos y las migraciones.",
    features: [
      "Endpoints REST para listar y crear publicaciones",
      "Arquitectura por capas con Spring Data JPA",
      "Migraciones de esquema con Flyway",
    ],
    stack: ["Java 17", "Spring Boot", "Spring Data JPA", "MySQL", "Flyway"],
    flow: ["REST", "Spring Boot", "JPA · Flyway", "MySQL"],
    links: [{ label: "Ver repositorio", href: "https://github.com/SC-Sergio/ChallengeForoHub", kind: "repo" }],
  },
];

export type LabProject = {
  name: string;
  description: string;
  href: string;
};

export const labProjects: LabProject[] = [
  {
    name: "ProgramacionAvanzadaInacap",
    description: "Proyecto académico de inventario para una bodega, del ramo Programación Avanzada de Aplicaciones.",
    href: "https://github.com/SC-Sergio/ProgramacionAvanzadaInacap",
  },
  {
    name: "Challenge Encriptador",
    description: "Ejercicio frontend de Alura Latam: transformación de texto e interacción en el navegador.",
    href: "https://github.com/SC-Sergio/challenge-encriptador",
  },
  {
    name: "Conversor de Monedas",
    description: "Aplicación de consola en Java que convierte monedas con tasas de ExchangeRate-API.",
    href: "https://github.com/SC-Sergio/ChallengeConversordeMonedasAluraLatam",
  },
];
