# Sergio Carey — Portfolio v2

Portafolio profesional de **Sergio Enrique Carey Alegre**, Ingeniero en Informática enfocado en backend, inteligencia artificial aplicada, automatización, datos y construcción de productos digitales para problemas reales.

[![CI](https://github.com/SC-Sergio/sergio-portfolio-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/SC-Sergio/sergio-portfolio-v2/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)

**Live portfolio:** [sergio-portfolio-v2-roan.vercel.app](https://sergio-portfolio-v2-roan.vercel.app)

---

## Qué muestra este proyecto

El sitio funciona como la portada técnica de mi trabajo y reúne:

- perfil profesional y foco actual;
- stack de backend, IA, datos, frontend e infraestructura;
- proyectos destacados con contexto de problema, resultado e impacto;
- enlaces directos a repositorios públicos cuando corresponde;
- servicios y formas de contacto;
- una experiencia visual 3D ligera;
- un asistente local del portafolio sin APIs externas ni claves privadas;
- metadata SEO, Open Graph, Twitter cards, sitemap, robots y JSON-LD;
- **casos de estudio** por proyecto en `/proyectos/<slug>` con galería de capturas rotuladas (real o simulada);
- **demos** en `/demos/pegasus` (recuperación RAG real), `/demos/spacex` (dashboard del notebook) y
  `/demos/fastlaundry` (prototipo conceptual con datos ficticios, sin relación con el sistema privado).

## Proyectos destacados

| Proyecto | Enfoque | Stack destacado |
| --- | --- | --- |
| **Pegasus Knowledge Center** | IA aplicada / RAG | Python, Gemini, ChromaDB, Sentence Transformers, Docker |
| **Carey Assistant** | Escritorio con IA local | Tauri, Rust, React, TypeScript, Ollama |
| **FASTLAUNDRY** | Sistema web en operación (privado) | Python, Django, PostgreSQL |
| **LiterAlura** / **ForoHub** | Backend Java | Java 17, Spring Boot, JPA, PostgreSQL/MySQL |
| **SpaceX Falcon 9** | Ciencia de datos | Python, Pandas, scikit-learn, TensorFlow |

Los datos de cada proyecto se verificaron contra su repositorio público; ver `docs/PORTFOLIO_V3_EXECUTION.md`.

## Stack del portfolio

- **Next.js 16** (App Router, página estática) · **React 19** · **TypeScript 5** · **Tailwind CSS 4**
- **Three.js** + React Three Fiber para el núcleo 3D (solo desktop; SVG en móvil, sin descargar Three.js)
- **Playwright** para pruebas unitarias y E2E · **Lucide** para iconos · despliegue en **Vercel**

## Arquitectura

```text
app/          layout, página, /cv, /proyectos/[slug], /demos/*, 404, sitemap, robots, manifest, iconos e imágenes sociales
components/   Navbar, Hero (+ Scene3D, HeroCoreStatic, boundary), About, TechStack, Projects,
              Services, Contact, Footer, PortfolioAssistant
data/         profile, projects (+ casos de estudio), media (manifiesto de capturas), spacex, literalura-run,
              skills, navigation, assistant (contenido separado de la vista)
public/       media/<proyecto>/ (WebP) y demos/pegasus/ (recuperaciones reales y chunks)
lib/          site (URL canónica), socialImage
tests/        unit/ (asistente) y e2e/ (navegación, anclas, 3D, SEO, responsive…)
scripts/      measure-perf.mjs, ab-perf.mjs, screenshots.mjs, optimize-media.mjs, build-cv-pdf.mjs
```

## Asistente local

`PortfolioAssistant` es una **demo local y determinista**. No consulta OpenAI, Anthropic ni ningún proveedor externo.

La lógica vive en `data/assistant.ts` y responde únicamente sobre el perfil, proyectos, stack, servicios y contacto. También incluye límites por sesión, cooldown, manejo de consultas fuera de contexto y bloqueo local defensivo.

Esto mantiene la demo:

- sin API keys en el navegador;
- sin costos de inferencia;
- sin almacenamiento remoto de conversaciones;
- sin dependencia de un backend adicional.

## SEO y accesibilidad

El proyecto incluye:

- Metadata API de Next.js;
- canonical URL;
- Open Graph y Twitter metadata;
- imágenes sociales generadas desde el App Router;
- `sitemap.ts` y `robots.ts`;
- JSON-LD `Person`;
- idioma principal `es`;
- foco visible, labels y atributos ARIA en componentes interactivos;
- layout responsive para móvil, desktop y pantallas anchas.

## Desarrollo local

### Requisitos

- Node.js **20.9+**
- npm

### Instalar

```bash
npm ci
```

### Desarrollo

```bash
npm run dev
```

### Calidad

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium   # una vez
npm test                          # unit + E2E contra el build de producción
```

## Integración continua

GitHub Actions valida el repositorio con un entorno limpio y ejecuta:

```text
npm ci → npm audit (critical) → lint → typecheck → build → Playwright (unit + E2E desktop y móvil)
```

El workflow utiliza permisos mínimos y acciones oficiales fijadas a commits inmutables.

## Deploy

El proyecto está preparado para Vercel. La URL pública usada por metadata, canonical, sitemap y robots se configura mediante:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio-o-url-de-vercel
```

Si la variable no está definida, el proyecto utiliza `http://localhost:3000` como fallback de desarrollo.

## Seguridad y alcance

- Los archivos `.env*` y `.vercel` están ignorados por Git.
- El portfolio no requiere secretos para su funcionalidad pública actual.
- El asistente visible es local y no transmite preguntas a servicios externos.
- Los enlaces a código privado solo se describen como tales; no se exponen repositorios privados.

## Autor

**Sergio Enrique Carey Alegre**  
Ingeniero en Informática · Arica, Chile

- GitHub: [SC-Sergio](https://github.com/SC-Sergio)
- LinkedIn: [Sergio Enrique Carey Alegre](https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/)
- Correo: [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com)
