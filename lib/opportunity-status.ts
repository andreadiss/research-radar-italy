import type { GrantOpportunity, Position } from "@/lib/types";

const italyCalendar = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" });

export function italyToday(date = new Date()) {
  return italyCalendar.format(date);
}

export function isPastDeadline(value: string, today = italyToday()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value < today;
}

export function isOpenPosition(position: Position, today = italyToday()) {
  return !position.archivedAt && !isPastDeadline(position.deadline, today);
}

export function isAvailableGrant(grant: GrantOpportunity, today = italyToday()) {
  return (grant.status === "open" || grant.status === "upcoming") && !isPastDeadline(grant.deadline, today);
}
