import type { MetadataRoute } from "next";
import { allLessons, phases, projects } from "@/content";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${site.url}${path}`;
  return [
    { url: u("/"), priority: 1 },
    { url: u("/learn"), priority: 0.9 },
    { url: u("/projects"), priority: 0.9 },
    { url: u("/security"), priority: 0.3 },
    ...phases.map((p) => ({ url: u(`/learn/${p.slug}`), priority: 0.8 })),
    ...allLessons.map((l) => ({ url: u(`/learn/${l.phase.slug}/${l.slug}`), priority: 0.7 })),
    ...projects.map((p) => ({ url: u(`/projects/${p.slug}`), priority: 0.7 })),
  ];
}
