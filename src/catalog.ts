import type { ArchitectureConfig, Capability } from './types.js';

export type CapabilitySpec = { purpose: string; dependencies: (config: ArchitectureConfig) => string[]; guards: string[] };

export const CATALOG: Record<Capability, CapabilitySpec> = {
  auth: { purpose: 'Session and protected navigation', dependencies: (c) => [c.workflow === 'expo' ? 'expo-secure-store' : 'react-native-keychain'], guards: ['credentials-outside-general-storage', 'clear-user-data-on-logout'] },
  'server-state': { purpose: 'Remote cache and mutations', dependencies: (c) => c.state.server === 'tanstack-query' ? ['@tanstack/react-query'] : c.state.server === 'none' ? [] : [c.state.server === 'apollo' ? '@apollo/client' : 'urql'], guards: ['no-server-state-in-client-store', 'query-key-factory'] },
  'client-state': { purpose: 'Shared client-only state', dependencies: (c) => c.state.client === 'zustand' ? ['zustand'] : c.state.client === 'redux-toolkit' ? ['@reduxjs/toolkit', 'react-redux'] : [], guards: ['no-server-state-mirroring'] },
  forms: { purpose: 'Typed form state and validation', dependencies: () => ['react-hook-form', 'zod', '@hookform/resolvers'], guards: ['schema-at-boundary'] },
  offline: { purpose: 'Persistence and synchronization', dependencies: (c) => [c.persistence.preferences === 'mmkv' ? 'react-native-mmkv' : '', c.persistence.database === 'sqlite' ? 'expo-sqlite' : ''].filter(Boolean), guards: ['idempotent-outbox', 'versioned-storage', 'tested-migrations'] },
  'design-system': { purpose: 'Tokens, themes, primitives and accessibility', dependencies: () => [], guards: ['no-raw-colors-in-product-ui', 'reduced-motion'] },
  animation: { purpose: 'Motion and gestures', dependencies: () => ['react-native-reanimated'], guards: ['reduced-motion'] },
  maps: { purpose: 'Maps and location', dependencies: () => [], guards: ['contextual-permission', 'no-precise-location-logs'] },
  observability: { purpose: 'Crash reporting and release diagnostics', dependencies: () => ['@sentry/react-native'], guards: ['no-sensitive-logs', 'release-tagged-sourcemaps'] },
  release: { purpose: 'Build, submission, OTA and versioning', dependencies: () => [], guards: ['native-change-invalidates-ota', 'runtime-version-match', 'monotonic-build-number'] },
};

export function dependenciesFor(config: ArchitectureConfig): string[] {
  return [...new Set(config.capabilities.flatMap((name) => CATALOG[name].dependencies(config)))].sort();
}
