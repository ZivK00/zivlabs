# Security boundaries

ZivLabs is policy and orchestration code, not a sandbox implementation. A
host must establish isolation before submitting a trusted write surface to the
router.

## Fail-closed rules

- `fileEdit` work only routes to a lane marked trusted for writes.
- The execution surface must also present passing evidence; otherwise the
  worker returns `NOT_STARTED`.
- A quota-exhausted or unavailable provider is excluded before routing.
- A route denial is a safe outcome. Callers must not silently replace it with a
  weaker surface.
- Delivery requires a routed task, a handoff matching the current revision,
  changed-file evidence, and a passing declared check.
- Continuation actions are clarified or regrounded when missing, completed, or
  stale.

## Host confinement contract

Before declaring a surface write-trusted, the host needs an independently
collected receipt tied to the exact worker version and surface configuration.
Its canary must prove all of the following in the same environment:

1. a write inside the allowed isolated workspace succeeds;
2. a direct write outside that workspace is refused;
3. a symbolic-link or platform-equivalent indirection to an external target is
   refused;
4. both external targets remain byte-for-byte unchanged.

Mounted host paths visible from a Linux guest are external targets unless the
host proves an isolation design that denies them. A container or subsystem that
merely launches successfully is not a confinement proof.

## Data boundary

The repository intentionally contains deterministic sample inputs only. It
contains no credential acquisition, personal paths, session files, provider
authentication, database files, user conversations, project exports, or shell
adapter. Hosts should minimize context before it reaches a provider, redact
credential-shaped strings, use least-privilege process credentials, and define
their own retention policy.

To report a security issue, use GitHub's private reporting mechanism if it is
enabled for the repository; otherwise open a minimal issue without secrets.
