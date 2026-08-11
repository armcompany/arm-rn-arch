# Architecture Templates

Load only the template needed for the current artifact. Keep decisions repository-owned under `docs/architecture/` or the repository's established equivalent.

## ADR

```markdown
# ADR-NNN: <decision>

- Status: proposed | accepted | superseded
- Date: YYYY-MM-DD
- Owners: <team or role>

## Context
<constraints and evidence that force a choice>

## Decision
<choice and scope>

## Alternatives
| Option | Benefit | Rejection reason |
| --- | --- | --- |

## Consequences
<costs, risks, migration and rollback>

## Enforcement
<config, type, lint rule, test, generator, CI gate, or explicit unenforced judgment>
```

## Interview result

```markdown
## Resolved
| Decision | Choice | Evidence | Enforcement |
| --- | --- | --- | --- |

## Assumed
| Decision | Assumption | Risk | Revisit condition |
| --- | --- | --- | --- |

## Blocked
| Decision | Missing authority/evidence | Owner |
| --- | --- | --- |
```

## Module contract

```markdown
# Module: <name>

- Purpose:
- Owner:
- Public API:
- Routes/events/contracts exposed:
- Data owned:
- Dependencies allowed:
- Forbidden dependencies:
- Offline/security classification:
- Required tests and architecture sensors:
```

## Pull-request checklist

```markdown
- [ ] Architecture, type, lint, and selected tests pass
- [ ] No cross-module deep import or UI-to-transport dependency
- [ ] External inputs validated and DTOs mapped outside UI
- [ ] Query invalidation/cache ownership is explicit
- [ ] Loading, empty, error, accessibility, and offline states handled as required
- [ ] Persistence has versioning, migration, account boundary, and logout cleanup
- [ ] Native-affecting change classified; binary/OTA path is correct
- [ ] ADR/config updated when an accepted decision changed
- [ ] Generated files were regenerated, not hand-edited
```

## Generated-project instructions

Place a concise repository instruction in `AGENTS.md` or the existing agent guide:

```markdown
## Architecture contract

- Read `rn-arch.config.json` and relevant ADRs before structural changes.
- Import product modules only through their public entrypoints.
- Keep UI independent from transport and persistence.
- Validate external data before constructing domain values.
- Run the cheapest relevant checks first, then `npm run verify` before completion.
- Treat native changes as binary changes unless the release policy proves otherwise.
```
