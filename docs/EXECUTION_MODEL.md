# Execution model

Execution is an adapter boundary, not a provider SDK call. A host describes an
execution surface with an id, kind, write-trust boolean, and evidence status.
`executeDemoWorker` is intentionally non-mutating: it demonstrates how a route
and surface are evaluated and returns a fixture candidate only after the trust
conditions pass.

For a real worker integration, replace the demo adapter with one that:

1. creates an isolated workspace and records its revision;
2. launches the worker with least privilege and controlled environment;
3. captures a deterministic changed-file receipt and independent checks;
4. refuses delivery on cancellation, timeout, route change, stale handoff, or
   incomplete evidence;
5. destroys or archives the isolated workspace under a documented retention
   policy.

The selected execution surface is part of the trust identity. A provider that
is acceptable on one surface does not become write-trusted on another surface
without a fresh confinement proof.
