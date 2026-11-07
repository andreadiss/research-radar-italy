import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./sync-mur-store.mjs", import.meta.url));
const importer = fileURLToPath(new URL("./import-mur.mjs", import.meta.url));

test("an isolated HTTP 500 is retried and deferred without blocking the rest of the catalog", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mur-partial-test-"));
  try {
    await mkdir(join(dir, "scripts"));
    await writeFile(join(dir, "scripts/import-mur.mjs"), `
      let failedAttempts = 0;
      globalThis.fetch = async (url) => {
        if (url.pathname.endsWith("/153787")) {
          failedAttempts += 1;
          console.log("unavailable-attempt", failedAttempts);
          return new Response("", { status: Number(process.env.TEST_MUR_STATUS ?? 500) });
        }
        if (url.pathname.endsWith("/153788")) {
          return new Response("<table><tr><th>Ente</th><td>Università di Padova</td></tr><tr><th>Data del bando</th><td>06/11/2026</td></tr><tr><th>Data di scadenza del bando</th><td>01/12/2026</td></tr></table>");
        }
        return new Response(url.pathname.includes("tecno.php")
          ? '<a href="/tecno.php/public/job/id_job/153787">Unavailable</a><a href="/tecno.php/public/job/id_job/153788">Available</a>'
          : "");
      };
      await import(${JSON.stringify(new URL(`file://${importer}`).href)});
    `);
    const cached = { id: "mur-technologists-153787", title: "Versione precedente", deadline: "2026-12-01" };
    const withdrawn = { id: "mur-technologists-153786", title: "Non più in elenco", deadline: "2026-12-01" };
    const statusPath = join(dir, "check.json");
    const cachePath = join(dir, "cache.json");
    const oldStatus = '{"lastSuccessfulCheckAt":"2026-11-03T00:00:00Z"}\n';
    await writeFile(cachePath, JSON.stringify([cached, withdrawn]));
    await writeFile(statusPath, oldStatus);
    const run = (status) => spawnSync(process.execPath, [script,
      "--limit=all", "--raw=raw.json", "--store=store", "--cache=cache.json", "--check-status=check.json"
    ], { cwd: dir, env: { ...process.env, TEST_MUR_STATUS: String(status) }, encoding: "utf8" });
    const partial = run(500);
    assert.equal(partial.status, 0, partial.stderr);
    assert.match(partial.stdout, /unavailable-attempt 3/);
    const newCache = await readFile(cachePath, "utf8");
    const positions = JSON.parse(newCache);
    assert.deepEqual(positions.find((position) => position.id === cached.id), cached);
    assert.ok(positions.find((position) => position.id === withdrawn.id).archivedAt);
    assert.ok(positions.some((position) => position.id === "mur-technologists-153788" && !position.archivedAt));
    const report = JSON.parse(await readFile(join(dir, "store/last-sync-report.json"), "utf8"));
    assert.deepEqual(report.failedDetails, [{
      sourceCategory: "technologists", externalId: "153787", status: 500,
      sourceUrl: "https://bandi.mur.gov.it/tecno.php/public/job/id_job/153787"
    }]);
    assert.equal(await readFile(statusPath, "utf8"), oldStatus);
    const forbidden = run(403);
    assert.notEqual(forbidden.status, 0);
    assert.match(forbidden.stderr, /Failed 403/);
    assert.equal(await readFile(cachePath, "utf8"), newCache);
    assert.equal(await readFile(statusPath, "utf8"), oldStatus);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

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
