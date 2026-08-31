/**
 * Date formatting helpers to ensure deterministic rendering across server and client
 */

export function formatDate(
  dateInput: string | Date | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof dateInput === "string" || typeof dateInput === "number" 
    ? new Date(dateInput) 
    : dateInput;

  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...options,
  });
}

export function formatShortDate(dateInput: string | Date | number): string {
  return formatDate(dateInput, {
    month: "short",
    day: "numeric",
  });
}

export function formatFullDate(dateInput: string | Date | number): string {
  return formatDate(dateInput, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
