import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./logo";

const nav = [
  { href: "/learn", label: "My progress", mobile: true },
  { href: "/projects", label: "Projects", mobile: true },
  { href: "/#route", label: "The route", mobile: false },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink">
          <Logo />
          {site.name}
        </Link>
        <nav aria-label="Main" className="flex items-center text-[15px] sm:text-base">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`${n.mobile ? "" : "hidden sm:inline-block "}whitespace-nowrap rounded-full px-2.5 py-2 text-ink/75 hover:bg-white hover:text-ink sm:px-4`}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
