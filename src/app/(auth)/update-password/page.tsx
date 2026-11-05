import { AuthShell } from "@/components/layout/auth-shell";
import { UpdatePasswordForm } from "@/features/authentication/auth-forms";

export default function UpdatePasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Use a strong password that you do not use for another account."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
