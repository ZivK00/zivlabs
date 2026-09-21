import test from 'node:test';
import assert from 'node:assert/strict';
import { eligibleProviders, providerStatus } from '../../packages/providers/src/registry.mjs';

test('provider registry treats quota and outages as unavailable for routing', () => {
  const providers = [
    { provider: 'local', status: 'AVAILABLE' },
    { provider: 'frontier', status: 'QUOTA_EXHAUSTED' },
    { provider: 'other', status: 'UNAVAILABLE' },
  ];
  assert.deepEqual(eligibleProviders(providers), ['local']);
  assert.equal(providerStatus(providers[1]).status, 'QUOTA_EXHAUSTED');
  assert.equal(providerStatus({ provider: 'missing' }).status, 'UNKNOWN');
});
