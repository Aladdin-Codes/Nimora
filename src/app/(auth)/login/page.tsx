import { Suspense } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { SignInForm } from "@/features/authentication/auth-forms";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your family space"
      description="Pick up where your family left off. Your account keeps your information private and in one place."
    >
      <Suspense fallback={<div className="min-h-56" aria-hidden="true" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
