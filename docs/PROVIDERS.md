# Providers

The provider registry normalizes availability without performing provider
authentication or a network call. Supported public states are:

`AVAILABLE`, `RATE_LIMITED`, `QUOTA_EXHAUSTED`, `UNAVAILABLE`, `UNKNOWN`, and
`DISABLED`.

Only `AVAILABLE` is returned by `eligibleProviders`. AgentLane independently
filters unavailable and quota-exhausted lanes, then applies task capability and
surface trust. This keeps the routing policy generic: it does not encode a
special fallback for a named provider.

The three demo entries illustrate a local analysis role, a trusted isolated
editing role, and a review role. They are fixtures, not an assertion that those
providers are installed, authenticated, healthy, or trusted on a user's
machine.
