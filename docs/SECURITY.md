# Security boundaries

This package is a policy core, not a sandbox. A host must establish process and
filesystem isolation before it marks a worker trusted for writes.

- Trust is bound to an execution surface, not just a provider name.
- Workers that cannot demonstrate confinement remain ineligible for writes.
- A route denial is a successful safe outcome; callers should not substitute a
  less-isolated worker automatically.
- A symbolic-link escape and a direct external-path escape must both be tested
  by the host's confinement canary.
- Linux-on-Windows hosts must treat mounted Windows paths as external targets
  unless an isolation design proves otherwise.
- Handoffs expire when their source revision changes.
- Model prose is never evidence of a change. Delivery requires independently
  collected diff and verification receipts.

The demo exposes no provider connection, filesystem mutation, credential read,
or shell execution path.
