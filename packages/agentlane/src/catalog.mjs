export const LANE_CATALOG = Object.freeze([
  {
    id: 'local-analysis', provider: 'ollama', surface: 'local', cost: 0,
    capabilities: ['analysis', 'context'], trustedForWrites: false,
  },
  {
    id: 'codex-isolated', provider: 'openai', surface: 'wsl2', cost: 3,
    capabilities: ['analysis', 'fileEdit', 'verification', 'context'], trustedForWrites: true,
  },
  {
    id: 'claude-review', provider: 'anthropic', surface: 'isolated-host', cost: 4,
    capabilities: ['analysis', 'review', 'context'], trustedForWrites: false,
  },
]);
