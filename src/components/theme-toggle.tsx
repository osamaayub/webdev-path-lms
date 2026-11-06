"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./icons";
import { THEME_KEY } from "./theme-script";

type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => "dark");

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
  }

  return (
    <button type="button" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="grid h-10 w-10 place-items-center rounded-xl text-warn hover:bg-card-2">
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
