import { positions } from "@/lib/positions";

export const positionTypes = Array.from(new Set(positions.map((position) => position.positionType))).sort();
export const disciplines = Array.from(new Set(positions.map((position) => position.discipline))).sort();
export const regions = Array.from(new Set(positions.map((position) => position.region))).sort();
export const fundingTypes = Array.from(new Set(positions.map((position) => position.fundingType))).sort();
