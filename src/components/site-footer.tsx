import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-zinc-200 py-10 text-sm text-zinc-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:justify-between">
        <p>
          {site.name} by <a className="underline-offset-2 hover:underline" href={site.author.url}>{site.author.name}</a>. Free and open source.
        </p>
        <p className="flex gap-4">
          <a className="underline-offset-2 hover:underline" href={site.youtube}>YouTube</a>
          <a className="underline-offset-2 hover:underline" href={site.repo}>Source code</a>
        </p>
      </div>
    </footer>
  );
}
