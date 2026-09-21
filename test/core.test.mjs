import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHandoff,
  decideDelivery,
  routeTask,
  verifyCandidate,
} from '../src/index.mjs';

const task = { id: 'change-1', requiredCapabilities: ['fileEdit', 'verification'], executionSurface: 'WSL2' };
const worker = { id: 'worker-1', available: true, trustedForWrites: true, executionSurface: 'WSL2', capabilities: ['fileEdit', 'verification'] };
const handoff = createHandoff({ taskId: task.id, sourceRevision: 'r1', nextAction: 'Make a bounded change.', observedAt: '2026-01-01T00:00:00.000Z' });

test('routes only to a capable trusted worker on the requested surface', () => {
  assert.deepEqual(routeTask(task, [worker]), { decision: 'ROUTE', taskId: 'change-1', workerId: 'worker-1', executionSurface: 'WSL2' });
});

test('fails closed when the capable worker is unavailable or untrusted', () => {
  assert.equal(routeTask(task, [{ ...worker, available: false }]).decision, 'DENY');
  assert.equal(routeTask(task, [{ ...worker, trustedForWrites: false }]).decision, 'DENY');
});

test('does not allow delivery for stale planning context', () => {
  const route = routeTask(task, [worker]);
  const receipt = verifyCandidate({ taskId: task.id, changedFiles: ['src/a.mjs'], declaredCheck: { command: 'npm test', passed: true } });
  assert.deepEqual(decideDelivery(route, handoff, receipt, 'r2'), { allowed: false, reason: 'STALE_HANDOFF' });
});

test('does not accept model-shaped prose without a diff and a passing declared check', () => {
  const route = routeTask(task, [worker]);
  const receipt = verifyCandidate({ taskId: task.id, changedFiles: [], declaredCheck: { command: 'npm test', passed: true } });
  assert.equal(receipt.verified, false);
  assert.deepEqual(decideDelivery(route, handoff, receipt, 'r1'), { allowed: false, reason: 'EVIDENCE_INCOMPLETE' });
});
