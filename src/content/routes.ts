import { allLessons, phases, projects } from "./index";

/** Every valid content URL. Used by the proxy to answer unknown slugs with a real 404. */
export const knownPaths = new Set<string>([
  ...phases.map((p) => `/learn/${p.slug}`),
  ...allLessons.map((l) => `/learn/${l.phase.slug}/${l.slug}`),
  ...projects.map((p) => `/projects/${p.slug}`),
]);
