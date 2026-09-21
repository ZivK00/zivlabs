export function createHandoff({ taskId, sourceRevision, nextAction, observedAt }) {
  if (!taskId || !sourceRevision || !nextAction || !observedAt) {
    throw new Error('A handoff must be task-bound, source-bound, and actionable.');
  }
  return Object.freeze({ taskId, sourceRevision, nextAction, observedAt });
}

export function isCurrentHandoff(handoff, currentRevision) {
  return handoff.sourceRevision === currentRevision;
}
