const millisecondsPerDay = 86_400_000;

export function daysUntil(deadline, today) {
  const deadlineTimestamp = calendarDateTimestamp(deadline);
  const todayTimestamp = calendarDateTimestamp(today);
  return Math.round((deadlineTimestamp - todayTimestamp) / millisecondsPerDay);
}

export function deadlineLabel(deadline, today) {
  const days = daysUntil(deadline, today);

  if (days < 0) return "Scaduto";
  if (days === 0) return "Scade oggi";
  if (days === 1) return "Scade domani";
  return `${days} giorni`;
}

export function deadlineClass(deadline, today) {
  const days = daysUntil(deadline, today);

  if (days <= 7) return "deadline-pill urgent";
  if (days <= 14) return "deadline-pill soon";
  return "deadline-pill";
}

function calendarDateTimestamp(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return Number.NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
