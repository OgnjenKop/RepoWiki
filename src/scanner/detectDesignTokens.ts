import type { DesignTokenCategory, DesignTokenRecord } from "../types/index.js";
import { stripComments, lineNumberAtIndex } from "../utils/sourceText.js";

const tokenFileNames = new Set([
  "tokens.json",
  "tokens.ts",
  "tokens.js",
  "theme.json",
  "theme.ts",
  "theme.js",
  "design-tokens.json",
  "design-tokens.ts",
  "design-tokens.js"
]);

const tokenPathHints = /(?:^|\/)(?:tokens|theme|themes|design-tokens|designTokens)\//i;

export function detectDesignTokens(filePath: string, content: string): DesignTokenRecord[] {
  const ext = getExtension(filePath);
  if (ext === ".css" || ext === ".scss") {
    return detectCssTokens(filePath, content, ext === ".scss" ? "scss-variable" : "css-variable");
  }
  if (ext === ".json" && isTokenFile(filePath)) {
    return detectJsonTokens(filePath, content, "token-json");
  }
  if (ext === ".ts" || ext === ".js") {
    return detectJsTokens(filePath, content);
  }
  return [];
}

export function isTokenFile(filePath: string): boolean {
  const base = filePath.split("/").pop() ?? "";
  if (tokenFileNames.has(base.toLowerCase())) return true;
  return tokenPathHints.test(filePath);
}

function detectCssTokens(filePath: string, content: string, source: "css-variable" | "scss-variable"): DesignTokenRecord[] {
  const tokens: DesignTokenRecord[] = [];
  const sourceText = stripComments(content);
  const pattern = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  for (const match of sourceText.matchAll(pattern)) {
    const rawName = match[1];
    const value = match[2].trim();
    if (!rawName) continue;
    const name = rawName.trim();
    if (!isMeaningfulTokenName(name)) continue;
    const category = inferCategory(name, value);
    tokens.push({
      name,
      value: truncateValue(value),
      category,
      file: filePath,
      line: match.index !== undefined ? lineNumberAtIndex(sourceText, match.index) : undefined,
      source
    });
  }
  if (source === "scss-variable") {
    const scssPattern = /\$([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
    for (const match of sourceText.matchAll(scssPattern)) {
      const name = match[1];
      if (!name || !isMeaningfulTokenName(name)) continue;
      const value = match[2].trim();
      tokens.push({
        name: `$${name}`,
        value: truncateValue(value),
        category: inferCategory(name, value),
        file: filePath,
        line: match.index !== undefined ? lineNumberAtIndex(sourceText, match.index) : undefined,
        source
      });
    }
  }
  return tokens;
}

function detectJsonTokens(filePath: string, content: string, source: "token-json"): DesignTokenRecord[] {
  const tokens: DesignTokenRecord[] = [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return tokens;
  }
  walkJsonTokens(parsed, [], filePath, source, tokens);
  return tokens;
}

function walkJsonTokens(
  node: unknown,
  pathParts: string[],
  filePath: string,
  source: "token-json",
  tokens: DesignTokenRecord[]
): void {
  if (node === null || node === undefined) return;
  if (typeof node === "string" || typeof node === "number") {
    const name = pathParts.join(".");
    if (!isMeaningfulTokenName(name)) return;
    tokens.push({
      name,
      value: truncateValue(String(node)),
      category: inferCategory(name, String(node)),
      file: filePath,
      source
    });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => walkJsonTokens(item, [...pathParts, String(index)], filePath, source, tokens));
    return;
  }
  if (typeof node === "object") {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      walkJsonTokens(value, [...pathParts, key], filePath, source, tokens);
    }
  }
}

function detectJsTokens(filePath: string, content: string): DesignTokenRecord[] {
  const tokens: DesignTokenRecord[] = [];
  if (!looksLikeTokenFile(filePath)) return tokens;
  const source = stripComments(content);
  const lines = source.split(/\r?\n/);
  const tailwindConfig = /tailwind\.config\.(?:js|ts|cjs|mjs)$/i.test(filePath) ? "tailwind-config" : undefined;
  const isTailwind = Boolean(tailwindConfig);
  for (const [lineIndex, line] of lines.entries()) {
    if (!/^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::\s*[^=]+)?\s*=\s*\{/.test(line)) continue;
    if (!/^\s*(?:export\s+)?(?:const|let|var)\s+(tokens|theme|designTokens|designTokens)\b/i.test(line) && !isTailwind) continue;
    const body = collectObjectBody(lines, lineIndex);
    if (!body) continue;
    extractFromObject(body.text, body.startLine, tokens, filePath, isTailwind ? "tailwind-config" : "theme-object");
  }
  return tokens;
}

function looksLikeTokenFile(filePath: string): boolean {
  const normalized = filePath.toLowerCase();
  const fileName = normalized.split("/").pop() ?? "";
  if (/tokens?\.(ts|js)$/.test(fileName)) return true;
  if (/theme\.(ts|js)$/.test(fileName)) return true;
  if (/design[-_]?tokens?\.(ts|js)$/.test(fileName)) return true;
  if (/(^|\/)(tokens|theme|themes|design[-_]?tokens?)\//.test(normalized)) return true;
  if (/tailwind\.config\.(js|ts|cjs|mjs)$/i.test(filePath)) return true;
  return false;
}

function collectObjectBody(lines: string[], startIndex: number): { text: string; startLine: number } | undefined {
  let depth = 0;
  let started = false;
  let text = "";
  const startLine = startIndex + 1;
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    for (const char of line) {
      if (char === "{") {
        depth += 1;
        started = true;
      } else if (char === "}") {
        depth -= 1;
      }
      text += char;
      if (started && depth === 0) {
        return { text, startLine };
      }
    }
    text += "\n";
  }
  return undefined;
}

function extractFromObject(
  body: string,
  startLine: number,
  tokens: DesignTokenRecord[],
  filePath: string,
  source: DesignTokenRecord["source"]
): void {
  const lines = body.split(/\r?\n/);
  for (const [offset, line] of lines.entries()) {
    if (/^\s*[}\]]/.test(line)) continue;
    const quotedMatch = line.match(/^\s*["']?([a-zA-Z0-9_.-]+)["']?\s*:\s*["'`]([^"'`]*)["'`]/);
    if (quotedMatch) {
      const name = quotedMatch[1];
      const value = quotedMatch[2].trim();
      if (!name || !isMeaningfulTokenName(name)) continue;
      tokens.push({
        name,
        value: truncateValue(value),
        category: inferCategory(name, value),
        file: filePath,
        line: startLine + offset,
        source
      });
      continue;
    }
    const numberMatch = line.match(/^\s*["']?([a-zA-Z0-9_.-]+)["']?\s*:\s*(-?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?)/);
    if (numberMatch) {
      const name = numberMatch[1];
      const value = numberMatch[2].trim();
      if (!name || !isMeaningfulTokenName(name)) continue;
      tokens.push({
        name,
        value: truncateValue(value),
        category: inferCategory(name, value),
        file: filePath,
        line: startLine + offset,
        source
      });
    }
  }
}

function isMeaningfulTokenName(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  const ignored = new Set(["type", "kind", "name", "id", "key", "value", "default", "description", "comment", "unit"]);
  if (ignored.has(lower)) return false;
  if (lower.length < 2) return false;
  return true;
}

function inferCategory(name: string, value: string): DesignTokenCategory {
  const lower = name.toLowerCase();
  const valueLower = value.toLowerCase();
  if (/shadow|elevation|drop/.test(lower)) {
    return "shadow";
  }
  if (/font|text|lineheight|letter|typography|weight/.test(lower)) {
    return "typography";
  }
  if (/color|colour|bg|background|fg|fill|stroke|brand|primary|secondary|accent|success|warning|error|danger|info|neutral|gray|grey|black|white|red|blue|green|yellow|orange|purple|pink/.test(lower) || /^#[0-9a-f]{3,8}$/i.test(valueLower) || /^rgba?\(|hsla?\(/.test(valueLower)) {
    return "color";
  }
  if (/space|spacing|gap|padding|margin|size|width|height|radius/.test(lower)) {
    if (/radius/.test(lower)) return "border";
    if (/size|width|height/.test(lower)) return "spacing";
    return "spacing";
  }
  if (/border|outline|stroke/.test(lower)) {
    return "border";
  }
  if (/duration|transition|animation|ease|timing/.test(lower)) {
    return "animation";
  }
  if (/breakpoint|media|screen|viewport/.test(lower)) {
    return "breakpoint";
  }
  return "other";
}

function truncateValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 80) return trimmed;
  return `${trimmed.slice(0, 77)}...`;
}

function getExtension(filePath: string): string {
  const index = filePath.lastIndexOf(".");
  return index === -1 ? "" : filePath.slice(index).toLowerCase();
}
