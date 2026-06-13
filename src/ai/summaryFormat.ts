import type { ContextChangePath } from "../knowledge/moduleFocus.js";
import { formatChangePath } from "../utils/changePaths.js";

export type AiSummaryDraft = {
  summary: string;
  responsibilities: string[];
  importantFiles: Array<{
    path: string;
    reason: string;
    evidence: string[];
  }>;
  executionFlow: string[];
  decisionPoints: string[];
  commonChangePaths: ContextChangePath[];
  changeTargets: Array<{
    path: string;
    reason: string;
    evidence: string[];
  }>;
  changeRisks: string[];
  notesForAiAgents: string[];
  verificationSteps: string[];
  unknowns?: string[];
};

export function parseSummaryDraft(content: string): AiSummaryDraft {
  const jsonText = extractJson(content);
  const parsed = JSON.parse(jsonText) as Partial<AiSummaryDraft> | null;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI summary response was not a JSON object");
  }

  const summary = expectString(parsed.summary, "summary");
  const responsibilities = expectStringArray(parsed.responsibilities, "responsibilities");
  const importantFiles = expectImportantFiles(parsed.importantFiles);
  const executionFlow = expectStringArray(parsed.executionFlow, "executionFlow");
  const decisionPoints = expectStringArray(parsed.decisionPoints, "decisionPoints");
  const commonChangePaths = expectChangePaths(parsed.commonChangePaths);
  const changeTargets = expectChangeTargets(parsed.changeTargets);
  const changeRisks = expectStringArray(parsed.changeRisks, "changeRisks");
  const notesForAiAgents = expectStringArray(parsed.notesForAiAgents, "notesForAiAgents");
  const verificationSteps = expectStringArray(parsed.verificationSteps, "verificationSteps");
  const unknowns = parsed.unknowns === undefined ? undefined : expectStringArray(parsed.unknowns, "unknowns");

  return {
    summary,
    responsibilities,
    importantFiles,
    executionFlow,
    decisionPoints,
    commonChangePaths,
    changeTargets,
    changeRisks,
    notesForAiAgents,
    verificationSteps,
    unknowns
  };
}

export function renderSummaryMarkdown(draft: AiSummaryDraft): string {
  const sections = [
    "# Summary",
    draft.summary.trim(),
    "",
    "## Responsibilities",
    renderBullets(draft.responsibilities),
    "",
    "## Important Files",
    draft.importantFiles.length
      ? draft.importantFiles.map((file) => `- ${file.path} - ${file.reason}${file.evidence.length ? ` (evidence: ${file.evidence.join(", ")})` : ""}`).join("\n")
      : "- _No important files provided._",
    "",
    "## Execution/Flow",
    renderBullets(draft.executionFlow),
    "",
    "## Decision Points",
    renderBullets(draft.decisionPoints),
    "",
    "## Common Change Paths",
    draft.commonChangePaths.length
      ? draft.commonChangePaths.map((path) => `- ${formatChangePath(path)}`).join("\n")
      : "- _No common change paths provided._",
    "",
    "## Where To Change",
    draft.changeTargets.length
      ? draft.changeTargets.map((target) => `- ${target.path} - ${target.reason}${target.evidence.length ? ` (evidence: ${target.evidence.join(", ")})` : ""}`).join("\n")
      : "- _No change targets provided._",
    "",
    "## Change Risks",
    renderBullets(draft.changeRisks),
    "",
    "## Verification Steps",
    renderBullets(draft.verificationSteps),
    "",
    "## Notes For AI Agents",
    renderBullets(draft.notesForAiAgents)
  ];

  if (draft.unknowns?.length) {
    sections.push("", "## Unknowns", renderBullets(draft.unknowns));
  }

  return sections.join("\n");
}

function extractJson(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();
  return trimmed;
}

function expectString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`AI summary response missing string field: ${field}`);
  }
  return value.trim();
}

function expectStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`AI summary response missing array field: ${field}`);
  }
  return value.map((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      throw new Error(`AI summary response contains invalid ${field}[${index}]`);
    }
    return item.trim();
  });
}

function expectImportantFiles(value: unknown): Array<{ path: string; reason: string; evidence: string[] }> {
  if (!Array.isArray(value)) {
    throw new Error("AI summary response missing array field: importantFiles");
  }
  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`AI summary response contains invalid importantFiles[${index}]`);
    }
    const record = item as { path?: unknown; reason?: unknown };
    const path = expectString(record.path, `importantFiles[${index}].path`);
    const reason = expectString(record.reason, `importantFiles[${index}].reason`);
    const evidence = expectOptionalStringArray((item as { evidence?: unknown }).evidence, `importantFiles[${index}].evidence`);
    return { path, reason, evidence };
  });
}


function expectChangeTargets(value: unknown): Array<{ path: string; reason: string; evidence: string[] }> {
  if (!Array.isArray(value)) {
    throw new Error("AI summary response missing array field: changeTargets");
  }
  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`AI summary response contains invalid changeTargets[${index}]`);
    }
    const record = item as { path?: unknown; reason?: unknown };
    const path = expectString(record.path, `changeTargets[${index}].path`);
    const reason = expectString(record.reason, `changeTargets[${index}].reason`);
    const evidence = expectOptionalStringArray((item as { evidence?: unknown }).evidence, `changeTargets[${index}].evidence`);
    return { path, reason, evidence };
  });
}

function expectChangePaths(value: unknown): ContextChangePath[] {
  if (!Array.isArray(value)) {
    throw new Error("AI summary response missing array field: commonChangePaths");
  }
  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`AI summary response contains invalid commonChangePaths[${index}]`);
    }
    const record = item as { task?: unknown; files?: unknown; note?: unknown; evidence?: unknown };
    const task = expectString(record.task, `commonChangePaths[${index}].task`);
    const files = expectStringArray(record.files, `commonChangePaths[${index}].files`);
    const note = expectString(record.note, `commonChangePaths[${index}].note`);
    const evidence = expectStringArray(record.evidence, `commonChangePaths[${index}].evidence`);
    return { task, files, note, evidence };
  });
}

function renderBullets(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- _No items provided._";
}

function expectOptionalStringArray(value: unknown, field: string): string[] {
  if (value === undefined) return [];
  return expectStringArray(value, field);
}
