# Architecture

The core is deliberately split into pure functions. A host application owns
provider adapters, persistence, process isolation, and user confirmation; this
package makes their safety decisions explicit and testable.

```mermaid
sequenceDiagram
  participant U as User intent
  participant R as Router
  participant W as Worker surface
  participant V as Verifier
  participant D as Delivery gate
  U->>R: bounded task signature
  R->>W: route only if trusted and capable
  W-->>V: candidate plus deterministic evidence
  V-->>D: verified receipt
  D-->>U: allow or fail closed
```

The route decision is not a delivery decision. A route merely identifies an
eligible surface. Delivery needs a current handoff, a non-empty change receipt,
and a passing declared check.
