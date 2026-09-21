# ContextForge

ContextForge converts scattered project state into a bounded context pack with
source provenance. It is deliberately not a raw history dump.

`buildContextPack` orders sources deterministically by priority and id, emits
only up to the requested byte budget, records the provenance of every emitted
source, and redacts common credential-shaped assignments. Redaction is a
defense-in-depth guard, not permission to feed sensitive source material into a
provider.

Continuation is separate from prompt text. `resolveProjectAction` asks whether
there is a project, a current revision, an unfinished next action, and a source
revision match. It returns one of:

- `ACTION` — an action is current and can be routed;
- `CLARIFY` — project/revision/action is absent or already completed;
- `REGROUND` — the prior action was derived from a different revision.

`createHandoff` stores the thread, project, source revision, bounded summary,
next action, and timestamp. Delivery checks the revision again so an old
handoff cannot authorize a candidate after the project changed.
