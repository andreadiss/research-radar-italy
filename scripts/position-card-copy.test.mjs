import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { positionCardPresentation, reviewedCardCopy } from "../lib/position-card-copy.mjs";
import { applyVerifiedPositionEnrichment } from "../lib/verified-position-enrichments.mjs";
import { positionTopicPresentation } from "../lib/position-topic.mjs";
import { positionTitleContext } from "../lib/position-title-context.mjs";

const positions = JSON.parse(readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url)));

test("the original ten-card pilot is preserved and all reviewed IDs remain unique", () => {
  const pilot = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-10-30.json", import.meta.url))).cards;
  assert.equal(pilot.length, 10);
  for (const card of pilot) {
    const review = reviewedCardCopy.find(({ source }) => source.id === card.id);
    assert.deepEqual(review, { source: card.source, ...card.proposal });
  }
  assert.equal(new Set(reviewedCardCopy.map(({ source }) => source.id)).size, reviewedCardCopy.length);
});

for (const review of reviewedCardCopy) {
  test(`card copy and official detail remain separate: ${review.source.id}`, () => {
    const raw = positions.find(({ id }) => id === review.source.id);
    // A later sync may change the source; that should safely disable the review,
    // not fail the entire daily import or publish stale copy.
    if (!raw) return;
    const position = applyVerifiedPositionEnrichment(raw);
    const before = JSON.stringify(position);
    const matches = Object.entries(review.source).every(([key, value]) => position[key] === value);
    const shown = positionCardPresentation(position);
    if (matches) {
      assert.equal(shown.title, review.title);
      assert.equal(shown.topic.text, review.summary);
      assert.ok(shown.topic.text.length <= 230);
      assert.equal(positionTitleContext(position, [position]).heading, raw.title);
    } else {
      assert.equal(shown.title, position.title);
      assert.deepEqual(shown.topic, positionTopicPresentation(position.title, position.summary));
    }
    assert.equal(JSON.stringify(position), before);
  });
}

test("the published October 31 batch is preserved exactly", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-10-31.json", import.meta.url))).cards;
  assert.equal(batch.length, 2);
  for (const card of batch) {
    const source = Object.fromEntries(["id", "sourceUrl", "positionType", "institution", "ssd", "location"].map(key => [key, card[key]]));
    Object.assign(source, card.original);
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source, ...card.proposal });
  }
});

test("the published November 1 batch is preserved exactly", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-01.json", import.meta.url))).cards;
  assert.equal(batch.length, 2);
  for (const card of batch) {
    const source = Object.fromEntries(["id", "sourceUrl", "positionType", "institution", "ssd", "location"].map(key => [key, card[key]]));
    Object.assign(source, card.original);
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source, ...card.proposal });
  }
});

test("the published November 2 batch is preserved exactly", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-02.json", import.meta.url))).cards;
  assert.equal(batch.length, 2);
  for (const card of batch) {
    const source = Object.fromEntries(["id", "sourceUrl", "positionType", "institution", "ssd", "location"].map(key => [key, card[key]]));
    Object.assign(source, card.original);
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source, ...card.proposal });
  }
});

test("the urgent homepage batch covers all six reviewed sources", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-03-home.json", import.meta.url))).cards;
  assert.equal(batch.length, 6);
  for (const card of batch) {
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.source.id), card);
    assert.ok(card.title.length < 90);
    assert.doesNotMatch(card.title, /procedura|selezione pubblica/i);
  }
});

test("a resolved duplicate warning invalidates the duplicate-specific summary", () => {
  const review = reviewedCardCopy.find(review => review.source.id === "mur-research-contracts-319575");
  const changed = { ...review.source, possibleDuplicateOf: undefined };
  assert.equal(positionCardPresentation(changed).summary, changed.summary);
});

test("November 6 recovery batch matches source and preserves restricted eligibility", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-06.json", import.meta.url))).cards;
  assert.equal(batch.length, 10);
  for (const card of batch) {
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source: card.source, ...card.proposal });
  }
  const restricted = batch.find(card => card.id === "mur-doctorates-319080");
  assert.match(restricted.proposal.title, /posti riservati/);
  assert.match(restricted.proposal.summary, /Due posizioni riservate ai dipendenti/);
});

test("changed source content or context disables editorial copy", () => {
  const original = reviewedCardCopy[0].source;
  for (const key of Object.keys(original)) {
    const changed = { ...original, [key]: `${original[key]} updated` };
    const shown = positionCardPresentation(changed, "Contextual fallback");
    assert.equal(shown.title, "Contextual fallback", key);
    assert.deepEqual(shown.topic, positionTopicPresentation(changed.title, changed.summary), key);
  }
});

test("unreviewed positions preserve the existing presentation", () => {
  const position = { id: "not-reviewed", title: "Official title", summary: "Original description" };
  assert.deepEqual(positionCardPresentation(position, "Contextual heading"), {
    title: "Contextual heading",
    summary: position.summary,
    topic: positionTopicPresentation(position.title, position.summary)
  });
});

test("November 3 keyboard-day batch is preserved exactly", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-03.json", import.meta.url))).cards;
  for (const card of batch) {
    const source = Object.fromEntries(["id", "sourceUrl", "positionType", "institution", "ssd", "location"].map(key => [key, card[key]]));
    Object.assign(source, card.original);
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source, ...card.proposal });
  }
});

test("priority batch matches its registry and both discovery surfaces reuse guarded copy", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-04.json", import.meta.url))).cards;
  assert.equal(batch.length, 10);
  for (const card of batch) assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source: card.source, ...card.proposal });
  const detail = readFileSync(new URL("../app/positions/[id]/page.tsx", import.meta.url), 'utf8');
  const landing = readFileSync(new URL("../app/(seo)/[...slug]/page.tsx", import.meta.url), 'utf8');
  assert.match(detail, /positionCardPresentation\(item, positionTitleContext\(item, openPositions\)\.heading\)\.title/);
  assert.match(landing, /positionCardPresentation\(position, positionTitleContext\(position, openPositions\)\.heading\)\.title/);
  assert.match(landing, /positionCardPresentation\(position\)\.summary/);
});

test("November 7 copy matches its review registry and uses matching source fields", () => {
  const batch = JSON.parse(readFileSync(new URL("../docs/growth/copy-review-2026-11-07.json", import.meta.url))).cards;
  assert.ok(batch.length > 0 && batch.length <= 10);
  for (const card of batch) {
    const record = positions.find(position => position.id === card.id);
    assert.ok(record, card.id);
    const source = applyVerifiedPositionEnrichment(record);
    for (const [key, value] of Object.entries(card.source)) assert.equal(source[key], value, `${card.id}:${key}`);
    assert.deepEqual(reviewedCardCopy.find(review => review.source.id === card.id), { source: card.source, ...card.proposal });
    assert.equal(positionCardPresentation(source).title, card.proposal.title);
    assert.equal(positionCardPresentation(source).summary, card.proposal.summary);
  }
});
