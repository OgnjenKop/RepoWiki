import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import type { CodeGraph, FileRecord, RepoScan } from "../types/index.js";
import { buildGraph } from "../graph/buildGraph.js";
import { hashContent } from "../utils/hashing.js";
import { toPosixPath } from "../utils/paths.js";
import { detectProject } from "./detectProject.js";
import { parseExports, parseImports, parseSymbols } from "./parseFiles.js";
import { detectModules } from "./detectModules.js";
import { detectEnvVars } from "./detectEnvVars.js";
import { detectRoutes } from "./detectRoutes.js";
import { detectTests } from "./detectTests.js";
import { detectPathAliases } from "./detectPathAliases.js";
import { shouldDetectEnvVars, shouldDetectRuntimeSignals } from "./fileClassifiers.js";
import { buildKnowledge } from "../knowledge/buildKnowledge.js";
import { detectModuleAreas } from "../knowledge/moduleAreas.js";

const discoveryIgnore = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/.expo/**",
  "**/.turbo/**",
  "**/.cache/**",
  "**/android/.gradle/**",
  "**/android/app/.cxx/**",
  "**/android/app/build/**",
  "**/ios/Pods/**",
  "**/coverage/**",
  "**/.repowiki/**",
  "**/docs/repo-wiki/**",
  "AGENTS.md"
];

const scanIgnore = [
  ...discoveryIgnore,
  "**/package-lock.json",
  "**/pnpm-lock.yaml",
  "**/yarn.lock",
  "**/bun.lockb"
];

const binaryExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip", ".tar", ".gz", ".wasm"]);
const maxFileSize = 512 * 1024;

export async function scanRepo(rootDir = process.cwd()): Promise<RepoScan> {
  const discoveredEntries = await fg(["**/*"], { cwd: rootDir, dot: true, onlyFiles: true, ignore: discoveryIgnore });
  const entries = await fg(["**/*"], { cwd: rootDir, dot: true, onlyFiles: true, ignore: scanIgnore });
  const relevant = entries.map(toPosixPath).filter(isRelevantFile).sort();
  const files: FileRecord[] = [];
  const envVars = [];
  const routes = [];
  const contentsByPath: Record<string, string> = {};

  for (const relativePath of relevant) {
    const absolutePath = path.join(rootDir, relativePath);
    const stat = await fs.stat(absolutePath);
    if (stat.size > maxFileSize) continue;
    const content = await fs.readFile(absolutePath);
    if (isLikelyBinary(content)) continue;
    const text = content.toString("utf8");
    contentsByPath[relativePath] = text;
    const file: FileRecord = {
      path: relativePath,
      language: inferLanguage(relativePath),
      size: stat.size,
      hash: hashContent(content),
      imports: parseImports(text),
      exports: parseExports(text),
      symbols: parseSymbols(text)
    };
    files.push(file);
    if (shouldDetectEnvVars(relativePath)) envVars.push(...detectEnvVars(file, text));
    if (shouldDetectRuntimeSignals(relativePath)) routes.push(...detectRoutes(relativePath, text));
  }

  const project = await detectProject(rootDir, discoveredEntries.map(toPosixPath).sort());
  const modules = detectModules(files);
  const aliases = await detectPathAliases(rootDir);
  const imports = buildGraph(files, aliases);
  const graph: CodeGraph = {
    files,
    imports,
    modules,
    areas: detectModuleAreas(modules, imports),
    routes,
    envVars,
    tests: detectTests(files, contentsByPath)
  };
  return { rootDir, project, graph, knowledge: buildKnowledge({ rootDir, project, graph }) };
}

function isRelevantFile(file: string): boolean {
  if (binaryExtensions.has(path.posix.extname(file).toLowerCase())) return false;
  if (/\.lock$/.test(file)) return false;
  return true;
}

function isLikelyBinary(content: Buffer): boolean {
  return content.subarray(0, 8000).includes(0);
}

function inferLanguage(file: string): string {
  const ext = path.posix.extname(file).toLowerCase();
  const map: Record<string, string> = {
    ".ts": "TypeScript",
    ".tsx": "TSX",
    ".js": "JavaScript",
    ".jsx": "JSX",
    ".json": "JSON",
    ".md": "Markdown",
    ".yml": "YAML",
    ".yaml": "YAML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".html": "HTML"
  };
  return map[ext] ?? "text";
}
