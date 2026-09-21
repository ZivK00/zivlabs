const valid = new Set(['AVAILABLE', 'RATE_LIMITED', 'QUOTA_EXHAUSTED', 'UNAVAILABLE', 'UNKNOWN', 'DISABLED']);

export function providerStatus(input) {
  const status = input?.status ?? 'UNKNOWN';
  if (!valid.has(status)) throw new Error(`Unsupported provider status: ${status}`);
  return Object.freeze({
    provider: input.provider,
    adapter: input.adapter,
    status,
    surface: input.surface,
    checkedAt: input.checkedAt ?? null,
    detail: input.detail ?? null,
  });
}

export function eligibleProviders(statuses) {
  return statuses.filter((entry) => entry.status === 'AVAILABLE').map((entry) => entry.provider);
}

export const DEMO_PROVIDERS = Object.freeze([
  { provider: 'ollama', adapter: 'local-demo', surface: 'local', status: 'AVAILABLE' },
  { provider: 'openai', adapter: 'codex-demo', surface: 'wsl2', status: 'AVAILABLE' },
  { provider: 'anthropic', adapter: 'claude-demo', surface: 'isolated-host', status: 'AVAILABLE' },
]);
