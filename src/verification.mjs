export function verifyCandidate({ taskId, changedFiles, declaredCheck }) {
  const hasDiff = Array.isArray(changedFiles) && changedFiles.length > 0;
  const checkPassed = declaredCheck?.passed === true && typeof declaredCheck.command === 'string' && declaredCheck.command.length > 0;
  return Object.freeze({
    taskId,
    verified: hasDiff && checkPassed,
    evidence: {
      changedFiles: hasDiff ? [...changedFiles] : [],
      declaredCheck: checkPassed ? { ...declaredCheck } : null,
    },
  });
}
