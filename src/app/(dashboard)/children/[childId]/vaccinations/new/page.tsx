import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { VaccinationRecordForm } from "@/features/records/forms";
import { loadManagedChild } from "@/features/records/managed-child";
import { RecordPage } from "@/features/records/record-page";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function NewVaccinationRecordPage({ params }: { params: Promise<{ childId: string }> }) {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;
  const { childId } = await params;
  const { child, canManage } = await loadManagedChild(childId);

  return (
    <RecordPage
      childId={child.id}
      childName={child.preferred_name || child.first_name}
      title="Add vaccination"
      description="Record a dose that has already been given. Scheduled doses are not tracked yet."
      canManage={canManage}
    >
      <VaccinationRecordForm childId={child.id} />
    </RecordPage>
  );
}
