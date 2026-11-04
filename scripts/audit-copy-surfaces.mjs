import fs from 'node:fs';
import assert from 'node:assert/strict';
import { reviewedCardCopy } from '../lib/position-card-copy.mjs';
const day = process.argv[2];
assert.match(day ?? '', /^\d{4}-\d{2}-\d{2}$/);
const queue = JSON.parse(fs.readFileSync(`docs/growth/copy-queue-${day}.json`, 'utf8'));
const items = new Map(queue.items.map(item => [item.id, item]));
const reviews = new Map(reviewedCardCopy.map(review => [review.source.id, review]));
const decode = text => text.replace(/<!--.*?-->/gs, '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
let checked = 0;
for (const [surface, ids] of Object.entries(queue.surfaces)) {
  const path = surface === 'home' ? '/' : surface.startsWith('related:') ? `/positions/${surface.slice(8)}/` : `${surface}/`;
  const html = fs.readFileSync(`out${path}index.html`, 'utf8');
  const scope = surface.startsWith('related:') ? html.split('id="related-opportunities-title"')[1]?.split('</section>')[0] ?? '' : html;
  const links = [...scope.matchAll(/<a\b([^>]*?)>(.*?)<\/a>/gs)].map(([, attributes, content]) => ({ href: attributes.match(/href="([^"]+)"/)?.[1], text: decode(content) }));
  for (const id of ids) {
    const item = items.get(id);
    if (!['revisionata', 'pubblicata'].includes(item.status)) continue;
    const link = links.find(link => link.href?.replace(/\/$/, '') === `/positions/${id}`);
    assert.ok(link, `Missing ${id} on ${surface}`);
    assert.ok(link.text.includes(reviews.get(id).title), `Stale title ${id} on ${surface}`);
    checked++;
  }
}
console.log(JSON.stringify({ reviewedLinkOccurrencesChecked: checked, surfaces: Object.keys(queue.surfaces).length, errors: 0 }));
