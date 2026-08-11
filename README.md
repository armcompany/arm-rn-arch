# rn-arch

An autonomous React Native architecture harness, available as a CLI and an agent skill.

```bash
npx @armcompany/rn-arch init --modules auth,catalog,orders --dry-run
npx @armcompany/rn-arch plan
npx @armcompany/rn-arch apply
npx @armcompany/rn-arch generate module checkout
npx @armcompany/rn-arch audit
npx @armcompany/rn-arch check
```

`rn-arch.config.json` is the shared contract between people, agents and CI. It records workflow, topology, presentation pattern, capabilities, integration, state, persistence, offline behavior, design and release policy.

Install the skill:

```bash
npx skills add armcompany/arm-rn-arch --skill react-native-architecture
```

The skill discovers repository evidence, interviews only unresolved decisions, writes the contract, previews a deterministic plan, applies it through the CLI and validates the result.
