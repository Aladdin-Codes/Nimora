"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import {
  requestPasswordReset,
  resendVerificationEmail,
  signIn,
  signUp,
  updatePassword,
  type AuthActionState,
} from "./actions";

const initialState: AuthActionState = {};

function ActionMessage({ state }: { state: AuthActionState }) {
  if (!state.error && !state.notice) return null;

  return (
    <p
      aria-live="polite"
      role={state.error ? "alert" : "status"}
      className={`mb-5 rounded-md border px-4 py-3 text-sm leading-5 ${state.error ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-nimora-teal/30 bg-nimora-sage/50 text-primary"}`}
    >
      {state.error ?? state.notice}
    </p>
  );
}

function PendingSubmit({ children, pending }: { children: string; pending: boolean }) {
  return (
    <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
      {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="size-4" />}
      {pending ? "Working…" : children}
    </button>
  );
}

function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  minLength,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-primary">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="mt-2 h-12 w-full rounded-md border border-input bg-card px-3.5 text-base text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
      />
    </label>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const verificationFailed = searchParams.get("error") === "verification";
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <ActionMessage state={state} />
      {verificationFailed ? <p role="alert" className="mb-5 text-sm leading-5 text-destructive">That verification link is invalid or expired. Sign in or request another email.</p> : null}
      <FormField id="email" label="Email address" type="email" autoComplete="email" />
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="password" className="text-sm font-medium text-primary">Password</label>
          <Link href="/forgot-password" className="text-xs font-medium text-primary underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 w-full rounded-md border border-input bg-card px-3.5 text-base text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20" />
      </div>
      <PendingSubmit pending={pending}>Sign in</PendingSubmit>
      <p className="text-center text-sm text-muted-foreground">
        New to NIMORA? <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialState);
  const next = useSearchParams().get("next") ?? "/dashboard";
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <ActionMessage state={state} />
      <FormField id="fullName" label="Your name" autoComplete="name" />
      <FormField id="email" label="Email address" type="email" autoComplete="email" />
      <div>
        <FormField id="password" label="Create a password" type="password" autoComplete="new-password" minLength={10} />
        <p className="mt-2 text-xs text-muted-foreground">Use at least 10 characters.</p>
      </div>
      <PendingSubmit pending={pending}>Create account</PendingSubmit>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

export function PasswordResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialState);
  return (
    <form action={action} className="space-y-5">
      <ActionMessage state={state} />
      <FormField id="email" label="Email address" type="email" autoComplete="email" />
      <PendingSubmit pending={pending}>Send reset link</PendingSubmit>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it? <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">Return to sign in</Link>
      </p>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialState);
  return (
    <form action={action} className="space-y-5">
      <ActionMessage state={state} />
      <div>
        <FormField id="password" label="New password" type="password" autoComplete="new-password" minLength={10} />
        <p className="mt-2 text-xs text-muted-foreground">Use at least 10 characters.</p>
      </div>
      <FormField id="confirmation" label="Confirm new password" type="password" autoComplete="new-password" minLength={10} />
      <PendingSubmit pending={pending}>Update password</PendingSubmit>
    </form>
  );
}

export function CheckEmailPanel() {
  const [state, action, pending] = useActionState(resendVerificationEmail, initialState);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-nimora-teal pl-4 text-sm leading-6 text-muted-foreground">
        If the address can be registered, a verification link is on its way. Open it to finish creating your account.
      </div>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
        Continue to sign in <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
      <form action={action} className="space-y-4 border-t border-border pt-5">
        <ActionMessage state={state} />
        <FormField id="email" label="Resend verification to" type="email" autoComplete="email" />
        <PendingSubmit pending={pending}>Resend verification email</PendingSubmit>
      </form>
    </div>
  );
}
