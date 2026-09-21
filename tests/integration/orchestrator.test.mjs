import test from 'node:test';
import assert from 'node:assert/strict';
import { createDesktopRuntime } from '../../apps/desktop/main/demo-runtime.mjs';
import { renderWorkspaceShell } from '../../apps/desktop/renderer/shell.mjs';
import { runDeterministicMission } from '../../packages/zivlabs/src/orchestrator.mjs';
import { demoInput } from '../../demos/scenario.mjs';

test('full deterministic flow routes, grounds, verifies, delivers, and persists a mission', () => {
  const result = runDeterministicMission(demoInput);
  assert.equal(result.route.lane, 'codex-isolated');
  assert.equal(result.candidate.status, 'CANDIDATE');
  assert.equal(result.verification.verdict, 'PASS');
  assert.equal(result.delivery.state, 'ALLOWED');
  const runtime = createDesktopRuntime();
  const snapshot = runtime.persistMission(result);
  assert.equal(snapshot.runs.length, 1);
  assert.equal(snapshot.providerStates.length, 3);
});

test('desktop shell renders escaped deterministic state rather than executing it', () => {
  const html = renderWorkspaceShell({
    intent: '<unsafe>', route: { decision: 'ROUTE', provider: 'openai', surface: 'wsl2' },
    handoff: { nextAction: 'npm test' }, verification: { verdict: 'PASS' }, delivery: { state: 'ALLOWED' },
  });
  assert.match(html, /&lt;unsafe&gt;/);
  assert.doesNotMatch(html, /<unsafe>/);
});
