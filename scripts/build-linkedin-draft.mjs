import { readFile, writeFile, mkdir } from "node:fs/promises";

const input = JSON.parse(await readFile("lib/generated/mur-positions.json", "utf8"));
if (!Array.isArray(input)) throw new Error("MUR cache must be an array");
const today = new Date();
const day = today.toISOString().slice(0, 10);
const freshCutoff = new Date(today.getTime() - 7 * 86400000);
const time = value => { const d = new Date(value); return Number.isFinite(d.getTime()) ? d.getTime() : NaN; };
const eligible = input.filter(p =>
  p && p.id && p.title && p.institution && p.sourceUrl &&
  /^https?:\/\//.test(p.sourceUrl) &&
  Number.isFinite(time(p.deadline)) && time(p.deadline) >= today.getTime() &&
  Number.isFinite(time(p.publishedAt)) && time(p.publishedAt) >= freshCutoff.getTime() &&
  time(p.publishedAt) <= today.getTime() &&
  p.reviewStatus !== "needs_review" && !p.possibleDuplicateOf
);
const selected = [...new Map(eligible.map(p => [p.id, p])).values()]
  .sort((a,b) => time(b.publishedAt) - time(a.publishedAt))
  .slice(0, 5);
const clean = s => String(s ?? "").replace(/[\r\n]+/g, " ").trim();
const tracked = "https://rritaly.com/?intent=posizioni&utm_source=linkedin&utm_medium=organic&utm_campaign=weekly_opportunities";
const lines = [
  "# Bozza LinkedIn — Research Radar Italy",
  "",
  "**Stato: DA APPROVARE — non pubblicata**",
  "**Generata:** " + day,
  "",
  "## Testo proposto",
  "",
  selected.length ? "Nuove opportunità nella ricerca accademica in Italia 🔎" : "Nessuna bozza pubblicabile questa settimana",
  ""
];
if (selected.length) {
  lines.push("Ecco una selezione di bandi pubblicati negli ultimi 7 giorni, con scadenza ancora aperta:");
  for (const p of selected) {
    lines.push("", "• " + clean(p.positionType || "Posizione di ricerca") + " — " + clean(p.institution),
      "  " + clean(p.title), "  Scadenza: " + clean(p.deadline).slice(0,10));
  }
  lines.push("", "Trova le opportunità e filtra per settore su Research Radar Italy: " + tracked,
    "", "#Ricerca #Università #OpportunitàAccademiche");
}
lines.push("", "## Verifica prima dell'approvazione", "",
  "- [ ] Ogni bando risulta ancora aperto sul sito ufficiale",
  "- [ ] Titoli, enti, settori e scadenze sono corretti",
  "- [ ] Il link RRItaly funziona e conduce a opportunità pertinenti",
  "- [ ] Il testo finale è stato approvato dal responsabile della pagina",
  "", "## Fonti originali");
for (const p of selected) lines.push("- " + clean(p.institution) + ": " + p.sourceUrl);
lines.push("", "Questa automazione non pubblica su LinkedIn né invia contenuti a Buffer.");
await mkdir("artifacts/linkedin", {recursive:true});
await writeFile("artifacts/linkedin/draft.md", lines.join("\n") + "\n");
console.log("Eligible positions: " + eligible.length + "; selected: " + selected.length);
