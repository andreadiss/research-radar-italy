export function LastUpdateBadge() {
  const label = formatShortDate(new Date());

  return (
    <aside className="last-update-badge" aria-label={`Last update: ${label}`}>
      <span>Last update <strong>{label}</strong></span>
    </aside>
  );
}

function formatShortDate(date: Date) {
  const months = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const monthLabel = months[date.getMonth()];

  return `${date.getDate()} ${monthLabel}`;
}