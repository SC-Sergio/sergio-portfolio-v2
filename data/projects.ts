export type Project = {
  name: string;
  summary: string;
  problem: string;
  result: string;
  impact: string;
  stack: string[];
  focus: string;
  status: string;
  repositoryUrl?: string;
  demoUrl?: string;
  accessNote?: string;
};

export type LabProject = {
  name: string;
  description: string;
  href: string;
};

export const projects: Project[] = [
  {
    name: "FASTLAUNDRY",
    summary:
      "Sistema Django de uso operativo para gestionar clientes, pedidos, caja, pagos, guías, estados y trazabilidad en una lavandería real.",
    problem:
      "Una operación diaria con múltiples roles, estados, pagos y decisiones internas necesitaba una fuente única de información y mayor control.",
    result:
      "Centraliza el flujo operacional y financiero en una aplicación web mantenible, con procesos explícitos y seguimiento de pedidos.",
    impact:
      "Reduce fricción operativa, mejora la trazabilidad y permite evolucionar el negocio sin depender de controles manuales dispersos.",
    stack: ["Python", "Django", "PostgreSQL", "Heroku", "Bootstrap"],
    focus: "Sistema real de negocio",
    status: "En producción",
    accessNote: "Código privado · uso operativo",
  },
  {
    name: "Carey Assistant",
    summary:
      "Aplicación de escritorio para Windows orientada a productividad, automatización y uso de IA local mediante Ollama.",
    problem:
      "Las tareas de asistencia personal y automatización suelen quedar repartidas entre múltiples herramientas, servicios y modelos.",
    result:
      "Integra chat local, selección de modelos, utilidades, noticias, notificaciones y flujos de productividad en una experiencia de escritorio.",
    impact:
      "Demuestra integración de IA local con una aplicación nativa moderna, manteniendo el código principal privado y una distribución pública controlada.",
    stack: ["Tauri", "React", "TypeScript", "Rust", "Ollama"],
    focus: "IA local / Desktop",
    status: "Releases públicas",
    repositoryUrl: "https://github.com/SC-Sergio/carey-assistant-releases",
  },
  {
    name: "SpaceX Falcon 9 Landing Prediction",
    summary:
      "Proyecto de ciencia de datos que analiza lanzamientos de Falcon 9 y experimenta con modelos de clasificación para predecir aterrizajes de la primera etapa.",
    problem:
      "Comprender qué variables se relacionan con el éxito de los aterrizajes requiere integrar exploración, visualización y modelado sobre datos heterogéneos.",
    result:
      "Organiza un pipeline con análisis tabular, SQL, visualizaciones, mapas, dashboard y varios clasificadores de machine learning.",
    impact:
      "Muestra competencias de análisis de datos, experimentación reproducible y comunicación técnica dentro de un único proyecto aplicado.",
    stack: ["Python", "Pandas", "SQL", "scikit-learn", "TensorFlow", "Plotly"],
    focus: "Data Science / ML",
    status: "Showcase público",
    repositoryUrl: "https://github.com/SC-Sergio/SpaceX_Falcon9_Landing_Prediction",
  },
  {
    name: "LiterAlura",
    summary:
      "Aplicación CLI con Java y Spring Boot que integra Gutendex y PostgreSQL para buscar, persistir y consultar libros y autores.",
    problem:
      "Consumir una API externa y convertir su información en un catálogo persistente exige mapping correcto, reglas contra duplicados y consultas coherentes.",
    result:
      "Separa cliente HTTP, servicios, entidades y repositories JPA, con autores, idiomas, búsquedas y validación automatizada mediante CI.",
    impact:
      "Demuestra backend Java moderno, integración de APIs, persistencia relacional, pruebas y disciplina de integración continua.",
    stack: ["Java 17", "Spring Boot", "PostgreSQL", "JPA", "Gutendex", "GitHub Actions"],
    focus: "Backend Java",
    status: "Portfolio-ready",
    repositoryUrl: "https://github.com/SC-Sergio/Challengeliteralura",
  },
];

export const labProjects: LabProject[] = [
  {
    name: "ChallengeForoHub",
    description: "Backend educativo con Java, Spring Boot, Spring Data JPA, MySQL y Flyway.",
    href: "https://github.com/SC-Sergio/ChallengeForoHub",
  },
  {
    name: "CanchaClara",
    description: "Proyecto web de gestión y reserva de canchas deportivas, orientado a lógica de producto y operación.",
    href: "https://github.com/SC-Sergio/canchaclara",
  },
  {
    name: "Challenge Encriptador",
    description: "Ejercicio frontend centrado en interacción, lógica de transformación de texto y presentación.",
    href: "https://github.com/SC-Sergio/challenge-encriptador",
  },
  {
    name: "ProgramacionAvanzadaInacap",
    description: "Repositorio académico con ejercicios y proyectos vinculados a formación técnica en desarrollo de software.",
    href: "https://github.com/SC-Sergio/ProgramacionAvanzadaInacap",
  },
];
