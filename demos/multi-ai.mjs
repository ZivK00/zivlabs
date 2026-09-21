import { runDeterministicMission } from '../packages/zivlabs/src/orchestrator.mjs';
import { createDesktopRuntime } from '../apps/desktop/main/demo-runtime.mjs';
import { demoInput } from './scenario.mjs';

const mission = runDeterministicMission(demoInput);
const persisted = createDesktopRuntime().persistMission(mission);
console.log(JSON.stringify({
  intent: mission.intent,
  planner: 'ollama/local analysis context',
  selectedProvider: mission.route.provider,
  handoff: mission.handoff,
  candidate: mission.candidate,
  verification: mission.verification,
  delivery: mission.delivery,
  persisted,
  disclaimer: 'Deterministic demonstration only. No provider, shell, or filesystem call was made.',
}, null, 2));
