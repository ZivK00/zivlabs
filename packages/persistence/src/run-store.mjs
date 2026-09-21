import { clone } from '../../shared/src/contracts.mjs';

export class MemoryRunStore {
  #runs = new Map();
  #threads = new Map();
  #handoffs = new Map();
  #providerStates = new Map();

  saveRun(run) { this.#runs.set(run.id, clone(run)); return this.getRun(run.id); }
  getRun(id) { return this.#runs.has(id) ? clone(this.#runs.get(id)) : null; }
  saveThread(thread) { this.#threads.set(thread.id, clone(thread)); return clone(thread); }
  saveHandoff(handoff) { this.#handoffs.set(handoff.threadId, clone(handoff)); return clone(handoff); }
  getHandoff(threadId) { return this.#handoffs.has(threadId) ? clone(this.#handoffs.get(threadId)) : null; }
  saveProviderState(state) { this.#providerStates.set(state.provider, clone(state)); return clone(state); }
  snapshot() { return clone({ runs: [...this.#runs.values()], threads: [...this.#threads.values()], handoffs: [...this.#handoffs.values()], providerStates: [...this.#providerStates.values()] }); }
}
