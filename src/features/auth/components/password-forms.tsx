"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Icon } from "@/components/icons";
import { signInPasswordAction, signUpAction } from "../actions";
import type { FormState } from "../schemas";

type IconKind = "user" | "mail" | "lock";

function FieldIcon({ kind }: { kind: IconKind }) {
  const d = {
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
    mail: "M4 6h16v12H4zM4 7l8 6 8-6",
    lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  }[kind];
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
      <path d={d} />
    </svg>
  );
}

function Field({ id, label, error, children, aside }: { id: string; label: string; error?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15px] font-semibold">{label}</label>
        {aside}
      </div>
      <div className="relative">{children}</div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-[14px] text-bad">{error}</p>}
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-rule bg-card pl-11 pr-4 text-[16px] outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--brand-soft)] aria-[invalid=true]:border-bad";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

function PasswordInput({ id, autoComplete, invalid, describedBy, placeholder, onValue }: { id: string; autoComplete: string; invalid: boolean; describedBy?: string; placeholder: string; onValue?: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <FieldIcon kind="lock" />
      <input id={id} name="password" type={show ? "text" : "password"} autoComplete={autoComplete} required maxLength={72} placeholder={placeholder} aria-invalid={invalid} aria-describedby={describedBy} onChange={onValue ? (e) => onValue(e.target.value) : undefined} className={`${inputCls} pr-12`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-card-2 hover:text-ink">
        <EyeIcon open={!show} />
      </button>
    </>
  );
}

/** Live checklist under the sign-up password, so the rule is visible before submitting, not after. */
function PasswordRules({ value }: { value: string }) {
  const rules = [
    { ok: value.length >= 8, label: "8+ characters" },
    { ok: /[a-z]/i.test(value), label: "a letter" },
    { ok: /\d/.test(value), label: "a number" },
  ];
  return (
    <ul id="password-hint" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]" aria-live="polite">
      {rules.map((r) => (
        <li key={r.label} className={`flex items-center gap-1.5 transition-colors ${r.ok ? "text-ok" : "text-muted"}`}>
          <span aria-hidden className={`grid h-4 w-4 place-items-center rounded-full border ${r.ok ? "border-ok bg-ok text-white" : "border-rule"}`}>
            {r.ok && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </span>
          {r.label}
          <span className="sr-only">{r.ok ? "(done)" : "(missing)"}</span>
        </li>
      ))}
    </ul>
  );
}

function Spinner() {
  return <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
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
        <FieldIcon kind="mail" />
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="you@example.com" defaultValue={state.values?.email} aria-invalid={Boolean(e.email)} aria-describedby={e.email ? "email-error" : undefined} className={inputCls} />
      </Field>
      <Field id="password" label="Password" error={e.password}>
        <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" invalid={Boolean(e.password)} describedBy={e.password ? "password-error" : undefined} />
      </Field>
      <button type="submit" disabled={pending} className="btn-primary h-12 w-full justify-center text-[16px] disabled:opacity-60">
        {pending ? <><Spinner /> Signing in</> : <>Sign in <Icon name="arrow" size={16} /></>}
      </button>
      <p className="text-center text-[15px] text-muted">
        New here? <Link href={`/sign-up?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-brand hover:underline">Create a free account</Link>
      </p>
    </form>
  );
}

export function SignUpForm({ returnTo }: { returnTo: string }) {
  const [state, action, pending] = useActionState(signUpAction, {});
  const [password, setPassword] = useState("");
  // React clears the form after each submit, so clear the live checklist with it.
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    setPassword("");
  }
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormError state={state} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Field id="name" label="Your name" error={e.name}>
        <FieldIcon kind="user" />
        <input id="name" name="name" autoComplete="name" required maxLength={60} placeholder="It goes on your certificate" defaultValue={state.values?.name} aria-invalid={Boolean(e.name)} aria-describedby={e.name ? "name-error" : undefined} className={inputCls} />
      </Field>
      <Field id="email" label="Email" error={e.email}>
        <FieldIcon kind="mail" />
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="you@example.com" defaultValue={state.values?.email} aria-invalid={Boolean(e.email)} aria-describedby={e.email ? "email-error" : undefined} className={inputCls} />
      </Field>
      <div>
        <Field id="password" label="Password" error={e.password}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" onValue={setPassword} invalid={Boolean(e.password)} describedBy={e.password ? "password-error password-hint" : "password-hint"} />
        </Field>
        <PasswordRules value={password} />
      </div>
      <button type="submit" disabled={pending} className="btn-primary h-12 w-full justify-center text-[16px] disabled:opacity-60">
        {pending ? <><Spinner /> Creating your account</> : <>Create free account <Icon name="arrow" size={16} /></>}
      </button>
      <p className="text-center text-[15px] text-muted">
        Already have an account? <Link href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
