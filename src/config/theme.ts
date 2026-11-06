// Each phase is a "line" on the route map, with its own colour.
// soft and ink are mixed with the current theme's card and text colours,
// so the same line colour reads well in both dark and light mode.
const base: Record<string, string> = {
  foundations: "#E4572E",
  javascript: "#E9A800",
  react: "#139A98",
  "nextjs-typescript": "#3A57E8",
  "backend-databases": "#8B45D9",
  "ai-and-careers": "#0F9D58",
};

const make = (line: string) => ({
  line,
  soft: `color-mix(in oklab, ${line} 16%, var(--card))`,
  ink: `color-mix(in oklab, ${line} 62%, var(--ink))`,
});

export const lineColors = Object.fromEntries(Object.entries(base).map(([k, v]) => [k, make(v)])) as Record<string, ReturnType<typeof make>>;

export const colorFor = (phaseSlug: string) => lineColors[phaseSlug] ?? lineColors.foundations;
