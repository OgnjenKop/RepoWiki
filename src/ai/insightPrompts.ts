import type { ModuleInsight, ProjectNarrative, ArchitecturalStory } from "./types.js";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ProjectContext = {
  projectName: string;
  projectType: string;
  moduleList: string[];
  areaList: string[];
  keyFiles: string[];
  dependencies: string[];
  scripts: Record<string, string>;
  routeCount: number;
  testCount: number;
  evidenceSnippets: string;
};

export function buildProjectNarrativeMessages(ctx: ProjectContext): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are writing the opening narrative for a repository wiki.",
        "Your output replaces a dry bullet-list project summary. The wiki page already lists files, modules, and commands - your job is the WHY and the WHAT-FOR.",
        "Write content that helps a new developer answer three questions:",
        "  1. What is this, in one sentence? (tagline + overview)",
        "  2. Who uses this and what problem does it solve? (audience)",
        "  3. What is the design philosophy? (designPhilosophy + keyInsights)",
        "BANNED patterns — do NOT use any of these openings:",
        "  - 'X is a [type] project' / 'X is a [type] application'",
        "  - 'This project provides...' / 'This project is a...'",
        "  - Generic descriptors with no concrete evidence ('modern', 'powerful', 'flexible', 'robust', 'comprehensive')",
        "Lead with the most concrete, distinctive thing about this codebase. Name the actual framework, the actual platform split, the actual deployment target.",
        "Use only the evidence provided. Do not invent features or claims.",
        "Do not reference file paths you are not given in the evidence. Do not cite time estimates, durations, or made-up specifics.",
        "If the evidence is thin for a section, say so explicitly - do not pad with generic language.",
        "Return a single JSON object and nothing else. Do not wrap in markdown fences.",
        "Use exactly these keys: tagline, overview, audience, designPhilosophy, keyInsights.",
        "tagline must be a single sentence under 90 characters. It must be specific, not generic.",
        "overview must be 2-3 sentences explaining what this is. Lead with the most concrete thing (e.g. 'Built on Expo with separate native and website targets...' not 'This is a cross-platform application...').",
        "audience must be 1-2 sentences on who uses this. Be specific about the user or use case.",
        "designPhilosophy must be 1-2 sentences on the design approach. Name the actual pattern or constraint (e.g. 'platform isolation via separate codebases' not 'modular architecture').",
        "keyInsights must be an array of 3-5 short bullet points (each under 100 chars). Each bullet must be a concrete, verifiable claim with a real dependency, framework, or file pattern from the evidence."
      ].join(" ")
    },
    {
      role: "user",
      content: [
        `## Project: ${ctx.projectName}`,
        `- Type: ${ctx.projectType}`,
        `- Modules: ${ctx.moduleList.join(", ")}`,
        `- Areas: ${ctx.areaList.join(", ")}`,
        `- Routes: ${ctx.routeCount}`,
        `- Tests: ${ctx.testCount}`,
        "",
        "## Scripts",
        ...Object.entries(ctx.scripts).map(([k, v]) => `- ${k}: ${v}`),
        "",
        "## Dependencies",
        ...ctx.dependencies.map((d) => `- ${d}`),
        "",
        "## Key Files",
        ...ctx.keyFiles.map((f) => `- ${f}`),
        "",
        "## Evidence Snippets",
        ctx.evidenceSnippets,
        "",
        "## Required Output",
        "{",
        '  "tagline": "string",',
        '  "overview": "string",',
        '  "audience": "string",',
        '  "designPhilosophy": "string",',
        '  "keyInsights": ["string"]',
        "}"
      ].join("\n")
    }
  ];
}

export function buildArchitectureStoryMessages(ctx: ProjectContext): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are writing the architectural story for a repository's wiki.",
        "The wiki already shows module dependencies, entry files, and area groupings. Your job is to explain the design intent behind that structure.",
        "Write content that answers: Why is this organized this way? What invariants does the architecture preserve? What tradeoffs were made?",
        "Do not summarize what is in the evidence - the wiki lists that. Explain the reasoning.",
        "Use only the evidence provided. Do not invent design decisions.",
        "BANNED phrases — do NOT write:",
        "  - 'has likely grown from' / 'has likely evolved from' (overused hedge)",
        "  - Generic claims like 'encourages code reuse' / 'enables independent evolution' without naming the SPECIFIC mechanism in this codebase",
        "  - 'is a core part of' / 'is central to' (boilerplate)",
        "If you cannot ground a tradeoff, invariant, or evolution claim in the evidence, omit it.",
        "The 'overview' field is for the architectural shape (how the codebase is organized into layers, areas, or tiers) — NOT a description of what the project does. The project description lives elsewhere in the wiki. Here, focus on structure: how many tiers, how platform-specific code is isolated, how core logic is shared, how dependencies flow between layers.",
        "Return a single JSON object and nothing else. Do not wrap in markdown fences.",
        "Use exactly these keys: overview, designIntent, tradeoffs, invariants, evolution.",
        "overview must be 2-3 sentences describing the architectural shape (layers, areas, platform splits, dependency direction). It must NOT restate what the project does.",
        "designIntent must be 2-4 sentences explaining WHY this shape was chosen. Name the actual constraint that drove it (e.g. 'separate Expo prebuilds per platform' not 'modular best practices').",
        "tradeoffs must be an array of 2-4 strings (each under 140 chars), naming tradeoffs that are visible in the structure (duplication, build complexity, etc.).",
        "invariants must be an array of 2-4 strings naming things the architecture guarantees — these should be things a developer could verify by reading the code.",
        "evolution must be 1-2 sentences on how the architecture has likely grown, based on the evidence. Skip this if the evidence is too thin to support a claim."
      ].join(" ")
    },
    {
      role: "user",
      content: [
        `## Project: ${ctx.projectName}`,
        `- Type: ${ctx.projectType}`,
        `- Modules: ${ctx.moduleList.join(", ")}`,
        `- Areas: ${ctx.areaList.join(", ")}`,
        "",
        "## Key Files",
        ...ctx.keyFiles.map((f) => `- ${f}`),
        "",
        "## Evidence Snippets",
        ctx.evidenceSnippets,
        "",
        "## Required Output",
        "{",
        '  "overview": "string",',
        '  "designIntent": "string",',
        '  "tradeoffs": ["string"],',
        '  "invariants": ["string"],',
        '  "evolution": "string"',
        "}"
      ].join("\n")
    }
  ];
}

export function buildModuleInsightMessages(
  moduleName: string,
  moduleFiles: string[],
  relatedFiles: string[],
  evidenceSnippets: string
): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are writing insight content for a single module's wiki page.",
        "The wiki page already lists the module's files, exports, consumers, and tests. Your job is the module's design intent - the WHY behind its existence.",
        "Generate content that helps a developer decide: should I add to this module, or create a new one? When would I extend it vs work around it?",
        "Use only the evidence. Do not invent patterns. Do not claim a file is or is not exported unless the evidence explicitly shows it. If you cannot verify a gotcha, return an empty array for gotchas.",
        "BANNED openings for 'intent' — do NOT start with:",
        "  - 'This module provides...' / 'This module is responsible for...'",
        "  - 'The X module centralizes/handles/offers X'",
        "  - 'X module' (just naming the module in the opening sentence is filler)",
        "Lead with the module's MOST DISTINCTIVE characteristic: a specific file pattern, an unusual design constraint, or a non-obvious role in the system. If you cannot find one, name what is concrete in the file list.",
        "BANNED openings for 'whenToExtend' — do NOT start with:",
        "  - 'Add to this module when...' (overused template)",
        "  - 'Create a new module for...' (always paired with the above)",
        "Instead, give a concrete signal: 'If your new X is imported by Y and depends on Z, add here' or 'If X is a sibling of Y but shares no imports, create a new module'.",
        "BANNED entries for 'relatedConcepts' — do NOT include:",
        "  - Vague 1-2 word fragments ('state management', 'localization', 'error handling')",
        "  - Concepts that are not present in the evidence (no file, no dependency, no export)",
        "  - Generic framework names without a specific file or symbol from this module's evidence",
        "Each relatedConcept must reference something visible in the evidence (a specific file, dependency, or sibling module by name). If you cannot ground it, omit it.",
        "If the evidence does not support a section, return an empty array for it.",
        "Return a single JSON object and nothing else. Do not wrap in markdown fences.",
        "Use exactly these keys: intent, patterns, gotchas, whenToExtend, relatedConcepts.",
        "intent must be 2-3 sentences. Lead with the module's most distinctive role, not a generic description.",
        "patterns must be an array of 2-4 strings naming concrete patterns visible in the evidence (e.g. 'factory functions in X', 'pure transformation functions in Y').",
        "gotchas must be an array of 1-3 strings naming real subtle behaviors or traps. Each gotcha MUST cite a file or symbol from the evidence. If you cannot find concrete evidence for a gotcha, return an empty array.",
        "whenToExtend must be 1-2 sentences giving a concrete signal for when to add to vs create-new. Reference specific imports, sibling modules, or constraints.",
        "relatedConcepts must be an array of 1-3 strings. Each must reference a specific file, dependency, or sibling module that appears in the evidence."
      ].join(" ")
    },
    {
      role: "user",
      content: [
        `## Module: ${moduleName}`,
        "",
        "## Files in this module",
        ...moduleFiles.map((f) => `- ${f}`),
        "",
        "## Related files (imported from or importing this module)",
        ...relatedFiles.map((f) => `- ${f}`),
        "",
        "## Evidence Snippets",
        evidenceSnippets,
        "",
        "## Required Output",
        "{",
        '  "intent": "string",',
        '  "patterns": ["string"],',
        '  "gotchas": ["string"],',
        '  "whenToExtend": "string",',
        '  "relatedConcepts": ["string"]',
        "}"
      ].join("\n")
    }
  ];
}

export function parseProjectNarrative(content: string): ProjectNarrative {
  const obj = safeParseJson(content);
  return {
    tagline: optionalString(obj?.tagline) ?? extractTagline(content),
    overview: optionalString(obj?.overview) ?? extractLeadParagraph(content),
    audience: optionalString(obj?.audience) ?? "",
    designPhilosophy: optionalString(obj?.designPhilosophy) ?? "",
    keyInsights: optionalStringArray(obj?.keyInsights) ?? []
  };
}

export function parseArchitectureStory(content: string): ArchitecturalStory {
  const obj = safeParseJson(content);
  return {
    overview: optionalString(obj?.overview) ?? extractLeadParagraph(content),
    designIntent: optionalString(obj?.designIntent) ?? "",
    tradeoffs: optionalStringArray(obj?.tradeoffs) ?? [],
    invariants: optionalStringArray(obj?.invariants) ?? [],
    evolution: optionalString(obj?.evolution) ?? ""
  };
}

export function parseModuleInsight(content: string): ModuleInsight {
  const obj = safeParseJson(content);
  return {
    intent: optionalString(obj?.intent) ?? extractLeadParagraph(content),
    patterns: optionalStringArray(obj?.patterns) ?? [],
    gotchas: optionalStringArray(obj?.gotchas) ?? [],
    whenToExtend: optionalString(obj?.whenToExtend) ?? "",
    relatedConcepts: optionalStringArray(obj?.relatedConcepts) ?? []
  };
}

function safeParseJson(content: string): any {
  try {
    return parseJsonObject(content);
  } catch {
    return undefined;
  }
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
  return items.length ? items : undefined;
}

function extractTagline(content: string): string {
  const stripped = content.replace(/^#.*$/m, "").trim();
  const sentence = stripped.split(/[.!?\n]/)[0]?.trim() ?? "";
  return sentence.length > 90 ? sentence.slice(0, 87) + "..." : sentence;
}

function extractLeadParagraph(content: string): string {
  const stripped = content.replace(/^#.*$/m, "").trim();
  const paragraphs = stripped.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs[0] ?? stripped.slice(0, 280);
}

function parseJsonObject(content: string): any {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const text = fenced?.[1] ?? trimmed;
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in AI response");
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) { escape = false; continue; }
    if (c === "\\" && inString) { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return JSON.parse(text.slice(start, i + 1)); }
  }
  throw new Error("Unclosed JSON object in AI response");
}
