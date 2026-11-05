function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function ageInMonths(birthDate: string, today: string): number {
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  const [year, month, day] = today.split("-").map(Number);
  let months = (year - birthYear) * 12 + (month - birthMonth);
  if (day < birthDay) months -= 1;
  return Math.max(0, months);
}

export function formatAge(birthDate: string, today: string): string {
  const months = ageInMonths(birthDate, today);
  if (months < 1) return "Under 1 month old";
  if (months < 24) return `${plural(months, "month", "months")} old`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const yearLabel = plural(years, "year", "years");
  return remainingMonths
    ? `${yearLabel}, ${plural(remainingMonths, "month", "months")} old`
    : `${yearLabel} old`;
}
