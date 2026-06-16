import type { ComponentFramework, ComponentRecord } from "../types/index.js";
import { stripComments, lineNumberAtIndex } from "../utils/sourceText.js";

export function detectComponents(filePath: string, content: string): ComponentRecord[] {
  const components: ComponentRecord[] = [];
  const framework = inferFramework(filePath, content);
  if (!framework) return components;

  if (framework === "react" || framework === "solid") {
    components.push(...detectReactLikeComponents(filePath, content, framework));
  } else if (framework === "vue") {
    components.push(...detectVueComponents(filePath, content));
  } else if (framework === "svelte") {
    components.push(...detectSvelteComponents(filePath, content));
  } else if (framework === "angular") {
    components.push(...detectAngularComponents(filePath, content));
  }

  const storyComponents = detectStorybookStories(filePath, content, framework);
  components.push(...storyComponents);

  return uniqueComponents(components).sort((a, b) =>
    `${a.file}:${a.name}`.localeCompare(`${b.file}:${b.name}`)
  );
}

export function inferFramework(filePath: string, content: string): ComponentFramework | undefined {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith(".tsx") || normalized.endsWith(".jsx")) {
    if (/(import\s+[^"'`]+from\s+["'`]react["'`])|(from\s+["'`]solid-js["'`])|(from\s+["'`]@solidjs\/)/.test(content)) {
      return /solid/i.test(content) ? "solid" : "react";
    }
    if (hasJsxReturn(filePath, content) || hasArrowJsx(filePath, content)) {
      return "react";
    }
  }
  if (normalized.endsWith(".vue")) return "vue";
  if (normalized.endsWith(".svelte")) return "svelte";
  if (normalized.endsWith(".ts") || normalized.endsWith(".js")) {
    if (/@Component\s*\(/.test(content)) return "angular";
  }
  return undefined;
}

function detectReactLikeComponents(filePath: string, content: string, framework: ComponentFramework): ComponentRecord[] {
  const components: ComponentRecord[] = [];
  const source = stripComments(content);
  const lines = source.split(/\r?\n/);
  const propPattern = /^\s*(?:([A-Za-z_$][\w$]*)\s*(?::\s*[^,)]+)?\s*[,)])/;

  const functionPattern = /^\s*(export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Z][A-Za-z0-9_]*)/;
  const classPattern = /^\s*(export\s+(?:default\s+)?)?class\s+([A-Z][A-Za-z0-9_]*)/;
  const constPattern = /^\s*(export\s+(?:default\s+)?)?const\s+([A-Z][A-Za-z0-9_]*)\s*(?::\s*[A-Za-z_$][\w$.<>|\s,]*)?\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=>/;
  const constFunctionPattern = /^\s*(export\s+(?:default\s+)?)?const\s+([A-Z][A-Za-z0-9_]*)\s*(?::\s*[A-Za-z_$][\w$.<>|\s,]*)?\s*=\s*(?:async\s+)?function\b/;
  const memoPattern = /^\s*(export\s+(?:default\s+)?)?const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:React\.)?memo\(/;

  for (const [lineIndex, line] of lines.entries()) {
    let match: RegExpMatchArray | null = null;
    let name: string | undefined;
    let exported = false;

    if ((match = line.match(functionPattern))) {
      exported = Boolean(match[1]);
      name = match[2];
    } else if ((match = line.match(classPattern))) {
      exported = Boolean(match[1]);
      name = match[2];
    } else if ((match = line.match(constFunctionPattern))) {
      exported = Boolean(match[1]);
      name = match[2];
    } else if ((match = line.match(constPattern))) {
      exported = Boolean(match[1]);
      name = match[2];
    } else if ((match = line.match(memoPattern))) {
      exported = Boolean(match[1]);
      name = match[2];
    }

    if (!name) continue;
    if (!isComponentUsedAsComponent(lines, lineIndex, name)) continue;

    const props = extractProps(lines, lineIndex, name);
    components.push({
      name,
      file: filePath,
      line: lineIndex + 1,
      framework,
      exported,
      props
    });
  }

  return components;
}

function detectVueComponents(filePath: string, content: string): ComponentRecord[] {
  const components: ComponentRecord[] = [];
  const nameMatch = content.match(/<script[^>]*>\s*(?:export\s+default\s+)?(?:defineComponent\s*\(\s*)?\{[\s\S]*?name\s*:\s*["'`]([A-Z][A-Za-z0-9_]*)["'`]/) ??
    content.match(/name\s*:\s*["'`]([A-Z][A-Za-z0-9_]*)["'`]/);
  const name = nameMatch?.[1] ?? deriveNameFromFile(filePath);
  if (!name) return components;
  const lineIndex = nameMatch?.index !== undefined ? lineNumberAtIndex(content, nameMatch.index) - 1 : 0;
  components.push({
    name,
    file: filePath,
    line: lineIndex + 1,
    framework: "vue",
    exported: true
  });
  return components;
}

function detectSvelteComponents(filePath: string, content: string): ComponentRecord[] {
  const name = deriveNameFromFile(filePath);
  if (!name) return [];
  const scriptMatch = content.match(/<script[^>]*>/);
  const line = scriptMatch?.index !== undefined ? lineNumberAtIndex(content, scriptMatch.index) : 1;
  return [{
    name,
    file: filePath,
    line,
    framework: "svelte",
    exported: true
  }];
}

function detectAngularComponents(filePath: string, content: string): ComponentRecord[] {
  const components: ComponentRecord[] = [];
  const source = stripComments(content);
  const classPattern = /@Component\s*\(\s*\{[\s\S]*?\}\s*\)\s*(?:export\s+)?class\s+([A-Z][A-Za-z0-9_]*)/g;
  for (const match of source.matchAll(classPattern)) {
    const name = match[1];
    const line = match.index !== undefined ? lineNumberAtIndex(source, match.index) : undefined;
    components.push({
      name,
      file: filePath,
      line,
      framework: "angular",
      exported: true
    });
  }
  return components;
}

function detectStorybookStories(filePath: string, content: string, framework: ComponentFramework): ComponentRecord[] {
  if (!/\.stories\.(tsx|jsx|ts|js)$/.test(filePath)) return [];
  const components: ComponentRecord[] = [];
  const source = stripComments(content);
  const titlePattern = /title\s*:\s*["'`]([^"'`]+)["'`]/g;
  for (const match of source.matchAll(titlePattern)) {
    const title = match[1];
    const lastSegment = title.split("/").pop() ?? title;
    const name = lastSegment.replace(/\s+/g, "");
    if (!name) continue;
    const line = match.index !== undefined ? lineNumberAtIndex(source, match.index) : undefined;
    components.push({
      name,
      file: filePath,
      line,
      framework,
      exported: true,
      isStory: true
    });
  }
  return components;
}

function hasJsxReturn(filePath: string, content: string): boolean {
  const source = stripComments(content);
  return /return\s*\(?\s*</.test(source) || /return\s+</.test(source);
}

function hasArrowJsx(filePath: string, content: string): boolean {
  const source = stripComments(content);
  return /=>\s*[<(]/.test(source) || /=>\s*\{[\s\S]*return\s*\(?\s*</.test(source);
}

function deriveNameFromFile(filePath: string): string | undefined {
  const normalized = filePath.replace(/\\/g, "/");
  const fileName = normalized.split("/").pop() ?? "";
  const base = fileName.replace(/\.(vue|svelte)$/, "");
  if (!base || !/^[A-Z]/.test(base)) return undefined;
  return base;
}

function isComponentUsedAsComponent(lines: string[], lineIndex: number, name: string): boolean {
  if (/forwardRef|displayName\s*[:=]/.test(lines.slice(lineIndex, lineIndex + 3).join("\n"))) return true;
  const window = lines.slice(lineIndex, Math.min(lines.length, lineIndex + 6)).join("\n");
  if (/return\s*\(?\s*</.test(window) || /return\s+</.test(window)) return true;
  if (/React\.createElement|createElement\(|h\(/.test(window)) return true;
  if (/<[A-Z]/.test(window)) return true;
  return false;
}

function extractProps(lines: string[], lineIndex: number, name: string): string[] {
  const props: string[] = [];
  const window = lines.slice(lineIndex, Math.min(lines.length, lineIndex + 10)).join("\n");
  const functionMatch = window.match(new RegExp(`function\\s+${name}\\s*\\(?\\s*\\{([^)]*)\\}\\s*[:)]`));
  if (functionMatch) {
    for (const part of functionMatch[1].split(",")) {
      const cleaned = part.trim().split(/[:=]/)[0].trim();
      if (cleaned && /^[A-Za-z_$][\w$]*$/.test(cleaned) && cleaned !== "props") {
        props.push(cleaned);
      }
    }
  }
  const arrowMatch = window.match(new RegExp(`(?:const|let|var)\\s+${name}\\s*(?::\\s*[^=]+)?\\s*=\\s*(?:React\\.)?(?:memo\\(|forwardRef\\()?\\s*(?:<\\s*)?\\(?\\s*\\{([^)]*)\\}\\s*[,:)]`));
  if (arrowMatch) {
    for (const part of arrowMatch[1].split(",")) {
      const cleaned = part.trim().split(/[:=]/)[0].trim();
      if (cleaned && /^[A-Za-z_$][\w$]*$/.test(cleaned) && cleaned !== "props") {
        props.push(cleaned);
      }
    }
  }
  const typedMatch = window.match(new RegExp(`(?:type|interface)\\s+${name}Props\\s*=?\\s*\\{([\\s\\S]*?)\\}`));
  if (typedMatch) {
    for (const part of typedMatch[1].split(";")) {
      const cleaned = part.trim().split(/[:?]/)[0].trim();
      if (cleaned && /^[A-Za-z_$][\w$]*$/.test(cleaned)) {
        if (!props.includes(cleaned)) props.push(cleaned);
      }
    }
  }
  return props;
}

function uniqueComponents(components: ComponentRecord[]): ComponentRecord[] {
  const seen = new Set<string>();
  const unique: ComponentRecord[] = [];
  for (const component of components) {
    const key = `${component.file}:${component.name}:${component.isStory ? "story" : "component"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(component);
  }
  return unique;
}
