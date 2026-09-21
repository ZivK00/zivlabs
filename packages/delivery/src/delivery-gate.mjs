import { handoffFresh } from '../../contextforge/src/continuity.mjs';

export function decideDelivery({ route, handoff, currentRevision, verification }) {
  if (route.decision !== 'ROUTE') return Object.freeze({ state: 'DENIED', reason: 'ROUTE_BLOCKED' });
  if (!handoffFresh(handoff, currentRevision)) return Object.freeze({ state: 'DENIED', reason: 'STALE_HANDOFF' });
  if (verification.verdict !== 'PASS') return Object.freeze({ state: 'DENIED', reason: 'VERIFICATION_FAILED' });
  return Object.freeze({ state: 'ALLOWED', reason: 'VERIFIED_CURRENT_CANDIDATE' });
}
