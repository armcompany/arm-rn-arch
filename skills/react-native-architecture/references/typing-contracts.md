# Typing and External Contracts

Load this reference when configuring TypeScript, API clients, navigation, environment values, persistence, or native boundaries.

## Compiler floor

Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, and `useUnknownInCatchVariables` for greenfield work. For an existing app, ratchet safely: measure violations, enable flags incrementally, and record temporary exceptions with an owner and removal condition.

Do not use `any` at transport, storage, navigation, environment, or native-module boundaries. Start with `unknown`, validate, then map.

## Boundary pipeline

Apply this pipeline to every untrusted input:

```text
external value → runtime schema → DTO → mapper → domain value
```

External inputs include REST/GraphQL responses, deep links, route params, persisted values, feature flags, push payloads, native-module results, and environment variables.

Keep DTO and domain types distinct when wire representation differs from business meaning. Map dates, money, enums, nullability, and identifiers once in the data layer.

```ts
const OrderDtoSchema = z.object({
  id: z.string().min(1),
  total_cents: z.number().int().nonnegative(),
  created_at: z.string().datetime(),
});

export function toOrder(input: unknown): Order {
  const dto = OrderDtoSchema.parse(input);
  return {
    id: dto.id as OrderId,
    total: Money.fromCents(dto.total_cents),
    createdAt: new Date(dto.created_at),
  };
}
```

## Generated clients

Generate REST types from a governed OpenAPI document and GraphQL types from the governed schema/documents. Commit generated output only when repository policy requires it, but always make CI regenerate and fail on drift. Never hand-edit generated files.

Generated compile-time types do not validate runtime payloads. Add runtime validation where provider drift, persisted compatibility, or security impact justifies it. Map GraphQL custom scalars explicitly; an unmapped scalar must not silently become `any`.

## Domain identifiers

Brand identifiers for entities that otherwise share `string` and are easy to mix up.

```ts
type Brand<T, Name extends string> = T & { readonly __brand: Name };
export type UserId = Brand<string, 'UserId'>;
export type OrderId = Brand<string, 'OrderId'>;
```

Construct them only after validation at a mapper or route boundary.

## Routes and deep links

Type route definitions and parse params at the route boundary. Handle missing or invalid values explicitly with not-found/error UI. Treat deep links as untrusted input and authorize the target resource after parsing; knowing an identifier is not permission to access it.

## Environment and secrets

Validate environment/config at startup and fail with a clear non-secret diagnostic. Treat all values bundled into JavaScript—including `EXPO_PUBLIC_*`—as public. Keep signing credentials, API secrets, and privileged tokens in CI/EAS secret stores or on the server, never in the app bundle.

## Persistence

Persist a versioned envelope and validate it before use. Define migrations, invalid-data fallback, account ownership, logout cleanup, and downgrade behavior. Encryption does not replace authorization, lifecycle management, or secure key custody.

## Review checklist

- strict compiler baseline or an explicit ratchet plan;
- no `any` at external boundaries;
- runtime validation before domain construction;
- DTO/domain mapping outside UI;
- generated-code drift checked;
- route and deep-link params parsed;
- environment validated without exposing secrets;
- persisted schemas versioned and migrated.
