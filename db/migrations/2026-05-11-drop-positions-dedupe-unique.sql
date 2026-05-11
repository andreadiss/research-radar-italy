-- Allow official MUR records with the same dedupe key to remain visible.
-- dedupe_key is a grouping/review signal, not a hard uniqueness constraint.

ALTER TABLE positions
  DROP CONSTRAINT IF EXISTS positions_dedupe_key_key;

CREATE INDEX IF NOT EXISTS positions_dedupe_key_idx
  ON positions(dedupe_key);
