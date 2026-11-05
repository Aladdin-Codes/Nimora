import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { AppointmentForm } from "@/features/records/forms";
import { loadManagedChild } from "@/features/records/managed-child";
import { RecordPage } from "@/features/records/record-page";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function NewAppointmentPage({ params }: { params: Promise<{ childId: string }> }) {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;
  const { childId } = await params;
  const { child, canManage } = await loadManagedChild(childId);

  return (
    <RecordPage
      childId={child.id}
      childName={child.preferred_name || child.first_name}
      title="Add appointment"
      description="Times are recorded in West Africa Time (WAT)."
      canManage={canManage}
    >
      <AppointmentForm childId={child.id} />
    </RecordPage>
  );
}
