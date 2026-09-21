export function executionSurface(input) {
  if (!input?.id || !input.kind) throw new Error('Execution surface id and kind are required.');
  return Object.freeze({ id: input.id, kind: input.kind, trustedForWrites: input.trustedForWrites === true, evidence: input.evidence ?? 'UNVERIFIED' });
}

export function executeDemoWorker({ route, handoff, surface }) {
  if (route.decision !== 'ROUTE') return Object.freeze({ status: 'NOT_STARTED', reason: 'ROUTE_BLOCKED' });
  if (route.task.capabilities.includes('fileEdit') && (!surface.trustedForWrites || surface.evidence !== 'PASS')) {
    return Object.freeze({ status: 'NOT_STARTED', reason: 'UNTRUSTED_EXECUTION_SURFACE' });
  }
  return Object.freeze({
    status: 'CANDIDATE', provider: route.provider, lane: route.lane,
    changedFiles: ['example/project-note.md'],
    summary: `Deterministic demo candidate for: ${handoff.nextAction}`,
  });
}
