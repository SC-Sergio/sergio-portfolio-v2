# Sergio Carey Portfolio

Portafolio personal de **Sergio Enrique Carey Alegre**, Ingeniero Informático enfocado en Python, Django, Inteligencia Artificial, automatización, chatbots, APIs, desarrollo web y soporte técnico.

El sitio presenta una identidad visual futurista profesional, un Hero con experiencia 3D liviana, secciones de perfil, tecnologías, proyectos destacados, servicios y contacto.

Sitio publicado en Vercel: [sergio-portfolio-v2-roan.vercel.app](https://sergio-portfolio-v2-roan.vercel.app)

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Motion
- Lucide React
- React Three Fiber, Drei y Three.js

## Características principales

- Diseño responsive para desktop, pantallas anchas y móvil.
- Hero premium con visual 3D optimizado.
- Secciones profesionales para perfil, tecnologías, proyectos y servicios.
- Contacto real con correo, GitHub y LinkedIn.
- SEO básico, Open Graph, Twitter metadata, sitemap y robots.
- Accesibilidad cuidada con contraste, foco visible y enlaces claros.

## Estructura general

```text
app/
  layout.tsx
  page.tsx
  globals.css
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
  Navbar.tsx
  Footer.tsx
data/
  projects.ts
  skills.ts
```

## Comandos

Instalar dependencias:

```bash
npm install
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

Crear build de producción:

```bash
npm run build
```

Ejecutar build local:

```bash
npm run start
```

## Deploy en Vercel

El proyecto está preparado para desplegarse en Vercel como aplicación Next.js.

Al publicar, configura la variable de entorno:

```bash
NEXT_PUBLIC_SITE_URL=https://sergio-portfolio-v2-roan.vercel.app
```

Esa URL se usa para metadata, canonical, sitemap y robots. Si no existe, el proyecto usa `http://localhost:3000` como fallback local.

## Autor

**Sergio Enrique Carey Alegre**  
Ingeniero Informático

- Correo: [sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com)
- GitHub: [SC-Sergio](https://github.com/SC-Sergio)
- LinkedIn: [Sergio Enrique Carey Alegre](https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/)
