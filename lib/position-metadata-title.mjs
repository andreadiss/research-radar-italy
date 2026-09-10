// Check the rendered (already truncated) title, so an institution removed by
// truncation is still appended. Exact suffix matching avoids partial-name matches.
export function positionMetadataTitle(title, institution, id) {
  const normalize = (value) => value.replace(/\s+/g, " ").trim().toLocaleLowerCase("it");
  const name = normalize(institution);
  const rendered = normalize(title);
  const hasInstitution = name && (rendered === name ||
    [" - ", " – ", " — "].some((separator) => rendered.endsWith(separator + name)));
  return `${title}${hasInstitution ? "" : ` – ${institution}`} (${id.split("-").at(-1)})`;
}
