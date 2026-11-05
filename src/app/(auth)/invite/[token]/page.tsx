import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { AcceptInvitationForm } from "@/features/children/profile-forms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { z } from "zod";

export default function CaregiverInvitationPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" aria-hidden="true" />}>
      <InvitationContent params={params} />
    </Suspense>
  );
}

async function InvitationContent({ params }: { params: Promise<{ token: string }> }) {
  const { token: rawToken } = await params;
  const parsedToken = z.uuid().safeParse(rawToken);
  if (!parsedToken.success) notFound();
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const destination = `/invite/${parsedToken.data}`;

  return (
    <AuthShell
      eyebrow="Caregiver invitation"
      title="You’ve been invited to help care"
      description="Accepting adds read-only access to one child profile. The invited email must be verified."
    >
      {user ? (
        <AcceptInvitationForm token={parsedToken.data} />
      ) : (
        <div className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">Sign in with the invited email address, or create an account with it to continue.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/login?next=${encodeURIComponent(destination)}`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Sign in</Link>
            <Link href={`/signup?next=${encodeURIComponent(destination)}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary px-4 text-sm font-semibold text-primary">Create account</Link>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
