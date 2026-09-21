export const demoInput = Object.freeze({
  intent: 'Continue the sample project with its declared action.',
  threadId: 'thread-demo-1',
  projectId: 'sample-project',
  revision: 'sample-revision-2',
  action: 'Update the documented sample contract.',
  createdAt: '2026-01-01T00:00:00.000Z',
  contextBudget: 640,
  sources: [
    { id: 'project-state', provenance: 'sample/project-state', priority: 10, content: 'Project is active. Current action is documentation contract update.' },
    { id: 'thread-summary', provenance: 'sample/thread-summary', priority: 8, content: 'Planner requested a bounded implementation followed by a declared check.' },
  ],
  task: { id: 'sample-task-1', capabilities: ['analysis', 'fileEdit', 'verification'], kind: 'code_change' },
  providerHealth: { ollama: { status: 'AVAILABLE' }, openai: { status: 'AVAILABLE' }, anthropic: { status: 'AVAILABLE' } },
  surface: { id: 'demo-wsl', kind: 'wsl2', trustedForWrites: true, evidence: 'PASS' },
  declaredCheck: { command: 'npm test', passed: true },
});
