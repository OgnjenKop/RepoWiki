import { writeDocs } from "../docs/writeDocs.js";
import { scanRepo } from "../scanner/scanRepo.js";
import { diffHashes, hashesFromScan, loadHashes, loadIndex, writeMetadata } from "../storage/metadataStore.js";
import type { ChangeSet, RepoScan } from "../types/index.js";
import { buildRepoSummaries } from "../ai/buildSummaries.js";
import { buildRepoInsights } from "../ai/buildInsights.js";
import type { AiRuntimeOptions } from "../ai/types.js";
import { routeContextKey } from "../ai/contextPacks.js";
import { resolveAiModel } from "../ai/config.js";
import { loadSummaryCache, writeSummaryCache } from "../ai/summaryCache.js";
import { loadInsightCache, writeInsightCache } from "../ai/insightCache.js";

export async function updateCommand(rootDir = process.cwd(), aiOptions?: AiRuntimeOptions): Promise<void> {
  const previous = await loadHashes(rootDir);
  const previousIndex = await loadIndex(rootDir);
  const scan = await scanRepo(rootDir);
  const changes = diffHashes(previous, hashesFromScan(scan));
  const affectedModules = getAffectedModules(scan, changes, previousIndex?.fileModules ?? {});
  const affectedRoutes = getAffectedRoutes(scan, changes, previousIndex?.routeContextFiles ?? {});
  const affectedAreas = getAffectedAreas(scan, changes, previousIndex?.areaFiles ?? {});
  const deletedFiles = hasDeletedFiles(changes);
  const globalWikiImpact = hasGlobalWikiImpact(changes);
  const cache = await loadSummaryCache(rootDir);
  const insightModel = resolveAiModel(aiOptions);
  const insightCache = await loadInsightCache(rootDir, insightModel);
  const summaries = await buildRepoSummaries({ scan, options: aiOptions, cache });
  const insights = await buildRepoInsights({ scan, options: aiOptions, cache: insightCache });
  const analyzed = { ...scan, summaries, insights };
  const docs = await writeDocs(analyzed, {
    areas: deletedFiles || globalWikiImpact ? "all" : affectedAreas,
    modules: deletedFiles || globalWikiImpact ? "all" : affectedModules,
    includeSetup: hasSetupRelatedChange(changes),
    cleanAreas: deletedFiles || globalWikiImpact,
    cleanModules: deletedFiles || globalWikiImpact,
    previousIndex
  });
  await writeMetadata(analyzed, {
    areas: deletedFiles || globalWikiImpact ? "all" : affectedAreas,
    modules: deletedFiles || globalWikiImpact ? "all" : affectedModules,
    routes: deletedFiles || globalWikiImpact ? "all" : affectedRoutes,
    cleanAreas: deletedFiles || globalWikiImpact,
    cleanModules: deletedFiles || globalWikiImpact,
    cleanRoutes: deletedFiles || globalWikiImpact,
    previousIndex: previousIndex
  });
  await writeSummaryCache(rootDir, cache);
  await writeInsightCache(rootDir, insightCache);
  console.log("RepoWiki updated.");
  console.log("");
  printChanges(changes);
  console.log("");
  console.log("Affected docs:");
  for (const doc of docs) console.log(`- ${doc}`);
}

export function getAffectedModules(scan: RepoScan, changes: ChangeSet, previousFileModules: Record<string, string>): string[] {
  const changedFiles = new Set([...changes.changed, ...changes.added, ...changes.deleted]);
  const affected = new Set<string>();
  for (const module of scan.graph.modules) {
    if (module.files.some((file) => changedFiles.has(file))) affected.add(module.id);
  }
  for (const test of scan.graph.tests) {
    if (!changedFiles.has(test.path)) continue;
    const testedFiles = [...new Set([test.testedFile, ...(test.testedFiles ?? [])].filter((file): file is string => Boolean(file)))];
    for (const module of scan.graph.modules) {
      if (testedFiles.some((file) => module.files.includes(file))) affected.add(module.id);
    }
  }
  for (const deletedFile of changes.deleted) {
    const previousModule = previousFileModules[deletedFile];
    if (previousModule) affected.add(previousModule);
  }
  if (affected.size === 0 && changedFiles.size > 0) {
    for (const module of scan.graph.modules) {
      if (module.id === "project") affected.add(module.id);
    }
  }
  return [...affected].sort();
}

export function getAffectedRoutes(scan: RepoScan, changes: ChangeSet, previousRouteFiles: Record<string, string>): string[] {
  const changedFiles = new Set([...changes.changed, ...changes.added, ...changes.deleted]);
  const affected = new Set<string>();
  for (const route of scan.graph.routes) {
    if (changedFiles.has(route.file)) affected.add(routeContextKey(route));
  }
  for (const deletedFile of changes.deleted) {
    for (const [routeKey, routeFile] of Object.entries(previousRouteFiles)) {
      if (routeFile.includes(deletedFile) || routeKey.startsWith(`${deletedFile}:`)) {
        affected.add(routeKey);
      }
    }
  }
  return [...affected].sort();
}

export function getAffectedAreas(scan: RepoScan, changes: ChangeSet, previousAreaFiles: Record<string, string[]>): string[] {
  const changedFiles = new Set([...changes.changed, ...changes.added, ...changes.deleted]);
  const affected = new Set<string>();
  for (const area of scan.graph.areas) {
    if (area.files.some((file) => changedFiles.has(file))) affected.add(area.id);
  }
  for (const test of scan.graph.tests) {
    if (!changedFiles.has(test.path)) continue;
    const testedFiles = [...new Set([test.testedFile, ...(test.testedFiles ?? [])].filter((file): file is string => Boolean(file)))];
    for (const area of scan.graph.areas) {
      if (testedFiles.some((file) => area.files.includes(file))) affected.add(area.id);
    }
  }
  for (const deletedFile of changes.deleted) {
    for (const [areaId, areaFiles] of Object.entries(previousAreaFiles)) {
      if (areaFiles.includes(deletedFile)) affected.add(areaId);
    }
  }
  return [...affected].sort();
}

function hasSetupRelatedChange(changes: ChangeSet): boolean {
  return [...changes.changed, ...changes.added, ...changes.deleted].some((file) => /(^package\.json$|^\.env|docker|compose|README\.md)/i.test(file));
}

function hasDeletedFiles(changes: ChangeSet): boolean {
  return changes.deleted.length > 0;
}

export function hasGlobalWikiImpact(changes: ChangeSet): boolean {
  return [...changes.changed, ...changes.added, ...changes.deleted].some((file) =>
    /^(src\/(ai|commands|docs|graph|knowledge|scanner|storage|types|utils)\/|package\.json$|tsconfig\.json$|vitest\.config\.ts$|README\.md$)/i.test(file)
  );
}

function printChanges(changes: { changed: string[]; added: string[]; deleted: string[] }): void {
  const all = [...changes.changed, ...changes.added, ...changes.deleted];
  if (!all.length) {
    console.log("Changed files:");
    console.log("- None");
    return;
  }
  if (changes.changed.length) {
    console.log("Changed files:");
    for (const file of changes.changed) console.log(`- ${file}`);
  }
  if (changes.added.length) {
    console.log("Added files:");
    for (const file of changes.added) console.log(`- ${file}`);
  }
  if (changes.deleted.length) {
    console.log("Deleted files:");
    for (const file of changes.deleted) console.log(`- ${file}`);
  }
}
