# Portfolio V3.5: registro de ejecución

Evidencia visual, casos de estudio, demos y aprovechamiento ultrawide. Si una sesión se corta, retomar desde
**Próxima acción**. Fuente de continuidad general: `docs/PORTFOLIO_CONTINUITY_CHECKPOINT.md`.

## Estado actual

- Rama `feat/portfolio-v35-interactive-showcase`, creada desde `origin/main` = `debcd07` (verificado el 19-nov-2026).
- Implementado, probado en local y medido; ver **Bitácora** para PR, CI y despliegue.

## Objetivos (orden maestra V3.5, 19-nov-2026)

Casos de estudio por proyecto, galerías con capturas auténticas, demos (prioridad Pegasus, FastLaundry conceptual,
SpaceX), Hero que aproveche monitores anchos, sin regresiones de rendimiento y con evidencia rotulada como real o simulada.

## Matriz de factibilidad e inventario

| Proyecto | Repo | Entorno | Ejecución local | Pruebas | Captura | Difusión | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pegasus | Público | Python 3.12, torch CPU, ChromaDB, Streamlit; Gemini con clave | **Sí** (venv aislado; sin clave de Gemini) | pytest 7/7 | **Captura real local** (2) + históricas OCI del repo (4) | Corpus ficticio público | **Demo funcional** (recuperación real precalculada + BM25) |
| Carey Assistant | Código privado; releases públicas | Windows, Tauri, Ollama | **Sí** (build QA 94628fc ya instalada) | — | **Captura real local** (6, PrintWindow + UI Automation, sin mover el mouse) | Sin datos personales en pantalla | Galería; sin demo web (app de escritorio) |
| FastLaundry | **Privado** (empresa) | Django, PostgreSQL | No se intentó (sin autorización) | — | **No** | Sin autorización para la interfaz original | **Demo simulada** nueva, marca genérica, datos ficticios |
| SpaceX | Público | Jupyter; faltan `dataset_part_2/3.csv` | No reproducible | — | **Resultados reales del notebook** (6 gráficos) | Salidas ya publicadas | **Demo funcional** (dashboard con cifras almacenadas) |
| LiterAlura | Público | Java 17, Maven, PostgreSQL, Gutendex | **Sí** (PostgreSQL aislado en puerto 55432) | mvnw 4/4 | **Transcripción real** de consola | Repo propio | Bug encontrado y corregido (PR #2, fusionada) |
| ForoHub | Público | Java 17, Maven, MySQL | **No**: falta `.mvn/wrapper` y `mysql-connector-j:8.0.34` no se resuelve | — | No | Repo propio | **Consola de API simulada** rotulada |

Categorías usadas (no se mezclan): captura real local, captura real histórica, resultado real del notebook, demo funcional,
demo simulada. No se crearon mockups conceptuales presentados como capturas.

## Recursos obtenidos

Manifiesto completo con origen, fecha, tamaño y texto alternativo: `data/media.ts`. Archivos en `public/media/<proyecto>/`
(WebP, 6–76 KB cada uno, 752 KB en total). Originales de las capturas nuevas: `docs/media-originals/` (WebP sin pérdida).

- **Pegasus**: `local-inicio`, `local-abstencion` (19-nov-2026); `oci-inicio` (barra del navegador con IP recortada),
  `oci-respuesta-technical-lead`, `oci-evidencia-incidentes`, `oci-evidencia-frontend` (jul. 2026, del repo).
  **Excluida**: `04-oci-instance-running.jpeg` (muestra IP pública, parte del OCID y compartimento).
- **Carey Assistant**: inicio, asistente, IA local, proyectos, configuración, investigación (build QA 94628fc).
- **SpaceX**: tendencia anual, éxito por órbita, sitio vs carga, órbita vs vuelo, carga vs vuelo, matriz del árbol.
- **Datos de demo**: `public/demos/pegasus/retrieval.json` (23 consultas reales, 85 KB) y `chunks.json` (312 chunks,
  305 KB, solo se descarga al hacer una pregunta libre). Generados con el pipeline real (script en el scratchpad de la sesión;
  reproducible con `build_rag_context(question, top_k=4)` del repo de Pegasus).

## Demos y enlaces internos

| Ruta | Tipo | Qué hace |
| --- | --- | --- |
| `/demos/pegasus` | Funcional | 23 recuperaciones reales (20 de `docs/test-questions.md` + 3 fuera del corpus) con distancia, página y abstención; BM25 en el navegador para preguntas libres, rotulado como léxico. No llama a Gemini. |
| `/demos/fastlaundry` | Simulada | Pedidos, estados, caja, roles y panel; aviso literal «Demostración conceptual con datos simulados. No conectada al sistema empresarial real.» Sin red ni persistencia. |
| `/demos/spacex` | Funcional | KPIs, lanzamientos por sitio con mapa de coordenadas, éxito por órbita, comparación de 5 modelos con matriz de confusión. Cifras copiadas del notebook. |
| `/proyectos/forohub` | Simulada (embebida) | Consola GET/POST `/api/posts` en memoria. |
| `/proyectos/literalura` | Real (transcripción) | Salida literal de la ejecución local. |
| `/proyectos/<slug>` × 6 | — | Casos de estudio con metadata y Open Graph propios. |

## Permisos, confidencialidad y riesgos

- FastLaundry: no se abrió ni clonó el repositorio privado; la demo no reutiliza código, interfaz ni datos. No hay capturas del sistema.
- Carey Assistant: solo capturas de la interfaz; código privado intacto. El arte del personaje «Airi» aparece en la captura de inicio:
  **confirmar con el propietario el origen/licencia de esa ilustración** antes de usarla fuera del portafolio.
- No se publicaron claves ni `.env`; Pegasus corrió sin `GEMINI_API_KEY`.
- Repos externos modificados: solo `SC-Sergio/Challengeliteralura` (PR #2, 1 línea, CI verde, squash `730576d`).

## Hero ultrawide

Medición previa (`docs/screenshots/v35-hero-before-*.webp`): el contenido vive en `max-w-7xl` (1280 px); el núcleo 3D ocupa la mitad
derecha del viewport y sus etiquetas llegan a ~1640 px en 1920. El margen izquierdo queda vacío desde 1600 px.

Alternativas: A (dos rieles) elegida en versión asimétrica; B (solo derecho) dejaba vacío el lado izquierdo; C (contenedor más ancho)
empujaba el H1 hacia el núcleo. Resultado (`v35-hero-after-*.webp`):
- Riel izquierdo desde 1600 px: índice numerado de secciones (anclas).
- Riel derecho desde 1840 px: accesos a las 3 demos y a los casos de estudio.
- Solo HTML/CSS, sin JS, sin animación, sin segundo canvas; ocultos (`display:none`) bajo esos anchos. Prueba E2E verifica que no
  se superponen al contenido a 1920, 2560 y 3840 px.

## Rendimiento (laboratorio, builds de producción locales fuera de OneDrive)

A/B intercalado `scripts/ab-perf.mjs`, 9 rondas, perfil móvil (CPU ×4, 150 ms RTT, 1,6 Mbps), mediana [IQR]:

| Variante | FCP = LCP | TBT | CSS listo | Fuentes |
| --- | --- | --- | --- | --- |
| Base `debcd07` | 884 [880–888] ms | 120 [119–123] ms | 530 ms | 109 KB |
| V3.5 | 908 [900–920] ms | 118 [118–119] ms | 573 ms | 109 KB |

`scripts/measure-perf.mjs` (mediana de 3, dos alternancias base/V3.5): CLS 0 en ambos; móvil JS 156 → 161 KB y **sin descarga de
Three.js**; desktop JS 385 → 428 KB.

Lectura honesta: +24 ms de FCP móvil, consistente (IQR sin solape), causado por el CSS global (Tailwind genera una hoja para todo
el sitio): 11,2 → 13,1 KB gzip. TBT sin cambio. En desktop, la carga inicial suma ~17 KB sin comprimir (Link/Image); los ~58 KB
restantes son el *prefetch* de Next.js de las rutas de casos de estudio cuando las tarjetas entran en pantalla, no en la carga.
INP no se midió (requiere interacción real de usuarios).

## Pruebas

- `npm run lint`, `npm run typecheck`, `npm run build`: OK (21 páginas estáticas).
- `npm test`: 126 aprobadas, 10 omitidas por diseño (pruebas solo desktop o solo móvil), 0 fallidas.
- Nuevo `tests/e2e/showcase.spec.ts`: 6 casos de estudio (encabezados, enlaces seguros, canonical, OG, regreso a `/#projects`),
  404 de slug inexistente, anterior/siguiente, manifiesto de medios (200 y alt), galería (flechas, Escape, foco, teclado),
  portada sin descargar capturas, Pegasus (fuentes, abstención, BM25, error de carga), FastLaundry (validación, roles, caja,
  entrega, panel), SpaceX (modelo y orden), ForoHub (200/400), LiterAlura (transcripción), demos sin Three.js ni desbordamiento
  a 320 px, tarjetas con caso y demo, rieles por ancho, sitemap.
- Ajuste de prueba existente: «los proyectos privados no exponen enlaces» ahora exige 0 enlaces externos y exactamente 2 internos
  (caso de estudio y demo conceptual).
- No se ejecutó un auditor automático de accesibilidad (axe no está instalado); no se afirma conformidad WCAG.

## Problemas detectados

| Problema | Estado |
| --- | --- |
| LiterAlura: toda búsqueda devolvía «no encontrado» (301 de Gutendex + cliente JDK sin redirecciones) | Corregido, PR #2 fusionada |
| ForoHub no compila desde un clon limpio (wrapper incompleto, conector MySQL 8.0.34) | Documentado; pendiente de decisión del propietario |
| `.btn` (CSS sin capa) gana a `hidden` de Tailwind: el botón «Contactar» del navbar de la portada se ve en móvil aunque la intención era ocultarlo | En subpáginas se resolvió con un contenedor; en la portada se dejó igual (preexistente, sin desbordamiento) |
| Gutendex intermitente | Externo |

## Próxima acción

Ver la última fila de la bitácora.

## Bitácora

| Fecha | Evento |
| --- | --- |
| 2026-11-19 | Auditoría: `origin/main` = `debcd07`; seis repos inventariados |
| 2026-11-19 | Pegasus ejecutado en local (índice 312 chunks, pytest 7/7, capturas, recuperaciones) |
| 2026-11-19 | Carey Assistant capturado (6 vistas); LiterAlura compilado y probado (4/4); ForoHub no compila |
| 2026-11-19 | LiterAlura: bug del 301 diagnosticado; PR SC-Sergio/Challengeliteralura#2, CI verde, squash `730576d` |
| 2026-11-19 | Commits `511da9c`…`ff663c6` en la rama: medios, casos de estudio, demos, portada, pruebas |
