function normalized(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("it");
}

export function positionTitleContext(position, openPositions) {
  const original = { heading: position.title, metadataSubject: position.title };
  const sector = position.ssd?.trim().replace(/\s+/g, " ");
  if (!sector || sector === "-" || !openPositions.some((item) => item.id === position.id)) return original;

  const title = normalized(position.title);
  const hasSameOfficialTitle = openPositions.some((item) =>
    item.id !== position.id && normalized(item.title) === title
  );
  if (!hasSameOfficialTitle) return original;

  return {
    heading: `${position.title} — ${sector}`,
    metadataSubject: `${position.positionType} — ${sector}`
  };
}
