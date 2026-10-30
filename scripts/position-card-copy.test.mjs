import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { positionCardPresentation, reviewedCardCopy } from "../lib/position-card-copy.mjs";
import { applyVerifiedPositionEnrichment } from "../lib/verified-position-enrichments.mjs";
import { positionTopicPresentation } from "../lib/position-topic.mjs";
import { positionTitleContext } from "../lib/position-title-context.mjs";

const positions = JSON.parse(readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url)));

test("the approved pilot contains exactly ten unique records", () => {
  assert.equal(reviewedCardCopy.length, 10);
  assert.equal(new Set(reviewedCardCopy.map(({ source }) => source.id)).size, 10);
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
