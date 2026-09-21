import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryRunStore } from '../../packages/persistence/src/run-store.mjs';

test('persistence abstraction snapshots runs, threads, handoffs, and provider state', () => {
  const store = new MemoryRunStore();
  store.saveRun({ id: 'run-1', status: 'PASS' });
  store.saveThread({ id: 'thread-1', currentAction: 'verify' });
  store.saveHandoff({ threadId: 'thread-1', status: 'FRESH' });
  store.saveProviderState({ provider: 'openai', status: 'AVAILABLE' });
  const snapshot = store.snapshot();
  assert.equal(snapshot.runs[0].id, 'run-1');
  assert.equal(snapshot.threads[0].currentAction, 'verify');
  assert.equal(snapshot.handoffs[0].threadId, 'thread-1');
  assert.equal(snapshot.providerStates[0].status, 'AVAILABLE');
});
