import type { ComponentRecord, DesignTokenCategory, DesignTokenRecord, RepoScan } from "../types/index.js";
import { code, heading, list, pluralize } from "../utils/markdown.js";

export function generateDesignDoc(scan: RepoScan): string {
  const designSystem = scan.graph.designSystem;
  const components = scan.graph.components.filter((c) => !c.isStory);
  const stories = scan.graph.components.filter((c) => c.isStory);
  const tokens = scan.graph.designTokens;

  if (!designSystem && components.length === 0 && tokens.length === 0) {
    return `# ${heading("Design System")}

_No design system, UI components, or design tokens were detected in this repository._

This page is generated when the project contains UI components, design tokens, or a design system configuration. Add a framework like React, Vue, or Svelte, or define design tokens in CSS variables, theme files, or token JSON to populate this page.
`;
  }

  const componentsByFramework = groupComponentsByFramework(components);
  const tokensByCategory = groupTokensByCategory(tokens);

  return `# ${heading("Design System")}

## Overview

${list(
  [
    designSystem ? `Primary UI framework: ${code(designSystem.framework)}` : "No primary UI framework detected.",
    designSystem?.componentLibraries.length ? `Component libraries: ${designSystem.componentLibraries.map(code).join(", ")}` : undefined,
    components.length ? `Components detected: ${pluralize(components.length, "component")}` : "No UI components detected.",
    stories.length ? `Storybook stories: ${pluralize(stories.length, "story")}` : "No Storybook stories detected.",
    tokens.length ? `Design tokens: ${pluralize(tokens.length, "token")}` : "No design tokens detected.",
    designSystem?.hasStorybook ? "Storybook configuration detected." : "No Storybook configuration detected."
  ].filter((value): value is string => Boolean(value))
)}

## Component Files

${list(designSystem?.componentFiles.map(code) ?? [], "_No component files detected._")}

## Storybook Files

${list(designSystem?.storyFiles.map(code) ?? [], "_No Storybook story files detected._")}

## Token Files

${list(designSystem?.tokenFiles.map(code) ?? [], "_No design token files detected._")}

## Components By Framework

${list(
  Object.entries(componentsByFramework).map(([framework, items]) => `${code(framework)} - ${pluralize(items.length, "component")}`),
  "_No UI components detected._"
)}

## Components

${list(components.map((component) => formatComponentLine(component)), "_No UI components detected._")}

## Design Tokens By Category

${list(
  Object.entries(tokensByCategory).map(([category, items]) => `${code(category)} - ${pluralize(items.length, "token")}`),
  "_No design tokens detected._"
)}

## Design Tokens

${list(renderTokenLines(tokens), "_No design tokens detected._")}

## Notes For AI Agents

- Component detection is based on PascalCase exports in .tsx/.jsx files, .vue files, .svelte files, and Angular @Component decorators.
- Design token detection covers CSS custom properties, SCSS variables, theme objects in JS/TS, and token JSON files.
- Storybook stories are detected by the .stories.{ts,tsx,js,jsx} file naming convention.
- Add or update design tokens in the listed token files; this page is regenerated each time the wiki is updated.
- When adding new components, follow the same file conventions so they are automatically catalogued.
`;
}

function formatComponentLine(component: ComponentRecord): string {
  const ref = component.line ? code(`${component.file}:${component.line}`) : code(component.file);
  const props = component.props?.length ? ` props: ${component.props.map(code).join(", ")}` : "";
  const exportTag = component.exported ? " (exported)" : "";
  return `${code(component.name)} in ${ref} - ${component.framework} component${exportTag}${props}`;
}

function renderTokenLines(tokens: DesignTokenRecord[]): string[] {
  return tokens.map((token) => {
    const ref = token.line ? code(`${token.file}:${token.line}`) : code(token.file);
    return `${code(token.name)} = ${code(token.value)} (${token.category}, ${token.source}) in ${ref}`;
  });
}

function groupComponentsByFramework(components: ComponentRecord[]): Record<string, ComponentRecord[]> {
  const grouped: Record<string, ComponentRecord[]> = {};
  for (const component of components) {
    const key = component.framework;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(component);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

function groupTokensByCategory(tokens: DesignTokenRecord[]): Record<DesignTokenCategory, DesignTokenRecord[]> {
  const grouped = {
    color: [] as DesignTokenRecord[],
    spacing: [] as DesignTokenRecord[],
    typography: [] as DesignTokenRecord[],
    shadow: [] as DesignTokenRecord[],
    border: [] as DesignTokenRecord[],
    animation: [] as DesignTokenRecord[],
    breakpoint: [] as DesignTokenRecord[],
    other: [] as DesignTokenRecord[]
  } satisfies Record<DesignTokenCategory, DesignTokenRecord[]>;
  for (const token of tokens) {
    grouped[token.category].push(token);
  }
  for (const key of Object.keys(grouped) as DesignTokenCategory[]) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}
