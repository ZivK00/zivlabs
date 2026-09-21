# AgentLane

AgentLane is the routing subsystem. It turns a task signature into either a
single deterministic route or an explicit block.

Each lane declares a provider, execution surface, cost, capabilities, and
whether that surface has been admitted for writes. The router filters lanes in
this order:

1. exclude `UNAVAILABLE` and `QUOTA_EXHAUSTED` providers;
2. retain only lanes that contain every requested capability;
3. for `fileEdit`, retain only write-trusted lanes;
4. order remaining lanes by cost and stable lane id.

The first result is selected; no result returns
`NO_TRUSTED_CAPABLE_LANE`. This means provider failover remains generic:
changing provider health changes candidates, without hard-coding a fallback
provider.

Protected tasks do not self-escalate. `requestEscalation` produces an
admission request only with an explicit policy.

The public catalog is illustrative. A host should load its lane catalog from
audited configuration and treat write trust as an evidence-backed runtime fact.
