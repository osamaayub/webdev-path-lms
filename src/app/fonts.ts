import localFont from "next/font/local";

// Geist (SIL Open Font License), self-hosted: no request to a font CDN at build or run time.
export const geist = localFont({
  src: "../fonts/geist-variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});
