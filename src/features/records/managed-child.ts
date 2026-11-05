import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loadManagedChild(childId: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: child } = await supabase
    .from("children")
    .select("id, first_name, preferred_name")
    .eq("id", childId)
    .maybeSingle();
  if (!child) notFound();

  const { data: canManage } = await supabase.rpc("can_manage_child", { target_child_id: childId });
  return { child, canManage: canManage === true };
}
