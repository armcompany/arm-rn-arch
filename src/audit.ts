import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { loadConfig, validateConfig } from './config.js';
import type { Audit, Finding } from './types.js';

const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ignored = new Set(['.git', 'node_modules', 'dist', 'build', 'ios', 'android', 'coverage']);

function readJson(path: string): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sourceFiles(root: string): string[] {
  const output: string[] = [];
  const visit = (directory: string): void => {
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory() && !ignored.has(entry.name) && !entry.name.startsWith('.')) {
        visit(join(directory, entry.name));
      } else if (entry.isFile() && sourceExtensions.has(extname(entry.name))) {
        output.push(join(directory, entry.name));
      }
    }
  };
  visit(root);
  return output;
}

export function audit(rootInput = '.'): Audit {
  const root = resolve(rootInput);
  const pkg = readJson(join(root, 'package.json'));
  const dependencies = {
    ...((pkg.dependencies ?? {}) as Record<string, string>),
    ...((pkg.devDependencies ?? {}) as Record<string, string>),
  };
  const tsconfig = readJson(join(root, 'tsconfig.json'));
  const compilerOptions = (tsconfig.compilerOptions ?? {}) as Record<string, unknown>;
  const findings: Finding[] = [];
  const reactNative = 'react-native' in dependencies || 'expo' in dependencies;
  const featureRoot = existsSync(join(root, 'src/modules')) || existsSync(join(root, 'src/features'));
  const packageModules = existsSync(join(root, 'packages'));
  const config = loadConfig(root);

  if (!reactNative) findings.push({ level: 'error', code: 'project-type', message: 'React Native or Expo dependency not found.' });
  if (compilerOptions.strict !== true) findings.push({ level: 'error', code: 'typescript-strict', message: 'Enable TypeScript strict mode.' });
  if (!featureRoot) findings.push({ level: 'warning', code: 'feature-root', message: 'Expected feature-first root at src/features.' });
  if (config) for (const message of validateConfig(config)) findings.push({ level: 'error', code: 'invalid-config', message });

  for (const file of sourceFiles(root)) {
    const rel = relative(root, file).split('\\').join('/');
    if (!rel.includes('/ui/') && !rel.includes('/screens/')) continue;
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/from\s+['"](?:axios|ky|@apollo\/client|graphql-request)['"]/.test(line)) {
        findings.push({
          level: 'error',
          code: 'ui-imports-transport',
          message: 'UI must call a feature hook instead of importing transport directly.',
          file: `${rel}:${index + 1}`,
        });
      }
      if (/AsyncStorage[\s\S]{0,80}(?:token|secret|password|credential)/i.test(line) || /createMMKV[\s\S]{0,120}(?:token|secret|password|credential)/i.test(line)) {
        findings.push({ level: 'error', code: 'sensitive-general-storage', message: 'Store credentials in SecureStore/Keychain, not general storage.', file: `${rel}:${index + 1}` });
      }
      if (/encryptionKey\s*:\s*['"][^'"]+['"]/.test(line)) findings.push({ level: 'error', code: 'hardcoded-encryption-key', message: 'Do not ship encryption keys in the JavaScript bundle.', file: `${rel}:${index + 1}` });
    });
  }

  return {
    root,
    reactNative,
    expo: 'expo' in dependencies,
    topology: packageModules ? 'multi-package-app' : featureRoot ? 'modular-monolith' : 'unknown',
    strictTypeScript: compilerOptions.strict === true,
    config,
    findings,
  };
}
