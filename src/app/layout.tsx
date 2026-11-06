import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AppShell } from "@/components/app-shell";
import { SiteFooter } from "@/components/site-footer";
import { themeScript } from "@/components/theme-script";
import { courseJsonLdHtml } from "@/config/json-ld";
import { site } from "@/config/site";
import { geist } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [site.author],
  keywords: ["web development course", "learn web development", "full-stack roadmap", "HTML CSS JavaScript", "React", "Next.js", "Node.js", "free coding course"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, title: site.title, description: site.description, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0d1220", colorScheme: "dark light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={geist.variable} suppressHydrationWarning>
      <head>
        <Script id="theme" strategy="beforeInteractive">{themeScript}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseJsonLdHtml }} />
      </head>
      <body className="min-h-screen bg-card-2 font-sans text-[16px] leading-relaxed text-ink antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2">
          Skip to content
        </a>
        <AppShell footer={<SiteFooter />}>{children}</AppShell>
      </body>
    </html>
  );
}
