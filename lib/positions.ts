import generatedPositions from "@/lib/generated/mur-positions.json";
import { positions as mockPositions } from "@/lib/mock-positions";
import type { Position } from "@/lib/types";

const importedPositions = generatedPositions as Position[];

export const positions = importedPositions.length > 0 ? importedPositions : mockPositions;

export function getPositionById(id: string) {
  return positions.find((position) => position.id === id);
}
