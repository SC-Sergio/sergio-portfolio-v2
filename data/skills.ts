// Stack organizado por categoría. Cada tecnología indica dónde se usó, para que
// un reclutador pueda verificarla en un proyecto concreto. Sin porcentajes.

export type StackItem = {
  name: string;
  evidence: string;
};

export type StackGroup = {
  id: string;
  title: string;
  description: string;
  items: StackItem[];
};

export const stackGroups: StackGroup[] = [
  {
    id: "backend",
    title: "Backend",
    description: "APIs, reglas de negocio y aplicaciones de consola o web.",
    items: [
      { name: "Python", evidence: "FASTLAUNDRY · Pegasus · SpaceX" },
      { name: "Django", evidence: "FASTLAUNDRY" },
      { name: "Java 17", evidence: "LiterAlura · ForoHub" },
      { name: "Spring Boot", evidence: "LiterAlura · ForoHub" },
      { name: "APIs REST", evidence: "ForoHub · cliente Gutendex" },
    ],
  },
  {
    id: "data",
    title: "Bases de datos",
    description: "Modelado relacional, persistencia y búsqueda vectorial.",
    items: [
      { name: "PostgreSQL", evidence: "FASTLAUNDRY · LiterAlura" },
      { name: "MySQL", evidence: "ForoHub" },
      { name: "JPA / Hibernate", evidence: "LiterAlura · ForoHub" },
      { name: "Flyway", evidence: "ForoHub" },
      { name: "ChromaDB", evidence: "Pegasus" },
      { name: "SQLite / SQL", evidence: "SpaceX" },
    ],
  },
  {
    id: "ai",
    title: "IA y datos",
    description: "RAG, modelos locales y análisis con machine learning.",
    items: [
      { name: "RAG", evidence: "Pegasus" },
      { name: "Gemini", evidence: "Pegasus" },
      { name: "Ollama / LLM locales", evidence: "Carey Assistant" },
      { name: "Sentence Transformers", evidence: "Pegasus" },
      { name: "scikit-learn", evidence: "SpaceX" },
      { name: "TensorFlow / Keras", evidence: "SpaceX" },
      { name: "Pandas · Plotly · Dash", evidence: "SpaceX" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend y escritorio",
    description: "Interfaces web y aplicaciones nativas para Windows.",
    items: [
      { name: "TypeScript", evidence: "Carey Assistant · este portafolio" },
      { name: "React", evidence: "Carey Assistant · este portafolio" },
      { name: "Next.js", evidence: "Este portafolio" },
      { name: "Tailwind CSS", evidence: "Este portafolio" },
      { name: "Three.js", evidence: "Este portafolio" },
      { name: "Tauri / Rust", evidence: "Carey Assistant" },
      { name: "Streamlit", evidence: "Pegasus" },
    ],
  },
  {
    id: "devops",
    title: "Herramientas y DevOps",
    description: "Calidad, contenedores, integración continua y despliegue.",
    items: [
      { name: "Git / GitHub", evidence: "Todos los proyectos" },
      { name: "GitHub Actions", evidence: "Pegasus · LiterAlura · este portafolio" },
      { name: "Docker", evidence: "Pegasus" },
      { name: "pytest · JUnit · Playwright", evidence: "Pegasus · LiterAlura · este portafolio" },
      { name: "Vercel", evidence: "Este portafolio" },
      { name: "Oracle Cloud", evidence: "Pegasus (despliegue de evaluación)" },
    ],
  },
];

export type Service = {
  title: string;
  problem: string;
  approach: string;
  evidence: { label: string; href: string };
};

export const services: Service[] = [
  {
    title: "Backend y sistemas web",
    problem: "Pedidos, pagos o estados que hoy viven en planillas y mensajes sueltos.",
    approach: "Aplicaciones Django o Spring Boot con modelo de datos claro, roles, validaciones y flujos explícitos.",
    evidence: { label: "FASTLAUNDRY", href: "#project-fastlaundry" },
  },
  {
    title: "IA aplicada",
    problem: "Información repartida en documentos que cuesta consultar con confianza.",
    approach: "Asistentes RAG que citan sus fuentes y se abstienen sin evidencia, o modelos locales cuando la privacidad importa.",
    evidence: { label: "Pegasus", href: "#project-pegasus" },
  },
  {
    title: "Automatización",
    problem: "Tareas repetitivas que consumen horas y dependen de pasos manuales.",
    approach: "Scripts y servicios en Python que encadenan pasos, validan datos y dejan registro de lo ejecutado.",
    evidence: { label: "Carey Assistant", href: "#project-carey-assistant" },
  },
  {
    title: "Integraciones y APIs",
    problem: "Sistemas que no se comunican entre sí y obligan a copiar datos a mano.",
    approach: "Clientes y endpoints REST con mapeo explícito, manejo de errores y pruebas.",
    evidence: { label: "LiterAlura", href: "#project-literalura" },
  },
  {
    title: "Bases de datos",
    problem: "Datos duplicados, sin estructura o difíciles de consultar.",
    approach: "Modelado relacional en PostgreSQL o MySQL, migraciones versionadas y consultas coherentes.",
    evidence: { label: "ForoHub", href: "#project-forohub" },
  },
  {
    title: "Aplicaciones de escritorio",
    problem: "Herramientas que deben funcionar localmente en Windows, sin depender de la nube.",
    approach: "Aplicaciones Tauri con interfaz React y capa nativa en Rust, distribuidas como instalador.",
    evidence: { label: "Carey Assistant", href: "#project-carey-assistant" },
  },
];
