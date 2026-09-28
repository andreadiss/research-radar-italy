import generatedPositions from "@/lib/generated/mur-positions.json";
import type { Position } from "@/lib/types";
import { applyVerifiedPositionEnrichment } from "@/lib/verified-position-enrichments.mjs";

const importedPositions = (generatedPositions as Position[]).map((position) =>
  applyVerifiedPositionEnrichment(position) as Position
);

// An empty source must never publish demonstration opportunities as real calls.
export const positions = importedPositions;

export function getPositionById(id: string) {
  return positions.find((position) => position.id === id);
}
