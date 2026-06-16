import type { ContextPack } from "./types.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { formatChangePath } from "../utils/changePaths.js";
import { formatVerificationHint } from "../knowledge/verification.js";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export function buildSummaryMessages(pack: ContextPack): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are writing Qoder-style repository wiki content for an AI coding agent.",
        "Write evidence-grounded documentation, not generic repository commentary.",
        "Your output will be rendered directly into a generated repo wiki, so it must be useful for a developer making a safe first change.",
        "Use only the provided evidence pack.",
        "Do not invent behavior, APIs, dependencies, or flows that are not supported by the evidence.",
        "Every non-obvious claim must include file-path evidence in the relevant evidence array or inline text.",
        "When evidence is weak, say so explicitly.",
        "Prefer specific architecture, ownership, flow, and change guidance over generic descriptions.",
        "Do not say a module \"likely\" does something unless the evidence is weak; otherwise state the supported behavior directly.",
        "Distinguish runtime code, tests, configs, generated files, and docs.",
        "Return a single JSON object and nothing else.",
        "Do not wrap the JSON in markdown fences.",
        "Use these keys exactly: summary, responsibilities, importantFiles, executionFlow, decisionPoints, commonChangePaths, changeTargets, changeRisks, verificationSteps, notesForAiAgents, unknowns.",
        "responsibilities, executionFlow, decisionPoints, changeRisks, verificationSteps, notesForAiAgents, and unknowns must be arrays of strings.",
        "commonChangePaths must be an array of objects with task, files, note, and evidence string[] fields.",
        "importantFiles and changeTargets must be arrays of objects with path, reason, and evidence string[] fields.",
        "Keep JSON compact: summary must be 2-3 sentences, arrays must contain at most 5 items, and each string must be under 240 characters."
      ].join(" ")
    },
    {
      role: "user",
      content: [
        `## Scope`,
        `- Scope: ${pack.scope}`,
        `- Title: ${pack.title}`,
        `- Summary hint: ${pack.summaryHint}`,
        "",
        "## Documentation Goal",
        "- Produce wiki content comparable to a high-quality Qoder RepoWiki page.",
        "- Optimize for agent navigation: what this scope owns, where to read first, where edits usually happen, what can break, and how to verify.",
        "- The response should be concise but not shallow. Avoid generic boilerplate like \"this module manages functionality\".",
        "- Keep the JSON compact enough for cheaper models: no section should include more than 5 entries.",
        "- If the evidence is insufficient for a section, put the gap in unknowns instead of guessing.",
        "",
        "## Scope-Specific Instructions",
        scopeInstructions(pack.scope),
        "",
        "## Evidence Rules",
        "- Prefer claims supported by multiple files or by graph/knowledge items.",
        "- Distinguish runtime code from tests, configs, and documentation.",
        "- If the pack is for a module or route, focus on what it does, how it is wired, and what to change safely.",
        "- Use exact file paths from the evidence pack. Do not refer to files that are not listed.",
        "- For each importantFiles, changeTargets, and commonChangePaths entry, include evidence with concrete file paths.",
        "- verificationSteps must reference provided commands, tests, or files when available.",
        "",
        "## Required Output Shape",
        "{",
        '  "summary": "string",',
        '  "responsibilities": ["string"],',
        '  "importantFiles": [{"path": "string", "reason": "string", "evidence": ["string"]}],',
        '  "executionFlow": ["string"],',
        '  "decisionPoints": ["string"],',
        '  "commonChangePaths": [{"task": "string", "files": ["string"], "note": "string", "evidence": ["string"]}],',
        '  "changeTargets": [{"path": "string", "reason": "string", "evidence": ["string"]}],',
        '  "changeRisks": ["string"],',
        '  "verificationSteps": ["string"],',
        '  "notesForAiAgents": ["string"],',
        '  "unknowns": ["string"]',
        "}",
        "",
        "## Field Quality Requirements",
        "- summary: 2-4 sentences explaining ownership, architecture role, and confidence/unknowns if needed.",
        "- responsibilities: concrete responsibilities backed by files or relations.",
        "- importantFiles: prioritize entry points, central files, configs, route handlers, state/service files, and tests that reveal behavior.",
        "- executionFlow: describe actual module/file flow using imports, relations, or route/test evidence.",
        "- decisionPoints: explain how an agent should choose where to edit.",
        "- commonChangePaths: practical edit tasks with ordered files and evidence.",
        "- changeTargets: specific files to edit, with reasons and evidence.",
        "- changeRisks: real risks from dependencies, shared state, routes, configs, or missing tests.",
        "- verificationSteps: commands/tests/manual checks grounded in provided verification hints.",
        "- notesForAiAgents: short instructions for a coding agent entering this scope.",
        "- unknowns: anything important that the evidence pack cannot prove.",
        "",
        "## Knowledge Items",
        ...formatKnowledge(pack),
        "",
        "## Relations",
        ...formatRelations(pack),
        "",
        "## Flows",
        ...formatFlows(pack),
        "",
        "## Verification Hints",
        ...formatVerificationHints(pack),
        "",
        "## Common Change Paths",
        ...formatChangePaths(pack),
        "",
        "## Change Targets",
        ...formatChangeTargets(pack),
        "",
        "## Files",
        ...formatFiles(pack),
        "",
        "## Output Reminder",
        "Return ONLY a single JSON object. Do not return multiple objects, an array, or any explanatory text outside the JSON. Start with '{' and end with '}'. Every required key must be present: summary, responsibilities, importantFiles, executionFlow, decisionPoints, commonChangePaths, changeTargets, changeRisks, verificationSteps, notesForAiAgents, unknowns."
      ].join("\n")
    }
  ];
}

function scopeInstructions(scope: ContextPack["scope"]): string {
  if (scope === "project") {
    return [
      "- Explain the repo's major areas, entry points, build/test workflow, and safest reading order.",
      "- Highlight cross-cutting files and architectural seams.",
      "- Include repo-wide change paths, not only module-local edits."
    ].join("\n");
  }
  if (scope === "area") {
    return [
      "- Explain how the modules in this area work together.",
      "- Identify incoming/outgoing area dependencies and where changes propagate.",
      "- Name the files an agent should inspect before editing the area."
    ].join("\n");
  }
  if (scope === "module") {
    return [
      "- Explain the module's ownership, public surface, internal flow, consumers, and tests.",
      "- Identify the module entry files and likely edit points.",
      "- Describe how this module interacts with neighboring modules."
    ].join("\n");
  }
  return [
    "- Explain the route/API entry, handler flow, owning module, and verification path.",
    "- Identify request/response or contract risks if supported by evidence.",
    "- Point to tests or manual checks for the route when available."
  ].join("\n");
}

function formatKnowledge(pack: ContextPack): string[] {
  if (!pack.knowledge.length) return ["- _No knowledge items provided._"];
  return pack.knowledge.flatMap((item) => {
    const lines = [
      `- ${item.kind.toUpperCase()}: ${item.title}`,
      `  - Files: ${item.files.join(", ")}`,
      `  - Summary: ${item.summary}`
    ];
    if (item.evidence.length) {
      lines.push(
        "  - Evidence:",
        ...item.evidence.map((evidence) => {
          const location = evidence.lines ? `${evidence.file}:${evidence.lines[0]}-${evidence.lines[1]}` : evidence.file;
          return `    - ${location} (${evidence.reason})`;
        })
      );
    }
    return lines;
  });
}

function formatFiles(pack: ContextPack): string[] {
  if (!pack.files.length) return ["- _No files provided._"];
  return pack.files.flatMap((file) => [
    `### ${file.path}`,
    `- Language: ${file.language}`,
    `- Imports: ${file.imports.length ? file.imports.join(", ") : "_none_"}`,
    `- Exports: ${file.exports.length ? file.exports.join(", ") : "_none_"}`,
    `- Symbols: ${file.symbols.length ? file.symbols.map((symbol) => `${symbol.kind}:${symbol.name}${symbol.exported ? " (exported)" : ""}${symbol.line ? ` @ ${file.path}:${symbol.line}` : ""}`).join(", ") : "_none_"}`,
    "~~~",
    file.snippet || "_No snippet available._",
    "~~~",
    ""
  ]);
}

function formatRelations(pack: ContextPack): string[] {
  if (!pack.relations.length) return ["- _No relations provided._"];
  return pack.relations.flatMap((relation) => {
    const lines = [
      `- ${relation.title}`,
      `  - Note: ${relation.note}`,
      `  - Files: ${relation.files.length ? relation.files.join(", ") : "_none_"}`
    ];
    return lines;
  });
}

function formatFlows(pack: ContextPack): string[] {
  if (!pack.flows.length) return ["- _No flows provided._"];
  return pack.flows.flatMap((flow) => {
    const lines = [
      `- ${flow.title}`,
      `  - Note: ${flow.note}`,
      `  - Files: ${flow.files.length ? flow.files.join(", ") : "_none_"}`,
      `  - Steps:`
    ];
    lines.push(...flow.steps.map((step) => `    - ${step}`));
    return lines;
  });
}

function formatChangePaths(pack: ContextPack): string[] {
  if (!pack.changePaths.length) return ["- _No common change paths provided._"];
  return pack.changePaths.map((path) => `- ${formatChangePath(path)}`);
}

function formatVerificationHints(pack: ContextPack): string[] {
  if (!pack.verificationHints.length) return ["- _No verification hints provided._"];
  return pack.verificationHints.map((hint) => `- ${formatVerificationHint(hint)}`);
}

function formatChangeTargets(pack: ContextPack): string[] {
  if (!pack.changeTargets.length) return ["- _No change targets provided._"];
  return pack.changeTargets.flatMap((target) => {
    const lines = [`- ${target.line ? `${target.path}:${target.line}` : target.path} - ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}`];
    if (target.caution) lines.push(`  - Caution: ${target.caution}`);
    return lines;
  });
}
