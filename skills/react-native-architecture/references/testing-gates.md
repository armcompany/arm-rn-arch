# Testing and Delivery Gates

Load this reference when designing test ownership, mocking policy, CI, or acceptance evidence.

## Test matrix

| Tier | Proves | Mock boundary | Typical gate |
| --- | --- | --- | --- |
| Unit | domain rules, schemas, mappers, reducers, selectors | time/randomness only | local and PR |
| Hook/view-model | orchestration, commands, cache interaction | transport through MSW/fake repository | PR |
| Component/screen | user-visible states and accessibility | module controller or network boundary | PR |
| Contract | provider payload/schema compatibility | none; use approved fixtures or provider | PR/nightly |
| Native integration | storage, permissions, deep links, notifications, maps | external service only | preview |
| E2E | critical journeys on a release-like binary | backend environment | nightly/pre-release |

Mock the boundary below the behavior under test. Do not mock implementation details inside the same layer. Prefer factories and approved payload fixtures over snapshots.

## Required UI states

For every data-driven screen, cover loading, success, empty, recoverable error, unauthorized/session-expired, offline/stale when applicable, and retry. Mutations cover success, validation failure, retryable failure, duplicate delivery, and optimistic rollback when used.

## Maestro or Detox

Default to Maestro when readable black-box flows and release-like builds are sufficient. Select Detox when the team needs maintained grey-box synchronization, native test hooks, or already owns a reliable Detox harness. Record the operational cost and run the chosen tool on both supported platforms.

## Gate progression

- Pre-commit: formatting/lint for staged files and targeted fast tests.
- Pull request: architecture check, typecheck, lint, codegen drift, unit, hook, component, and contract tests.
- Preview: native build, smoke test, permission/deep-link checks, and critical E2E.
- Nightly: full device matrix, staging contracts, performance and offline recovery where applicable.
- Store release: release artifact E2E, version/signing/privacy checks, sourcemaps, rollback readiness.
- OTA promotion: runtime compatibility, no native delta, preview-channel evidence, monitoring, rollback target.

Do not require every tier for a trivial pure change. Select gates by changed risk surface, but never skip the sensor that owns that risk.

## Failure injection

Before declaring the harness complete, prove at least one guardrail detects a realistic violation—for example a cross-module import, invalid persisted payload, unvalidated response, or native-affecting OTA change—then restore the fixture and confirm the suite passes.
