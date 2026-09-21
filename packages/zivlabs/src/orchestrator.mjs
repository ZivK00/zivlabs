import { LANE_CATALOG } from '../../agentlane/src/catalog.mjs';
import { routeTask } from '../../agentlane/src/route.mjs';
import { buildContextPack } from '../../contextforge/src/context-pack.mjs';
import { createHandoff } from '../../contextforge/src/continuity.mjs';
import { executionSurface, executeDemoWorker } from '../../execution/src/worker.mjs';
import { verifyCandidate } from '../../verification/src/verifier.mjs';
import { decideDelivery } from '../../delivery/src/delivery-gate.mjs';

export function runDeterministicMission(input) {
  const context = buildContextPack({ objective: input.intent, budgetBytes: input.contextBudget ?? 4_000, sources: input.sources });
  const route = routeTask(input.task, LANE_CATALOG, input.providerHealth);
  const handoff = createHandoff({
    threadId: input.threadId, projectId: input.projectId, sourceRevision: input.revision,
    summary: context.text.slice(0, 300), nextAction: input.action, createdAt: input.createdAt,
  });
  const surface = executionSurface({ id: input.surface.id, kind: input.surface.kind, trustedForWrites: input.surface.trustedForWrites, evidence: input.surface.evidence });
  const candidate = executeDemoWorker({ route, handoff, surface });
  const verification = verifyCandidate(candidate, input.declaredCheck);
  const delivery = decideDelivery({ route, handoff, currentRevision: input.revision, verification });
  return Object.freeze({ intent: input.intent, context, route, handoff, candidate, verification, delivery, providerHealth: input.providerHealth });
}
