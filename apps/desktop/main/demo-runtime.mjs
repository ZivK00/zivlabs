import { MemoryRunStore } from '../../../packages/persistence/src/run-store.mjs';

export function createDesktopRuntime(store = new MemoryRunStore()) {
  return Object.freeze({
    persistMission(mission) {
      store.saveThread({ id: mission.handoff.threadId, projectId: mission.handoff.projectId, updatedAt: mission.handoff.createdAt });
      store.saveHandoff(mission.handoff);
      store.saveRun({ id: mission.handoff.threadId, status: mission.delivery.state, route: mission.route.lane ?? null, evidence: mission.verification.evidence });
      for (const [provider, health] of Object.entries(mission.providerHealth ?? {})) store.saveProviderState({ provider, ...health });
      return store.snapshot();
    },
  });
}
