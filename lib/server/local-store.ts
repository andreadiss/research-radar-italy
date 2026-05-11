import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const storeDir = path.join(process.cwd(), "data", "store");

export async function appendLocalStore<T extends Record<string, unknown> & { createdAt?: string }>(fileName: string, value: T) {
  await mkdir(storeDir, { recursive: true });
  const filePath = path.join(storeDir, fileName);
  const records = await readJson<T[]>(filePath, []);
  records.unshift({
    ...value,
    createdAt: value.createdAt ?? new Date().toISOString()
  });
  await writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

async function readJson<T>(filePath: string, fallback: T) {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}
