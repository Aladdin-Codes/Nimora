import { AuthShell } from "@/components/layout/auth-shell";
import { PasswordResetRequestForm } from "@/features/authentication/auth-forms";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email address linked to your account. We’ll send instructions if an account matches."
    >
      <PasswordResetRequestForm />
    </AuthShell>
  );
}
