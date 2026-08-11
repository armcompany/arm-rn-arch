import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ApplyOptions, ApplyResult, ArchitecturePlan } from './types.js';

export function applyPlan(plan: ArchitecturePlan, options: ApplyOptions = {}): ApplyResult {
  const result: ApplyResult = { created: [], skipped: [], unchanged: [] };
  for (const file of plan.files) {
    const destination = join(plan.root, file.path);
    if (existsSync(destination)) {
      if (readFileSync(destination, 'utf8') === file.content) { result.unchanged.push(file.path); continue; }
      if (!options.force && file.path !== 'rn-arch.config.json') { result.skipped.push(file.path); continue; }
    }
    result.created.push(file.path);
    if (!options.dryRun) { mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, file.content, 'utf8'); }
  }
  return result;
}
