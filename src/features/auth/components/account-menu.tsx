"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLearner } from "@/features/progress/store";
import { signOutAction } from "../actions";

export function AccountMenu() {
  const { status, state } = useLearner();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (status === "loading") return <span aria-hidden className="ml-1 h-9 w-9 rounded-full bg-rule" />;
  if (!state.viewer) {
    if (!state.configured) return null;
    return (
      <Link href="/sign-in" className="ml-1 whitespace-nowrap rounded-full bg-ink px-4 py-2 font-semibold text-white hover:bg-[#22325a]">
        Sign in
      </Link>
    );
  }

  const v = state.viewer;
  const initial = (v.name ?? "?").trim().charAt(0).toUpperCase();
  return (
    <div ref={ref} className="relative ml-1">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)} className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-ink bg-white font-display font-bold">
        {v.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny avatar from GitHub/Google, allowed by CSP
          <img src={v.image} alt="" width={36} height={36} referrerPolicy="no-referrer" />
        ) : (
          initial
        )}
        <span className="sr-only">Account menu for {v.name ?? "you"}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 w-56 rounded-2xl border border-rule bg-white p-2 shadow-[0_12px_32px_rgba(20,33,61,.12)]">
          <p className="truncate px-3 py-2 text-[15px] text-muted">{v.name ?? "Signed in"}</p>
          <Link role="menuitem" href="/learn" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 hover:bg-paper">My progress</Link>
          {v.isAdmin && <Link role="menuitem" href="/admin" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 hover:bg-paper">Review submissions</Link>}
          <form action={signOutAction}>
            <button role="menuitem" type="submit" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-paper">Sign out</button>
          </form>
        </div>
      )}
    </div>
  );
}
