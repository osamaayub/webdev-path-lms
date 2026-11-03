import { lessonId, phases } from "@/content";
import type { RouteLine } from "./route-map";

/** Plain, serialisable route data for the client map. */
export const routeLines = (): RouteLine[] =>
  phases.map((p) => ({
    slug: p.slug,
    number: p.number,
    title: p.title,
    stops: p.lessons.map((l) => ({ id: lessonId({ phase: p, slug: l.slug }), week: l.week, title: l.title, href: `/learn/${p.slug}/${l.slug}` })),
  }));
