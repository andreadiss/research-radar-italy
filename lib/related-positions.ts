import type { Position } from "./types";

export function relatedPositions(current: Position, items: Position[], today: string): Position[] {
  if (!current.discipline || /altro|interdisciplinare|specificat/i.test(current.discipline)) return [];
  return items.filter((item) =>
    item.id !== current.id && item.sourceUrl !== current.sourceUrl &&
    !item.archivedAt && /^\d{4}-\d{2}-\d{2}$/.test(item.deadline) && item.deadline >= today &&
    item.positionType === current.positionType && item.discipline === current.discipline &&
    !item.possibleDuplicateOf && item.reviewStatus !== "duplicate" &&
    current.possibleDuplicateOf !== item.id
  ).sort((a, b) => a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id)).slice(0, 3);
}
