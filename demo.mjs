import {
  createHandoff,
  decideDelivery,
  routeTask,
  verifyCandidate,
} from './src/index.mjs';

const task = {
  id: 'demo-readme-adjustment',
  requiredCapabilities: ['fileEdit', 'verification'],
  executionSurface: 'WSL2',
};

const workers = [{
  id: 'sample-worker',
  provider: 'sample',
  executionSurface: 'WSL2',
  trustedForWrites: true,
  available: true,
  capabilities: ['fileEdit', 'verification'],
}];

const route = routeTask(task, workers);
const handoff = createHandoff({
  taskId: task.id,
  sourceRevision: 'demo-revision-1',
  nextAction: 'Adjust one documented example.',
  observedAt: new Date().toISOString(),
});
const receipt = verifyCandidate({
  taskId: task.id,
  changedFiles: ['README.md'],
  declaredCheck: { command: 'npm test', passed: true },
});
const delivery = decideDelivery(route, handoff, receipt, 'demo-revision-1');

console.log(JSON.stringify({ route, handoff, receipt, delivery }, null, 2));
