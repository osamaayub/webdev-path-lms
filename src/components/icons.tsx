// Small stroke icons (24px grid, 2px stroke), drawn inline so no icon library ships to the browser.
const paths = {
  cap: "M22 10 12 5 2 10l10 5 10-5Z M6 12v5c3 2 9 2 12 0v-5",
  book: "M2 5a2 2 0 0 1 2-2h6v18H4a2 2 0 0 1-2-2Z M22 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2Z",
  quiz: "M9 6h11 M9 12h11 M9 18h11 M3 6l1.5 1.5L7 5 M3 12l1.5 1.5L7 11 M3 18l1.5 1.5L7 17",
  kanban: "M3 3h18v18H3Z M8 7v7 M12 7v4 M16 7v9",
  play: "M8 5v14l11-7Z",
  video: "M3 6h12v12H3Z M15 10l6-3v10l-6-3",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2 M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5Z M9 10l-4 1 3 3 M14 15l-1 4-3-3",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 20h16",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M8.5 14 7 22l5-3 5 3-1.5-8",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z M9 12l2 2 4-4",
  review: "M4 4h16v12H8l-4 4Z M8 9h8 M8 12h5",
  home: "M3 11 12 3l9 8 M5 9v11h14V9",
  chevron: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  back: "M19 12H5 M11 6l-6 6 6 6",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M6 6l12 12 M18 6 6 18",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  check: "M5 12l5 5L20 7",
  lock: "M5 11h14v10H5Z M8 11V7a4 4 0 0 1 8 0v4",
  external: "M14 4h6v6 M20 4l-9 9 M19 14v6H4V5h6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={paths[name]} fill={name === "play" ? "currentColor" : "none"} />
    </svg>
  );
}
