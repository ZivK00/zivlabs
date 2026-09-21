export function resolveProjectAction({ project, action, currentRevision }) {
  if (!project?.id || !currentRevision) return Object.freeze({ decision: 'CLARIFY', reason: 'PROJECT_OR_REVISION_MISSING' });
  if (!action?.nextAction) return Object.freeze({ decision: 'CLARIFY', reason: 'NO_CURRENT_ACTION' });
  if (action.completed === true) return Object.freeze({ decision: 'CLARIFY', reason: 'ACTION_ALREADY_COMPLETED' });
  if (action.sourceRevision !== currentRevision) return Object.freeze({ decision: 'REGROUND', reason: 'ACTION_STALE' });
  return Object.freeze({ decision: 'ACTION', projectId: project.id, objective: action.nextAction, verifier: action.verifier ?? null });
}
