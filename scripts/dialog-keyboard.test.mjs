import test from 'node:test';
import assert from 'node:assert/strict';
import { activateDialogKeyboard } from '../lib/dialog-keyboard.mjs';
import { readFileSync } from 'node:fs';

function setup() {
  const listeners = new Map();
  const doc = { activeElement: null, addEventListener: (k, f) => listeners.set(k, f), removeEventListener: (k, f) => { assert.equal(listeners.get(k), f); listeners.delete(k); } };
  const element = () => ({ isConnected: true, getClientRects: () => [1], focus() { doc.activeElement = this; } });
  const trigger = element();
  const close = element(), detail = element(), source = element();
  const items = [close, detail, source];
  const dialog = { ownerDocument: doc, querySelectorAll: () => items, contains: el => items.includes(el), focus() { doc.activeElement = this; } };
  let closed = 0;
  const cleanup = activateDialogKeyboard(dialog, trigger, () => closed++);
  function key(value, shiftKey = false) {
    const event = { key: value, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
    listeners.get('keydown')?.(event);
    return event.prevented;
  }
  return { doc, trigger, close, detail, source, items, dialog, listeners, cleanup, key, closed: () => closed };
}

test('focus enters the close button and cleanup restores the trigger and removes the listener', () => {
  const s = setup(); assert.equal(s.doc.activeElement, s.close);
  s.cleanup(); assert.equal(s.doc.activeElement, s.trigger); assert.equal(s.listeners.size, 0);
});
test('Escape closes and unrelated keys do not interfere', () => {
  const s = setup(); assert.equal(s.key('Enter'), false); assert.equal(s.closed(), 0);
  assert.equal(s.key('Escape'), true); assert.equal(s.closed(), 1);
});
test('Tab and Shift+Tab wrap at the dialog boundaries, not in the middle', () => {
  const s = setup(); assert.equal(s.key('Tab', true), true); assert.equal(s.doc.activeElement, s.source);
  assert.equal(s.key('Tab'), true); assert.equal(s.doc.activeElement, s.close);
  s.detail.focus(); assert.equal(s.key('Tab'), false); assert.equal(s.key('Tab', true), false);
});
test('missing source link and focus outside the dialog remain safely bounded', () => {
  const s = setup(); s.items.pop(); s.detail.focus(); assert.equal(s.key('Tab'), true); assert.equal(s.doc.activeElement, s.close);
  s.trigger.focus(); assert.equal(s.key('Tab', true), true); assert.equal(s.doc.activeElement, s.detail);
});
test('hidden controls are skipped and empty dialogs and detached triggers are safe', () => {
  const s = setup(); s.source.getClientRects = () => []; s.detail.focus();
  assert.equal(s.key('Tab'), true); assert.equal(s.doc.activeElement, s.close);
  s.items.length = 0; assert.equal(s.key('Tab'), true); assert.equal(s.doc.activeElement, s.dialog);
  s.trigger.isConnected = false; s.cleanup(); assert.equal(s.doc.activeElement, s.dialog);
});

test('share dialog wires guarded focus only after mount without changing the copy action', () => {
  const component = readFileSync(new URL('../app/components/NextBestActions.tsx', import.meta.url), 'utf8');
  assert.match(component, /activateDialogKeyboard\(shareDialogRef.current, shareTriggerRef.current, \(\) => setShareOpen\(false\)\)/);
  assert.match(component, /ref=\{shareTriggerRef\}/);
  assert.match(component, /ref=\{shareDialogRef\} tabIndex=\{-1\}/);
  assert.match(component, /onClick=\{copyShareLink\}/);
  assert.match(component, /navigator.clipboard.writeText\(shareUrl\)/);
});
