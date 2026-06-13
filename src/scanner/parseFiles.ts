import type { SymbolRecord } from "../types/index.js";
import { stripComments, stripCommentsAndStrings } from "../utils/sourceText.js";

export function parseImports(content: string): string[] {
  const imports = new Set<string>();
  const source = stripComments(content);
  const patterns = [
    /import\s+(?:type\s+)?(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g,
    /export\s+[^'"]+\s+from\s+["']([^"']+)["']/g,
    /require\(["']([^"']+)["']\)/g
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) imports.add(match[1]);
  }
  return [...imports].sort();
}

export function parseExports(content: string): string[] {
  const exports = new Set<string>();
  const source = stripCommentsAndStrings(content);
  const addExport = (name: string) => {
    const normalized = name.trim().split(/\s+as\s+/)[0];
    if (!normalized || ["function", "class", "interface", "type", "enum", "const", "let", "var", "async"].includes(normalized)) return;
    exports.add(normalized);
  };
  const patterns = [
    /export\s+(?:default\s+)?(?:async\s+)?function\s*\*?\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:default\s+)?class\s+([A-Za-z_$][\w$]*)/g,
    /export\s+interface\s+([A-Za-z_$][\w$]*)/g,
    /export\s+type\s+([A-Za-z_$][\w$]*)/g,
    /export\s+enum\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g,
    /export\s+default\s+([A-Za-z_$][\w$]*)/g,
    /export\s*\{([^}]+)\}/g
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1].includes(",")) {
        for (const name of match[1].split(",")) addExport(name);
      } else {
        addExport(match[1]);
      }
    }
  }
  return [...exports].sort();
}

export function parseSymbols(content: string): SymbolRecord[] {
  const source = stripCommentsAndStrings(content);
  const symbols: SymbolRecord[] = [];
  const seen = new Set<string>();
  const lines = source.split(/\r?\n/);
  for (const [lineIndex, line] of lines.entries()) {
    const exportedFunction = line.match(/^\s*(export\s+(?:default\s+)?)?(?:async\s+)?function\s*\*?\s+([A-Za-z_$][\w$]*)/);
    if (exportedFunction) {
      const name = exportedFunction[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: /^[A-Z]/.test(name) ? "component" : "function",
          exported: Boolean(exportedFunction[1]),
          line: lineIndex + 1
        });
      }
      continue;
    }

    const exportedClass = line.match(/^\s*(export\s+(?:default\s+)?)?class\s+([A-Za-z_$][\w$]*)/);
    if (exportedClass) {
      const name = exportedClass[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: "class",
          exported: Boolean(exportedClass[1]),
          line: lineIndex + 1
        });
      }
      continue;
    }

    const exportedInterface = line.match(/^\s*(export\s+)?interface\s+([A-Za-z_$][\w$]*)/);
    if (exportedInterface) {
      const name = exportedInterface[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: "interface",
          exported: Boolean(exportedInterface[1]),
          line: lineIndex + 1
        });
      }
      continue;
    }

    const exportedType = line.match(/^\s*(export\s+)?type\s+([A-Za-z_$][\w$]*)/);
    if (exportedType) {
      const name = exportedType[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: "type",
          exported: Boolean(exportedType[1]),
          line: lineIndex + 1
        });
      }
      continue;
    }

    const exportedEnum = line.match(/^\s*(export\s+)?enum\s+([A-Za-z_$][\w$]*)/);
    if (exportedEnum) {
      const name = exportedEnum[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: "type",
          exported: Boolean(exportedEnum[1]),
          line: lineIndex + 1
        });
      }
      continue;
    }

    const assignedFunctionExpression = line.match(
      /^\s*(export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\b/
    );
    if (assignedFunctionExpression) {
      const exported = Boolean(assignedFunctionExpression[1]);
      const name = assignedFunctionExpression[2];
      if (!seen.has(name)) {
        seen.add(name);
        symbols.push({
          name,
          kind: /^[A-Z]/.test(name) ? "component" : "function",
          exported,
          line: lineIndex + 1
        });
      }
      continue;
    }

    const assignedArrowFunction = line.match(
      /^\s*(export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^=;]*\)|[A-Za-z_$][\w$]*)\s*=>/
    );
    if (assignedArrowFunction) {
      const exported = Boolean(assignedArrowFunction[1]);
      const name = assignedArrowFunction[2];
      if (exported || /^[A-Z]/.test(name)) {
        if (!seen.has(name)) {
          seen.add(name);
          symbols.push({
            name,
            kind: /^[A-Z]/.test(name) ? "component" : "function",
            exported,
            line: lineIndex + 1
          });
        }
        continue;
      }
    }

    const constant = line.match(/^\s*(export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/);
    if (constant) {
      const name = constant[2];
      if (seen.has(name)) continue;
      seen.add(name);
      symbols.push({
        name,
        kind: "constant",
        exported: Boolean(constant[1]),
        line: lineIndex + 1
      });
    }
  }
  return symbols.sort((a, b) => a.name.localeCompare(b.name));
}
