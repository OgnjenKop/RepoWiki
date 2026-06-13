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
        "You are writing an evidence-grounded repository wiki summary for an AI coding agent.",
        "Use only the provided evidence pack.",
        "Do not invent behavior, APIs, dependencies, or flows that are not supported by the evidence.",
        "Cite file paths inline when making claims.",
        "When evidence is weak, say so explicitly.",
        "Return a single JSON object and nothing else.",
        "Do not wrap the JSON in markdown fences.",
        "Use these keys exactly: summary, responsibilities, importantFiles, executionFlow, decisionPoints, commonChangePaths, changeTargets, changeRisks, verificationSteps, notesForAiAgents, unknowns.",
        "responsibilities, executionFlow, decisionPoints, changeRisks, verificationSteps, notesForAiAgents, and unknowns must be arrays of strings.",
        "commonChangePaths must be an array of objects with task, files, note, and evidence string[] fields.",
        "importantFiles and changeTargets must be arrays of objects with path, reason, and evidence string[] fields."
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
        "## Evidence Rules",
        "- Prefer claims supported by multiple files or by graph/knowledge items.",
        "- Distinguish runtime code from tests, configs, and documentation.",
        "- If the pack is for a module or route, focus on what it does, how it is wired, and what to change safely.",
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
        "Keep all strings concise and evidence-grounded."
      ].join("\n")
    }
  ];
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
