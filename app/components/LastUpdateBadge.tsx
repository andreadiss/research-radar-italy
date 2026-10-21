"use client";

import { useEffect, useState } from "react";
import murCheckStatus from "@/lib/generated/mur-check-status.json";

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
    const snapshotDate = murCheckStatus.lastSuccessfulCheckAt.slice(0, 10);
    const parsedSnapshotDate = new Date(`${snapshotDate}T12:00:00+02:00`);
    return { timestamp: snapshotDate, label: dateFormatter.format(parsedSnapshotDate) };
  });

  useEffect(() => {
    const refreshDate = () => setDate(currentDate());
    window.addEventListener("focus", refreshDate);
    return () => window.removeEventListener("focus", refreshDate);
  }, []);

  return (
    <aside className="last-update-badge" aria-label={`Dati MUR: ${date.label}`}>
      <span>Dati MUR <strong><time dateTime={date.timestamp}>{date.label}</time></strong></span>
    </aside>
  );
}
