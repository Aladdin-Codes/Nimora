import { describe, expect, it } from "vitest";
import { ageInMonths, formatAge } from "@/features/dashboard/calculations";
import { clinicInstant, todayInClinicZone } from "@/lib/clinic-time";

describe("formatAge", () => {
  it("reports under a month for newborns", () => {
    expect(formatAge("2026-11-01", "2026-11-05")).toBe("Under 1 month old");
  });

  it("uses months before two years", () => {
    expect(formatAge("2026-08-05", "2026-11-05")).toBe("3 months old");
    expect(formatAge("2026-10-05", "2026-11-05")).toBe("1 month old");
  });

  it("combines years and months after two years", () => {
    expect(formatAge("2024-08-05", "2026-11-05")).toBe("2 years, 3 months old");
    expect(formatAge("2024-11-05", "2026-11-05")).toBe("2 years old");
  });

  it("does not count a birthday before the day arrives", () => {
    expect(ageInMonths("2025-11-10", "2026-11-05")).toBe(11);
  });

  it("never returns a negative age", () => {
    expect(ageInMonths("2026-12-01", "2026-11-05")).toBe(0);
  });
});

describe("clinic time", () => {
  it("stores appointment times at West Africa Time", () => {
    expect(clinicInstant("2026-11-05", "09:30")).toBe("2026-11-05T08:30:00.000Z");
  });

  it("uses the Lagos calendar date near midnight UTC", () => {
    expect(todayInClinicZone(new Date("2026-11-04T23:30:00Z"))).toBe("2026-11-05");
  });
});
