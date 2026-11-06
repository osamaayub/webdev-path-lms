"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/config/site";
import { AccountMenu } from "@/features/auth/components/account-menu";
import { useLearner } from "@/features/progress/store";
import { Icon, type IconName } from "./icons";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

type Item = { href: string; label: string; icon: IconName; admin?: boolean };
type Group = { label: string; icon: IconName; items: Item[] };

const groups: Group[] = [
  {
    label: "Learn",
    icon: "cap",
    items: [
      { href: "/learn", label: "My course", icon: "book" },
      { href: "/quizzes", label: "Quizzes", icon: "quiz" },
      { href: "/projects", label: "Projects", icon: "kanban" },
      { href: "/videos", label: "Video lessons", icon: "video" },
    ],
  },
  {
    label: "Build & Showcase",
    icon: "rocket",
    items: [
      { href: "/submissions", label: "My submissions", icon: "upload" },
      { href: "/certificate", label: "Certificate", icon: "award" },
    ],
  },
  {
    label: "Account",
    icon: "shield",
    items: [
      { href: "/admin", label: "Review submissions", icon: "review", admin: true },
      { href: "/security", label: "Privacy and security", icon: "shield" },
    ],
  },
];

const isActive = (path: string, href: string) => (href === "/learn" ? path === "/learn" || path.startsWith("/learn/") : path === href || path.startsWith(`${href}/`));

/** Sidebar layout for the learning area. The marketing home page keeps a simple top bar. */
export function AppShell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const path = usePathname();
  // The drawer remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? path : null);

  // Sign-in and sign-up get a focused, full-screen layout with no sidebar or footer.
  if (path === "/sign-in" || path === "/sign-up") {
    return <main id="main">{children}</main>;
  }

  if (path === "/") {
    return (
      <>
        <TopBar onMenu={null} />
        <main id="main">{children}</main>
        {footer}
      </>
    );
  }

  return (
    <>
      <TopBar onMenu={() => setOpen((o) => !o)} menuOpen={open} />
      <div className="mx-auto flex max-w-[1440px]">
        <aside className={`${open ? "fixed inset-0 top-16 z-30 block bg-paper/70 backdrop-blur-sm" : "hidden"} lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:bg-transparent lg:backdrop-blur-none`}>
          <Sidebar path={path} />
        </aside>
        <div className="min-w-0 flex-1">
          <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          {footer}
        </div>
      </div>
    </>
  );
}

function TopBar({ onMenu, menuOpen }: { onMenu: (() => void) | null; menuOpen?: boolean }) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-rule bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        {onMenu && (
          <button type="button" onClick={onMenu} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-card-2 lg:hidden">
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-rule bg-card"><Logo /></span>
          {site.name}
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          {!onMenu && (
            <nav aria-label="Main" className="mr-1 hidden items-center sm:flex">
              <Link href="/learn" className="rounded-xl px-3 py-2 text-muted hover:bg-card-2 hover:text-ink">My course</Link>
              <Link href="/projects" className="rounded-xl px-3 py-2 text-muted hover:bg-card-2 hover:text-ink">Projects</Link>
            </nav>
          )}
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

function Sidebar({ path }: { path: string }) {
  const { state } = useLearner();
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  return (
    <nav aria-label="Learning area" className="h-full w-[17rem] overflow-y-auto border-r border-rule bg-sidebar px-3 py-5">
      {groups.map((g) => {
        const items = g.items.filter((i) => !i.admin || state.viewer?.isAdmin);
        const isOpen = !closed[g.label];
        const id = `group-${g.label.replace(/\W+/g, "-").toLowerCase()}`;
        return (
          <div key={g.label} className="mb-3">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setClosed((c) => ({ ...c, [g.label]: isOpen }))}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-semibold ${items.some((i) => isActive(path, i.href)) ? "bg-brand-soft text-ink" : "text-ink/85 hover:bg-card-2"}`}
            >
              <Icon name={g.icon} className="text-brand" />
              {g.label}
              <Icon name="chevron" size={16} className={`ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <ul id={id} className="ml-5 mt-1 space-y-1 border-l border-rule pl-3">
                {items.map((i) => {
                  const active = isActive(path, i.href);
                  return (
                    <li key={i.href}>
                      <Link href={i.href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] ${active ? "bg-brand-soft font-semibold text-brand" : "text-muted hover:bg-card-2 hover:text-ink"}`}>
                        <Icon name={i.icon} size={17} />
                        {i.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-3 rounded-xl border border-rule bg-card px-3 py-3 text-[15px] text-muted hover:text-ink">
        <Icon name="play" size={16} className="text-bad" />
        Free lessons on YouTube
        <Icon name="external" size={14} className="ml-auto" />
      </a>
    </nav>
  );
}
