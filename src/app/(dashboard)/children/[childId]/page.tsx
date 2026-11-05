import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CaregiverInvitationForm, EditChildForm, RevokeCaregiverForm } from "@/features/children/profile-forms";
import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function ChildProfilePage({ params }: { params: Promise<{ childId: string }> }) {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;
  const { childId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: child, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .maybeSingle();
  if (error || !child) notFound();

  const isOwner = child.owner_id === user.id;
  const { data: caregivers } = isOwner
    ? await supabase
        .from("child_memberships")
        .select("user_id, member_email, created_at")
        .eq("child_id", child.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div>
      <Link href="/dashboard" className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft aria-hidden="true" className="size-4" /> Family overview
      </Link>
      <header className="mt-7 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase text-nimora-slate">Child profile</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">
          {child.preferred_name || child.first_name} {child.last_name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Born {new Date(`${child.birth_date}T00:00:00`).toLocaleDateString(undefined, { dateStyle: "long" })}
        </p>
        {!isOwner ? <p className="mt-3 inline-flex rounded-sm bg-secondary px-2.5 py-1 text-xs font-medium text-primary">Read-only caregiver access</p> : null}
      </header>

      {isOwner ? (
        <div className="grid gap-12 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <section>
            <h2 className="mb-5 font-heading text-xl font-semibold text-primary">Profile details</h2>
            <EditChildForm child={child} />
          </section>
          <aside className="space-y-10">
            <section>
              <h2 className="font-heading text-xl font-semibold text-primary">Caregiver access</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Invited caregivers can view this profile. They cannot change it.</p>
              <div className="mt-5">
                <CaregiverInvitationForm childId={child.id} />
              </div>
              {caregivers?.length ? (
                <div className="mt-6 border-y border-border">
                  <p className="py-3 text-xs font-semibold uppercase text-nimora-slate">Current access</p>
                  {caregivers.map((caregiver) => (
                    <RevokeCaregiverForm key={caregiver.user_id} childId={child.id} userId={caregiver.user_id} email={caregiver.member_email} />
                  ))}
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      ) : (
        <section className="max-w-2xl py-8">
          <h2 className="font-heading text-xl font-semibold text-primary">Profile details</h2>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            <div className="flex flex-wrap justify-between gap-2 py-4 text-sm">
              <dt className="text-muted-foreground">First name</dt><dd className="font-medium text-primary">{child.first_name}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-4 text-sm">
              <dt className="text-muted-foreground">Last name</dt><dd className="font-medium text-primary">{child.last_name}</dd>
            </div>
            {child.preferred_name ? <div className="flex flex-wrap justify-between gap-2 py-4 text-sm"><dt className="text-muted-foreground">Name they go by</dt><dd className="font-medium text-primary">{child.preferred_name}</dd></div> : null}
          </dl>
        </section>
      )}
    </div>
  );
}
