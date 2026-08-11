export type Workflow = 'expo' | 'bare' | 'brownfield';
export type Topology = 'modular-monolith' | 'multi-package-app' | 'mobile-platform' | 'mobile-microfrontends';
export type Presentation = 'hook-based-mvvm' | 'mvi' | 'clean' | 'viper';
export type Transport = 'rest' | 'graphql' | 'hybrid';
export type OfflineMode = 'none' | 'cache-persisted' | 'offline-read' | 'offline-write' | 'local-first';
export type ReleaseProvider = 'eas' | 'fastlane' | 'custom';
export type Capability =
  | 'auth'
  | 'server-state'
  | 'client-state'
  | 'forms'
  | 'offline'
  | 'design-system'
  | 'animation'
  | 'maps'
  | 'observability'
  | 'release';

export type ArchitectureConfig = {
  $schema?: string;
  version: 1;
  workflow: Workflow;
  topology: Topology;
  presentation: Presentation;
  navigation: 'expo-router' | 'react-navigation';
  modules: string[];
  core: string[];
  capabilities: Capability[];
  integration: { transport: Transport; contract: 'openapi' | 'graphql-schema' | 'runtime-schema'; codegen: boolean };
  state: { server: 'tanstack-query' | 'apollo' | 'urql' | 'none'; client: 'zustand' | 'redux-toolkit' | 'local' };
  persistence: { preferences: 'mmkv' | 'async-storage' | 'none'; credentials: 'secure-store' | 'keychain'; database: 'sqlite' | 'none' };
  offline: { mode: OfflineMode; conflictPolicy: 'server-authoritative' | 'client-authoritative' | 'manual'; idempotency: boolean };
  design: { uiKit: 'internal' | 'paper' | 'tamagui' | 'nativewind' | 'gluestack' | 'restyle' | 'none'; themes: Array<'light' | 'dark'>; fonts: 'system' | 'local' };
  release: { provider: ReleaseProvider; ota: 'eas-update' | 'none' | 'custom'; runtimeVersion: 'fingerprint' | 'app-version' | 'manual' };
};

export type Finding = { level: 'error' | 'warning'; code: string; message: string; file?: string };
export type Audit = { root: string; reactNative: boolean; expo: boolean; topology: Topology | 'unknown'; strictTypeScript: boolean; config: ArchitectureConfig | null; findings: Finding[] };
export type PlannedFile = { path: string; content: string; reason: string };
export type ArchitecturePlan = { root: string; config: ArchitectureConfig; files: PlannedFile[]; warnings: string[] };
export type ApplyOptions = { dryRun?: boolean; force?: boolean };
export type ApplyResult = { created: string[]; skipped: string[]; unchanged: string[] };
