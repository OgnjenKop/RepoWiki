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
