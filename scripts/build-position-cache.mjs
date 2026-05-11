import { mkdir, readFile, writeFile } from "node:fs/promises";
import { normalizeRecords } from "./mur-normalize.mjs";

const args = new Map(
  process.argv
    .slice(2)
    .map((arg) => arg.split("="))
    .filter(([key, value]) => key?.startsWith("--") && value !== undefined)
    .map(([key, value]) => [key.slice(2), value])
);

const inputPath = args.get("in") ?? "data/mur-sample.json";
const outputPath = args.get("out") ?? "lib/generated/mur-positions.json";
const source = JSON.parse(await readFile(inputPath, "utf8"));
const records = Array.isArray(source) ? source : source.results;
const positions = normalizeRecords(records);

await mkdir(outputPath.split("/").slice(0, -1).join("/") || ".", { recursive: true });
await writeFile(outputPath, `${JSON.stringify(positions, null, 2)}\n`, "utf8");

console.log(`Wrote ${positions.length} normalized positions to ${outputPath}`);
