import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-muted">Error 404</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">There&apos;s no stop here.</h1>
      <p className="mt-3 text-ink/80">This lesson or project doesn&apos;t exist. It may have been renamed.</p>
      <Link href="/learn" className="mt-8 btn-primary">Go to my progress</Link>
    </div>
  );
}
