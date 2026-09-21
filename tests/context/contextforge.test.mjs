import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContextPack } from '../../packages/contextforge/src/context-pack.mjs';
import { resolveProjectAction } from '../../packages/contextforge/src/grounding.mjs';
import { createHandoff, handoffFresh } from '../../packages/contextforge/src/continuity.mjs';

test('ContextForge bounds a pack, records provenance, and redacts credential-shaped text', () => {
  const pack = buildContextPack({
    objective: 'Verify a bounded context pack.',
    budgetBytes: 120,
    sources: [
      { id: 'mission', provenance: 'mission', priority: 10, content: 'Deliver a verified change.' },
      { id: 'secret', provenance: 'environment', priority: 9, content: 'api_key=replace-me' },
      { id: 'later', provenance: 'history', priority: 1, content: 'This source is too low priority.' },
    ],
  });
  assert.ok(pack.totalBytes <= 120);
  assert.equal(pack.provenance[0], 'mission');
  assert.match(pack.text, /\[REDACTED\]/);
  assert.doesNotMatch(pack.text, /replace-me/);
});

test('ContextForge grounds continuations and rejects stale or completed actions', () => {
  assert.equal(resolveProjectAction({}).decision, 'CLARIFY');
  assert.equal(resolveProjectAction({ project: { id: 'sample' }, action: { nextAction: 'x', completed: true }, currentRevision: 'r2' }).reason, 'ACTION_ALREADY_COMPLETED');
  assert.equal(resolveProjectAction({ project: { id: 'sample' }, action: { nextAction: 'x', sourceRevision: 'r1' }, currentRevision: 'r2' }).decision, 'REGROUND');
  assert.equal(resolveProjectAction({ project: { id: 'sample' }, action: { nextAction: 'x', sourceRevision: 'r1', verifier: 'npm test' }, currentRevision: 'r1' }).decision, 'ACTION');
});

test('handoff freshness is explicit and deterministic', () => {
  const handoff = createHandoff({ threadId: 'thread-1', projectId: 'sample', sourceRevision: 'r1', summary: 'Verify', nextAction: 'test', createdAt: '2026-01-01T00:00:00.000Z' });
  assert.equal(handoffFresh(handoff, 'r1'), true);
  assert.equal(handoffFresh(handoff, 'r2'), false);
});
