import path from "node:path";

const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

export function isTestFile(filePath: string): boolean {
  return /(^|\/)(__tests__|test|tests)\//.test(filePath) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath);
}

export function isMarkdownFile(filePath: string): boolean {
  return path.posix.extname(filePath).toLowerCase() === ".md";
}

export function isCodeFile(filePath: string): boolean {
  return codeExtensions.has(path.posix.extname(filePath).toLowerCase());
}

export function isEnvFile(filePath: string): boolean {
  return path.posix.basename(filePath).startsWith(".env");
}

export function shouldDetectRuntimeSignals(filePath: string): boolean {
  return isCodeFile(filePath) && !isTestFile(filePath);
}

export function shouldDetectEnvVars(filePath: string): boolean {
  return isEnvFile(filePath) || shouldDetectRuntimeSignals(filePath);
}

export function shouldDetectComponents(filePath: string): boolean {
  if (isTestFile(filePath)) return false;
  const ext = path.posix.extname(filePath).toLowerCase();
  return [".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte"].includes(ext);
}

export function shouldDetectDesignTokens(filePath: string): boolean {
  if (isTestFile(filePath)) return false;
  const ext = path.posix.extname(filePath).toLowerCase();
  if (ext === ".css" || ext === ".scss") return true;
  if (ext === ".json") {
    return /(?:^|\/)(tokens?|theme|design[-_]?tokens?|tailwind)\//i.test(filePath) ||
      /^(tokens|theme|design[-_]?tokens)\.json$/i.test(path.posix.basename(filePath));
  }
  if (ext === ".ts" || ext === ".js") {
    return /(?:^|\/)(tokens?|theme|design[-_]?tokens?)\//i.test(filePath) ||
      /^(tokens?|theme|design[-_]?tokens?)\.(ts|js)$/i.test(path.posix.basename(filePath)) ||
      /tailwind\.config\.(js|ts|cjs|mjs)$/i.test(filePath);
  }
  return false;
}
