import { z } from "zod";

const notes = z.string().trim().max(500, "Keep notes under 500 characters.");
const clockTime = z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time.");

export const growthSchema = z.object({
  childId: z.uuid(),
  measuredOn: z.iso.date("Enter the measurement date."),
  weightKg: z.coerce
    .number({ error: "Enter the weight in kilograms." })
    .positive("Weight must be more than 0 kg.")
    .max(200, "Check the weight. It must be 200 kg or less."),
  heightCm: z.coerce
    .number({ error: "Enter the height in centimetres." })
    .positive("Height must be more than 0 cm.")
    .max(250, "Check the height. It must be 250 cm or less."),
  notes,
});

export const vaccinationSchema = z.object({
  childId: z.uuid(),
  vaccineName: z.string().trim().min(1, "Enter the vaccine name.").max(120),
  doseLabel: z.string().trim().min(1, "Enter the dose, for example First dose.").max(80),
  administeredOn: z.iso.date("Enter the date it was given."),
  notes,
});

export const appointmentSchema = z.object({
  childId: z.uuid(),
  title: z.string().trim().min(1, "Enter a title for the appointment.").max(160),
  providerName: z.string().trim().min(1, "Enter the clinic or provider name.").max(120),
  scheduledDate: z.iso.date("Enter the appointment date."),
  scheduledTime: clockTime,
  notes,
});

export function firstIssueMessage(error: z.ZodError, fallback: string): string {
  return error.issues[0]?.message ?? fallback;
}
