import { AuthShell } from "@/components/layout/auth-shell";
import { CheckEmailPanel } from "@/features/authentication/auth-forms";

export default function CheckEmailPage() {
  return (
    <AuthShell
      eyebrow="One last step"
      title="Check your inbox"
      description="Verify your email address to activate your NIMORA account."
    >
      <CheckEmailPanel />
    </AuthShell>
  );
}
