import type { Position } from "./types";

export function positionCardPresentation(
  position: Position,
  fallbackTitle?: string
): { title: string; summary: string; topic: { label: string; text: string } };
