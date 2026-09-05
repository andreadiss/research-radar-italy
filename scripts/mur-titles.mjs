import { normalizeLabel } from './mur-html.mjs';
export function extractCallTitles(fields) {
 const first = (labels) => labels.map((label) => fields[normalizeLabel(label)]).find((value) => typeof value === 'string' && value.trim())?.trim() ?? '';
 return {
  title: first(["Titolo del progetto di ricerca in italiano", "Titolo del progetto dell'incarico in italiano", "Titolo del progetto di ricerca", "Nome bando", "Titolo"]),
  titleEn: first(["Titolo del progetto di ricerca in inglese", "Titolo del progetto dell'incarico in inglese", "Titolo del progetto ddell'incarico in inglese"])
 };
}
