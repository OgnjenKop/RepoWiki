import type { ProjectNarrative, ArchitecturalStory, ModuleInsight } from "../ai/types.js";
import { code, list, pluralize, section, callout } from "./markdown.js";

export function renderProjectNarrative(narrative: ProjectNarrative): string {
  const parts: string[] = [];
  if (narrative.tagline) {
    parts.push(`> **${narrative.tagline}**`);
    parts.push("");
  }
  if (narrative.overview) {
    parts.push(narrative.overview);
    parts.push("");
  }
  if (narrative.audience) {
    parts.push(`**Who it's for:** ${narrative.audience}`);
    parts.push("");
  }
  if (narrative.designPhilosophy) {
    parts.push(`**Design approach:** ${narrative.designPhilosophy}`);
  }
  if (narrative.keyInsights.length) {
    parts.push("");
    parts.push(list(narrative.keyInsights));
  }
  return parts.join("\n").trim();
}

export function renderArchitectureStory(story: ArchitecturalStory): string {
  const parts: string[] = [];
  if (story.overview) {
    parts.push(story.overview);
    parts.push("");
  }
  if (story.designIntent) {
    parts.push(`### Why This Shape`);
    parts.push(story.designIntent);
    parts.push("");
  }
  if (story.invariants.length) {
    parts.push(`### Invariants The Architecture Preserves`);
    parts.push(list(story.invariants));
    parts.push("");
  }
  if (story.tradeoffs.length) {
    parts.push(`### Tradeoffs`);
    parts.push(list(story.tradeoffs));
    parts.push("");
  }
  if (story.evolution) {
    parts.push(`### How It Grew`);
    parts.push(story.evolution);
  }
  return parts.join("\n").trim();
}

export function renderModuleInsight(insight: ModuleInsight): string {
  const parts: string[] = [];
  if (insight.intent) {
    parts.push(`### Design Intent`);
    parts.push(insight.intent);
    parts.push("");
  }
  if (insight.patterns.length) {
    parts.push(`### Patterns Used Here`);
    parts.push(list(insight.patterns));
    parts.push("");
  }
  if (insight.gotchas.length) {
    parts.push(`### Gotchas`);
    parts.push(calloutBody(insight.gotchas));
    parts.push("");
  }
  if (insight.whenToExtend) {
    parts.push(`### When To Extend`);
    parts.push(insight.whenToExtend);
    parts.push("");
  }
  if (insight.relatedConcepts.length) {
    parts.push(`### Related Concepts`);
    parts.push(list(insight.relatedConcepts));
  }
  return parts.join("\n").trim();
}

function calloutBody(items: string[]): string {
  return `> ${items.map((item) => `- ${item}`).join("\n> ")}`;
}
