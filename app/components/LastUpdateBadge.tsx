"use client";

import { useEffect, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Rome"
});

const isoDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Europe/Rome"
});

function currentDate() {
  const now = new Date();
  return { timestamp: isoDateFormatter.format(now), label: dateFormatter.format(now) };
}

export function LastUpdateBadge() {
  const [date, setDate] = useState(() => {
    const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE;
    if (!buildDate) return currentDate();
    const parsedBuildDate = new Date(`${buildDate}T12:00:00+02:00`);
    return { timestamp: buildDate, label: dateFormatter.format(parsedBuildDate) };
  });

  useEffect(() => {
    setDate(currentDate());
  }, []);

  return (
    <aside className="last-update-badge" aria-label={`Dati MUR: ${date.label}`}>
      <span>Dati MUR <strong><time dateTime={date.timestamp}>{date.label}</time></strong></span>
    </aside>
  );
}
