export const CLINIC_TIME_ZONE = "Africa/Lagos";

// Nigeria observes no daylight saving time, so a fixed offset keeps stored instants stable.
export const CLINIC_UTC_OFFSET = "+01:00";

export function todayInClinicZone(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(now);
}

export function clinicInstant(date: string, time: string): string {
  return new Date(`${date}T${time}:00${CLINIC_UTC_OFFSET}`).toISOString();
}

export function formatDateOnly(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-NG", { dateStyle: "medium", timeZone: "UTC" });
}

export function formatDateTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: CLINIC_TIME_ZONE,
  });
}
