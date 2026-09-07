export function LastUpdateBadge() {
  const timestamp = process.env.NEXT_PUBLIC_MUR_CHECKED_AT;
  if (!timestamp) return null;
  const label = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", timeZone: "Europe/Rome" }).format(new Date(timestamp));

  return (
    <aside className="last-update-badge" aria-label={`Ultimo controllo MUR riuscito: ${label}`}>
      <span>Controllo MUR <strong><time dateTime={timestamp}>{label}</time></strong></span>
    </aside>
  );
}
