# Presentation Patterns

## Hook-based MVVM

Use as the default React Native profile. Keep views/components pure. Put screen coordination, derived state, commands, and navigation intent in named hooks such as `useOrdersViewModel`. Keep server access in query/repository hooks below the view-model.

## MVI

Use for event-heavy workflows with explicit state transitions. Define immutable state, user/system intents, a reducer, effects, and exhaustive transition tests. Avoid duplicating server cache into MVI state.

## Clean layered

Use for complex, long-lived domain rules or multiple infrastructure implementations. Keep presentation → application/use cases → domain ← data adapters. Remove layers that only forward calls.

## VIPER

Use only for an existing organizational standard, brownfield parity, or highly regulated flow that benefits from explicit router/interactor/presenter boundaries. Record the boilerplate cost.

## UI/logic contract

- Components render props and emit semantic events.
- Screens compose layouts and a single presentation controller.
- Hooks/view-models coordinate user intent and exposed view state.
- Repositories/query modules own data access.
- Schemas validate external data; mappers produce domain types.
- Routes validate params and do not implement domain behavior.

Test pure state and view-model behavior without rendering. Test screens through user-visible behavior, not implementation snapshots.
