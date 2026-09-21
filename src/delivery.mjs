import { isCurrentHandoff } from './continuation.mjs';

export function decideDelivery(route, handoff, receipt, currentRevision) {
  if (route.decision !== 'ROUTE') return Object.freeze({ allowed: false, reason: 'ROUTE_DENIED' });
  if (!isCurrentHandoff(handoff, currentRevision)) return Object.freeze({ allowed: false, reason: 'STALE_HANDOFF' });
  if (receipt.verified !== true) return Object.freeze({ allowed: false, reason: 'EVIDENCE_INCOMPLETE' });
  return Object.freeze({ allowed: true, reason: 'VERIFIED_AND_CURRENT' });
}
