import path from "node:path";
import { readJson, writeJson } from "../utils/fs.js";
import { hashContent } from "../utils/hashing.js";
import { buildSummaryMessages } from "./prompt.js";
import type { ContextPack } from "./types.js";
import type { SummaryRecord } from "../types/index.js";

export type AiSummaryCache = {
  version: 1;
  entries: Record<string, CachedAiSummary>;
};

export type CachedAiSummary = {
  content: string;
  model?: string;
  sources: string[];
  packHash: string;
  updatedAt: string;
};

const cacheVersion = 1;
const cacheFileName = "ai-summaries.json";

export function cacheKey(model: string, pack: ContextPack): string {
  const scopeId = pack.scope === "project" ? "project" : pack.title;
  // Routes are keyed by method/path, so include the owning file to avoid collisions.
  const routeSuffix = pack.scope === "route" && pack.files[0] ? `:${pack.files[0].path}` : "";
  return `${model}:${pack.scope}:${scopeId}${routeSuffix}`;
}

export function computePackHash(pack: ContextPack): string {
  // Hash the actual prompt messages so that any prompt or evidence change
  // invalidates cached summaries.
  const messages = buildSummaryMessages(pack);
  return hashContent(JSON.stringify(messages));
}

export async function loadSummaryCache(rootDir: string): Promise<AiSummaryCache> {
  const cached = await readJson<AiSummaryCache>(path.join(rootDir, ".repowiki", cacheFileName));
  if (cached && cached.version === cacheVersion) {
    return cached;
  }
  return { version: cacheVersion, entries: {} };
}

export async function writeSummaryCache(rootDir: string, cache: AiSummaryCache): Promise<void> {
  await writeJson(path.join(rootDir, ".repowiki", cacheFileName), cache);
}

export function getCachedSummary(
  cache: AiSummaryCache,
  model: string,
  pack: ContextPack
): SummaryRecord | undefined {
  const key = cacheKey(model, pack);
  const entry = cache.entries[key];
  if (!entry) return undefined;
  if (entry.packHash !== computePackHash(pack)) return undefined;
  return {
    provider: "ai",
    model,
    content: entry.content,
    sources: entry.sources,
    updatedAt: entry.updatedAt
  };
}

export function setCachedSummary(
  cache: AiSummaryCache,
  model: string,
  pack: ContextPack,
  record: SummaryRecord
): void {
  const key = cacheKey(model, pack);
  cache.entries[key] = {
    content: record.content,
    model: record.model,
    sources: record.sources,
    packHash: computePackHash(pack),
    updatedAt: record.updatedAt ?? new Date().toISOString()
  };
}
