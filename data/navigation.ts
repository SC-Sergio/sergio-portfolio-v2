export type NavSection = { id: string; label: string };

/** Secciones de la página, en orden. El navbar, el footer y las pruebas usan esta lista. */
export const navSections: NavSection[] = [
  { id: "about", label: "Perfil" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Proyectos" },
  { id: "services", label: "Servicios" },
  { id: "contact", label: "Contacto" },
];
