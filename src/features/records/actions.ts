"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/forms/form-fields";
import { clinicInstant, todayInClinicZone } from "@/lib/clinic-time";
import { createClient } from "@/lib/supabase/server";
import { appointmentSchema, firstIssueMessage, growthSchema, vaccinationSchema } from "./schemas";

const SIGN_IN_AGAIN = "Please sign in again before saving.";
const CANNOT_SAVE = "We could not save this record. Check that you can manage this child's profile.";

function configurationError(): FormState {
  return { error: "Supabase is not configured. Add the project URL and public key to your local environment." };
}

export async function createGrowthMeasurement(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = growthSchema.safeParse({
    childId: formData.get("childId"),
    measuredOn: formData.get("measuredOn"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error, "Check the measurement details.") };
  if (parsed.data.measuredOn > todayInClinicZone()) return { error: "Measurement date cannot be in the future." };

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: SIGN_IN_AGAIN };

    const { error } = await supabase.from("growth_measurements").insert({
      child_id: parsed.data.childId,
      measured_on: parsed.data.measuredOn,
      weight_kg: parsed.data.weightKg,
      height_cm: parsed.data.heightCm,
      notes: parsed.data.notes,
    });
    if (error) return { error: CANNOT_SAVE };
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?child=${parsed.data.childId}`);
}

export async function createVaccinationRecord(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = vaccinationSchema.safeParse({
    childId: formData.get("childId"),
    vaccineName: formData.get("vaccineName"),
    doseLabel: formData.get("doseLabel"),
    administeredOn: formData.get("administeredOn"),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error, "Check the vaccination details.") };
  if (parsed.data.administeredOn > todayInClinicZone()) return { error: "The vaccination date cannot be in the future." };

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: SIGN_IN_AGAIN };

    const { error } = await supabase.from("vaccination_records").insert({
      child_id: parsed.data.childId,
      vaccine_name: parsed.data.vaccineName,
      dose_label: parsed.data.doseLabel,
      administered_on: parsed.data.administeredOn,
      notes: parsed.data.notes,
    });
    if (error) return { error: CANNOT_SAVE };
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?child=${parsed.data.childId}`);
}

export async function createAppointment(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = appointmentSchema.safeParse({
    childId: formData.get("childId"),
    title: formData.get("title"),
    providerName: formData.get("providerName"),
    scheduledDate: formData.get("scheduledDate"),
    scheduledTime: formData.get("scheduledTime"),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error, "Check the appointment details.") };
  const scheduledAt = clinicInstant(parsed.data.scheduledDate, parsed.data.scheduledTime);

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: SIGN_IN_AGAIN };

    const { error } = await supabase.from("appointments").insert({
      child_id: parsed.data.childId,
      title: parsed.data.title,
      provider_name: parsed.data.providerName,
      scheduled_at: scheduledAt,
      notes: parsed.data.notes,
    });
    if (error) return { error: CANNOT_SAVE };
  } catch {
    return configurationError();
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?child=${parsed.data.childId}`);
}
