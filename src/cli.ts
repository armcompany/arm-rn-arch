#!/usr/bin/env node
import { readFileSync, realpathSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { applyPlan } from './apply.js';
import { audit } from './audit.js';
import { defaultConfig, loadConfig, mergeConfig } from './config.js';
import { plan, planModule } from './planner.js';
import { renderApply, renderAudit, renderPlan } from './render.js';
import type { Capability, Presentation, Topology, Workflow } from './types.js';

const usage = `rn-arch — autonomous React Native architecture harness

Usage:
  rn-arch init [path] [options]       Create config and apply its architecture
  rn-arch plan [path] [options]       Preview the architecture plan
  rn-arch apply [path] [options]      Apply rn-arch.config.json
  rn-arch generate module <name> [path] [--dry-run]
  rn-arch audit [path] [--json]
  rn-arch check [path] [--json]

Options:
  --workflow expo|bare|brownfield
  --topology modular-monolith|multi-package-app|mobile-platform|mobile-microfrontends
  --presentation hook-based-mvvm|mvi|clean|viper
  --modules auth,catalog,orders
  --capabilities auth,server-state,forms,offline,design-system,animation,maps,observability,release
  --dry-run  Preview without writing
  --force    Overwrite listed generated files
`;

function value(argv: string[], flag: string): string | undefined { const index = argv.indexOf(flag); return index >= 0 ? argv[index + 1] : argv.find((arg) => arg.startsWith(`${flag}=`))?.slice(flag.length + 1); }
function csv(input?: string): string[] | undefined { return input?.split(',').map((v) => v.trim()).filter(Boolean); }
function rootArg(argv: string[], command: string): string {
  const skip = new Set(['--workflow', '--topology', '--presentation', '--modules', '--capabilities']);
  for (let i = command === 'generate' ? 3 : 1; i < argv.length; i += 1) { const arg = argv[i]!; if (skip.has(argv[i - 1]!)) continue; if (!arg.startsWith('-')) return arg; }
  return '.';
}

function resolvedConfig(argv: string[], root: string) {
  const detected = audit(root);
  const base = loadConfig(root) ?? defaultConfig(detected.expo ? 'expo' : 'bare');
  const values: Parameters<typeof mergeConfig>[1] = {};
  const workflow = value(argv, '--workflow') as Workflow | undefined;
  const topology = value(argv, '--topology') as Topology | undefined;
  const presentation = value(argv, '--presentation') as Presentation | undefined;
  const modules = csv(value(argv, '--modules'));
  const capabilities = csv(value(argv, '--capabilities')) as Capability[] | undefined;
  if (workflow) values.workflow = workflow;
  if (topology) values.topology = topology;
  if (presentation) values.presentation = presentation;
  if (modules) values.modules = modules;
  if (capabilities) values.capabilities = capabilities;
  return mergeConfig(base, values);
}

export function run(argv: string[]): number {
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) { process.stdout.write(usage); return 0; }
  if (argv.includes('--version') || argv.includes('-v')) { const here = dirname(fileURLToPath(import.meta.url)); const pkg = JSON.parse(readFileSync(`${here}/../package.json`, 'utf8')) as { version: string }; process.stdout.write(`${pkg.version}\n`); return 0; }
  const command = argv[0]!;
  const root = rootArg(argv, command);
  const json = argv.includes('--json');

  if (command === 'audit' || command === 'check') { const result = audit(root); process.stdout.write(json ? `${JSON.stringify(result, null, 2)}\n` : renderAudit(result)); return command === 'check' && result.findings.some((f) => f.level === 'error') ? 1 : 0; }
  if (command === 'generate' && argv[1] === 'module' && argv[2]) { const config = resolvedConfig(argv, root); const architecturePlan = planModule(root, config, argv[2]); if (architecturePlan.warnings.length) { process.stderr.write(`${architecturePlan.warnings.join('\n')}\n`); return 1; } const result = applyPlan(architecturePlan, { dryRun: argv.includes('--dry-run'), force: argv.includes('--force') }); process.stdout.write(renderApply(result, argv.includes('--dry-run'))); return 0; }
  if (['init', 'plan', 'apply'].includes(command)) { const config = resolvedConfig(argv, root); const architecturePlan = plan(root, config); if (command === 'plan') { process.stdout.write(json ? `${JSON.stringify(architecturePlan, null, 2)}\n` : renderPlan(architecturePlan)); return architecturePlan.warnings.length ? 1 : 0; } if (architecturePlan.warnings.length) { process.stderr.write(`${architecturePlan.warnings.join('\n')}\n`); return 1; } const result = applyPlan(architecturePlan, { dryRun: argv.includes('--dry-run'), force: argv.includes('--force') }); process.stdout.write(json ? `${JSON.stringify(result, null, 2)}\n` : renderApply(result, argv.includes('--dry-run'))); return 0; }
  process.stderr.write(`Unknown command: ${command}\n\n${usage}`); return 2;
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : '';
if (entry === import.meta.url) process.exitCode = run(process.argv.slice(2));
