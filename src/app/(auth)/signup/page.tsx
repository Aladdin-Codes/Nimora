import { Suspense } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { SignUpForm } from "@/features/authentication/auth-forms";

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Start here"
      title="Create your family account"
      description="A calm, private place to keep your family’s care organized."
    >
      <Suspense fallback={<div className="min-h-64" aria-hidden="true" />}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
