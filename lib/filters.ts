import { positions } from "@/lib/positions";
import type { PositionType } from "@/lib/types";

export const positionTypes: PositionType[] = [
  "PhD",
  "Tecnologo",
  "Assegno",
  "RTT",
  "Professore I fascia",
  "Professore II fascia",
  "Contratto di ricerca",
  "Incarico di ricerca",
  "Postdoc"
];
export const disciplines = Array.from(new Set(positions.map((position) => position.discipline))).sort();
export const regions = Array.from(new Set(positions.map((position) => position.region))).sort();
export const fundingTypes = Array.from(new Set(positions.map((position) => position.fundingType))).sort();
