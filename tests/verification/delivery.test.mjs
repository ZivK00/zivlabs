import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyCandidate } from '../../packages/verification/src/verifier.mjs';
import { decideDelivery } from '../../packages/delivery/src/delivery-gate.mjs';

test('verification requires an explicit passing check and a declared change', () => {
  assert.equal(verifyCandidate({ changedFiles: [] }, { command: 'npm test', passed: true }).verdict, 'FAIL');
  assert.equal(verifyCandidate({ changedFiles: ['a.md'] }, { command: 'npm test', passed: true }).verdict, 'PASS');
});

test('delivery is refused for nonpassing verification or stale handoff', () => {
  const route = { decision: 'ROUTE' };
  const handoff = { sourceRevision: 'r1' };
  assert.equal(decideDelivery({ route, handoff, currentRevision: 'r1', verification: { verdict: 'FAIL' } }).state, 'DENIED');
  assert.equal(decideDelivery({ route, handoff, currentRevision: 'r2', verification: { verdict: 'PASS' } }).reason, 'STALE_HANDOFF');
  assert.equal(decideDelivery({ route, handoff, currentRevision: 'r1', verification: { verdict: 'PASS' } }).state, 'ALLOWED');
});
