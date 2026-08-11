# Data, State, Persistence, and Offline

## Transport

Choose REST when endpoints and HTTP caching are stable or an OpenAPI contract exists. Choose GraphQL when screens compose overlapping entities from a governed graph. Generate types from OpenAPI/GraphQL when possible and validate every untrusted boundary. Do not run two transports for one domain without a migration deadline.

## Ownership

- TanStack Query/Apollo/urql owns server state.
- Local React state owns local UI state.
- Zustand/Redux owns shared client-only state.
- Never mirror query entities or request status into a client store.

## Persistence classification

- SecureStore/Keychain: credentials and small sensitive values.
- MMKV: small, performance-sensitive, nonsensitive preferences or caches; never hardcode encryption keys.
- SQLite: relational, queryable, migration-heavy, queued, or authoritative offline data.
- Filesystem: media and files; store metadata separately.

## Offline levels

- `none`: network required.
- `cache-persisted`: restore expiring query cache with version/buster.
- `offline-read`: local reads with explicit freshness and stale UI.
- `offline-write`: durable outbox, idempotency keys, backoff, connectivity sensor, and conflict policy.
- `local-first`: local database is the UI source of truth; a sync engine reconciles with remote state.

For queued writes, persist operation ID, idempotency key, entity, action, versioned payload, creation time, attempts, and status. Test crash recovery, duplicate delivery, account switching, migration, partial sync, and conflict behavior.
