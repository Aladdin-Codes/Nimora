import { GuardianProfileForm } from "@/features/children/profile-forms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";

export const instant = false;

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <div>
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase text-nimora-slate">Your account</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">Your details</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Keep the name on your family account up to date.</p>
      </header>
      <section className="pt-7">
        <GuardianProfileForm fullName={profile?.full_name ?? ""} />
      </section>
    </div>
  );
}
