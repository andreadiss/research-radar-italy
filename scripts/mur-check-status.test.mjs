import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./sync-mur-store.mjs", import.meta.url));
test("check timestamp advances only on successful full live sync, even with unchanged records", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mur-check-test-"));
  try {
    await mkdir(join(dir, "scripts"));
    await writeFile(join(dir, "scripts/import-mur.mjs"), "process.exit(Number(process.env.TEST_IMPORT_EXIT ?? 0));");
    await writeFile(join(dir, "scripts/persist-supabase.mjs"), "process.exit(1);");
    await writeFile(join(dir, "raw.json"), JSON.stringify({ results: [{
      externalId: "test", sourceCategory: "doctorates", positionType: "PhD",
      title: "Dottorato di ricerca in fisica", institution: "Università di Padova",
      deadline: "2027-01-01", importedAt: "2026-09-01T00:00:00Z",
      sourceUrl: "https://bandi.mur.gov.it/doctorate.php/public/fellowship/id/test"
    }] }));
    const statusPath = join(dir, "check.json");
    const old = '{"lastSuccessfulCheckAt":"2026-01-01T00:00:00Z"}\n';
    const run = (extra = [], env = {}) => spawnSync(process.execPath, [script,
      "--limit=all", "--raw=raw.json", "--store=store", "--cache=cache.json", "--check-status=check.json", ...extra
    ], { cwd: dir, env: { ...process.env, ...env }, encoding: "utf8" });
    await writeFile(statusPath, old);
    let result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.ok(Date.parse(JSON.parse(await readFile(statusPath, "utf8")).lastSuccessfulCheckAt) > Date.parse("2026-01-01"));
    const cache = await readFile(join(dir, "cache.json"), "utf8");
    await writeFile(statusPath, old);
    result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(join(dir, "cache.json"), "utf8"), cache);
    assert.notEqual(await readFile(statusPath, "utf8"), old);
    for (const [extra, env, expected] of [
      [[], { TEST_IMPORT_EXIT: "1" }, 1],
      [["--persist=supabase"], {}, 1],
      [["--skip-fetch=true"], {}, 0],
      [["--limit=10"], {}, 0]
    ]) {
      await writeFile(statusPath, old);
      result = run(extra, env);
      assert.equal(result.status, expected, result.stderr);
      assert.equal(await readFile(statusPath, "utf8"), old);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
