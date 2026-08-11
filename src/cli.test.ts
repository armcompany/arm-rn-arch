import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyPlan } from './apply.js';
import { audit } from './audit.js';
import { defaultConfig, validateConfig } from './config.js';
import { plan } from './planner.js';
import { run } from './cli.js';

function project(expo = true): string {
  const root = mkdtempSync(join(tmpdir(), 'rn-arch-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: expo ? { expo: '57', 'react-native': '0.85' } : { 'react-native': '0.85' } }));
  writeFileSync(join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true } }));
  return root;
}

test('plan and apply are deterministic and idempotent', () => {
  const root = project();
  try {
    const config = { ...defaultConfig('expo'), modules: ['orders'], capabilities: [...defaultConfig('expo').capabilities, 'design-system' as const] };
    const architecturePlan = plan(root, config);
    assert.ok(architecturePlan.files.some((file) => file.path === 'src/modules/orders/hooks/.gitkeep'));
    assert.ok(architecturePlan.files.some((file) => file.path === 'src/design-system/tokens/.gitkeep'));
    assert.equal(applyPlan(architecturePlan, { dryRun: true }).created.length, architecturePlan.files.length);
    assert.equal(applyPlan(architecturePlan).created.length, architecturePlan.files.length);
    assert.equal(applyPlan(architecturePlan).created.length, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('multi-package plan creates package boundaries', () => {
  const root = project();
  try {
    const architecturePlan = plan(root, { ...defaultConfig('expo'), topology: 'multi-package-app', modules: ['catalog'] });
    assert.ok(architecturePlan.files.some((file) => file.path === 'packages/module-catalog/package.json'));
    assert.ok(architecturePlan.files.some((file) => file.path === 'packages/module-catalog/src/hooks/.gitkeep'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('invalid offline and microfrontend combinations are blocked', () => {
  const config = defaultConfig('expo');
  config.topology = 'mobile-microfrontends';
  config.offline.mode = 'offline-write';
  assert.equal(validateConfig(config).length, 2);
});

test('audit detects transport and sensitive storage violations', () => {
  const root = project();
  try {
    mkdirSync(join(root, 'src/modules/orders/screens'), { recursive: true });
    writeFileSync(join(root, 'src/modules/orders/screens/Orders.tsx'), "import axios from 'axios';\nAsyncStorage.setItem('token', token);\n");
    const codes = audit(root).findings.map((finding) => finding.code);
    assert.ok(codes.includes('ui-imports-transport'));
    assert.ok(codes.includes('sensitive-general-storage'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('CLI generates a configured module and check gates errors', () => {
  const root = project();
  const original = process.stdout.write;
  try {
    process.stdout.write = () => true;
    assert.equal(run(['init', root, '--modules', 'auth']), 0);
    assert.equal(run(['generate', 'module', 'orders', root]), 0);
    const contract = readFileSync(join(root, 'rn-arch.config.json'), 'utf8');
    assert.ok(contract.includes('modular-monolith'));
    assert.ok(contract.includes('orders'));
    writeFileSync(join(root, 'tsconfig.json'), '{}');
    assert.equal(run(['check', root]), 1);
  } finally { process.stdout.write = original; rmSync(root, { recursive: true, force: true }); }
});

test('compiled executable runs as a subprocess', () => {
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./cli.js', import.meta.url)), '--help'], { encoding: 'utf8' });
  assert.match(output, /rn-arch generate module/);
});
