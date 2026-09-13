# Sergio Carey — Portfolio v2

Portafolio profesional de **Sergio Enrique Carey Alegre**, Ingeniero Informático enfocado en backend, inteligencia artificial aplicada, automatización, datos y construcción de productos digitales para problemas reales.

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
- metadata SEO, Open Graph, Twitter cards, sitemap, robots y JSON-LD.

## Proyectos destacados

La selección principal está orientada a mostrar variedad técnica:

| Proyecto | Enfoque | Stack destacado |
| --- | --- | --- |
| **FASTLAUNDRY** | Sistema real de negocio | Python, Django, PostgreSQL, Heroku |
| **Carey Assistant** | IA local y aplicación desktop | Tauri, React, TypeScript, Rust, Ollama |
| **SpaceX Falcon 9 Landing Prediction** | Data Science / Machine Learning | Python, Pandas, SQL, scikit-learn, TensorFlow |
| **LiterAlura** | Backend Java e integración de APIs | Java 17, Spring Boot, PostgreSQL, JPA, Gutendex |

FASTLAUNDRY es un proyecto privado de uso operativo. Los demás proyectos públicos incluyen enlaces directos desde el propio portfolio.

## Stack del portfolio

- **Next.js 16** con App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Motion** para transiciones
- **Three.js**, React Three Fiber y Drei para la escena 3D
- **Lucide React** para iconografía
- despliegue preparado para **Vercel**

## Arquitectura

```text
app/
  layout.tsx              # Metadata global, canonical y social cards
  page.tsx                # Composición principal + JSON-LD
  globals.css             # Tokens visuales y estilos globales
  sitemap.ts
  robots.ts
  opengraph-image.tsx
  twitter-image.tsx

components/
  Hero.tsx
  Scene3D.tsx
  About.tsx
  TechStack.tsx
  Projects.tsx
  Services.tsx
  Contact.tsx
  PortfolioAssistant.tsx
  Navbar.tsx
  Footer.tsx
  AnimatedSection.tsx

data/
  projects.ts             # Contenido y enlaces de proyectos
  skills.ts               # Stack, credenciales y servicios
  assistant.ts            # Base de conocimiento del asistente local
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
npm run build
```

## Integración continua

GitHub Actions valida el repositorio con un entorno limpio y ejecuta:

```text
npm ci
npm run lint
npm run build
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
Ingeniero Informático · Arica, Chile

- GitHub: [SC-Sergio](https://github.com/SC-Sergio)
- LinkedIn: [Sergio Enrique Carey Alegre](https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/)
- Correo: [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com)
