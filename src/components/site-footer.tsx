import Link from "next/link";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-[15px] text-muted sm:grid-cols-[2fr_1fr_1fr] sm:px-6">
        <div>
          <p className="font-display text-lg font-bold text-ink">{site.name}</p>
          <p className="mt-2 max-w-sm">A free, open-source path from your first HTML tag to your first developer job. Made by {site.author.name}.</p>
        </div>
        <nav aria-label="Course">
          <p className="font-semibold text-ink">Course</p>
          <ul className="mt-2 space-y-1.5">
            <li><Link className="hover:text-ink" href="/learn">My progress</Link></li>
            <li><Link className="hover:text-ink" href="/projects">Projects</Link></li>
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <p className="font-semibold text-ink">Elsewhere</p>
          <ul className="mt-2 space-y-1.5">
            <li><a className="hover:text-ink" href={site.youtube}>Video lessons on YouTube</a></li>
            <li><a className="hover:text-ink" href={site.repo}>Source code on GitHub</a></li>
            <li><a className="hover:text-ink" href={site.author.url}>About the author</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
