// Manifiesto de medios del portafolio. Cada recurso declara su origen y su tipo para no mezclar
// capturas reales con demos simuladas. Los archivos viven en public/media/<proyecto>/ y se generan
// con scripts/optimize-media.mjs (WebP). Los originales de las capturas nuevas están en
// docs/media-originals/ (WebP sin pérdida); los históricos de Pegasus y los gráficos de SpaceX
// siguen en sus repositorios públicos.

export type MediaKind = "captura-local" | "captura-historica" | "resultado-notebook" | "demo-simulada";

export const mediaKindLabel: Record<MediaKind, string> = {
  "captura-local": "Captura real · ejecución local",
  "captura-historica": "Captura real · despliegue histórico",
  "resultado-notebook": "Resultado real del notebook",
  "demo-simulada": "Demo simulada · datos ficticios",
};

export type MediaItem = {
  id: string;
  project: string;
  src: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  caption: string;
  kind: MediaKind;
  /** Cómo se obtuvo el recurso, en una frase verificable. */
  origin: string;
  date: string;
  /** Fondo claro (gráficos de matplotlib): se enmarca distinto en la galería. */
  light?: boolean;
};

const pegasusOci = "Captura del autor publicada en docs/screenshots del repositorio público (instancia OCI, hoy apagada).";
const pegasusLocal =
  "Ejecución local del código público (main) con los 5 PDF ficticios del repositorio; Streamlit capturado con Playwright.";
const careyLocal =
  "Ventana de la app instalada (build QA 94628fc, posterior a v0.1.19) capturada con PrintWindow de Windows; sin datos personales.";
const spacexNotebook = "Salida almacenada en el notebook público SpaceX_Falcon9_Landing_Prediction.ipynb, sin recalcular.";

export const media: MediaItem[] = [
  // ─── Pegasus ──────────────────────────────────────────────────────────────
  {
    id: "pegasus-local-inicio",
    project: "pegasus",
    src: "/media/pegasus/local-inicio.webp",
    width: 1440,
    height: 900,
    bytes: 53490,
    alt: "Interfaz Streamlit de Pegasus Engineering Knowledge Center: 5 documentos PDF, 312 chunks indexados y filtro de distancia coseno de 0,65.",
    caption: "Inicio con el índice construido en local: 5 PDF, 312 chunks y el umbral del relevance gate visible.",
    kind: "captura-local",
    origin: pegasusLocal,
    date: "2026-11-19",
  },
  {
    id: "pegasus-local-abstencion",
    project: "pegasus",
    src: "/media/pegasus/local-abstencion.webp",
    width: 1440,
    height: 900,
    bytes: 44866,
    alt: "Pegasus se abstiene ante la pregunta «¿Cuál es la capital de Francia?»: no encontró evidencia suficientemente relevante en la documentación.",
    caption: "Abstención real: una pregunta fuera del corpus no supera el umbral y no se envía al LLM.",
    kind: "captura-local",
    origin: pegasusLocal,
    date: "2026-11-19",
  },
  {
    id: "pegasus-oci-inicio",
    project: "pegasus",
    src: "/media/pegasus/oci-inicio.webp",
    width: 1600,
    height: 787,
    bytes: 46738,
    alt: "Pegasus desplegado en Oracle Cloud: panel con 5 PDF, 306 chunks, modelo Gemini 2.5 Flash y consola de preguntas.",
    caption: "Versión desplegada en OCI durante la evaluación (jul. 2026). Se recortó la barra del navegador con la IP.",
    kind: "captura-historica",
    origin: pegasusOci,
    date: "2026-07-10",
  },
  {
    id: "pegasus-oci-respuesta",
    project: "pegasus",
    src: "/media/pegasus/oci-respuesta-technical-lead.webp",
    width: 1600,
    height: 781,
    bytes: 42452,
    alt: "Respuesta de Pegasus sobre las responsabilidades del Technical Lead durante un incidente, con evidencia del protocolo de incidentes, página 6.",
    caption: "Respuesta generada con Gemini y lista de evidencia: documento y página de cada fuente.",
    kind: "captura-historica",
    origin: pegasusOci,
    date: "2026-07-10",
  },
  {
    id: "pegasus-oci-evidencia-incidentes",
    project: "pegasus",
    src: "/media/pegasus/oci-evidencia-incidentes.webp",
    width: 1600,
    height: 783,
    bytes: 72300,
    alt: "Panel de evidencia documental de Pegasus: 4 fuentes recuperadas, relevancia alta y el fragmento del protocolo de incidentes sobre el Incident Commander.",
    caption: "Trazabilidad: cada fuente muestra documento, página, chunk, distancia y el texto recuperado.",
    kind: "captura-historica",
    origin: pegasusOci,
    date: "2026-07-10",
  },
  {
    id: "pegasus-oci-evidencia-frontend",
    project: "pegasus",
    src: "/media/pegasus/oci-evidencia-frontend.webp",
    width: 1600,
    height: 787,
    bytes: 76300,
    alt: "Evidencia de Pegasus para una pregunta de front-end: 4 fuentes de la guía de ingeniería front-end con relevancia media y baja.",
    caption: "Una consulta con evidencia más débil: las fuentes se etiquetan con relevancia media o baja.",
    kind: "captura-historica",
    origin: pegasusOci,
    date: "2026-07-10",
  },

  // ─── Carey Assistant ──────────────────────────────────────────────────────
  // La vista «Inicio» no se publica: muestra la ilustración del personaje «Airi», cuyo origen y
  // licencia están pendientes de confirmar por el propietario.
  {
    id: "carey-asistente",
    project: "carey-assistant",
    src: "/media/carey-assistant/asistente.webp",
    width: 1440,
    height: 900,
    bytes: 44604,
    alt: "Chat de Carey Assistant con el modelo local llama3.2 seleccionado, estado de Ollama y opciones de contexto y memoria por mensaje.",
    caption: "Chat: modelo local activo visible y estado honesto del motor (Ollama no estaba en ejecución al capturar).",
    kind: "captura-local",
    origin: careyLocal,
    date: "2026-11-19",
  },
  {
    id: "carey-ia-local",
    project: "carey-assistant",
    src: "/media/carey-assistant/ia-local.webp",
    width: 1440,
    height: 900,
    bytes: 67562,
    alt: "Configuración de IA local y proveedores en Carey Assistant: motor recomendado, modo sin IA, motor local Ollama y proveedor cloud bloqueado sin clave.",
    caption: "IA local / proveedores: Ollama primero y nube bloqueada hasta que exista una clave guardada.",
    kind: "captura-local",
    origin: careyLocal,
    date: "2026-11-19",
  },
  {
    id: "carey-proyectos",
    project: "carey-assistant",
    src: "/media/carey-assistant/proyectos.webp",
    width: 1440,
    height: 900,
    bytes: 56650,
    alt: "Vista de proyectos de Carey Assistant: carpetas autorizadas de solo lectura con permisos temporales.",
    caption: "Proyectos: permisos de carpeta temporales y de solo lectura, que desaparecen al cerrar la app.",
    kind: "captura-local",
    origin: careyLocal,
    date: "2026-11-19",
  },
  {
    id: "carey-configuracion",
    project: "carey-assistant",
    src: "/media/carey-assistant/configuracion.webp",
    width: 1440,
    height: 900,
    bytes: 54642,
    alt: "Configuración general de Carey Assistant con secciones de personalidad, voz, IA, privacidad, automatización y diagnóstico.",
    caption: "Configuración: privacidad y memoria, automatización con horario silencioso y actualizaciones manuales.",
    kind: "captura-local",
    origin: careyLocal,
    date: "2026-11-19",
  },
  {
    id: "carey-investigacion",
    project: "carey-assistant",
    src: "/media/carey-assistant/investigacion.webp",
    width: 1440,
    height: 900,
    bytes: 34986,
    alt: "Investigación web de Carey Assistant en modo gratuito: fuentes públicas RSS/JSON con caché local.",
    caption: "Investigación web: fuentes públicas, scoring local y sin APIs de pago.",
    kind: "captura-local",
    origin: careyLocal,
    date: "2026-11-19",
  },

  // ─── SpaceX ───────────────────────────────────────────────────────────────
  {
    id: "spacex-tendencia",
    project: "spacex",
    src: "/media/spacex/tendencia-anual.webp",
    width: 581,
    height: 446,
    bytes: 7614,
    alt: "Gráfico de línea: tasa de aterrizajes exitosos por año, de 0 en 2010–2013 a cerca de 0,9 en 2019.",
    caption: "Tasa de éxito por año (matplotlib).",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
  {
    id: "spacex-orbita",
    project: "spacex",
    src: "/media/spacex/exito-por-orbita.webp",
    width: 581,
    height: 446,
    bytes: 7442,
    alt: "Gráfico de barras con la tasa de éxito de aterrizaje por tipo de órbita.",
    caption: "Tasa de éxito por tipo de órbita (seaborn).",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
  {
    id: "spacex-sitio-carga",
    project: "spacex",
    src: "/media/spacex/sitio-vs-carga.webp",
    width: 1054,
    height: 495,
    bytes: 13032,
    alt: "Diagrama de dispersión de masa de carga útil por sitio de lanzamiento, coloreado por aterrizaje exitoso o fallido.",
    caption: "Carga útil por sitio de lanzamiento y resultado del aterrizaje.",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
  {
    id: "spacex-orbita-vuelo",
    project: "spacex",
    src: "/media/spacex/orbita-vs-vuelo.webp",
    width: 1058,
    height: 496,
    bytes: 11864,
    alt: "Diagrama de dispersión de órbita por número de vuelo, coloreado por resultado del aterrizaje.",
    caption: "Órbita por número de vuelo: los éxitos se concentran en vuelos posteriores.",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
  {
    id: "spacex-carga-vuelo",
    project: "spacex",
    src: "/media/spacex/carga-vs-vuelo.webp",
    width: 1600,
    height: 313,
    bytes: 15798,
    alt: "Diagrama de dispersión de masa de carga útil por número de vuelo, coloreado por resultado del aterrizaje.",
    caption: "Carga útil por número de vuelo.",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
  {
    id: "spacex-matriz-arbol",
    project: "spacex",
    src: "/media/spacex/matriz-arbol.webp",
    width: 530,
    height: 453,
    bytes: 6190,
    alt: "Matriz de confusión del árbol de decisión sobre 18 lanzamientos de prueba: 5 y 11 aciertos, 1 y 1 errores.",
    caption: "Matriz de confusión del árbol de decisión (conjunto de prueba de 18 lanzamientos).",
    kind: "resultado-notebook",
    origin: spacexNotebook,
    date: "2024-07-04",
    light: true,
  },
];

export function mediaFor(project: string) {
  return media.filter((item) => item.project === project);
}

export function mediaById(id: string) {
  return media.find((item) => item.id === id);
}
