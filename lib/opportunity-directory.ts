import { positions } from "@/lib/positions";
import { isOpenPosition } from "@/lib/opportunity-status";

export const directoryPageSize = 30;
export function directoryItems() {
  return positions.filter((position) => isOpenPosition(position)).sort((a, b) => a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id));
}
export function directoryPageCount() {
  return Math.max(1, Math.ceil(directoryItems().length / directoryPageSize));
}
export function directoryPath(page: number) {
  return page === 1 ? "/posizioni/indice" : `/posizioni/indice/pagina/${page}`;
}
