import { Suspense } from "react";
import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import {
  AppointmentsCard,
  ChildHero,
  ChildSwitcher,
  GrowthCard,
  SectionSkeleton,
  TimelineCard,
  VaccinationCard,
} from "@/features/dashboard/sections";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default function DashboardPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase text-nimora-slate">Family overview</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">Your family</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Growth, vaccinations, and visits for each child, in one calm place.
        </p>
      </header>

      <Suspense fallback={<SectionSkeleton label="children" className="h-12" />}>
        <ChildSwitcher searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton label="selected child" className="h-56" />}>
        <ChildHero searchParams={searchParams} />
      </Suspense>

      <div className="grid gap-5 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton label="growth" />}>
          <GrowthCard searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton label="vaccinations" />}>
          <VaccinationCard searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton label="appointments" />}>
          <AppointmentsCard searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton label="health events" />}>
          <TimelineCard searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
