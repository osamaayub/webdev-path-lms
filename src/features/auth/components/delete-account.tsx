"use client";

import { useState } from "react";
import { useLearner } from "@/features/progress/store";
import { deleteAccountAction } from "../actions";

export function DeleteAccount() {
  const { state } = useLearner();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  if (!state.viewer) return null;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-5 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#9A2E10] ring-2 ring-[#E4572E]">
        Delete my account
      </button>
    );
  }
  return (
    <form action={deleteAccountAction} className="mt-5 rounded-2xl bg-white p-5">
      <label htmlFor="confirm-delete" className="block font-semibold">Type DELETE to remove your account, progress, quiz attempts and submissions. This can&apos;t be undone.</label>
      <input id="confirm-delete" name="confirm" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className="mt-3 w-full rounded-xl border-2 border-rule bg-paper px-4 py-3" />
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" disabled={typed !== "DELETE"} className="rounded-full bg-[#C2361B] px-6 py-3 font-semibold text-white disabled:opacity-40">Delete everything</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-6 py-3 font-semibold underline underline-offset-4">Cancel</button>
      </div>
    </form>
  );
}
