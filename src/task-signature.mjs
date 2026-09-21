export function createTaskSignature({ id, requiredCapabilities, executionSurface }) {
  if (!id || !Array.isArray(requiredCapabilities) || requiredCapabilities.length === 0) {
    throw new Error('A task needs an id and at least one required capability.');
  }
  return Object.freeze({
    id,
    requiredCapabilities: [...new Set(requiredCapabilities)].sort(),
    executionSurface: executionSurface ?? null,
  });
}
