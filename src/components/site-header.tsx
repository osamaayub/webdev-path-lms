import Link from "next/link";
import { site } from "@/config/site";

const nav = [
  { href: "/learn", label: "Learn" },
  { href: "/projects", label: "Projects" },
  { href: "/#roadmap", label: "Roadmap" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap font-bold text-zinc-900">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
            WP
          </span>
          {site.name}
        </Link>
        <nav aria-label="Main" className="flex items-center text-sm font-medium sm:gap-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-2 py-2 text-zinc-700 sm:px-3 hover:bg-zinc-100 hover:text-zinc-900">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
