import test from "node:test";
import assert from "node:assert/strict";
import { fetchTextWithRetry } from "./fetch-text.mjs";

const response = (status, body = "") => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? "OK" : "Proxy Error",
  text: async () => body
});

test("retries a temporary 502 and returns the recovered response", async () => {
  const statuses = [502, 502, 200];
  const delays = [];
  const result = await fetchTextWithRetry("https://bandi.mur.gov.it/example", {
    fetchFn: async () => response(statuses.shift(), "recovered"),
    sleep: async (delay) => delays.push(delay)
  });
  assert.equal(result, "recovered");
  assert.deepEqual(delays, [1000, 3000]);
});

test("retries a network error", async () => {
  let calls = 0;
  const result = await fetchTextWithRetry("https://bandi.mur.gov.it/example", {
    fetchFn: async () => {
      calls += 1;
      if (calls === 1) throw new TypeError("fetch failed");
      return response(200, "ok");
    },
    sleep: async () => {}
  });
  assert.equal(result, "ok");
  assert.equal(calls, 2);
});

test("does not retry a permanent client error", async () => {
  let calls = 0;
  await assert.rejects(
    fetchTextWithRetry("https://bandi.mur.gov.it/missing", {
      fetchFn: async () => {
        calls += 1;
        return response(404);
      },
      sleep: async () => {}
    }),
    /Failed 404/
  );
  assert.equal(calls, 1);
});

test("stops after the configured number of attempts", async () => {
  let calls = 0;
  await assert.rejects(
    fetchTextWithRetry("https://bandi.mur.gov.it/example", {
      attempts: 3,
      fetchFn: async () => {
        calls += 1;
        return response(503);
      },
      sleep: async () => {}
    }),
    /Failed 503/
  );
  assert.equal(calls, 3);
});
