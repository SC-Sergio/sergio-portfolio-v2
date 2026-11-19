# CHECKPOINT DE CONTINUIDAD — Sergio Portfolio V3 → V3.5

> **Actualización 19-nov-2026 — V3.5 PUBLICADA.** PR #11 fusionado por squash como
> **`b642d1ecc3273335352eccc3e7b979052c8ff0df`**; CI de `main` en verde y Vercel Production sirviendo ese commit en
> https://sergio-portfolio-v2-roan.vercel.app (público, sin login). E2E contra producción: 126 aprobadas, 10 omitidas por diseño,
> 0 fallidas. Rollback: `debcd07`. Detalle, evidencias y mediciones en **`docs/PORTFOLIO_V35_EXECUTION.md`**; leerlo primero.
> - Publicado: casos de estudio `/proyectos/<slug>` (6); demos `/demos/pegasus` (funcional), `/demos/spacex` (funcional) y
>   `/demos/fastlaundry` (simulada, marca genérica, sin conexión con el sistema real); 17 capturas/gráficos rotulados; rieles
>   del Hero desde 1600/1840 px.
> - Repos externos: SC-Sergio/Challengeliteralura#2 (arreglo del 301 de Gutendex) fusionado como `730576d`.
> - Pendientes solo del propietario: tres confirmaciones del CV (sección 2), compra del dominio, licencia de la ilustración
>   «Airi» (la vista «Inicio» de Carey se retiró por eso) y decidir si se corrige ForoHub para que compile.
> - Las secciones siguientes conservan el texto original del 17-nov-2026 como contexto histórico.

**Fecha:** 17 de noviembre de 2026  
**Estado:** diagnóstico y planificación; **NO hay autorización todavía para implementar la V3.5**.  
**Repositorio:** https://github.com/SC-Sergio/sergio-portfolio-v2  
**Producción existente:** https://sergio-portfolio-v2-roan.vercel.app  
**Referencia de código ANTERIOR a este checkpoint:** `e17893d49941d956ee8f6eda47c24bdd7b84abdf`.

> **Para continuar en otra conversación o agente:** leer **este archivo**, `docs/PORTFOLIO_V3_EXECUTION.md`, `README.md`, `data/projects.ts`, `data/profile.ts`, `components/Hero.tsx`, `package.json` y el HEAD actual de `main` **antes de redactar un prompt o modificar el código**. Este documento registra la intención y los límites de la próxima fase, pero no es una autorización para publicar contenido privado o comprar servicios.

## 1. Qué está terminado y verificado

- La versión V3 del portafolio es pública en la URL de producción arriba indicada. El propietario **comprobó personalmente en una ventana de incógnito que la web abre sin iniciar sesión**. Las previews de Vercel pueden tener autenticación; **producción debe conservar el acceso público**.
- Los PR #8 (rediseño total), #9 (pruebas/documentación) y #10 (pulido del rendimiento) ya fueron fusionados. El código de referencia de esta nota es el merge del PR #10, `e17893d`. Verificar el HEAD actual de GitHub en cada reanudación; después de este commit documental habrá un SHA nuevo.
- La CI posterior al PR #10 terminó en verde: lint, TypeScript, build y pruebas. Claude Code reportó **78/78 pruebas unitarias/E2E**, en CI y contra producción. No deducir cumplimiento absoluto de accesibilidad o ausencia de fallos de ese dato.
- Interfaz V3: concepto «consola de ingeniería», oscuro, cian/esmeralda/violeta; Navbar desktop + menú móvil; Hero con núcleo neuronal Three.js en desktop, SVG en móvil; Perfil, Stack, Proyectos, Servicios, Contacto, asistente local, página `/cv` imprimible, SEO y redes.
- La escena WebGL se solicita condicionalmente y de forma diferida, con fallback y protección de errores, ~30 FPS en desktop y pausa fuera del viewport; **no se descarga Three.js en móvil**. Preservar estas decisiones.
- Se corrigieron saltos de scroll, anclas, desbordamiento a 320 px, errores de hidratación de `AnimatedSection`, filtros blur costosos, menú móvil y clasificación de preguntas del asistente.
- PR #10: el primer pintado móvil empeoraba por el cálculo del layout completo, **no por las fuentes**. Se introdujo render diferido y progresivo de secciones bajo el Hero durante la carga, activación inmediata al interactuar/anclar/volver por historial y liberación progresiva hasta altura estable. En A/B local: LCP/TBT ~1204/172 → ~900/128 ms. En dos corridas limpias públicas Claude reportó LCP ~1036–1044 ms y TBT 144–171 ms; son mediciones de laboratorio, no datos de usuarios reales. No repetir hipótesis desmentida de «quitar fuentes» sin evidencia.
- El dueño no ha comprado `sergiocareydev.cl`; la configuración del dominio propio está **pendiente**. La futura URL preferida es `https://www.sergiocareydev.cl`, raíz `sergiocareydev.cl` redirigida. **Ninguna compra ni cargo sin aprobación**.

## 2. Datos reales y proyecto actual

Stack del portafolio: Next.js 16.4.5, React 19.2.4, TypeScript, Tailwind CSS 4, Three.js, React Three Fiber, Playwright, GitHub Actions, Vercel. Consultar las versiones vigentes en `package.json`. Scripts: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npm run perf -- <url>`, `npm run cv:pdf -- <url> <salida.pdf>`.

Actualmente `data/projects.ts` contiene estos **seis proyectos principales**:
1. **Pegasus Knowledge Center:** IA/RAG para consultar documentos con citas. Repo público `SC-Sergio/pegasus-knowledge-center`; el despliegue OCI histórico está apagado.
2. **Carey Assistant:** aplicación Windows con Tauri/Rust/React/Ollama. Código privado; releases públicas en `SC-Sergio/carey-assistant-releases`.
3. **FASTLAUNDRY:** sistema Django/PostgreSQL para gestión de lavandería (pedidos, estados, caja/pagos, permisos por rol). **Sistema interno de empresa y repositorio privado**; actualmente `links: []`.
4. **LiterAlura:** backend Java/Spring/PostgreSQL, repo `SC-Sergio/Challengeliteralura`.
5. **SpaceX Falcon 9 Landing:** ciencia de datos, notebooks, mapas/gráficos; repo `SC-Sergio/SpaceX_Falcon9_Landing_Prediction`. Dos datasets históricos no están en el repo.
6. **ForoHub API:** backend Java/Spring/MySQL, repo `SC-Sergio/ChallengeForoHub`.
También hay proyectos menores en `labProjects`.

`data/profile.ts`, la página `/cv` y el asistente comparten datos profesionales. Antes de publicar un PDF nuevo debe confirmarse:
- Si **Tupoclick Softwares** sigue siendo un trabajo vigente «Desde nov. 2025» o cuál fue su fecha de término.
- Razón social correcta en el cargo de desarrollador Python: «Vending Store Limitada» versus «Vending Store Ilimitada»; fuentes previas son inconsistentes.
- Si el propietario desea declarar en público «Abierto a trabajo 100 % remoto» (se habló de ese enfoque, pero la confirmación final editorial estaba pendiente).
Hasta confirmación no transformar esos datos en hechos nuevos. El generador A4 está listo, pero PDF estático pendiente.

## 3. Nueva solicitud del propietario (17-nov-2026)

Se desea evolucionar **la V3 existente** hacia un portafolio con evidencia visual y demos de proyectos, aprovechando mejor los márgenes laterales en monitores anchos, **sin perder calidad visual ni rendimiento**.

El propietario entregó una captura de la portada en desktop y marcó con trazos blancos áreas laterales vacías a izquierda y derecha del Hero. Quiere aprovechar esos espacios **sin tapar el texto ni el núcleo neuronal** y sin añadir JS/Canvas costosos. Una distribución a evaluar:
- Izquierda: rail editorial de navegación numerada/progreso, discreto.
- Centro: Hero, H1 y núcleo actual, preservando jerarquía y espacio negativo suficiente.
- Derecha: rail de habilidades reales y/o acceso a proyecto destacado, discretos.
- **Solo en pantallas anchas, tentativamente desde 1600 px.** En móvil/tablet ocultar rieles. Esta disposición es una **propuesta**, no una especificación aprobada ni un permiso para implementarla sin la decisión final del propietario.

Objetivo principal: incorporar por proyecto según corresponda:
- **Capturas auténticas** de la interfaz y una galería optimizada.
- **Video corto demostrativo**, con poster y reproducción solo a petición.
- **Caso de estudio técnico** con problema, contribución real, arquitectura, decisiones, pruebas y resultados comprobables.
- **Demo interactiva funcional**, si es razonable en costo, privacidad y arquitectura.
- Enlaces distintos para **Ver demo**, **Ver código** (solo si es público y está autorizado), **Ver capturas** y **Caso de estudio**.
- Rutas propias candidatas: `/proyectos/<slug>` en Next.js. Considerar evitar dependencias pesadas en la portada.

**No confundir** una página de GitHub (código) con una demo funcional; GitHub Pages sirve frontend estático, no ejecuta Django/Python en backend. No es obligatorio levantar en producción seis aplicaciones completas. Priorizar tres demostraciones representativas y después evaluar el resto.

### Propuestas de demo, **no implementadas ni aprobadas aún**
- **Pegasus:** demo RAG con documentos ficticios/públicos y citas; puede ser una simulación honesta o un sandbox aislado; no mostrar como «IA real» si solo reproduce ejemplos.
- **FastLaundry:** caso de estudio y capturas **autorizadas** con datos ficticios; posible simulador de flujos (crear orden, estados, caja, permisos) totalmente separado del sistema real; **NUNCA conectar una demo pública a producción**.
- **SpaceX:** dashboard con datos publicables y atribución, mapas y resultados; marcar claramente datos de muestra si procede.
- **Carey Assistant:** capturas o video de la app Windows y release público; no requiere necesariamente «demo web».
- **LiterAlura / ForoHub:** ejemplos de terminal, swagger/API de ejemplo o video; nunca fingir que un backend simulado es el original funcionando.

### Política de confidencialidad estricta para FastLaundry
- **No convertir a público el repositorio privado original**. No exponer código, historial, secretos, credenciales, estructura de clientes, pedidos, pagos reales, información de trabajadores ni datos operativos internos.
- El autor de código puede tener restricciones de confidencialidad/propiedad; **obtener aprobación de la empresa o titular** antes de publicar capturas reales o fragmentos sustanciales de interfaz/arquitectura. No asumir que cambiar nombres basta para obtener autorización.
- Si no hay autorización, crear **una demo ilustrativa nueva e independiente**, con datos totalmente sintéticos, marca genérica y explicación explícita de que es un prototipo conceptual, no el sistema empresarial original.
- No tocar el sistema operativo real, desplegar endpoints reales ni usar datasets de producción sin permisos explícitos.

## 4. Automatización deseada (Claude Code **o** Codex)

El propietario preguntó si puede entregar **un solo prompt** para que uno de los dos agentes haga prácticamente todo: inspeccionar código y repositorios, levantar proyectos autorizados, hacer capturas y videos, transformar recursos a formatos optimizados, agregar galerías y páginas de caso, construir demos, desplegar, ejecutar E2E y medir rendimiento, abrir PR, fusionar y publicar, con informe final.

**Respuesta técnica:** gran parte puede automatizarse cuando el agente tenga acceso real a los repos, sistemas, datos de prueba, navegadores, terminal, credenciales de sesión autorizadas y herramientas necesarias. No hay garantía de automatización absoluta: bloqueos de autenticación, entornos que no se pueden levantar, acceso a proyectos privados, derechos de difusión, servicios de pago, dominio y autorización empresarial requieren intervención humana. Tampoco se puede garantizar ejecución ininterrumpida si se agota el límite de sesión: debe dejar commits, documentación y pruebas reproducibles para reanudar.

Para que el trabajo sea integral pero seguro:
1. Inventariar repositorios accesibles, stack y procedimientos reales de arranque; detectar faltantes.
2. Separar evidencia **real verificada** de **mockup ilustrativo** o **demo simulada** (rotular claramente).
3. Capturar pantallas reales con Playwright u otra herramienta local cuando la app sea accesible. Para apps desktop, usar herramienta de captura del sistema si está disponible. Solo usar datos ficticios/autorizados.
4. Generar capturas en formato eficiente (AVIF/WebP, dimensiones y peso revisados), descripciones accesibles y posters de video. No cargar videos/iframes hasta interacción.
5. Implementar casos de estudio y demos como rutas aisladas o subdominios, sin afectar carga de Home. `next/image` y lazy-loading fuera de vista; evitar componentes pesados en el bundle inicial.
6. Para proyectos backend sin hosting accesible, ofrecer demo frontend simulada, honesta y aislada, o describir cómo correr el backend con Docker en lugar de publicar falsa URL.
7. Ejecutar tests unitarios/E2E, Lighthouse/perfilado y comparaciones A/B; preservar LCP, TBT, CLS, scroll, SVG sin Three.js en móvil, SEO, accesibilidad y no-login en producción.
8. Git en ramas/PRs con checks; guardar evidencias y estado en documentación. Deployment final solo de código validado y con permisos correctos.
9. Nada de abrir repositorios privados, pagar servicios o registrar dominio sin autorización explícita.

**Importante: el usuario pidió expresamente no generar todavía el prompt maestro**; primero quiere entender posibilidades y guardar este checkpoint para continuar la conversación sin perder contexto. Respetar esa secuencia.

## 5. Criterios de aceptación futuros propuestos (no ejecutados)

- URL pública accesible en incógnito y sin cuenta Vercel; previews protegidas pueden permanecer protegidas.
- En Home todas las galerías y demos se cargan de forma diferida; no descarga Three.js en móvil.
- Ancho 320–390, tablet, 1024, 1440, ultrawide ~1600+, 4K, zoom y movimiento reducido sin clipping ni overflow.
- Hero desktop mantiene aspecto actual, y los rieles no lo sobrecargan; no añadir elementos ficticios, conteos inventados ni animación GPU adicional.
- Cada proyecto tiene enlaces comprobados y evidencias etiquetadas como reales o simuladas.
- Fotos/video y datasets no contienen información confidencial.
- Demos no escriben a sistemas de producción; si se usa backend real, sandbox con datos ficticios y límites de recursos.
- Recursos visuales comprimidos y cargados a demanda; análisis de budgets antes/después, repetir pruebas con builds comparables.
- E2E, CI, Vercel y SEO verificados; no afirmar éxito sin ejecutarlos.

## 6. Decisiones abiertas a resolver antes de autorizar implementación

1. **Qué proyectos tienen acceso disponible para ejecutar y capturar:** Pegasus, Carey Assistant, FastLaundry, SpaceX, LiterAlura, ForoHub. Una ruta al repo no garantiza que se pueda levantar; auditar.
2. **Permiso de uso público de capturas de FastLaundry:** aprobación de la empresa/titular o demo enteramente original con marca genérica.
3. **Qué demos desean realmente desplegar en vivo** versus simuladores estáticos con datos ficticios; costos, seguridad y estado de repos.
4. **Distribución final del Hero ultrawide**: riel izquierdo, derecho, ambos u otra propuesta visual basada en capturas y rendimiento.
5. **Dominio**: el propietario todavía no registra `sergiocareydev.cl`; no bloquear el desarrollo por esto.
6. **Contenido profesional**: tres confirmaciones documentadas en la sección 2.

## 7. Orden para la próxima conversación

Iniciar con: «Continuemos el proyecto Sergio Portfolio V3.5. El checkpoint está en `docs/PORTFOLIO_CONTINUITY_CHECKPOINT.md` del repositorio `SC-Sergio/sergio-portfolio-v2`. Lee ese documento, `docs/PORTFOLIO_V3_EXECUTION.md`, el HEAD de `main` y `data/projects.ts`. Todavía no quiero un prompt definitivo hasta aprobar las opciones de demos, capturas y los laterales».

**No asumir** que la sola existencia de este documento autoriza acceso a sistemas privados, publicar recursos o realizar compras.
