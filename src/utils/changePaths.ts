import type { ContextChangePath } from "../knowledge/moduleFocus.js";
import { code } from "./markdown.js";

export function formatChangePath(path: ContextChangePath): string {
  const files = path.files.slice(0, 4).map(code).join(", ");
  const evidence = path.evidence.length ? ` (evidence: ${path.evidence.slice(0, 4).map(code).join(", ")})` : "";
  return `${code(path.task)} -> ${files}${path.note ? ` - ${path.note}` : ""}${evidence}`;
}

