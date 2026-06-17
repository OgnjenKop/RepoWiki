import type { RepoScan, FileRecord } from "../types/index.js";
import type { AiRuntimeOptions, RepoInsights, ModuleInsight } from "./types.js";
import { OpenAICompatibleSummaryProvider } from "./openaiCompatibleProvider.js";
import {
  buildProjectNarrativeMessages,
  buildArchitectureStoryMessages,
  buildModuleInsightMessages,
  parseProjectNarrative,
  parseArchitectureStory,
  parseModuleInsight
} from "./insightPrompts.js";
import {
  type InsightCache,
  type InsightScope,
  computePackHash,
  getCachedInsight,
  setCachedInsight
} from "./insightCache.js";
import { resolveAiApiKey, resolveAiBaseUrl, resolveAiModel } from "./config.js";

const defaultConcurrency = 3;
const maxSnippetChars = 4000;
const defaultSnippetLines = 80;
const evidencePerFile = 12;
const filesForContext = 18;

export type InsightBuildInput = {
  scan: RepoScan;
  options?: AiRuntimeOptions;
  cache?: InsightCache;
};

export async function buildRepoInsights(input: InsightBuildInput): Promise<RepoInsights | undefined> {
  const { scan, options, cache } = input;
  const provider = createProvider(options);
  if (!provider) return undefined;

  const projectContext = buildProjectContext(scan);
  const insights: RepoInsights = { moduleInsights: {} };

  const projectMessages = buildProjectNarrativeMessages(projectContext);
  const projectHash = computePackHash(projectMessages);
  try {
    const projectContent = await chatWithCache(
      provider,
      cache,
      "project",
      projectMessages,
      projectHash
    );
    insights.project = parseProjectNarrative(projectContent);
  } catch (error) {
    logInsightFailure("project-narrative", error);
  }

  const archMessages = buildArchitectureStoryMessages(projectContext);
  const archHash = computePackHash(archMessages);
  try {
    const archContent = await chatWithCache(
      provider,
      cache,
      "architecture",
      archMessages,
      archHash
    );
    insights.architecture = parseArchitectureStory(archContent);
  } catch (error) {
    logInsightFailure("architecture-story", error);
  }

  const moduleInsights = await mapWithConcurrency(
    scan.graph.modules,
    defaultConcurrency,
    async (module) => {
      const moduleFiles = scan.graph.files.filter((f) => module.files.includes(f.path));
      const relatedFiles = findRelatedFiles(scan, module.files, 8);
      const snippets = collectSnippets([...moduleFiles, ...relatedFiles]);
      const moduleMessages = buildModuleInsightMessages(
        module.name,
        module.files,
        relatedFiles.map((f) => f.path),
        snippets
      );
      const moduleHash = computePackHash(moduleMessages);
      const scope: InsightScope = `module:${module.id}`;
      try {
        const content = await chatWithCache(provider, cache, scope, moduleMessages, moduleHash);
        return { moduleId: module.id, insight: parseModuleInsight(content) };
      } catch (error) {
        logInsightFailure(`module-insight:${module.id}`, error);
        return null;
      }
    }
  );

  for (const result of moduleInsights) {
    if (result) insights.moduleInsights[result.moduleId] = result.insight;
  }

  return insights;
}

async function chatWithCache(
  provider: OpenAICompatibleSummaryProvider,
  cache: InsightCache | undefined,
  scope: InsightScope,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  packHash: string
): Promise<string> {
  if (cache) {
    const cached = getCachedInsight(cache, scope, packHash);
    if (cached !== undefined) return cached;
  }
  const content = await provider.chat(messages, scope, { jsonMode: true });
  if (cache) {
    setCachedInsight(cache, scope, packHash, content);
  }
  return content;
}

function createProvider(options?: AiRuntimeOptions): OpenAICompatibleSummaryProvider | undefined {
  if (!options?.enabled) return undefined;
  const baseUrl = resolveAiBaseUrl(options);
  const model = resolveAiModel(options);
  const apiKey = resolveAiApiKey(options);
  if (!apiKey) return undefined;
  return new OpenAICompatibleSummaryProvider({ baseUrl, model, apiKey });
}

function buildProjectContext(scan: RepoScan) {
  const moduleList = scan.graph.modules.map((m) => m.name);
  const areaList = scan.graph.areas.map((a) => a.name);
  const centralFiles = scan.graph.files
    .filter((f) => ["package.json", "tsconfig.json", "README.md", "index.ts", "index.js", "main.ts", "main.js", "app.ts", "app.js"]
      .some((name) => f.path.endsWith(name)) || f.imports.length > 0)
    .slice(0, filesForContext)
    .map((f) => f.path);
  const keyFiles = centralFiles.length
    ? centralFiles
    : scan.graph.files.slice(0, filesForContext).map((f) => f.path);
  return {
    projectName: scan.project.name,
    projectType: scan.project.type,
    moduleList,
    areaList,
    keyFiles,
    dependencies: scan.project.dependencies,
    scripts: scan.project.scripts,
    routeCount: scan.graph.routes.length,
    testCount: scan.graph.tests.length,
    evidenceSnippets: collectSnippets(scan.graph.files.slice(0, filesForContext))
  };
}

function findRelatedFiles(scan: RepoScan, moduleFiles: string[], limit: number): FileRecord[] {
  const moduleSet = new Set(moduleFiles);
  const incoming = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    if (moduleSet.has(edge.from) && !moduleSet.has(edge.to)) {
      incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    }
    if (moduleSet.has(edge.to) && !moduleSet.has(edge.from)) {
      incoming.set(edge.from, (incoming.get(edge.from) ?? 0) + 1);
    }
  }
  return [...incoming.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([path]) => scan.graph.files.find((f) => f.path === path))
    .filter((f): f is FileRecord => Boolean(f));
}

function collectSnippets(files: FileRecord[]): string {
  const sections: string[] = [];
  let total = 0;
  for (const file of files.slice(0, evidencePerFile)) {
    const snippet = truncate(file.path, file.exports.join(", "), file.imports.length);
    if (total + snippet.length > maxSnippetChars) break;
    sections.push(snippet);
    total += snippet.length;
  }
  return sections.join("\n\n");
}

function truncate(path: string, exports: string, imports: number): string {
  const lines = [
    `### ${path}`,
    `- exports: ${exports || "none"}`,
    `- imports: ${imports} module(s)`
  ];
  return lines.join("\n");
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;
  let rejected = false;

  async function worker(): Promise<void> {
    while (!rejected && index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex]!, currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    worker().catch((error) => {
      rejected = true;
      throw error;
    })
  );

  await Promise.all(workers);
  return results;
}

function logInsightFailure(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Warning: AI insight for ${scope} failed: ${message}`);
}
