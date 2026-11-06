"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Icon } from "@/components/icons";
import { signInPasswordAction, signUpAction } from "../actions";
import type { FormState } from "../schemas";

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold">{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] text-bad">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[14px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-rule bg-card-2 px-4 py-3 outline-none transition-colors focus:border-brand aria-[invalid=true]:border-bad";

function PasswordInput({ id, autoComplete, invalid, describedBy }: { id: string; autoComplete: string; invalid: boolean; describedBy?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} name="password" type={show ? "text" : "password"} autoComplete={autoComplete} required maxLength={72} aria-invalid={invalid} aria-describedby={describedBy} className={`${inputCls} pr-20`} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-2 my-auto h-9 rounded-lg px-3 text-[14px] font-semibold text-muted hover:bg-card hover:text-ink" aria-pressed={show}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function FormError({ state }: { state: FormState }) {
  return state.error ? <p role="alert" className="rounded-xl bg-bad-soft px-4 py-3 text-[15px] text-bad">{state.error}</p> : null;
}

export function SignInForm({ returnTo }: { returnTo: string }) {
  const [state, action, pending] = useActionState(signInPasswordAction, {});
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormError state={state} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Field id="email" label="Email" error={e.email}>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} aria-invalid={Boolean(e.email)} aria-describedby={e.email ? "email-error" : undefined} className={inputCls} />
      </Field>
      <Field id="password" label="Password" error={e.password}>
        <PasswordInput id="password" autoComplete="current-password" invalid={Boolean(e.password)} describedBy={e.password ? "password-error" : undefined} />
      </Field>
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"} <Icon name="arrow" size={16} />
      </button>
      <p className="text-center text-[15px] text-muted">
        New here? <Link href={`/sign-up?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-brand hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export function SignUpForm({ returnTo }: { returnTo: string }) {
  const [state, action, pending] = useActionState(signUpAction, {});
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormError state={state} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Field id="name" label="Name" error={e.name}>
        <input id="name" name="name" autoComplete="name" required maxLength={60} defaultValue={state.values?.name} aria-invalid={Boolean(e.name)} aria-describedby={e.name ? "name-error" : undefined} className={inputCls} />
      </Field>
      <Field id="email" label="Email" error={e.email}>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} aria-invalid={Boolean(e.email)} aria-describedby={e.email ? "email-error" : undefined} className={inputCls} />
      </Field>
      <Field id="password" label="Password" error={e.password} hint="At least 8 characters, with a letter and a number.">
        <PasswordInput id="password" autoComplete="new-password" invalid={Boolean(e.password)} describedBy={e.password ? "password-error" : "password-hint"} />
      </Field>
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">
        {pending ? "Creating your account..." : "Create account"} <Icon name="arrow" size={16} />
      </button>
      <p className="text-center text-[15px] text-muted">
        Already have an account? <Link href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
