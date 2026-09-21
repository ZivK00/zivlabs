import { routeTask } from '../packages/agentlane/src/route.mjs';
import { LANE_CATALOG } from '../packages/agentlane/src/catalog.mjs';

const task = { id: 'write-demo', capabilities: ['fileEdit', 'verification'] };
const healthy = routeTask(task, LANE_CATALOG, { openai: { status: 'AVAILABLE' } });
const unavailable = routeTask(task, LANE_CATALOG, { openai: { status: 'QUOTA_EXHAUSTED' } });
console.log(JSON.stringify({ trustedSurface: healthy, quotaUnavailable: unavailable, disclaimer: 'Policy demonstration only; no worker is invoked.' }, null, 2));
