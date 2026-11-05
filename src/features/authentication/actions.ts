"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  notice?: string;
};

const emailSchema = z.email();
const passwordSchema = z.string().min(10, "Use at least 10 characters.").max(128);
const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name.").max(100),
  email: emailSchema,
  password: passwordSchema,
  next: z.string().optional(),
});

function getAppOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredOrigin) return new URL(configuredOrigin).origin;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production.");
}

function safeNextPath(value: string | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (
    value === "/dashboard" ||
    value === "/onboarding" ||
    value.startsWith("/children/") ||
    value.startsWith("/invite/")
  ) {
    return value;
  }
  return "/dashboard";
}

function configurationError(): AuthActionState {
  return {
    error: "Authentication is not configured yet. Add the Supabase URL and public key to your local environment.",
  };
}

export async function signIn(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z
    .object({ email: emailSchema, password: z.string().min(1), next: z.string().optional() })
    .safeParse({
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? ""),
      next: String(formData.get("next") ?? "") || undefined,
    });

  if (!parsed.success) return { error: "Enter a valid email and password." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: "That email and password combination was not recognized." };
  } catch {
    return configurationError();
  }

  redirect(safeNextPath(parsed.data.next));
}

export async function signUp(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    next: String(formData.get("next") ?? "") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the information and try again." };
  }

  let hasSession = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
        emailRedirectTo: `${getAppOrigin()}/callback?next=${encodeURIComponent(safeNextPath(parsed.data.next))}`,
      },
    });

    if (error) return { error: "We could not create your account. Check your details and try again." };
    hasSession = Boolean(data.session);
  } catch {
    return configurationError();
  }

  redirect(hasSession ? safeNextPath(parsed.data.next) : "/check-email");
}

export async function requestPasswordReset(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z
    .object({ email: emailSchema })
    .safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase() });

  if (!parsed.success) return { error: "Enter a valid email address." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${getAppOrigin()}/callback?next=/update-password`,
    });
    if (error) return { error: "We could not send a reset email. Please try again shortly." };
  } catch {
    return configurationError();
  }

  return { notice: "If an account exists for that email, a reset link is on its way." };
}

export async function resendVerificationEmail(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z
    .object({ email: emailSchema })
    .safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase() });

  if (!parsed.success) return { error: "Enter a valid email address." };

  try {
    const supabase = await createClient();
    await supabase.auth.resend({
      type: "signup",
      email: parsed.data.email,
      options: { emailRedirectTo: `${getAppOrigin()}/callback?next=/dashboard` },
    });
  } catch {
    return configurationError();
  }

  return { notice: "If the account still needs verification, a new link is on its way." };
}

export async function updatePassword(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  const parsed = passwordSchema.safeParse(password);

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Choose a stronger password." };
  if (password !== confirmation) return { error: "Those passwords do not match." };

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Your reset link has expired. Request a new one." };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: "We could not update your password. Please try again." };
  } catch {
    return configurationError();
  }

  redirect("/dashboard");
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } finally {
    redirect("/login");
  }
}
