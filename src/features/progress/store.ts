"use client";

import { useSyncExternalStore } from "react";
import { emptyProgress, parseProgress, type Progress } from "./model";

const KEY = "webdev-path:progress:v1";
const listeners = new Set<() => void>();
const SERVER = emptyProgress();
let cache: { raw: string | null; value: Progress } | undefined;

function read(): Progress {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked (private mode): progress lives in memory for this visit.
    return cache?.value ?? SERVER;
  }
  if (!cache || cache.raw !== raw) cache = { raw, value: parseProgress(raw) };
  return cache.value;
}

export function saveProgress(next: Progress) {
  const raw = JSON.stringify(next);
  cache = { raw, value: next };
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Ignore: in-memory cache still updates the UI.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener(); // sync across tabs
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current progress. Renders as empty on the server, then updates in the browser. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

export function useUpdateProgress() {
  return (fn: (p: Progress) => Progress) => saveProgress(fn(read()));
}
