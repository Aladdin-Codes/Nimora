"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  error?: string;
  notice?: string;
  invitationUrl?: string;
};

const childSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name.").max(80),
  lastName: z.string().trim().min(1, "Enter a last name.").max(80),
  preferredName: z.string().trim().max(80).optional(),
  birthDate: z.iso.date("Enter a valid birth date."),
});

function configurationError(): ProfileActionState {
  return { error: "Supabase is not configured. Add the project URL and public key to your local environment." };
}

export async function updateGuardianProfile(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = z.object({ fullName: z.string().trim().min(2, "Enter your name.").max(100) }).safeParse({
    fullName: String(formData.get("fullName") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your name." };

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Please sign in again before updating your profile." };

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: parsed.data.fullName })
      .eq("id", user.id);
    if (error) return { error: "We could not save your profile. Please try again." };
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createChild(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = childSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    preferredName: String(formData.get("preferredName") ?? "").trim() || undefined,
    birthDate: formData.get("birthDate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the profile details." };
  if (parsed.data.birthDate > new Date().toISOString().slice(0, 10)) {
    return { error: "Birth date cannot be in the future." };
  }

  let childId: string;
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Please sign in again before creating a child profile." };

    const { data, error } = await supabase
      .from("children")
      .insert({
        owner_id: user.id,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        preferred_name: parsed.data.preferredName || null,
        birth_date: parsed.data.birthDate,
      })
      .select("id")
      .single();
    if (error || !data) return { error: "We could not create the profile. Please try again." };
    childId = data.id;
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect(`/children/${childId}`);
}

export async function updateChild(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = childSchema.extend({ id: z.uuid() }).safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    preferredName: String(formData.get("preferredName") ?? "").trim() || undefined,
    birthDate: formData.get("birthDate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the profile details." };
  if (parsed.data.birthDate > new Date().toISOString().slice(0, 10)) {
    return { error: "Birth date cannot be in the future." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("children")
      .update({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        preferred_name: parsed.data.preferredName || null,
        birth_date: parsed.data.birthDate,
      })
      .eq("id", parsed.data.id);
    if (error) return { error: "We could not update the profile. Please try again." };
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  revalidatePath(`/children/${parsed.data.id}`);
  redirect(`/children/${parsed.data.id}`);
}

export async function createCaregiverInvitation(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = z.object({ childId: z.uuid(), email: z.email() }).safeParse({
    childId: formData.get("childId"),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  });
  if (!parsed.success) return { error: "Enter a valid email address." };

  let token: string;
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Please sign in again before inviting a caregiver." };

    const { data, error } = await supabase
      .from("child_invitations")
      .insert({ child_id: parsed.data.childId, invite_email: parsed.data.email, invited_by: user.id })
      .select("token")
      .single();
    if (error || !data) return { error: "We could not create the invitation. Check your access and try again." };
    token = data.token;
  } catch {
    return configurationError();
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  revalidatePath(`/children/${parsed.data.childId}`);
  return {
    notice: "Invitation created. Share this private link with the invited caregiver; they must sign in with the invited email.",
    invitationUrl: `${origin}/invite/${token}`,
  };
}

export async function acceptCaregiverInvitation(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = z.object({ token: z.uuid() }).safeParse({ token: formData.get("token") });
  if (!parsed.success) return { error: "This invitation link is invalid." };

  let childId: string;
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Sign in with the invited email to accept this invitation." };

    const { data, error } = await supabase.rpc("accept_child_invitation", {
      invitation_token: parsed.data.token,
    });
    if (error || !data) return { error: "This invitation is invalid, expired, or was sent to another email." };
    childId = data;
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect(`/children/${childId}`);
}

export async function revokeCaregiver(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = z.object({ childId: z.uuid(), userId: z.uuid() }).safeParse({
    childId: formData.get("childId"),
    userId: formData.get("userId"),
  });
  if (!parsed.success) return { error: "Could not identify that caregiver." };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("child_memberships")
      .delete()
      .eq("child_id", parsed.data.childId)
      .eq("user_id", parsed.data.userId);
    if (error) return { error: "We could not remove access. Please try again." };
  } catch {
    return configurationError();
  }

  revalidatePath(`/children/${parsed.data.childId}`);
  return { notice: "Caregiver access removed." };
}
