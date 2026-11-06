import Link from "next/link";
import { Icon, type IconName } from "./icons";

/** The breadcrumb strip at the top of every learning page, with an optional badge on the right. */
export function PageBar({ trail, badge }: { trail: { href?: string; label: string }[]; badge?: React.ReactNode }) {
  return (
    <div className="panel flex flex-wrap items-center gap-2 px-4 py-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-[15px]">
          {trail.map((t, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={t.label} className="flex items-center gap-1">
                {i > 0 && <Icon name="chevronRight" size={15} className="text-muted" />}
                {t.href && !last ? (
                  <Link href={t.href} className="rounded-lg px-3 py-1.5 text-muted hover:bg-card-2 hover:text-ink">{t.label}</Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className="rounded-lg border border-brand/40 bg-brand-soft px-3 py-1.5 font-semibold">{t.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-brand/40 bg-brand-soft px-3 py-1.5 text-[14px] font-semibold text-brand">{children}</span>;
}

/** Title card: gradient icon tile, title, subtitle and whatever goes below (progress, actions). */
export function HeaderCard({ icon = "book", title, subtitle, children }: { icon?: IconName; title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="panel mt-6 flex gap-4 p-5 sm:gap-5 sm:p-7">
      <span className="icon-tile h-12 w-12 shrink-0 sm:h-14 sm:w-14"><Icon name={icon} size={26} /></span>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[2rem] sm:leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

/** One row in a list of modules or lessons. */
export function RowLink({ href, icon, title, meta, action = "View", done, color }: { href: string; icon: IconName; title: string; meta?: string; action?: string; done?: boolean; color?: string }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-rule bg-card-2 px-4 py-3.5 transition-colors hover:border-brand/50 sm:px-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ color: color ?? "var(--brand)", background: color ? `color-mix(in oklab, ${color} 16%, transparent)` : "var(--brand-soft)" }}>
          <Icon name={done ? "check" : icon} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{title}</span>
          {meta && <span className="block text-[14px] text-muted">{meta}</span>}
        </span>
        <span className="btn-primary hidden !px-4 !py-2 text-[15px] sm:inline-flex">
          {action}
          <Icon name="arrow" size={16} />
        </span>
        <Icon name="chevronRight" className="text-muted sm:hidden" />
      </Link>
    </li>
  );
}
