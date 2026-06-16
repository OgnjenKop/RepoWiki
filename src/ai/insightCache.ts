import path from "node:path";
import { readJson, writeJson } from "../utils/fs.js";
import { hashContent } from "../utils/hashing.js";

export type InsightScope = "project" | "architecture" | `module:${string}`;

export type InsightCache = {
  version: 1;
  model: string;
  entries: Record<string, CachedInsight>;
};

export type CachedInsight = {
  content: string;
  packHash: string;
  updatedAt: string;
};

const cacheVersion = 1;
const cacheFileName = "ai-insights.json";

export function cacheKeyFor(model: string, scope: InsightScope): string {
  return `${model}::${scope}`;
}

export function computePackHash(messages: Array<{ role: string; content: string }>): string {
  return hashContent(JSON.stringify(messages));
}

export async function loadInsightCache(rootDir: string, model: string): Promise<InsightCache> {
  const cached = await readJson<InsightCache>(path.join(rootDir, ".repowiki", cacheFileName));
  if (!cached || cached.version !== cacheVersion || cached.model !== model) {
    return { version: cacheVersion, model, entries: {} };
  }
  return cached;
}

export async function writeInsightCache(rootDir: string, cache: InsightCache): Promise<void> {
  await writeJson(path.join(rootDir, ".repowiki", cacheFileName), cache);
}

export function getCachedInsight(
  cache: InsightCache,
  scope: InsightScope,
  packHash: string
): string | undefined {
  const key = cacheKeyFor(cache.model, scope);
  const entry = cache.entries[key];
  if (!entry) return undefined;
  if (entry.packHash !== packHash) return undefined;
  return entry.content;
}

export function setCachedInsight(
  cache: InsightCache,
  scope: InsightScope,
  packHash: string,
  content: string
): void {
  const key = cacheKeyFor(cache.model, scope);
  cache.entries[key] = {
    content,
    packHash,
    updatedAt: new Date().toISOString()
  };
}
