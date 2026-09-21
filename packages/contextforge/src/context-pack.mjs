import { assert, unique } from '../../shared/src/contracts.mjs';

const secretPattern = /(?:api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret)\s*[=:]\s*[^\s,;]+/gi;
const redact = (text) => text.replace(secretPattern, '[REDACTED]');

export function buildContextPack({ objective, budgetBytes, sources }) {
  assert(objective, 'An objective is required.');
  assert(Number.isSafeInteger(budgetBytes) && budgetBytes > 0, 'Budget must be a positive integer.');
  const selected = [];
  let used = 0;
  for (const source of [...sources].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))) {
    if (!source?.id || !source?.provenance || typeof source.content !== 'string') continue;
    const safe = redact(source.content);
    const left = budgetBytes - used;
    if (left <= 0) break;
    const emitted = safe.slice(0, left);
    if (!emitted) continue;
    selected.push(Object.freeze({ id: source.id, provenance: source.provenance, emittedBytes: Buffer.byteLength(emitted), truncated: emitted.length < safe.length, content: emitted }));
    used += Buffer.byteLength(emitted);
  }
  return Object.freeze({
    objective,
    budgetBytes,
    totalBytes: used,
    sources: selected,
    provenance: unique(selected.map((source) => source.provenance)),
    text: selected.map((source) => `## ${source.id}\n${source.content}`).join('\n\n'),
  });
}
