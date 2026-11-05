import { describe, expect, it } from "vitest";
import { appointmentSchema, growthSchema, vaccinationSchema } from "@/features/records/schemas";

const childId = "123e4567-e89b-42d3-a456-426614174000";

describe("growthSchema", () => {
  it("accepts numeric strings from the form", () => {
    const result = growthSchema.safeParse({
      childId,
      measuredOn: "2026-11-01",
      weightKg: "12.5",
      heightCm: "88",
      notes: "  ",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.weightKg).toBe(12.5);
  });

  it("rejects a non-positive weight with a readable message", () => {
    const result = growthSchema.safeParse({ childId, measuredOn: "2026-11-01", weightKg: "0", heightCm: "88" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("Weight must be more than 0 kg.");
  });

  it("rejects a child id that is not a UUID", () => {
    const result = growthSchema.safeParse({ childId: "not-a-uuid", measuredOn: "2026-11-01", weightKg: "12", heightCm: "88" });
    expect(result.success).toBe(false);
  });
});

describe("vaccinationSchema", () => {
  it("requires a vaccine name and dose", () => {
    const result = vaccinationSchema.safeParse({
      childId,
      vaccineName: " ",
      doseLabel: "First dose",
      administeredOn: "2026-10-01",
      notes: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("appointmentSchema", () => {
  it("rejects a time that is not HH:mm", () => {
    const result = appointmentSchema.safeParse({
      childId,
      title: "Well-baby visit",
      providerName: "Lagos clinic",
      scheduledDate: "2026-11-10",
      scheduledTime: "9am",
      notes: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a complete appointment", () => {
    const result = appointmentSchema.safeParse({
      childId,
      title: "Well-baby visit",
      providerName: "Lagos clinic",
      scheduledDate: "2026-11-10",
      scheduledTime: "09:30",
      notes: "",
    });
    expect(result.success).toBe(true);
  });
});
