import { renderWorkspaceShell } from '../apps/desktop/renderer/shell.mjs';
import { demoInput } from './scenario.mjs';
import { runDeterministicMission } from '../packages/zivlabs/src/orchestrator.mjs';

const mission = runDeterministicMission(demoInput);
console.log(renderWorkspaceShell(mission));
