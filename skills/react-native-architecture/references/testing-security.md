# Testing and Security Controls

## Test ladder

- Unit: pure domain, reducer, mapper, formatter, schema, state transition, and view-model behavior.
- Integration: screen + hooks + providers with transport mocked at the boundary through MSW or equivalent.
- Contract: generated client/schema fixtures against provider expectations.
- Native integration: permissions, storage, deep links, notifications, maps, and background work.
- E2E: critical user journeys through Maestro or Detox on release-like builds.

A tier may mock only the tier below it. Prefer behavior assertions and approved fixtures over snapshots.

## Security baseline

Map controls to OWASP MASVS storage, crypto, auth, network, platform, code, resilience, and privacy categories. Validate network payloads, deep links, navigation params, storage reads, remote flags, and native responses.

Block credentials in AsyncStorage/general MMKV, hardcoded keys, sensitive logs, unsafe TLS bypass, cross-account caches, missing logout cleanup, unversioned persisted payloads, untested migrations, overbroad permissions, and production secrets in the JS bundle.

## Architecture sensors

Check transport imports in UI, cross-module deep imports, direct storage access outside adapters, untyped external boundaries, inline query keys, native changes in OTA-only releases, and release builds without tagged sourcemaps. Every recurring defect must become a test, lint rule, type boundary, or deterministic check.
