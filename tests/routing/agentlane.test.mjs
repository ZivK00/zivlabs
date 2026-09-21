import test from 'node:test';
import assert from 'node:assert/strict';
import { LANE_CATALOG } from '../../packages/agentlane/src/catalog.mjs';
import { requestEscalation, routeTask } from '../../packages/agentlane/src/route.mjs';

test('AgentLane selects the least-cost healthy lane that satisfies read-only work', () => {
  const route = routeTask(
    { id: 'read-1', capabilities: ['analysis', 'context'] }, LANE_CATALOG,
    { ollama: { status: 'AVAILABLE' }, openai: { status: 'AVAILABLE' }, anthropic: { status: 'AVAILABLE' } },
  );
  assert.equal(route.decision, 'ROUTE');
  assert.equal(route.lane, 'local-analysis');
});

test('AgentLane requires a trusted lane for editing work', () => {
  const route = routeTask(
    { id: 'write-1', capabilities: ['fileEdit', 'verification'] }, LANE_CATALOG,
    { ollama: { status: 'AVAILABLE' }, openai: { status: 'AVAILABLE' }, anthropic: { status: 'AVAILABLE' } },
  );
  assert.equal(route.decision, 'ROUTE');
  assert.equal(route.lane, 'codex-isolated');
  assert.equal(route.surface, 'wsl2');
});

test('AgentLane fails closed when the only qualified provider is unavailable', () => {
  const route = routeTask(
    { id: 'write-2', capabilities: ['fileEdit'] }, LANE_CATALOG,
    { ollama: { status: 'AVAILABLE' }, openai: { status: 'QUOTA_EXHAUSTED' }, anthropic: { status: 'AVAILABLE' } },
  );
  assert.equal(route.decision, 'BLOCKED');
  assert.equal(route.reason, 'NO_TRUSTED_CAPABLE_LANE');
});

test('AgentLane excludes rate-limited providers from a write route', () => {
  const route = routeTask(
    { id: 'write-3', capabilities: ['fileEdit'] }, LANE_CATALOG,
    { openai: { status: 'RATE_LIMITED' } },
  );
  assert.equal(route.decision, 'BLOCKED');
});

test('protected work cannot be escalated without an explicit policy', () => {
  const protectedRoute = routeTask({ id: 'protected-1', capabilities: ['analysis'], protected: true }, LANE_CATALOG, {});
  const result = requestEscalation(protectedRoute, { allowProtected: false });
  assert.equal(result.decision, 'DENY');
});
