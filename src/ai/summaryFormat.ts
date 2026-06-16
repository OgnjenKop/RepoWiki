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
  let jsonText: string;
  try {
    jsonText = extractJson(content);
  } catch (error) {
    const preview = content.slice(0, 500).replace(/\s+/g, " ");
    console.error(`Warning: AI summary response did not contain a JSON object. Using raw content as the summary. Error: ${error instanceof Error ? error.message : String(error)} Content preview: ${preview}`);
    return buildFallbackDraft(content);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (originalError) {
    const repaired = repairJson(jsonText);
    try {
      parsed = JSON.parse(repaired);
    } catch {
      const preview = content.slice(0, 500).replace(/\s+/g, " ");
      console.error(`Warning: AI summary response was not valid JSON. Using raw content as the summary. Error: ${originalError instanceof Error ? originalError.message : String(originalError)} Content preview: ${preview}`);
      return buildFallbackDraft(content);
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return buildFallbackDraft(content);
  }

  const record = parsed as Partial<AiSummaryDraft>;

  try {
    const summary = expectString(record.summary, "summary");
    const responsibilities = expectStringArray(record.responsibilities, "responsibilities");
    const importantFiles = expectImportantFiles(record.importantFiles);
    const executionFlow = expectStringArray(record.executionFlow, "executionFlow");
    const decisionPoints = expectStringArray(record.decisionPoints, "decisionPoints");
    const commonChangePaths = expectChangePaths(record.commonChangePaths);
    const changeTargets = expectChangeTargets(record.changeTargets);
    const changeRisks = expectStringArray(record.changeRisks, "changeRisks");
    const notesForAiAgents = expectStringArray(record.notesForAiAgents, "notesForAiAgents");
    const verificationSteps = expectStringArray(record.verificationSteps, "verificationSteps");
    const unknowns = record.unknowns === undefined ? undefined : expectStringArray(record.unknowns, "unknowns");

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
  } catch (validationError) {
    const preview = content.slice(0, 500).replace(/\s+/g, " ");
    console.error(`Warning: AI summary response failed field validation. Using raw content as the summary. Error: ${validationError instanceof Error ? validationError.message : String(validationError)} Content preview: ${preview}`);
    return buildFallbackDraft(content);
  }
}

export function aiSummaryBody(content: string): string {
  return content.replace(/^#\s+Summary\s*\n+/, "").trim();
}

export function summaryLead(content: string): string {
  if (content.trimStart().startsWith("# Summary")) {
    return extractLeadFromMarkdown(content);
  }
  const draft = parseSummaryDraft(content);
  return draft.summary.trim();
}

function extractLeadFromMarkdown(content: string): string {
  const lines = content.split(/\r?\n/);
  const paragraphs: string[] = [];
  let current: string[] = [];
  let pastHeading = false;
  for (const line of lines) {
    if (!pastHeading) {
      if (line.startsWith("# ")) {
        pastHeading = true;
        continue;
      }
      continue;
    }
    if (line.startsWith("## ")) break;
    if (line.trim() === "") {
      if (current.length) {
        paragraphs.push(current.join(" ").trim());
        current = [];
      }
      continue;
    }
    current.push(line.trim());
  }
  if (current.length) paragraphs.push(current.join(" ").trim());
  return paragraphs[0] ?? "";
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

export function extractJson(content: string): string {
  const trimmed = content.trim();

  // Handle fenced JSON blocks
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) {
    return findJsonObject(fenced[1].trim());
  }

  // Handle inline fenced JSON (e.g., text before/after fences)
  const inlineFence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (inlineFence?.[1]) {
    return findJsonObject(inlineFence[1].trim());
  }

  return findJsonObject(trimmed);
}

export function repairJson(json: string): string {
  // Strip BOM and zero-width characters.
  let text = json.replace(/^\uFEFF+/, "").replace(/\uFEFF+$/, "");

  // Convert bare-key objects like {"a", "b"} to {"a": "a", "b": "b"}.
  text = reinflateBareKeyObjects(text);

  // Quote unquoted object keys.
  text = quoteUnquotedKeys(text);

  // Remove trailing commas before } or ].
  text = removeTrailingCommas(text);

  // Fill in missing object values for any remaining bare keys.
  text = fixMissingObjectValues(text);

  // Normalize single-quoted strings to double-quoted strings.
  text = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

  return text;
}

function reinflateBareKeyObjects(json: string): string {
  // Match objects that contain only quoted strings separated by commas,
  // e.g. {"path", "reason", "evidence"}, and convert each bare key into a
  // key-value pair using the key itself as the value.
  const pattern = /\{\s*"([^"]+)"(?:\s*,\s*"([^"]+)")*\s*\}/g;
  return json.replace(pattern, (match) => {
    const keys = [...match.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
    if (keys.length === 0) return match;
    const pairs = keys.map((key) => {
      const escaped = key.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `"${escaped}": "${escaped}"`;
    });
    return `{ ${pairs.join(", ")} }`;
  });
}

function quoteUnquotedKeys(json: string): string {
  const chars: string[] = [];
  let inString = false;
  let escapeNext = false;
  let lastNonWhitespace = "";

  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    if (!char) continue;

    if (escapeNext) {
      chars.push(char);
      escapeNext = false;
      continue;
    }

    if (char === "\\" && inString) {
      chars.push(char);
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      chars.push(char);
      continue;
    }

    if (inString) {
      chars.push(char);
      continue;
    }

    if (/[a-zA-Z_$]/.test(char)) {
      const rest = json.slice(i);
      const match = rest.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
      if (match && (lastNonWhitespace === "{" || lastNonWhitespace === ",")) {
        chars.push(`"${match[1]}":`);
        i += match[0].length - 1;
        lastNonWhitespace = ":";
        continue;
      }
    }

    chars.push(char);
    if (!/\s/.test(char)) {
      lastNonWhitespace = char;
    }
  }

  return chars.join("");
}

function removeTrailingCommas(json: string): string {
  const chars: string[] = [];
  let inString = false;
  let escapeNext = false;
  let depth = 0;
  let commaIndex = -1;
  let commaDepth = -1;

  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    if (!char) continue;

    if (escapeNext) {
      chars.push(char);
      escapeNext = false;
      continue;
    }

    if (char === "\\" && inString) {
      chars.push(char);
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      chars.push(char);
      // A string starting after a comma means that comma is not trailing.
      if (inString) {
        commaIndex = -1;
        commaDepth = -1;
      }
      continue;
    }

    if (inString) {
      chars.push(char);
      continue;
    }

    if (char === "{" || char === "[") {
      depth++;
      chars.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      depth--;
      if (commaIndex !== -1 && depth === commaDepth - 1) {
        chars.splice(commaIndex, 1);
      }
      commaIndex = -1;
      commaDepth = -1;
      chars.push(char);
      continue;
    }

    if (char === ",") {
      commaIndex = chars.length;
      commaDepth = depth;
      chars.push(char);
      continue;
    }

    if (!/\s/.test(char) && commaIndex !== -1) {
      commaIndex = -1;
      commaDepth = -1;
    }

    chars.push(char);
  }

  return chars.join("");
}

function fixMissingObjectValues(json: string): string {
  const chars: string[] = [];
  let inString = false;
  let escapeNext = false;
  const braceStack: Array<"{" | "["> = [];
  let expectKey = false; // true after { or , inside an object
  let pendingKey = false; // true if we just closed a quoted key and haven't seen : yet

  function insideObject(): boolean {
    return braceStack.length > 0 && braceStack[braceStack.length - 1] === "{";
  }

  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    if (!char) continue;

    if (escapeNext) {
      chars.push(char);
      escapeNext = false;
      continue;
    }

    if (char === "\\" && inString) {
      chars.push(char);
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      if (inString) {
        inString = false;
        if (expectKey && insideObject()) {
          pendingKey = true;
        }
        expectKey = false;
      } else {
        inString = true;
      }
      chars.push(char);
      continue;
    }

    if (inString) {
      chars.push(char);
      continue;
    }

    if (char === "{" || char === "[") {
      braceStack.push(char);
      expectKey = char === "{";
      pendingKey = false;
      chars.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      if (pendingKey && char === "}") {
        chars.push(': ""');
      }
      braceStack.pop();
      expectKey = insideObject();
      pendingKey = false;
      chars.push(char);
      continue;
    }

    if (char === ":") {
      pendingKey = false;
      expectKey = false;
      chars.push(char);
      continue;
    }

    if (char === ",") {
      if (pendingKey) {
        chars.push(': ""');
      }
      expectKey = insideObject();
      pendingKey = false;
      chars.push(char);
      continue;
    }

    if (pendingKey && !/\s/.test(char)) {
      chars.push(': ""');
      pendingKey = false;
    }

    chars.push(char);
  }

  return chars.join("");
}

function findJsonObject(content: string): string {
  const start = content.indexOf("{");
  if (start === -1) {
    throw new Error("AI summary response did not contain a JSON object");
  }

  // Find the matching closing brace by tracking brace depth
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\" && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        return sanitizeJson(content.slice(start, i + 1));
      }
    }
  }

  // No matching closing brace found; return from first { to end and let JSON.parse fail with context
  return sanitizeJson(content.slice(start));
}

function sanitizeJson(json: string): string {
  // Strip BOM and other zero-width characters that can appear before/after the JSON
  let sanitized = json.replace(/^\uFEFF+/, "").replace(/\uFEFF+$/, "");

  // Escape unescaped control characters inside JSON strings.
  // We walk the text and only modify characters when we are inside a string literal.
  let inString = false;
  let escapeNext = false;
  const chars: string[] = [];

  for (const char of sanitized) {
    if (escapeNext) {
      chars.push(char);
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      chars.push(char);
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      chars.push(char);
      inString = !inString;
      continue;
    }

    if (inString) {
      const code = char.charCodeAt(0);
      if (code === 0x0a) {
        chars.push("\\n");
      } else if (code === 0x09) {
        chars.push("\\t");
      } else if (code === 0x0d) {
        chars.push("\\r");
      } else if (code < 0x20) {
        // Drop other control characters
        continue;
      } else {
        chars.push(char);
      }
    } else {
      chars.push(char);
    }
  }

  return chars.join("");
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

function buildFallbackDraft(content: string): AiSummaryDraft {
  const lead = content
    .replace(/^#.*$/m, "")
    .trim()
    .split(/\n\s*\n/)[0]
    ?.trim() ?? content.trim();
  return {
    summary: lead.slice(0, 600),
    responsibilities: [],
    importantFiles: [],
    executionFlow: [],
    decisionPoints: [],
    commonChangePaths: [],
    changeTargets: [],
    changeRisks: [],
    notesForAiAgents: [],
    verificationSteps: [],
    unknowns: undefined
  };
}
