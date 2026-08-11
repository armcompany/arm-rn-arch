# Dependencies, Versions, and Release

## Capability catalog

Select libraries by accepted capabilities, not by starter-kit popularity. Keep navigation, validation, state, forms, persistence, animation, maps, observability, and release choices explicit in `rn-arch.config.json`. Review licenses, maintenance, New Architecture support, native setup, Expo compatibility, testability, bundle impact, and migration cost.

Maintain a tested compatibility baseline for Node, package manager, Expo SDK or RN, React, native toolchains, and native libraries. Pin native-sensitive dependencies through the lockfile. Upgrade Expo one SDK at a time; use React Native Upgrade Helper for Bare projects. Run compatibility builds before promotion.

## Release profiles

Use EAS Build/Submit/Update for Expo/CNG unless organizational constraints require a custom pipeline. Use fastlane for Bare/custom native build, signing, TestFlight, Play tracks, metadata, and submission. Do not use retired Microsoft CodePush for new projects.

Track marketing app version, monotonic iOS/Android build number, native runtime version, and OTA update identity separately. Prefer EAS runtime fingerprint when minimizing incompatible OTA risk. Any native dependency, config plugin, entitlement, permission, app config, Pod, Gradle, or native source change requires a new binary.

Use development, preview, and production environments/channels. Promote an already verified artifact when possible. Require rollback, staged rollout, crash monitoring, source maps, environment validation, store compliance, and release evidence.

## Gates

PR: config, architecture check, types, lint, unit, integration. Preview: native build and smoke/E2E. Store release: version/build validation, signing, security/privacy review, staged rollout. OTA: runtime compatibility, no native delta, preview-channel verification, monitoring, and rollback target.
