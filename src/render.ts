import type { ApplyResult, ArchitecturePlan, Audit } from './types.js';

export function renderAudit(result: Audit): string {
  const lines = ['# React Native Architecture Audit', '', `- Project: ${result.reactNative ? 'React Native' : 'not detected'}`, `- Workflow: ${result.expo ? 'Expo' : 'Bare or unknown'}`, `- Topology: ${result.topology}`, `- TypeScript strict: ${result.strictTypeScript ? 'yes' : 'no'}`, `- Architecture contract: ${result.config ? 'present' : 'missing'}`, '', '## Findings', ''];
  if (!result.findings.length) lines.push('No findings.');
  for (const finding of result.findings) lines.push(`- **${finding.level}** ${finding.code}${finding.file ? ` (${finding.file})` : ''}: ${finding.message}`);
  return `${lines.join('\n')}\n`;
}

export function renderPlan(plan: ArchitecturePlan): string {
  const lines = ['# Architecture Plan', '', `Topology: ${plan.config.topology}`, `Presentation: ${plan.config.presentation}`, `Files: ${plan.files.length}`, '', '## Changes', ''];
  lines.push(...plan.files.map((file) => `- \`${file.path}\` — ${file.reason}`));
  if (plan.warnings.length) lines.push('', '## Blocking configuration issues', '', ...plan.warnings.map((w) => `- ${w}`));
  return `${lines.join('\n')}\n`;
}

export function renderApply(result: ApplyResult, dryRun: boolean): string {
  const lines = [dryRun ? 'Planned files:' : 'Created or updated files:', ...result.created.map((file) => `+ ${file}`)];
  if (result.unchanged.length) lines.push('Unchanged files:', ...result.unchanged.map((file) => `= ${file}`));
  if (result.skipped.length) lines.push('Skipped existing files:', ...result.skipped.map((file) => `! ${file}`));
  return `${lines.join('\n')}\n`;
}
