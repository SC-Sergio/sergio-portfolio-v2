# Portfolio V3: registro de ejecución

Archivo de seguimiento del rediseño integral. Si una sesión se corta, retomar desde **Próxima acción**.

## Objetivos

Rediseño visual completo, corrección de los defectos conocidos, pruebas automatizadas, publicación en Vercel
(proyecto existente) y preparación del dominio propio, usando solo información verificable.

## Estado inicial (2026-11-14)

- `main` = `c3fb6c2` (verificado contra `origin/main`).
- Línea base medida en producción con `scripts/measure-perf.mjs` (laboratorio con Playwright, sin Lighthouse, mediana de 3):

| Perfil | FCP | LCP | TBT | CLS | JS | Three.js | Altura del documento al recorrer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop 1440 | 896 ms | 896 ms | 117 ms | 0 | 425 KB | sí | 5360 → 6972 px |
| Móvil (CPU ×4, 4G lenta) | 1412 ms | 1412 ms | 153 ms | 0 | 190 KB | no | 8196 → 12312 px |

## Arquitectura elegida

- Next.js 16 App Router; la página sigue siendo estática (SSG). Los datos están separados de la presentación:
  `data/profile.ts`, `data/projects.ts`, `data/skills.ts`, `data/navigation.ts`, `data/assistant.ts`.
- Solo son componentes cliente los que lo necesitan: `Navbar`, `Hero` (selección SVG/WebGL), `PortfolioAssistant`,
  `CopyEmailButton` y `PrintButton`. El resto se renderiza en el servidor.
- Se conserva todo el pipeline 3D de las fases 1B: `useHeroSceneMode`, `useDeferredSceneRequest`,
  `Scene3DErrorBoundary`, `canUseWebGL`, el reloj propio, el límite de ~30 FPS y las pausas fuera de vista.
- Se eliminan `motion` (solo lo usaba `AnimatedSection`) y `@react-three/drei` (sin uso). Se agrega
  `@types/three` (antes llegaba de forma transitiva desde drei) y `@playwright/test` como dependencias de desarrollo.

## Decisiones de diseño

- Concepto: «consola de ingeniería». Fondo casi negro, acentos cian, esmeralda y violeta, paneles con esquinas HUD,
  encabezados editoriales numerados (01–05) y tipografía Space Grotesk / Inter / JetBrains Mono (autoalojadas por next/font).
- Hero: nombre en gran formato, propuesta en degradado, CTAs, enlaces sociales y CV, una franja de datos verificados y
  etiquetas HUD alrededor del núcleo neuronal (solo en pantallas anchas).
- Stack: cada tecnología indica en qué proyecto se usó; sin porcentajes.
- Proyectos: un proyecto destacado (Pegasus) y tarjetas con categoría, contexto, estado honesto, diagrama de flujo
  técnico, detalle desplegable y enlaces. Se descartaron los filtros: con 6 proyectos no aportan.
- Servicios: lista de problemas y enfoque, cada uno enlazado a su proyecto de evidencia.
- Contacto sin formulario (no hay backend de correo gratuito ya configurado); correo, copiar correo, GitHub, LinkedIn y CV.

## Verificación de contenido

| Dato | Fuente |
| --- | --- |
| Pegasus Knowledge Center | README y topics del repositorio público; despliegue OCI histórico, hoy apagado |
| Carey Assistant | README y releases públicas (v0.1.19); código privado |
| FASTLAUNDRY | Experiencia en Tupoclick Softwares según el CV del autor; repositorio privado, sin detalles internos |
| LiterAlura, ForoHub, SpaceX, laboratorio | README de cada repositorio público |
| Experiencia y formación | CV del autor (rama `fase-6-mejoras-post-deploy`, nov. 2025), sin teléfono ni carta de presentación |
| CanchaClara | **Retirado**: el repositorio es un fork de `Darighan/canchaclara` y la autoría no es verificable |
| Flask, OpenAI, Webhooks | **Retirados del stack**: sin evidencia pública |

## Defectos corregidos

| Defecto | Causa | Solución | Prueba de regresión |
| --- | --- | --- | --- |
| Saltos de altura y scroll inestable | `content-visibility: auto` con altura estimada de 820 px | Se eliminó `.cv-auto`; la página es corta y no había beneficio medible | `la altura del documento no cambia…` |
| Títulos tapados por el navbar | Sin `scroll-padding` | `scroll-padding-top` en `html` (no se combina con `scroll-margin`, que lo duplicaba) | `#… queda visible bajo el navbar` |
| Sin menú móvil | No existía | Menú con `aria-expanded`, foco, Escape, clic fuera y cierre al navegar | `menú móvil` |
| Aviso de hidratación en AnimatedSection | `useReducedMotion` difiere entre servidor y cliente | Animación de aparición en CSS con `animation-timeline: view()`, sin JS | `carga sin errores de consola ni avisos de hidratación` |
| `backdrop-filter` costoso | Blur en navbar, paneles y asistente | Fondos opacos; ningún `backdrop-filter` restante | inspección (`grep backdrop`) |
| «¿Cómo puedo contactarlo?» fuera de tema | Coincidencia por subcadena «contacto» | Clasificador por palabras/raíces (`contact*`) con prioridad de intenciones | `tests/unit/assistant.spec.ts` |
| Falsos positivos del asistente | «ia» coincidía con «historia» | Coincidencia por palabra completa | idem |
| CV 404 | El PDF ya no existía en `main` y el antiguo tenía teléfono | Nueva ruta `/cv` imprimible con datos verificados | `CV disponible…`, `no publica números de teléfono` |
| Desbordamiento horizontal a 320 px | Nombre largo en tarjetas de laboratorio | `overflow-wrap:anywhere` y `min-w-0` | `sin desbordamiento horizontal` |

## Pruebas

- `npm run lint`, `npm run typecheck`, `npm run build`.
- `npm test`: Playwright con proyectos `unit`, `desktop` (1440×900) y `mobile` (Pixel 7) contra `next start`.
  Cubre anclas, menú móvil, Hero y CTAs, proyectos y enlaces, asistente, contacto, SVG/WebGL, sin WebGL, fallo del chunk 3D,
  movimiento reducido, scroll, Home/End, recarga, hidratación, desbordamiento de 320 a 3840 px, SEO, rutas y 404.
- `npm run perf -- <url>`: medición de laboratorio. `node scripts/screenshots.mjs <url> docs/screenshots`: capturas.

## Avisos conocidos

- `THREE.Clock` obsoleto: lo emite React Three Fiber internamente. Es cosmético; no se parchea R3F.
- El año del footer se calcula en el build (página estática); se actualiza con cada despliegue.

## Dominio propio

- 2026-11-14, WHOIS: `sergiocareydev.cl` (NIC Chile) y `sergiocareydev.com` (Verisign) **no registrados**.
  No pertenecen al autor: requieren compra con aprobación explícita. Ver el informe final para precio y pasos.
- Hasta entonces, canonical, sitemap, robots y Open Graph usan `https://sergio-portfolio-v2-roan.vercel.app`.

## Bitácora

- Rama `feat/portfolio-v3`, PR y despliegue: ver la sección siguiente, que se actualiza al cerrar cada etapa.

## Próxima acción

Abrir el PR de `feat/portfolio-v3`, esperar CI y Vercel Preview, fusionar con squash y verificar producción.
