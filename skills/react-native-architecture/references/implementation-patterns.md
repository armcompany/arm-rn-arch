# Implementation Patterns

Load this reference when implementing or reviewing module internals. Adapt names to the repository; preserve the boundaries.

## Layer boundaries

| Layer | Owns | May import | Must not import |
| --- | --- | --- | --- |
| `app` or routes | layouts, route composition, navigation wiring | module public APIs, shared UI | transport, storage, module internals |
| `ui` | screens and presentational components | view-model, shared UI | transport, persistence, unrelated modules |
| `model` or view-model | screen coordination, derived state, commands | module data/domain, typed navigation | React Native view primitives |
| `data` or `api` | requests, schemas, DTO mapping, query keys | core transport, generated contracts | UI and navigation |
| `core` | transport, storage, config, observability, providers | shared contracts | product modules |
| `shared` | generic UI, types, and pure utilities | other shared code | product policy or module internals |

Expose each module through `index.ts`. Forbid deep imports into another module. Enforce boundaries with ESLint import restrictions, workspace package exports, or both.

## Query ownership

Create query keys once per module and reuse them for reads, invalidation, prefetch, and tests.

```ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  detail: (id: OrderId) => [...orderKeys.all, 'detail', id] as const,
};
```

Make the request function validate the response and map DTOs to domain values. Let the query hook manage cache policy; do not make components parse payloads.

```ts
export function useOrderQuery(id: OrderId) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderRepository.get(id),
  });
}
```

For mutations, declare invalidation or cache replacement explicitly. Optimistic updates require snapshot, rollback, reconciliation, and a test for failure.

```ts
export function useCancelOrderMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: orderRepository.cancel,
    onSuccess: (order) => {
      client.setQueryData(orderKeys.detail(order.id), order);
      void client.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
```

## Hook-based view-model

Use one screen-level controller when independent testing or nontrivial orchestration is required. Return view state and semantic commands, not transport objects.

```ts
export function useOrderViewModel(id: OrderId) {
  const order = useOrderQuery(id);
  const cancel = useCancelOrderMutation();

  return {
    order: order.data,
    isLoading: order.isPending,
    error: order.error,
    canCancel: order.data?.status === 'pending' && !cancel.isPending,
    cancel: () => cancel.mutateAsync(id),
  };
}
```

Keep components declarative: render the view-model and emit semantic events. Keep formatting in pure presenters/selectors when it is domain-aware. Do not hide every `useState` behind a view-model; local ephemeral UI state can remain local.

## State rules

- Server state stays in TanStack Query, Apollo, or urql; never mirror it into Zustand/Redux.
- Shared client state uses a store only when multiple independent consumers require it.
- Session identity may be in memory; credentials stay behind secure storage adapters.
- Derived values are computed, not persisted.
- Animation and gesture values stay in the component/Reanimated runtime.
- Persisted client state has a schema version, migration, account boundary, and logout cleanup.

Use effects only to synchronize with an external system. Do not use effects to derive render values, mirror props into state, or sequence business operations that belong in a command/state machine.

## Error contract

Normalize transport failures into a small domain-facing taxonomy: network, authentication, validation, not-found, contract, server, and unknown. Define user behavior, retry policy, observability, and sensitive-data redaction for each class. Never expose raw backend messages directly to UI.

## Boundary sensor

At minimum, make architecture checks fail when:

- UI imports transport or storage;
- a module imports another module's internals;
- query keys are declared inline outside the module key factory;
- direct storage access bypasses its adapter;
- `core` imports a product module.
