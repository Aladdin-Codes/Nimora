import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;

  const supabase = await createClient();
  const { data: children, error } = await supabase
    .from("children")
    .select("id, first_name, last_name, preferred_name, birth_date")
    .order("created_at", { ascending: false });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase text-nimora-slate">Family overview</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">Your family</h1>
          <p className="mt-2 text-sm text-muted-foreground">A private space for the people you care for.</p>
        </div>
        <Link href="/children/new" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <Plus aria-hidden="true" className="size-4" /> Add child
        </Link>
      </header>

      {error ? (
        <p role="alert" className="mt-8 border-l-2 border-destructive pl-4 text-sm text-destructive">
          We could not load your family profiles. Refresh the page to try again.
        </p>
      ) : children?.length ? (
        <ul className="mt-3 divide-y divide-border">
          {children.map((child) => (
            <li key={child.id}>
              <Link href={`/children/${child.id}`} className="group flex min-h-24 items-center justify-between gap-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-primary group-hover:text-nimora-teal">
                    {child.preferred_name || child.first_name} {child.last_name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Born {new Date(`${child.birth_date}T00:00:00`).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
                <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-nimora-slate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <section className="mt-10 border-y border-border py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase text-nimora-slate">A good place to begin</p>
          <h2 className="mt-3 max-w-lg font-heading text-2xl font-semibold text-primary">Add a child profile to create your family space.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">You control who can see each profile. Caregivers you invite will have read-only access.</p>
          <Link href="/children/new" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Plus aria-hidden="true" className="size-4" /> Create first profile
          </Link>
        </section>
      )}
    </div>
  );
}
