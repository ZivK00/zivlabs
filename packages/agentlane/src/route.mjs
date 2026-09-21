import { assert, unique } from '../../shared/src/contracts.mjs';

const writable = (signature) => signature.capabilities.includes('fileEdit');

export function createTaskSignature(input) {
  assert(input?.id, 'Task id is required.');
  assert(Array.isArray(input.capabilities) && input.capabilities.length > 0, 'At least one capability is required.');
  return Object.freeze({
    id: input.id,
    kind: input.kind ?? 'code_change',
    capabilities: unique(input.capabilities).sort(),
    contextBudget: input.contextBudget ?? 12_000,
    protected: input.protected === true,
  });
}

export function routeTask(rawSignature, lanes, healthByProvider = {}) {
  const signature = createTaskSignature(rawSignature);
  const candidates = lanes
    .filter((lane) => !healthByProvider[lane.provider] || healthByProvider[lane.provider].status === 'AVAILABLE')
    .filter((lane) => signature.capabilities.every((capability) => lane.capabilities.includes(capability)))
    .filter((lane) => !writable(signature) || lane.trustedForWrites)
    .sort((left, right) => left.cost - right.cost || left.id.localeCompare(right.id));

  const selected = candidates[0];
  if (!selected) {
    return Object.freeze({
      decision: 'BLOCKED', task: signature, reason: 'NO_TRUSTED_CAPABLE_LANE', rejected: lanes.map((lane) => lane.id),
    });
  }
  return Object.freeze({
    decision: 'ROUTE', task: signature, lane: selected.id, provider: selected.provider,
    surface: selected.surface, reason: 'LOWEST_COST_HEALTHY_TRUSTED_CAPABLE_LANE',
    fallback: candidates.slice(1).map((lane) => lane.id),
  });
}

export function requestEscalation(route, policy = { allowProtected: false }) {
  if (route.decision !== 'ROUTE' || !route.task.protected || policy.allowProtected !== true) {
    return Object.freeze({ decision: 'DENY', reason: 'PROTECTED_LANE_REQUIRES_EXPLICIT_ADMISSION' });
  }
  return Object.freeze({ decision: 'REQUEST_ADMISSION', taskId: route.task.id });
}
