# Topologies and Module Contracts

## Modular monolith

Use one package and one release with `src/app`, `src/core`, `src/modules`, `src/shared`, and optionally `src/design-system`. Give every product module a public `index.ts`. Forbid cross-module internal imports.

## Multi-package application

Use `apps/mobile` plus `packages/core-*`, `packages/shared-*`, and `packages/module-*`. Keep one product binary/release while enforcing dependency and ownership boundaries through workspaces.

## Mobile platform

Use multiple app shells consuming shared core, design, contracts, and selected product modules. Keep brand/product configuration outside reusable domain packages.

## Mobile microfrontends

Use a host plus remote modules only when modules must be deployed or loaded independently. Require a compatibility manifest, shared singleton policy, fallback UI, remote kill switch, integration tests, and native-runtime compatibility. Treat Module Federation support as an advanced build decision.

## Dependency law

`app/host → modules → contracts/core`; `core` never imports product modules; `shared` contains no business policy; modules communicate through public APIs, typed navigation, events, or shared domain contracts. Avoid a global `core` that becomes a business-logic dump.

## Module anatomy

```text
module/
├── api/ or data/
├── model/ or domain/
├── hooks/ or view-model/
├── screens/ or views/
├── components/
├── routes/
├── tests/
└── index.ts
```

Split `api` and `impl` packages only when independent compilation, substitution, or strong visibility control justifies the overhead.
