import { createTaskSignature } from './task-signature.mjs';

const supports = (worker, task) => task.requiredCapabilities.every((capability) => worker.capabilities.includes(capability));

export function routeTask(rawTask, workers) {
  const task = createTaskSignature(rawTask);
  const eligible = workers.filter((worker) =>
    worker.available === true
    && worker.trustedForWrites === true
    && supports(worker, task)
    && (task.executionSurface === null || worker.executionSurface === task.executionSurface),
  );

  if (eligible.length === 0) {
    return Object.freeze({ decision: 'DENY', reason: 'NO_TRUSTED_CAPABLE_WORKER', taskId: task.id });
  }

  const [worker] = eligible.sort((left, right) => left.id.localeCompare(right.id));
  return Object.freeze({ decision: 'ROUTE', taskId: task.id, workerId: worker.id, executionSurface: worker.executionSurface });
}
