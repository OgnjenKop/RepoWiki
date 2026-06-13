import type { EnvVarRecord, FileRecord } from "../types/index.js";
import { stripComments } from "../utils/sourceText.js";
import { lineNumberAtIndex } from "../utils/sourceText.js";

export function detectEnvVars(file: FileRecord, content: string): EnvVarRecord[] {
  const source = stripComments(content);
  const vars = new Set<string>();
  const records: EnvVarRecord[] = [];
  for (const match of source.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
    const line = match.index !== undefined ? lineNumberAtIndex(source, match.index) : undefined;
    if (!vars.has(match[1])) records.push({ name: match[1], sourceFile: file.path, line });
    vars.add(match[1]);
  }
  for (const match of source.matchAll(/process\.env\[['"]([A-Z0-9_]+)['"]\]/g)) {
    const line = match.index !== undefined ? lineNumberAtIndex(source, match.index) : undefined;
    if (!vars.has(match[1])) records.push({ name: match[1], sourceFile: file.path, line });
    vars.add(match[1]);
  }
  if (file.path.includes(".env")) {
    for (const [index, lineContent] of content.split(/\r?\n/).entries()) {
      const match = lineContent.match(/^([A-Z0-9_]+)=/);
      if (match) vars.add(match[1]);
      if (match && !records.some((record) => record.name === match[1])) {
        records.push({ name: match[1], sourceFile: file.path, line: index + 1 });
      }
    }
  }
  return records.sort((a, b) => a.name.localeCompare(b.name));
}
