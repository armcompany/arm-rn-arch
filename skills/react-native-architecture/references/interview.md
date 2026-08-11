# Architecture Interview

Ask only questions not answered by repository evidence. Recommend an answer with each question.

## Product and runtime

1. Which platforms and form factors must ship: iOS, Android, web, TV, extensions, brownfield hosts?
2. Is Expo/CNG acceptable? Identify a concrete blocker before selecting Bare.
3. Which native SDKs, background modes, widgets, extensions, maps, payments, media, or hardware integrations exist?

## Organization and delivery

1. How many teams own product domains?
2. Are modules reused by multiple apps?
3. Is there one binary/release or independent deployment/runtime loading?
4. Are strict visibility and build boundaries worth workspace overhead?

Select one: `modular-monolith`, `multi-package-app`, `mobile-platform`, `mobile-microfrontends`.

## Presentation and navigation

1. Are screens mostly CRUD, state-machine flows, or domain-heavy workflows?
2. Must view logic be independently testable?
3. Is routing file-based, configured in code, or supplied by a native host?

Select one: `hook-based-mvvm`, `mvi`, `clean`, `viper`. Treat VIPER as exceptional in React Native.

## Data and offline

1. REST, GraphQL, or a migration between them? Is OpenAPI or a GraphQL schema governed?
2. Cache-only offline, offline reads, queued writes, or local-first?
3. Which data is ephemeral, server-owned, client-owned, sensitive, relational, or irreplaceable?
4. How are conflicts, retries, idempotency, logout cleanup, and storage migrations handled?

## Experience and platform

1. Is there a design system, Figma source, token set, UI kit, font license, brand asset pack, motion language, or accessibility target?
2. Are maps, foreground/background location, custom splash, adaptive icons, or notification icons required?

## Quality and release

1. Which failures must block PR, preview, store release, or OTA promotion?
2. Expo/EAS or custom native/fastlane? Which environments and channels exist?
3. What is the supported upgrade cadence and oldest app/runtime still in the field?
4. Which OWASP MASVS, privacy, regulatory, or data-residency controls apply?

Finish with resolved decisions, open decisions, evidence, alternatives rejected, and checks that will enforce each decision.
