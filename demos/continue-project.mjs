import { resolveProjectAction } from '../packages/contextforge/src/grounding.mjs';
import { runDeterministicMission } from '../packages/zivlabs/src/orchestrator.mjs';
import { demoInput } from './scenario.mjs';

const grounding = resolveProjectAction({
  project: { id: demoInput.projectId },
  action: { nextAction: demoInput.action, sourceRevision: demoInput.revision, verifier: demoInput.declaredCheck.command },
  currentRevision: demoInput.revision,
});
const mission = grounding.decision === 'ACTION' ? runDeterministicMission(demoInput) : null;
console.log(JSON.stringify({ grounding, route: mission?.route, verification: mission?.verification, delivery: mission?.delivery }, null, 2));
