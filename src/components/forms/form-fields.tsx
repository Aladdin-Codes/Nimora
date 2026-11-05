import { ArrowRight, LoaderCircle } from "lucide-react";

export type FormState = {
  error?: string;
  notice?: string;
  invitationUrl?: string;
};

export function Feedback({ state }: { state: FormState }) {
  if (!state.error && !state.notice) return null;
  return (
    <div className="space-y-3" aria-live="polite">
      <p role={state.error ? "alert" : "status"} className={`text-sm leading-5 ${state.error ? "text-destructive" : "text-primary"}`}>
        {state.error ?? state.notice}
      </p>
      {state.invitationUrl ? (
        <a href={state.invitationUrl} className="block break-all rounded-md border border-border bg-muted px-3 py-2 text-sm text-primary underline decoration-nimora-teal underline-offset-4">
          {state.invitationUrl}
        </a>
      ) : null}
    </div>
  );
}

export function Submit({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60">
      {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="size-4" />}
      {pending ? "Saving…" : label}
    </button>
  );
}

export function TextField({
  id,
  label,
  type = "text",
  defaultValue,
  required = true,
  autoComplete,
  inputMode,
  step,
  min,
  max,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "decimal" | "numeric" | "text";
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-primary">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        step={step}
        min={min}
        max={max}
        className="mt-2 h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
      />
    </label>
  );
}

export function TextAreaField({ id, label, required = false }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-primary">
      {label}
      <textarea
        id={id}
        name={id}
        rows={3}
        required={required}
        className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-base text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
      />
    </label>
  );
}
