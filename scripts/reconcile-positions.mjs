// Keep published URLs when the source's open-call search stops returning a record.
export function reconcilePositions(previous, incoming, { fullSync, checkedAt }) {
  if (!incoming.length && previous.length) throw new Error("Empty import: retaining the previous cache. Review source availability before publishing.");
  const result = new Map(previous.map((item) => [item.id, item]));
  const incomingIds = new Set(incoming.map((item) => item.id));
  if (incomingIds.size !== incoming.length) throw new Error("Duplicate source IDs in import.");
  for (const item of incoming) {
    const old = result.get(item.id);
    const next = { ...item, updatedAt: old && sameContent(old, item) && !old.archivedAt ? old.updatedAt : checkedAt };
    delete next.archivedAt;
    result.set(item.id, next);
  }
  if (fullSync) {
    for (const [id, item] of result) {
      if (!incomingIds.has(id) && !item.archivedAt) result.set(id, { ...item, archivedAt: checkedAt });
    }
  }
  return [...result.values()];
}

function sameContent(a, b) {
  const omit = new Set(["updatedAt", "archivedAt", "deadlineStatus"]);
  const stable = (item) => JSON.stringify(Object.fromEntries(Object.entries(item).filter(([key]) => !omit.has(key)).sort(([a], [b]) => a.localeCompare(b))));
  return stable(a) === stable(b);
}
