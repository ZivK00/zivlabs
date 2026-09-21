import test from 'node:test';
import assert from 'node:assert/strict';
import { executeDemoWorker } from '../../packages/execution/src/worker.mjs';

test('execution refuses a write without a passing trust receipt', () => {
  const execution = executeDemoWorker({ route: { decision: 'ROUTE', task: { capabilities: ['fileEdit'] } }, handoff: { nextAction: 'x' }, surface: { trustedForWrites: false, evidence: 'FAIL' } });
  assert.deepEqual(execution, { status: 'NOT_STARTED', reason: 'UNTRUSTED_EXECUTION_SURFACE' });
});

test('execution produces a declared candidate only after trusted routing and evidence', () => {
  const execution = executeDemoWorker({ route: { decision: 'ROUTE', task: { capabilities: ['fileEdit'] }, provider: 'openai', lane: 'codex-isolated' }, handoff: { nextAction: 'x' }, surface: { trustedForWrites: true, evidence: 'PASS' } });
  assert.equal(execution.status, 'CANDIDATE');
  assert.deepEqual(execution.changedFiles, ['example/project-note.md']);
});
