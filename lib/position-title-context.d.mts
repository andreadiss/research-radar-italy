import type { Position } from "./types";

export function positionTitleContext(
  position: Position,
  openPositions: Position[]
): { heading: string; metadataSubject: string };
