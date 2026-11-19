// Proyectos verificados contra sus repositorios públicos (README, topics, releases)
// o, en el caso de FASTLAUNDRY, contra la experiencia declarada en el CV del autor.
// No se publican detalles internos de repositorios privados.

export type ProjectCategory = "IA aplicada" | "Backend" | "Datos" | "Escritorio";

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "release";
};

/**
 * Nivel de evidencia de la demo. «funcional»: ejecuta lógica real con datos reales del proyecto;
 * «simulada»: reproduce el flujo con datos ficticios, sin el sistema original.
 */
export type DemoKind = "funcional" | "simulada";

export type ProjectDemo = {
  href: string;
  label: string;
  kind: DemoKind;
  /** Qué es exactamente la demo, en una frase. */
  description: string;
};

export type CaseStudy = {
  /** Arquitectura en pasos legibles (el diagrama usa `flow`). */
  architecture: string[];
  decisions: { title: string; detail: string }[];
  /** Resultados y pruebas comprobables, con su fuente. */
  results: string[];
  limitations: string[];
  /** De dónde sale lo que dice la página. */
  sources: string;
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
  /** Id de data/media.ts usado como portada (solo si hay una imagen real o de demo rotulada). */
  cover?: string;
  demo?: ProjectDemo;
  caseStudy: CaseStudy;
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
    cover: "pegasus-oci-evidencia-incidentes",
    demo: {
      href: "/demos/pegasus",
      label: "Probar recuperación RAG",
      kind: "funcional",
      description:
        "Recuperaciones reales del pipeline (embeddings y ChromaDB) precalculadas para las 20 preguntas de prueba, más búsqueda léxica en el navegador sobre los 312 chunks reales. No llama a Gemini.",
    },
    caseStudy: {
      architecture: [
        "pypdf extrae el texto por página de los 5 PDF del corpus ficticio «Santos Pegasus Soluciones».",
        "Chunking con cortes naturales (párrafo, línea, oración) de hasta 1100 caracteres y 160 de overlap.",
        "Sentence Transformers (paraphrase-multilingual-MiniLM-L12-v2) genera embeddings normalizados.",
        "ChromaDB persiste los vectores con distancia coseno explícita y recupera el Top-K (4 por defecto).",
        "El relevance gate descarta vecinos con distancia mayor a 0,65; si no queda ninguno, el sistema se abstiene.",
        "Solo con evidencia suficiente se construye el contexto trazable y se llama a Gemini con una system instruction separada.",
      ],
      decisions: [
        {
          title: "Abstenerse antes que inventar",
          detail:
            "El umbral se evalúa antes del LLM: una pregunta sin evidencia no consume una llamada a Gemini y devuelve una abstención explícita.",
        },
        {
          title: "Contexto tratado como dato no confiable",
          detail:
            "La system instruction prohíbe seguir instrucciones encontradas en la pregunta o en el texto recuperado, una defensa básica contra prompt injection en documentos.",
        },
        {
          title: "Embeddings locales",
          detail: "La indexación y la búsqueda no dependen de una API de pago; solo la redacción final usa Gemini.",
        },
        {
          title: "Trazabilidad visible",
          detail: "Cada fuente conserva documento, página, número de chunk y distancia, y la interfaz las muestra junto a la respuesta.",
        },
      ],
      results: [
        "Ejecución local del 19-nov-2026 con el código público: 5 PDF, 152 páginas y 312 chunks indexados.",
        "Las 20 preguntas de docs/test-questions.md recuperan 4 fuentes bajo el umbral; la mejor distancia va de 0,22 a 0,54.",
        "3 de 3 preguntas fuera del corpus («capital de Francia», «receta de cocina», «precio del dólar») terminan en abstención.",
        "pytest: 7 de 7 pruebas aprobadas en la misma ejecución local; el repositorio corre Ruff, pytest, pip-audit y build de Docker en CI.",
      ],
      limitations: [
        "La instancia de Oracle Cloud usada en la evaluación está apagada; las capturas de ese despliegue son históricas (jul. 2026) y muestran 306 chunks y una escala de distancias de una versión anterior.",
        "La demo pública no genera respuestas con Gemini: muestra la recuperación real y una síntesis extractiva rotulada como tal.",
        "El corpus es material educativo de una empresa ficticia; no se evaluó con documentación real.",
      ],
      sources: "README, código y docs/test-questions.md del repositorio público; ejecución local reproducible del 19-nov-2026.",
    },
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
    cover: "carey-asistente",
    caseStudy: {
      architecture: [
        "Interfaz en React y TypeScript empaquetada como aplicación de escritorio con Tauri (Rust).",
        "Motor local: Ollama en 127.0.0.1, puerto 11434; la app recomienda modelos y muestra cuál está activo en el chat.",
        "Proveedor en la nube opcional (DeepSeek en v0.1.19) con respaldo local, bloqueado hasta que exista una clave guardada.",
        "Distribución: instalador Windows x64 publicado en GitHub Releases; el código fuente es privado.",
      ],
      decisions: [
        {
          title: "Local primero",
          detail: "El modo recomendado usa Ollama cuando está disponible; la nube queda preparada pero no se usa sin configuración explícita.",
        },
        {
          title: "Permisos temporales y de solo lectura",
          detail: "Las carpetas de proyecto se autorizan una a una, empiezan pausadas y los permisos viven solo en memoria hasta cerrar la app.",
        },
        {
          title: "Estado honesto del motor",
          detail: "El chat muestra el modelo efectivo y si Ollama está disponible, en vez de fingir una respuesta cuando el motor no responde.",
        },
        {
          title: "Memoria con consentimiento",
          detail: "La memoria es manual y opcional por mensaje; los datos sensibles se ocultan por defecto.",
        },
      ],
      results: [
        "Releases públicas v0.1.15 a v0.1.19 (junio de 2026) con notas de versión e instalador.",
        "Capturas reales del 19-nov-2026 de una build QA local (94628fc) ejecutada en Windows 11.",
      ],
      limitations: [
        "Código privado: esta página no muestra código ni detalles internos.",
        "Las capturas son de una build QA posterior a v0.1.19; la interfaz de la release pública puede diferir.",
        "Durante la captura Ollama no estaba en ejecución, por eso el chat indica «Ollama no detectado».",
        "Es una app de escritorio: no hay demo web. Se prueba descargando el instalador desde Releases.",
      ],
      sources: "README y releases del repositorio público carey-assistant-releases; capturas de la app instalada.",
    },
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
    demo: {
      href: "/demos/fastlaundry",
      label: "Abrir demo conceptual",
      kind: "simulada",
      description:
        "Prototipo independiente creado desde cero con marca genérica y datos ficticios: pedidos, estados, caja y roles. No reutiliza código ni datos del sistema real.",
    },
    caseStudy: {
      architecture: [
        "Aplicación web en Django con PostgreSQL como base de datos y Bootstrap en la interfaz.",
        "Flujo central: un pedido se registra, avanza por estados explícitos y se cierra con su pago en caja.",
        "El acceso a cada acción depende del rol del usuario.",
      ],
      decisions: [
        {
          title: "Estados explícitos",
          detail: "Cada pedido tiene un estado definido en todo momento, lo que evita registros ambiguos entre recepción, proceso y entrega.",
        },
        {
          title: "Caja y pagos en el mismo sistema",
          detail: "El pago queda asociado al pedido en lugar de registrarse por separado.",
        },
        {
          title: "Roles",
          detail: "Las acciones disponibles se limitan según el rol de quien opera.",
        },
      ],
      results: ["Sistema en uso operativo según la experiencia declarada del autor; no se publican métricas internas."],
      limitations: [
        "Repositorio privado de un sistema empresarial: no se publica código, capturas de la interfaz original ni datos.",
        "La demo enlazada es un prototipo conceptual nuevo con datos inventados; no representa la interfaz ni las reglas exactas del sistema real.",
      ],
      sources: "Experiencia declarada en el CV del autor. Sin acceso público al sistema.",
    },
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
    caseStudy: {
      architecture: [
        "Spring Boot sin servidor web (web-application-type=none): la app es un menú de consola.",
        "GutendexClient usa RestClient para consultar /books?search= en la API pública de Gutendex.",
        "BookService mapea la respuesta a entidades Book y Author con Spring Data JPA.",
        "PostgreSQL persiste el catálogo; las credenciales llegan por variables de entorno (DB_URL, DB_USER, DB_PASSWORD).",
      ],
      decisions: [
        {
          title: "Sin duplicados por ID de Gutenberg",
          detail: "Antes de guardar se verifica el ID de Gutendex, y el resultado de la importación es un enum explícito (registrado, duplicado, no encontrado, error de API).",
        },
        {
          title: "Errores de la API como resultado, no como excepción al usuario",
          detail: "Si Gutendex falla, el menú informa «No fue posible consultar Gutendex» y sigue funcionando.",
        },
        {
          title: "Credenciales fuera del repositorio",
          detail: "application.properties solo referencia variables de entorno.",
        },
      ],
      results: [
        "Compilación y pruebas en local (19-nov-2026, Java 17, mvnw test): 4 de 4 pruebas aprobadas (GutendexMappingTest y BookServiceTest).",
        "Sesión real del 19-nov-2026 (transcripción abajo): 3 libros registrados desde Gutendex, duplicado detectado y consultas por autor, año e idioma con datos.",
        "El repositorio ejecuta las pruebas con Maven en GitHub Actions.",
      ],
      limitations: [
        "La auditoría encontró un bug: Gutendex responde 301 a /books?search= y el cliente HTTP del JDK no sigue redirecciones, así que toda búsqueda devolvía «no encontrado». Se corrigió con un cambio de una línea, fusionado en main el 19-nov-2026 (PR #2).",
        "Depende de la disponibilidad de la API pública de Gutendex, que durante la auditoría respondió con intermitencia.",
        "Es una aplicación de consola: no hay demo web en vivo.",
      ],
      sources: "README, código y pruebas del repositorio público; ejecución local con PostgreSQL aislado.",
    },
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
    cover: "spacex-sitio-carga",
    demo: {
      href: "/demos/spacex",
      label: "Abrir dashboard",
      kind: "funcional",
      description:
        "Dashboard navegable con los agregados y métricas que el notebook ya tiene almacenados (90 lanzamientos). No recalcula modelos ni usa datos nuevos.",
    },
    caseStudy: {
      architecture: [
        "Pandas carga dos CSV preparados: 90 lanzamientos y sus variables codificadas.",
        "SQLite (con ipython-sql) responde consultas de agregación por sitio, carga útil y órbita.",
        "Matplotlib y seaborn exploran relaciones; Folium ubica los sitios de lanzamiento y Dash/Plotly arma un dashboard.",
        "StandardScaler y train_test_split (20 % de prueba, random_state=2) preparan los datos.",
        "Se comparan regresión logística, SVM, árbol de decisión y KNN, más una red densa en Keras.",
      ],
      decisions: [
        {
          title: "Varias familias de modelos",
          detail: "Comparar modelos lineales, de márgenes, de árboles y de vecinos sobre el mismo split hace visibles sus diferencias en la clase minoritaria.",
        },
        {
          title: "Mirar la matriz de confusión, no solo la exactitud",
          detail: "Con 6 fallos y 12 éxitos en prueba, la exactitud esconde que KNN detecta solo 2 de 6 fallos.",
        },
      ],
      results: [
        "Dataset: 90 lanzamientos; 60 aterrizajes exitosos (66,7 %), según las consultas SQL almacenadas.",
        "Exactitud en prueba (18 lanzamientos): árbol de decisión 0,89, regresión logística 0,83, SVM 0,78, KNN 0,78 y red Keras 0,78.",
        "Todas las cifras provienen de las salidas guardadas en el notebook; no se recalcularon.",
      ],
      limitations: [
        "dataset_part_2.csv y dataset_part_3.csv no están en el repositorio: el notebook no es reproducible desde un clon limpio.",
        "El conjunto de prueba tiene solo 18 lanzamientos y el árbol de decisión no fija semilla: los resultados son exploratorios.",
        "Los mapas de Folium y el dashboard de Dash no quedaron guardados como salida estática en el notebook.",
      ],
      sources: "Notebook público con sus salidas almacenadas (subido el 4-jul-2024) y README del repositorio.",
    },
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
    caseStudy: {
      architecture: [
        "PostController expone /api/posts (GET para listar y POST para crear) en el puerto 8082.",
        "PostService delega en PostRepository (Spring Data JPA).",
        "La entidad Post tiene id, title, content, author y created_at.",
        "Flyway aplica V1__Create_Table.sql para crear la tabla posts en MySQL.",
      ],
      decisions: [
        {
          title: "Esquema versionado",
          detail: "Hibernate no modifica el esquema (ddl-auto=none); los cambios entran solo como migraciones de Flyway.",
        },
        {
          title: "Capas separadas",
          detail: "El controlador no accede a la base de datos: pasa por el servicio y el repositorio.",
        },
      ],
      results: ["Dos endpoints documentados en el README y verificables en el código."],
      limitations: [
        "Auditoría del 19-nov-2026: desde un clon limpio no compila sin ajustes, porque falta .mvn/wrapper y mysql-connector-j 8.0.34 no se resuelve en Maven Central.",
        "No hay autenticación ni validación de entrada en los endpoints; es un proyecto educativo.",
        "La consola de API de esta página es una simulación en el navegador; no se conecta a ningún backend.",
      ],
      sources: "Código, migración y README del repositorio público.",
    },
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
