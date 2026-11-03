// Each phase is a "line" on the route map. Colours are presentation only,
// so they live here, not in the course content.
export const lineColors: Record<string, { line: string; soft: string; ink: string }> = {
  foundations: { line: "#E4572E", soft: "#FDEDE8", ink: "#9A2E10" },
  javascript: { line: "#E9A800", soft: "#FEF6DC", ink: "#7A5600" },
  react: { line: "#139A98", soft: "#E1F5F4", ink: "#0B5F5E" },
  "nextjs-typescript": { line: "#3A57E8", soft: "#E8ECFD", ink: "#1F34A3" },
  "backend-databases": { line: "#7B2CBF", soft: "#F1E8FA", ink: "#55188A" },
  "ai-and-careers": { line: "#0F9D58", soft: "#E2F5EB", ink: "#0A6B3C" },
};

export const colorFor = (phaseSlug: string) => lineColors[phaseSlug] ?? lineColors.foundations;
