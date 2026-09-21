export function verifyCandidate(candidate, declaredCheck) {
  const changedFiles = Array.isArray(candidate?.changedFiles) ? candidate.changedFiles : [];
  const checkPassed = declaredCheck?.passed === true && typeof declaredCheck.command === 'string' && declaredCheck.command.length > 0;
  return Object.freeze({
    verdict: changedFiles.length > 0 && checkPassed ? 'PASS' : 'FAIL',
    evidence: { changedFiles: [...changedFiles], declaredCheck: checkPassed ? { ...declaredCheck } : null },
  });
}
