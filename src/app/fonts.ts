import localFont from "next/font/local";

// Self-hosted: no request to Google at build or run time.
export const display = localFont({
  src: "../fonts/bricolage-grotesque.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

export const body = localFont({
  src: [
    { path: "../fonts/atkinson-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/atkinson-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
