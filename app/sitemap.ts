import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/cv`, changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((project) => ({ url: `${siteUrl}/proyectos/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.flatMap((project) => (project.demo ? [{ url: `${siteUrl}${project.demo.href}`, changeFrequency: "monthly" as const, priority: 0.7 }] : [])),
  ];
}
