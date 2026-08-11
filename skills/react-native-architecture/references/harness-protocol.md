# Autonomous Harness Protocol

## Repository-owned state

Use `rn-arch.config.json` as the durable architecture contract. For work spanning multiple sessions, maintain `.rn-arch/checkpoint.md` with objective, accepted decisions, completed validations, current blocker, dirty files, next command, and recovery notes. Reconcile checkpoint claims against Git and filesystem evidence before resuming.

## Bounded loop

Repeat `frame → observe → resolve → lock`:

1. Frame one bounded architectural outcome and its acceptance check.
2. Observe repository evidence and run the cheapest relevant sensor.
3. Resolve the smallest coherent change that advances the outcome.
4. Lock learning into config, ADR, generator, test, lint rule, or check.

Stop when the outcome passes, authority is required, the same blocker repeats, or risk expands beyond the accepted contract. Do not interpret persistence as permission for deployment, store submission, OTA promotion, destructive migration, or dependency installation outside the approved plan.

## Recovery

On interruption, re-read project instructions, config, checkpoint, Git status, and validation output. Resume from evidence rather than conversational memory. If code and checkpoint disagree, treat code and deterministic sensors as authoritative and repair the checkpoint.

## Completion

Declare complete only when the requested structure exists, relevant checks pass, one expected failure is detected by a sensor, generated and manual work are distinguished, and remaining risk is explicit.
