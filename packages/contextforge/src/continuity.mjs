import { assert } from '../../shared/src/contracts.mjs';

export function createHandoff({ threadId, projectId, sourceRevision, summary, nextAction, createdAt }) {
  for (const [name, value] of Object.entries({ threadId, projectId, sourceRevision, summary, nextAction, createdAt })) {
    assert(typeof value === 'string' && value.length > 0, `Handoff ${name} is required.`);
  }
  return Object.freeze({ threadId, projectId, sourceRevision, summary, nextAction, createdAt });
}

export const handoffFresh = (handoff, currentRevision) => handoff.sourceRevision === currentRevision;
