import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAge } from "@/features/dashboard/calculations";
import { canManageChild, displayName, loadFamily } from "@/features/dashboard/family";
import { formatDateOnly, formatDateTime, todayInClinicZone } from "@/lib/clinic-time";
import { createClient } from "@/lib/supabase/server";

type DashboardSearchParams = Promise<{ child?: string }>;

const linkClass = "inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-nimora-teal-ink transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const quickActionClass = "inline-flex min-h-11 items-center gap-2 rounded-md border border-primary-foreground/25 px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function AlertText({ children }: { children: string }) {
  return (
    <p role="alert" className="border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">
      {children}
    </p>
  );
}

export function SectionSkeleton({ label, className = "h-48" }: { label: string; className?: string }) {
  return (
    <div role="status" aria-label={`Loading ${label}`} className={`animate-pulse rounded-lg border border-border bg-card ${className}`} />
  );
}

export async function ChildSwitcher({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (family.failed) return <AlertText>We could not load your family profiles. Refresh the page to try again.</AlertText>;

  return (
    <nav aria-label="Children" className="flex flex-wrap items-center gap-2">
      {family.children.map((member) => {
        const active = member.id === family.selected?.id;
        return (
          <Link
            key={member.id}
            href={`/dashboard?child=${member.id}`}
            aria-current={active ? "true" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary hover:bg-secondary"}`}
          >
            {member.preferred_name || member.first_name}
          </Link>
        );
      })}
      <Link href="/children/new" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-nimora-slate/60 px-4 text-sm font-medium text-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <Plus aria-hidden="true" className="size-4" /> Add child
      </Link>
    </nav>
  );
}

export async function ChildHero({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (family.failed) return null;

  if (!family.selected) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
        <EmptyState
          title="Add a child profile to create your family space."
          description="You control who can see each profile. Caregivers you invite will have read-only access."
          action={
            <Link href="/children/new" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <Plus aria-hidden="true" className="size-4" /> Create first profile
            </Link>
          }
        />
      </section>
    );
  }

  const selected = family.selected;
  const today = todayInClinicZone();
  const canManage = await canManageChild(selected.id);

  return (
    <section aria-labelledby="selected-child-heading" className="rounded-lg bg-primary p-6 text-primary-foreground shadow-soft sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/75">Selected child</p>
          <h2 id="selected-child-heading" className="mt-2 font-heading text-3xl font-semibold">{displayName(selected)}</h2>
          <p className="mt-2 text-sm text-primary-foreground/85">
            {formatAge(selected.birth_date, today)} · Born {formatDateOnly(selected.birth_date)}
          </p>
        </div>
        <Link href={`/children/${selected.id}`} className={quickActionClass}>
          View profile
        </Link>
      </div>
      {canManage ? (
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/children/${selected.id}/growth/new`} className={quickActionClass}>
            <Plus aria-hidden="true" className="size-4" /> Log growth
          </Link>
          <Link href={`/children/${selected.id}/vaccinations/new`} className={quickActionClass}>
            <Plus aria-hidden="true" className="size-4" /> Add vaccination
          </Link>
          <Link href={`/children/${selected.id}/appointments/new`} className={quickActionClass}>
            <Plus aria-hidden="true" className="size-4" /> Add appointment
          </Link>
          <span aria-disabled="true" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary-foreground/15 px-4 text-sm text-primary-foreground/60">
            Upload document
            <span className="rounded-sm bg-primary-foreground/10 px-2 py-0.5 text-xs">Coming soon</span>
          </span>
        </div>
      ) : (
        <p className="mt-6 text-sm text-primary-foreground/85">Read-only caregiver access. Guardians can add records for this child.</p>
      )}
    </section>
  );
}

export async function GrowthCard({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (!family.selected) return null;

  const supabase = await createClient();
  const { data: latest, error } = await supabase
    .from("growth_measurements")
    .select("measured_on, weight_kg, height_cm")
    .eq("child_id", family.selected.id)
    .order("measured_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  const canManage = await canManageChild(family.selected.id);
  const action = canManage ? (
    <Link href={`/children/${family.selected.id}/growth/new`} className={linkClass}>
      <Plus aria-hidden="true" className="size-4" /> Log growth
    </Link>
  ) : null;

  return (
    <SectionCard title="Growth" action={action}>
      {error ? (
        <AlertText>Growth records could not be loaded.</AlertText>
      ) : latest ? (
        <dl className="grid grid-cols-2 gap-5">
          <div>
            <dt className="text-sm text-muted-foreground">Weight</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold text-primary">{latest.weight_kg} kg</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Height</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold text-primary">{latest.height_cm} cm</dd>
          </div>
          <div className="col-span-2 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <StatusBadge tone="success">Latest measurement</StatusBadge>
            <span className="text-sm text-muted-foreground">Measured {formatDateOnly(latest.measured_on)}</span>
          </div>
        </dl>
      ) : (
        <EmptyState title="No measurements yet" description="Log a weight and height to start this child's growth record." />
      )}
    </SectionCard>
  );
}

export async function VaccinationCard({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (!family.selected) return null;

  const supabase = await createClient();
  const childId = family.selected.id;
  const [countResult, recentResult] = await Promise.all([
    supabase.from("vaccination_records").select("id", { count: "exact", head: true }).eq("child_id", childId),
    supabase
      .from("vaccination_records")
      .select("id, vaccine_name, dose_label, administered_on")
      .eq("child_id", childId)
      .order("administered_on", { ascending: false })
      .limit(3),
  ]);

  const canManage = await canManageChild(childId);
  const action = canManage ? (
    <Link href={`/children/${childId}/vaccinations/new`} className={linkClass}>
      <Plus aria-hidden="true" className="size-4" /> Add vaccination
    </Link>
  ) : null;

  return (
    <SectionCard title="Vaccinations" action={action}>
      {countResult.error || recentResult.error ? (
        <AlertText>Vaccination records could not be loaded.</AlertText>
      ) : countResult.count ? (
        <>
          <StatusBadge tone="success">{countResult.count} {countResult.count === 1 ? "dose" : "doses"} recorded</StatusBadge>
          <ul className="mt-5 divide-y divide-border">
            {recentResult.data?.map((record) => (
              <li key={record.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-primary">{record.vaccine_name} · {record.dose_label}</span>
                <span className="text-muted-foreground">{formatDateOnly(record.administered_on)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          title="No doses recorded yet"
          description="Only doses you record appear here. Due and overdue doses are not tracked yet."
        />
      )}
    </SectionCard>
  );
}

export async function AppointmentsCard({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (!family.selected) return null;

  const supabase = await createClient();
  const childId = family.selected.id;
  const now = new Date();
  const { data: upcoming, error } = await supabase
    .from("appointments")
    .select("id, title, provider_name, scheduled_at")
    .eq("child_id", childId)
    .eq("status", "scheduled")
    .gte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(3);

  const canManage = await canManageChild(childId);
  const action = canManage ? (
    <Link href={`/children/${childId}/appointments/new`} className={linkClass}>
      <Plus aria-hidden="true" className="size-4" /> Add appointment
    </Link>
  ) : null;

  return (
    <SectionCard title="Upcoming appointments" action={action}>
      {error ? (
        <AlertText>Appointments could not be loaded.</AlertText>
      ) : upcoming?.length ? (
        <ul className="divide-y divide-border">
          {upcoming.map((appointment) => (
            <li key={appointment.id} className="py-3">
              <p className="font-medium text-primary">{appointment.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {appointment.provider_name} · {formatDateTime(appointment.scheduled_at)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No upcoming appointments" description="Scheduled visits will appear here, in West Africa Time." />
      )}
    </SectionCard>
  );
}

export async function TimelineCard({ searchParams }: { searchParams: DashboardSearchParams }) {
  const { child } = await searchParams;
  const family = await loadFamily(child);
  if (!family.selected) return null;

  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("health_timeline_events")
    .select("id, title, event_type, occurred_at")
    .eq("child_id", family.selected.id)
    .order("occurred_at", { ascending: false })
    .limit(5);

  return (
    <SectionCard title="Recent health events">
      {error ? (
        <AlertText>Health events could not be loaded.</AlertText>
      ) : events?.length ? (
        <ul className="divide-y divide-border">
          {events.map((event) => (
            <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-primary">{event.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{event.event_type}</p>
              </div>
              <span className="text-sm text-muted-foreground">{formatDateTime(event.occurred_at)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No health events yet" description="Visits, milestones, and checkups will appear here as they are recorded." />
      )}
    </SectionCard>
  );
}
