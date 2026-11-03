"use client";

import { useEffect, useSyncExternalStore } from "react";
import { signedOutState, type LearnerState } from "./model";

// Browser-side copy of the learner's data from /api/me.
// One request per page load, shared by every component; refreshed after each change
// and when the tab regains focus (so two open tabs stay in sync).

type Snapshot = { status: "loading" | "ready" | "error"; state: LearnerState };

const LOADING: Snapshot = { status: "loading", state: signedOutState(true) };
let snapshot: Snapshot = LOADING;
let inflight: Promise<void> | undefined;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function refreshLearner(): Promise<void> {
  inflight ??= fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status));
      snapshot = { status: "ready", state: (await res.json()) as LearnerState };
    })
    .catch(() => {
      snapshot = { ...snapshot, status: snapshot.status === "ready" ? "ready" : "error" };
    })
    .finally(() => {
      inflight = undefined;
      emit();
    });
  return inflight;
}

/** Apply a local change right away (optimistic), before the server confirms it. */
export function patchLearner(fn: (s: LearnerState) => LearnerState) {
  snapshot = { ...snapshot, state: fn(snapshot.state) };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onFocus = () => document.visibilityState === "visible" && refreshLearner();
  document.addEventListener("visibilitychange", onFocus);
  return () => {
    listeners.delete(listener);
    document.removeEventListener("visibilitychange", onFocus);
  };
}

export function useLearner(): Snapshot {
  const snap = useSyncExternalStore(subscribe, () => snapshot, () => LOADING);
  // Refresh whenever a page using it mounts (e.g. after signing in or out, which
  // navigates client-side). Concurrent calls share one request.
  useEffect(() => {
    void refreshLearner();
  }, []);
  return snap;
}

/** Shorthand for components that only need the data. */
export const useProgress = () => useLearner().state;
