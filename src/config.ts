import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ArchitectureConfig, Capability, Presentation, Topology, Workflow } from './types.js';

export const CONFIG_FILE = 'rn-arch.config.json';

export function defaultConfig(workflow: Workflow = 'expo'): ArchitectureConfig {
  return {
    $schema: 'https://raw.githubusercontent.com/armcompany/arm-rn-arch/main/schema/rn-arch.schema.json',
    version: 1,
    workflow,
    topology: 'modular-monolith',
    presentation: 'hook-based-mvvm',
    navigation: workflow === 'expo' ? 'expo-router' : 'react-navigation',
    modules: [],
    core: ['api', 'auth', 'config', 'observability', 'storage'],
    capabilities: ['auth', 'server-state', 'forms', 'observability', 'release'],
    integration: { transport: 'rest', contract: 'runtime-schema', codegen: false },
    state: { server: 'tanstack-query', client: 'local' },
    persistence: { preferences: 'none', credentials: workflow === 'expo' ? 'secure-store' : 'keychain', database: 'none' },
    offline: { mode: 'none', conflictPolicy: 'server-authoritative', idempotency: false },
    design: { uiKit: 'internal', themes: ['light', 'dark'], fonts: 'system' },
    release: { provider: workflow === 'expo' ? 'eas' : 'fastlane', ota: workflow === 'expo' ? 'eas-update' : 'none', runtimeVersion: workflow === 'expo' ? 'fingerprint' : 'app-version' },
  };
}

export function loadConfig(rootInput = '.'): ArchitectureConfig | null {
  const path = join(resolve(rootInput), CONFIG_FILE);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as ArchitectureConfig;
}

export function mergeConfig(base: ArchitectureConfig, values: { workflow?: Workflow; topology?: Topology; presentation?: Presentation; modules?: string[]; capabilities?: Capability[] }): ArchitectureConfig {
  const workflow = values.workflow ?? base.workflow;
  return {
    ...base,
    ...values,
    workflow,
    navigation: values.workflow ? (workflow === 'expo' ? 'expo-router' : 'react-navigation') : base.navigation,
    modules: values.modules ?? base.modules,
    capabilities: values.capabilities ?? base.capabilities,
    release: values.workflow ? { provider: workflow === 'expo' ? 'eas' : 'fastlane', ota: workflow === 'expo' ? 'eas-update' : 'none', runtimeVersion: workflow === 'expo' ? 'fingerprint' : 'app-version' } : base.release,
  };
}

export function validateConfig(config: ArchitectureConfig): string[] {
  const errors: string[] = [];
  if (config.version !== 1) errors.push('Unsupported config version.');
  if (config.topology === 'mobile-microfrontends' && config.workflow === 'expo') errors.push('Mobile microfrontends require a custom native/bundler workflow; select bare or brownfield.');
  if (config.offline.mode === 'offline-write' && !config.offline.idempotency) errors.push('offline-write requires idempotency.');
  if (config.offline.mode === 'local-first' && config.persistence.database === 'none') errors.push('local-first requires a database.');
  if (config.release.ota === 'eas-update' && config.workflow !== 'expo') errors.push('EAS Update requires an Expo-compatible workflow.');
  if (config.integration.transport === 'graphql' && config.integration.contract !== 'graphql-schema') errors.push('GraphQL requires graphql-schema contracts.');
  return errors;
}
