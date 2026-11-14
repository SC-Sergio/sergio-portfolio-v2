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
- Precio oficial NIC Chile (nic.cl/dominios/tarifas.html, vigente desde el 1-nov-2023): **$9.990 CLP por año, exento de IVA**;
  la renovación cuesta lo mismo (2 años $19.980, 5 años $49.950). Inscripción en nic.cl con Clave Única o cuenta NIC.
- Hasta entonces, canonical, sitemap, robots y Open Graph usan `https://sergio-portfolio-v2-roan.vercel.app`.

## Resultado de rendimiento (producción, mismo script y condiciones que la línea base)

| Perfil | Métrica | Antes (`c3fb6c2`) | Después (`faed1dd`) |
| --- | --- | --- | --- |
| Desktop 1440 | FCP / LCP | 896 ms | 680 ms |
| Desktop 1440 | TBT | 117 ms | 25 ms |
| Desktop 1440 | JS transferido | 425 KB | 393 KB |
| Móvil (CPU ×4, 4G lenta) | FCP / LCP | 1412 ms | 1596 ms |
| Móvil | TBT | 153 ms | 192 ms |
| Móvil | JS transferido | 190 KB | 158 KB |
| Ambos | CLS | 0 | 0 |
| Ambos | Altura del documento al recorrer | varía hasta +4116 px | constante |
| Móvil | Descarga de Three.js | no | no |

Lectura honesta: desktop mejora en todo; en móvil baja el JS (−32 KB) y desaparecen los saltos de scroll, pero el
LCP sube ~180 ms y el TBT ~40 ms. La causa más probable son las tres familias tipográficas nuevas (el H1 es el elemento
LCP y su fuente se intercambia al cargar). Son mediciones de laboratorio con red remota (ruido de ±100 ms entre corridas).
Optimización candidata, pendiente de una medición A/B intercalada: usar fuente del sistema para el cuerpo y precargar solo
Space Grotesk.

## Bitácora

| Fecha | Evento |
| --- | --- |
| 2026-11-14 | Rama `feat/portfolio-v3`; 5 commits lógicos + 1 corrección (panel del asistente bajo el navbar en móvil) |
| 2026-11-14 | PR #8: CI falló por pruebas de anclas sensibles al scroll suave en el runner; se esperaron posiciones finales en vez de pausas |
| 2026-11-14 | PR #8 en verde (CI + Vercel Preview) → squash-merge `faed1dd`; CI de `main` en verde |
| 2026-11-14 | Producción (Vercel, proyecto existente) sirve `faed1dd`; suite E2E contra la URL pública: 72/73 al primer intento |
| 2026-11-14 | Ajustes de pruebas tras correr contra producción: los chunks en Vercel viven en `/_next/static/immutable/`, y la prueba de bloqueo del asistente necesitaba más tiempo bajo carga |

## Pulido final (2026-11-14)

### Diagnóstico del rendimiento móvil

A/B intercalado (`scripts/ab-perf.mjs`, 9 rondas, orden rotado, builds servidos fuera de OneDrive), perfil móvil
CPU ×4 / 150 ms / 1,6 Mbps. Mediana [rango intercuartil]:

| Variante | FCP = LCP | TBT | Fuentes |
| --- | --- | --- | --- |
| O · `c3fb6c2` (antes del rediseño) | 868 [864–872] | 138 [131–145] | 0 KB |
| A · `e011749` (V3) | 1220 [1180–1276] | 162 [145–186] | 109 KB |
| B · A sin precargar Inter | 1184 [1180–1208] | 124 [122–238] | 109 KB |
| C · A sin precargar ninguna fuente | 1144 [1136–1168] | 258 [256–307] | 109 KB |
| D · A sin Inter (cuerpo con fuente del sistema) | 1352 [1328–1440] | 147 [137–153] | 61 KB |
| E · A **sin ninguna fuente web** | 1216 [1188–1292] | 125 [121–129] | 0 KB |
| G · A sin animación `reveal` | 1124 [1112–1160] | 168 [118–181] | 109 KB |
| F · A sin la máscara de la cuadrícula | 1188 [1188–1208] | 172 [151–182] | 109 KB |

Conclusiones:
- **Las fuentes no son la causa**: sin ninguna fuente web (E) el FCP es igual al de A. No se cambió la tipografía.
- El elemento LCP es el párrafo del Hero (`p`), no el H1.
- Trazas de Chrome antes del primer pintado: Layout **~450 ms vs ~200 ms** y recálculo de estilos 110 vs 25 ms.
  La V3 maqueta toda la página antes de pintar; la versión anterior lo evitaba con `content-visibility`
  (que a la vez causaba los saltos de scroll).

### Cambio aplicado: render diferido solo durante la carga

`.defer-render` (`content-visibility: auto`) en las secciones bajo el Hero, únicamente hasta que:
`RenderGate` las activa de a una en momentos ociosos tras `load` (~550 ms en el perfil móvil), o el usuario
interactúa (scroll, toque, tecla: lo escucha un script en línea del `<head>`, sin esperar la hidratación), o la visita
es una recarga, navegación del historial o trae un ancla (se renderiza todo antes del primer pintado).
Después, `data-render="all"` deja la altura del documento fija.

| Variante | FCP = LCP | TBT |
| --- | --- | --- |
| A · V3 | 1204 [1168–1204] | 172 [169–187] |
| H · render diferido, activado todo de una vez | 904 [884–916] | 161 [143–303] |
| **I · render diferido progresivo (aplicado)** | **900 [892–912]** | **128 [121–134]** |

- Desktop: sin regresión (diferencias dentro del ruido).
- Capturas antes/después con movimiento reducido: **12 de 12 idénticas píxel a píxel** (móvil y desktop, 6 secciones).
- Pruebas nuevas: CLS < 0,02 con scroll inmediato tras cargar; render completo tras la carga; altura estable.
- Descartados: quitar la precarga (C sube el TBT), quitar Inter (D empeora el FCP), quitar `reveal` (−80 ms, pero es
  parte del diseño aprobado y el render diferido ya recupera la diferencia).
- Nota de pruebas: con WebGL por software y 6 workers, la prueba Home/End falla de forma intermitente también en el
  build original (1 de 12); se estabilizó esperando la carga y con timeout global de 60 s.

### Datos profesionales pendientes de confirmación del propietario

| Dato | Dónde aparece | Fuente | Qué confirmar |
| --- | --- | --- | --- |
| Tupoclick Softwares «Desde nov. 2025» y redacción en presente («Hoy desarrollo…», «Lo desarrolla…») | Perfil, `/cv`, asistente, tarjeta FASTLAUNDRY | CV de nov. 2025 marcado «(Actual)» | Si el cargo sigue vigente o su fecha de término |
| «Vending Store Limitada» en el cargo de Desarrollador Python | Perfil, `/cv`, asistente | El CV escribe «Vending Store Ilimitada» en ese cargo y «LIMITADA» en la práctica | Razón social correcta |
| «Abierto a trabajo remoto» | Hero, Contacto | Orden del propietario (capacidad de trabajo remoto) | Que quiera declararlo así |
| Contenido del perfil de LinkedIn | Enlaces | La URL responde, pero LinkedIn exige iniciar sesión para verla | Que el perfil esté al día |

Verificado sin cambios: repositorios públicos (todos responden 200), Carey Assistant sigue en v0.1.19, Pegasus no está
archivado, JSON-LD sin empleador declarado (`worksFor` omitido a propósito), formación y idiomas coinciden con el CV.

### CV en PDF

- `npm run cv:pdf -- <url> <salida.pdf>` genera el PDF desde `/cv` (A4, 2 páginas, fondo blanco, enlaces de correo,
  GitHub y LinkedIn activos, sin teléfono). Prueba de regresión: «la versión impresa cabe en 2 páginas A4».
- Se corrigió la impresión de `/cv`: marco oscuro por `color-scheme: dark` y saltos de página que dejaban media hoja vacía.
- **No se publica un PDF estático** hasta que el propietario confirme la tabla anterior. Mientras tanto, el botón
  «Imprimir / PDF» de `/cv` produce el mismo documento desde el navegador.

### Dominio

- WHOIS 2026-11-14 (2.ª verificación): `sergiocareydev.cl` sigue **sin registrar**; no hay DNS. No se generaron cargos.

## Próxima acción

1. Propietario: confirmar los datos de la tabla anterior (si cambian, editar `data/profile.ts` y regenerar el PDF con
   `npm run cv:pdf`, dejándolo en `public/` y enlazándolo desde `/cv`).
2. Propietario: registrar `sergiocareydev.cl` en nic.cl ($9.990 CLP/año). Después: agregar `sergiocareydev.cl` y
   `www.sergiocareydev.cl` al proyecto Vercel `sergio-portfolio-v2`, crear en NIC Chile los registros DNS que indique
   Vercel, verificar HTTPS, redirigir el dominio raíz a `www` y fijar `NEXT_PUBLIC_SITE_URL=https://www.sergiocareydev.cl`
   en Production.
