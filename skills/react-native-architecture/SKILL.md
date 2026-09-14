---
name: react-native-architecture
description: Design, scaffold, audit, refactor, and govern production React Native or Expo applications. Use for greenfield setup, existing-app architecture, modular monoliths, multi-package apps, mobile platforms, microfrontends, MVVM/MVI/Clean/VIPER decisions, REST or GraphQL integration, state and offline design, design systems, security, testing, dependency baselines, EAS or fastlane releases, OTA updates, or autonomous long-running React Native implementation. Combines an adaptive architecture interview with the deterministic @armcompany/rn-arch CLI.
---

```
@@@@@@   @@@@@@@   @@@@@@@@@@      @@@  @@@   @@@@@@   @@@@@@@   @@@  @@@  @@@@@@@@   @@@@@@    @@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@@@@@     @@@  @@@  @@@@@@@@  @@@@@@@@  @@@@ @@@  @@@@@@@@  @@@@@@@   @@@@@@@
@@!  @@@  @@!  @@@  @@! @@! @@!     @@!  @@@  @@!  @@@  @@!  @@@  @@!@!@@@  @@!       !@@       !@@
!@!  @!@  !@!  @!@  !@! !@! !@!     !@!  @!@  !@!  @!@  !@!  @!@  !@!!@!@!  !@!       !@!       !@!
@!@!@!@!  @!@!!@!   @!! !!@ @!@     @!@!@!@!  @!@!@!@!  @!@!!@!   @!@ !!@!  @!!!:!    !!@@!!    !!@@!!
!!!@!!!!  !!@!@!    !@!   ! !@!     !!!@!!!!  !!!@!!!!  !!@!@!    !@!  !!!  !!!!!:     !!@!!!    !!@!!!
!!:  !!!  !!: :!!   !!:     !!:     !!:  !!!  !!:  !!!  !!: :!!   !!:  !!!  !!:            !:!       !:!
:!:  !:!  :!:  !:!  :!:     :!:     :!:  !:!  :!:  !:!  :!:  !:!  :!:  !:!  :!:           !:!       !:!
::   :::  ::   :::  :::     ::      ::   :::  ::   :::  ::   :::   ::   ::   :: ::::  :::: ::   :::: ::
 :   : :   :   : :   :      :        :   : :   :   : :   :   : :  ::    :   : :: ::   :: : :    :: : :
```

# React Native Architecture

Operate as `architectural judgment + persistent contract + deterministic sensors`. Discover before asking, decide before generating, preview before writing, and validate before declaring completion.

## Operating modes

- **Design**: interview, recommend, and write the architecture contract and ADRs.
- **Scaffold**: create a new architecture or module from an approved contract.
- **Audit**: compare repository evidence to the contract without changing files.
- **Refactor**: migrate incrementally, preserving a runnable project at each checkpoint.
- **Ratchet**: convert a production defect or repeated review comment into an enforceable guardrail.

## Autonomous workflow

1. Resolve the project root and read repository instructions, `package.json`, lockfile, app config, `tsconfig.json`, native folders, CI, and existing source layout.
2. Run `npx --yes @armcompany/rn-arch@latest audit .` when package execution is available. Treat output as evidence, not permission to install or overwrite.
3. Read [interview.md](references/interview.md). Infer answered questions from evidence. Ask only unresolved questions whose answers change the topology, runtime, data model, security posture, or release path.
4. Load only the relevant references:
   - topology or ownership: [topologies.md](references/topologies.md)
   - UI/logic pattern: [presentation.md](references/presentation.md)
   - API, state, storage, offline: [data-state-offline.md](references/data-state-offline.md)
   - concrete hooks, queries, mutations, and boundaries: [implementation-patterns.md](references/implementation-patterns.md)
   - TypeScript, external contracts, codegen, routes, and environment: [typing-contracts.md](references/typing-contracts.md)
   - design, fonts, splash, animation, maps: [design-platform.md](references/design-platform.md)
   - testing, security, and delivery gates: [testing-security.md](references/testing-security.md) and [testing-gates.md](references/testing-gates.md)
   - libraries and compatibility: [release-dependencies.md](references/release-dependencies.md)
   - CI, EAS, fastlane, versions, OTA, and native-change detection: [release-operations.md](references/release-operations.md)
   - ADRs, decision records, module contracts, and review checklists: [templates.md](references/templates.md)
5. Write `rn-arch.config.json` as the repository-owned architecture contract. Record alternatives and costs in `docs/architecture/`.
6. Run `npx --yes @armcompany/rn-arch@latest plan .`. Explain warnings and the exact overwrite surface.
7. Apply only when the user requested implementation: `npx --yes @armcompany/rn-arch@latest apply .`. Never use `--force` without explicit approval for the listed files.
8. Implement domain-specific content the generic generator cannot know: contracts, screens, hooks/view-models, schemas, navigation, fixtures, and release policy.
9. Validate in increasing cost: config → architecture check → typecheck → lint → unit → integration → native build → E2E. Report `passed`, `failed`, `blocked`, or `not run`; never collapse these states.
10. Break one contract intentionally or simulate one realistic failure. Confirm its sensor fails, restore it, then confirm the sensor passes.
11. For long-running work, follow [harness-protocol.md](references/harness-protocol.md) and checkpoint repository state before context or environment boundaries.

## Decision defaults

- Default to Expo/CNG, modular monolith, hook-based MVVM, feature modules, strict TypeScript, REST with runtime schemas, TanStack Query for server state, local state for client state, and no offline persistence.
- Escalate to packages only for enforceable ownership, reuse, visibility, or build boundaries.
- Escalate to mobile microfrontends only for independent deployment/runtime loading. Do not call ordinary modularity a superapp.
- Keep components presentational; coordinate UI behavior in feature hooks/view-models; isolate transport and persistence behind module data boundaries.
- Keep credentials in SecureStore/Keychain, never AsyncStorage or general MMKV. Use MMKV for small nonsensitive key-value data and SQLite for relational or authoritative offline data.
- Do not install a capability because it is popular. Install it because an accepted requirement selects it.
- Do not recommend Microsoft CodePush for new projects. Prefer EAS Update for compatible Expo workflows; treat native changes as requiring a new binary.

## CLI contract

```bash
rn-arch init [path] [options]
rn-arch plan [path]
rn-arch apply [path]
rn-arch generate module <name> [path]
rn-arch audit [path]
rn-arch check [path]
```

If the CLI is unavailable, reproduce the approved plan manually and preserve the same `rn-arch.config.json`. Do not silently choose a different architecture.

## Completion contract

Return the detected baseline, resolved decisions and rationale, generated or changed files, skipped files, dependency plan, validation evidence, remaining risks, and the next safe command. A structure with no enforcing check is provisional, not complete.
