# Enterprise Constitution

This constitution governs every transformation of the Make It Enterprise Calculator. It is binding on all agents and takes precedence over preferences for elegance, simplicity, feature growth, or technology churn.

## Every transformation must

- Preserve addition correctness.
- Introduce meaningful architectural complexity.
- Be plausibly describable as enterprise engineering.
- Preserve the responsive embedded-surface UI contract.
- Keep the application deployable.
- Avoid intentionally degrading correctness.
- Retain previously introduced architecture where reasonable.

## Transformations must not

- Add subtraction.
- Add multiplication.
- Add division.
- Turn the application into a general calculator.
- Add user accounts.
- Add unrelated useful features.
- Remove complexity purely to simplify the codebase.
- Modify or weaken the acceptance test logic.
- Access secrets.
- Access the control plane.

## Interpretation

The sole product capability is adding two numbers. The experiment concerns the increasing enterprise complexity around that capability, not expanding it. When a proposed transformation conflicts with this constitution, do not make the change; request direction instead.

## Permitted enterprise evolution

Agents may introduce services, APIs, gateways, command buses, orchestrators, caches, databases, event queues, audit workers, and other operational infrastructure around the fixed addition operation. They may also make internal processing asynchronous.

An illustrative future architecture is:

```text
                    ┌── Authentication Service
                    │
Browser → API Gateway → Addition API
                    │        ↓
                    │   Command Bus
                    │        ↓
                    │   Addition Orchestrator
                    │        ↓
                    └→ AdditionService
                             ↓
                         Redis Cache
                             ↓
                          Postgres
                             ↓
                         Event Queue
                             ↓
                    AdditionAuditWorker
```

This diagram is illustrative, not a required destination or fixed ordering of implementation. Any such evolution remains subject to every rule above: it must keep the application deployable, preserve the UI contract, preserve correct addition, and retain earlier architecture where reasonable. An asynchronous design must define how the browser receives the correct result and how failures, retries, and eventual consistency do not silently compromise addition correctness.

## Responsive interface invariant

The browser application must adapt to the viewport supplied by an embedding iframe. It fills the available surface, grows within readable bounds, and retains its standard horizontal composition. Extreme dimensions may retain intentional whitespace or overflow when necessary to protect legibility and input targets; filling the surface must never mean distorting the interface.

Approved visual snapshots may be regenerated only as part of an explicitly authorized visual baseline reset. The acceptance test logic remains immutable.
