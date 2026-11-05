import { SupabaseSetupNotice } from "@/components/shared/supabase-setup-notice";
import { GrowthMeasurementForm } from "@/features/records/forms";
import { loadManagedChild } from "@/features/records/managed-child";
import { RecordPage } from "@/features/records/record-page";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function NewGrowthMeasurementPage({ params }: { params: Promise<{ childId: string }> }) {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice />;
  const { childId } = await params;
  const { child, canManage } = await loadManagedChild(childId);

  return (
    <RecordPage
      childId={child.id}
      childName={child.preferred_name || child.first_name}
      title="Log growth"
      description="Record a weight and height measurement. Dates cannot be in the future."
      canManage={canManage}
    >
      <GrowthMeasurementForm childId={child.id} />
    </RecordPage>
  );
}
