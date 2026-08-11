# Release Operations

Load this reference when creating scripts, CI lanes, app version policy, EAS/fastlane configuration, or OTA controls.

## Canonical commands

Map these capabilities to the repository's package manager and existing names; do not rename working scripts solely for uniformity.

```jsonc
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "test:ci": "jest --ci --coverage",
    "arch:check": "rn-arch check .",
    "verify": "npm run arch:check && npm run typecheck && npm run lint && npm run test:ci"
  }
}
```

Add `codegen` and a drift check when OpenAPI/GraphQL generation is selected. Add preview, submit, and OTA commands only after environments and authority are defined.

## CI lanes

| Lane | Trigger | Minimum evidence |
| --- | --- | --- |
| quality | every PR | architecture, types, lint, codegen drift |
| test | every PR | unit/integration/contract and coverage artifact |
| native-preview | native-affecting PR | clean native generation/build and smoke test |
| E2E | nightly/release | critical flows on iOS and Android release-like binaries |
| release | immutable tag/artifact | signing, submit, sourcemaps, changelog, rollout record |

Cache only reproducible inputs. Pin the package manager and CI runtime. Treat warnings from architecture/type/lint gates as failures when the contract says they are prohibited.

## Native-change classification

Require a new binary for native dependencies, Expo config plugins, entitlements, permissions, icons/splash native configuration, Pods, Gradle, native source, minimum OS, New Architecture toggles, or runtime-version changes. Compare the change against the last shipped native artifact, not merely the previous commit.

Automate this classification conservatively. When uncertain, require a binary.

## Version model

Track separately:

- marketing version shown to users;
- monotonic iOS build number and Android version code;
- native runtime compatibility identity;
- OTA update/channel identity;
- source-map/release identifier used by observability.

Produce all identifiers from one release manifest or pipeline output so crash reports, artifacts, and OTA updates can be correlated.

## EAS and fastlane

For Expo/CNG, define development, preview, and production build profiles plus matching update channels. Use a runtime policy that prevents incompatible OTA delivery. For Bare/custom native, use fastlane lanes for signing, beta/release builds, metadata, submission, and staged rollout; keep signing material out of Git.

Promote a tested immutable artifact when the platform permits it. Do not rebuild different binaries from the same release tag without recording the new artifact identity.

## OTA guardrail

Permit OTA only when the target runtime is compatible and no native surface changed. Require preview-channel verification, staged rollout, crash/health monitoring, sourcemaps, rollback target, and an operator with explicit authority. An autonomous agent may prepare an update but must not promote it without deployment authorization.
