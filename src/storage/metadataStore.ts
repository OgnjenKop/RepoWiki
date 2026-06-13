import path from "node:path";
import type { ChangeSet, FileHashes, RepoKnowledge, RepoScan, RepoWikiIndex } from "../types/index.js";
import { pathExists, readJson, writeJson } from "../utils/fs.js";
import { buildKnowledge } from "../knowledge/buildKnowledge.js";
import { buildDeterministicSummaries } from "../knowledge/buildSummaries.js";
import { routeContextFileName, routeContextKey, writeContextPacksSelective } from "../ai/contextPacks.js";
import { areaDocFileName } from "../utils/docPaths.js";

export type MetadataWriteOptions = {
  areas?: "all" | string[];
  modules?: "all" | string[];
  routes?: "all" | string[];
  cleanModules?: boolean;
  cleanRoutes?: boolean;
  cleanAreas?: boolean;
  previousIndex?: RepoWikiIndex;
};

export function hashesFromScan(scan: RepoScan): FileHashes {
  return Object.fromEntries(scan.graph.files.map((file) => [file.path, file.hash]));
}

export async function loadHashes(rootDir: string): Promise<FileHashes> {
  return (await readJson<FileHashes>(path.join(rootDir, ".repowiki/file-hashes.json"))) ?? {};
}

export async function hasStoredHashes(rootDir: string): Promise<boolean> {
  return pathExists(path.join(rootDir, ".repowiki/file-hashes.json"));
}

export async function loadIndex(rootDir: string): Promise<RepoWikiIndex | undefined> {
  return readJson<RepoWikiIndex>(path.join(rootDir, ".repowiki/index.json"));
}

export async function writeMetadata(scan: RepoScan, options: MetadataWriteOptions = {}): Promise<void> {
  const metadataDir = path.join(scan.rootDir, ".repowiki");
  const knowledge = scan.knowledge ?? buildKnowledge(scan);
  const summaries = scan.summaries ?? buildDeterministicSummaries(scan, knowledge);
  const areaContextFiles = areaContextFilesFromScan(scan);
  const moduleContextFiles = moduleContextFilesFromScan(scan);
  const routeContextFiles = routeContextFilesFromScan(scan);
  await writeJson(path.join(metadataDir, "file-hashes.json"), hashesFromScan(scan));
  await writeJson(path.join(metadataDir, "graph.json"), scan.graph);
  await writeJson(path.join(metadataDir, "knowledge.json"), knowledge);
  await writeJson(path.join(metadataDir, "index.json"), {
    schemaVersion: 2,
    generator: "repowiki",
    project: scan.project,
    docs: [
      "docs/repo-wiki/index.md",
      "docs/repo-wiki/architecture.md",
      "docs/repo-wiki/codex-review.md",
      "docs/repo-wiki/quality.md",
      "docs/repo-wiki/setup.md",
      "docs/repo-wiki/agent-context.md",
      "docs/repo-wiki/flows/index.md",
      "docs/repo-wiki/areas/index.md",
      ...scan.graph.areas.map((area) => `docs/repo-wiki/areas/${areaDocFileName(area.id)}`),
      "AGENTS.md"
    ],
    fileModules: fileModulesFromScan(scan),
    areaFiles: areaFilesFromScan(scan),
    areaContextFiles,
    moduleContextFiles,
    routeContextFiles
  } satisfies RepoWikiIndex);
  await writeJson(path.join(metadataDir, "summaries.json"), summaries);
  await writeContextPacksSelective(scan, {
    areas: options.areas,
    modules: options.modules,
    routes: options.routes,
    cleanAreas: options.cleanAreas,
    cleanModules: options.cleanModules,
    cleanRoutes: options.cleanRoutes,
    previousIndex: options.previousIndex
  });
}

export function fileModulesFromScan(scan: RepoScan): Record<string, string> {
  const fileModules: Record<string, string> = {};
  for (const module of scan.graph.modules) {
    for (const file of module.files) fileModules[file] = module.id;
  }
  return fileModules;
}

export function areaFilesFromScan(scan: RepoScan): Record<string, string[]> {
  const areaFiles: Record<string, string[]> = {};
  for (const area of scan.graph.areas) {
    areaFiles[area.id] = [...area.files].sort();
  }
  return areaFiles;
}

export function moduleContextFilesFromScan(scan: RepoScan): Record<string, string> {
  return Object.fromEntries(scan.graph.modules.map((module) => [module.id, `modules/${module.id}.json`]));
}

export function areaContextFilesFromScan(scan: RepoScan): Record<string, string> {
  return Object.fromEntries(scan.graph.areas.map((area) => [area.id, `areas/${area.id}.json`]));
}

export function routeContextFilesFromScan(scan: RepoScan): Record<string, string> {
  return Object.fromEntries(scan.graph.routes.map((route) => [routeContextKey(route), `routes/${routeContextFileName(route)}`]));
}

export function diffHashes(previous: FileHashes, current: FileHashes): ChangeSet {
  const changed: string[] = [];
  const added: string[] = [];
  const deleted: string[] = [];
  for (const [file, hash] of Object.entries(current)) {
    if (!(file in previous)) added.push(file);
    else if (previous[file] !== hash) changed.push(file);
  }
  for (const file of Object.keys(previous)) {
    if (!(file in current)) deleted.push(file);
  }
  return {
    changed: changed.sort(),
    added: added.sort(),
    deleted: deleted.sort()
  };
}

export function hasChanges(changes: ChangeSet): boolean {
  return changes.changed.length > 0 || changes.added.length > 0 || changes.deleted.length > 0;
}
