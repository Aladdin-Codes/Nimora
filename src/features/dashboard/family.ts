import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const loadFamily = cache(async (requestedChildId: string | undefined) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .select("id, first_name, last_name, preferred_name, birth_date")
    .order("created_at", { ascending: false });

  if (error) return { failed: true as const, children: [], selected: null };

  const children = data ?? [];
  const selected = children.find((child) => child.id === requestedChildId) ?? children[0] ?? null;
  return { failed: false as const, children, selected };
});

export const canManageChild = cache(async (childId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("can_manage_child", { target_child_id: childId });
  return data === true;
});

export function displayName(child: { first_name: string; last_name: string; preferred_name: string | null }) {
  return `${child.preferred_name || child.first_name} ${child.last_name}`.trim();
}
