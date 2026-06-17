import type { RepoScan, RepoSummaries, SummaryRecord } from "../types/index.js";
import { buildDeterministicSummaries } from "../knowledge/buildSummaries.js";
import { buildAreaContextPack, buildModuleContextPack, buildProjectContextPack, buildRouteContextPack, reduceContextPack } from "./contextPacks.js";
import { OpenAICompatibleSummaryProvider } from "./openaiCompatibleProvider.js";
import type { AiRuntimeOptions, ContextPack, SummaryProvider } from "./types.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { getCachedSummary, setCachedSummary, type AiSummaryCache } from "./summaryCache.js";
import { resolveAiApiKey, resolveAiBaseUrl, resolveAiModel } from "./config.js";

const defaultConcurrency = 3;

export type SummaryBuildInput = {
  scan: RepoScan;
  options?: AiRuntimeOptions;
  cache?: AiSummaryCache;
};

export async function buildRepoSummaries(input: SummaryBuildInput): Promise<RepoSummaries> {
  const { scan, options, cache } = input;
  const knowledge = scan.knowledge ?? { items: [] };
  const deterministic = buildDeterministicSummaries(scan, knowledge);
  const provider = createSummaryProvider(options);
  if (!provider) {
    if (options?.required) {
      throw new Error("AI synthesis requires --ai-api-key (or REPOWIKI_AI_API_KEY). The default model is `deepseek/deepseek-v4-flash`; override with --ai-model or REPOWIKI_AI_MODEL.");
    }
    return deterministic;
  }

  const model = resolveAiModel(options);

  try {
    const projectPack = await buildProjectContextPack(scan);
    logSynthesisProgress("project", projectPack.title, 1, 1);
    const project = await summarizePackOrFallback(provider, projectPack, options, deterministic.project, cache, model);

    const ordered = orderedAreas(scan);
    const areas = await mapWithConcurrency(ordered, defaultConcurrency, async (area, index) => {
      const pack = await buildAreaContextPack({ scan, area });
      logSynthesisProgress("area", pack.title, index + 1, ordered.length);
      const summary = await summarizePackOrFallback(provider, pack, options, deterministic.areas?.[area.id], cache, model);
      return [area.id, summary] as const;
    });
    const areaMap = Object.fromEntries(areas) as Record<string, SummaryRecord>;

    const modules = await mapWithConcurrency(scan.graph.modules, defaultConcurrency, async (module, index) => {
      const pack = await buildModuleContextPack({ scan, module });
      logSynthesisProgress("module", pack.title, index + 1, scan.graph.modules.length);
      const summary = await summarizePackOrFallback(provider, pack, options, deterministic.modules[module.id], cache, model);
      return [module.id, summary] as const;
    });
    const moduleMap = Object.fromEntries(modules) as Record<string, SummaryRecord>;

    const routes = await mapWithConcurrency(scan.graph.routes, defaultConcurrency, async (route, index) => {
      const pack = await buildRouteContextPack({ scan, route });
      logSynthesisProgress("route", pack.title, index + 1, scan.graph.routes.length);
      const key = routeSummaryKey(route);
      const summary = await summarizePackOrFallback(provider, pack, options, deterministic.routes?.[key], cache, model);
      return [key, summary] as const;
    });
    const routeMap = Object.fromEntries(routes) as Record<string, SummaryRecord>;

    return {
      project,
      areas: Object.keys(areaMap).length ? areaMap : undefined,
      modules: moduleMap,
      routes: Object.keys(routeMap).length ? routeMap : undefined
    };
  } catch (error) {
    if (options?.required) {
      throw error;
    }
    return deterministic;
  }
}

function createSummaryProvider(options?: AiRuntimeOptions): SummaryProvider | undefined {
  if (!options?.enabled) return undefined;
  const baseUrl = resolveAiBaseUrl(options);
  const model = resolveAiModel(options);
  const apiKey = resolveAiApiKey(options);
  if (!apiKey) return undefined;
  return new OpenAICompatibleSummaryProvider({ baseUrl, model, apiKey });
}

async function summarizePack(provider: SummaryProvider, pack: ContextPack, cache: AiSummaryCache | undefined, model: string): Promise<SummaryRecord> {
  if (cache) {
    const cached = getCachedSummary(cache, model, pack);
    if (cached) {
      return cached;
    }
  }
  const content = await summarizePackWithRetry(provider, pack, 2);
  const record: SummaryRecord = {
    provider: "ai",
    model,
    content,
    sources: pack.files.map((file) => file.path),
    updatedAt: new Date().toISOString()
  };
  if (cache) {
    setCachedSummary(cache, model, pack, record);
  }
  return record;
}

async function summarizePackWithRetry(provider: SummaryProvider, pack: ContextPack, attempts: number): Promise<string> {
  let lastError: unknown;
  let currentPack = pack;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await provider.summarize(currentPack);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (attempt < attempts && isContextLimitError(message)) {
        currentPack = reduceContextPack(currentPack);
        console.error(`Reducing context for ${pack.scope} "${pack.title}" after context limit error and retrying (${attempt}/${attempts}).`);
        continue;
      }
      if (attempt < attempts) {
        console.error(`Retrying ${pack.scope} "${pack.title}" after AI summary failure: ${message}`);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function isContextLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("token limit") ||
    lower.includes("context length") ||
    lower.includes("context too long") ||
    lower.includes("maximum context") ||
    lower.includes("finish_reason: length") ||
    lower.includes("too many tokens") ||
    lower.includes("exceeds token") ||
    lower.includes("request timeout") ||
    lower.includes("signal timed out") ||
    lower.includes("the operation was aborted");
}

async function summarizePackOrFallback(
  provider: SummaryProvider,
  pack: ContextPack,
  options: AiRuntimeOptions | undefined,
  fallback: SummaryRecord | undefined,
  cache: AiSummaryCache | undefined,
  model: string
): Promise<SummaryRecord> {
  try {
    return await summarizePack(provider, pack, cache, model);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!fallback) {
      // No deterministic fallback available; in required mode we have to fail.
      if (options?.required) {
        throw error;
      }
      throw new Error(`No fallback summary available for ${pack.scope}:${pack.title}: ${message}`);
    }
    console.error(`Warning: AI summary failed for ${pack.scope} "${pack.title}". Falling back to deterministic summary. Error: ${message}`);
    return { ...fallback, provider: "deterministic" };
  }
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

function routeSummaryKey(route: import("../types/index.js").RouteRecord): string {
  return `${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}`;
}

export function logSynthesisCoverage(summaries: RepoSummaries): void {
  const projectTotal = summaries.project ? 1 : 0;
  const projectAi = summaries.project?.provider === "ai" ? 1 : 0;
  const areaIds = Object.keys(summaries.areas ?? {});
  const areaAi = areaIds.filter((id) => summaries.areas?.[id].provider === "ai").length;
  const moduleIds = Object.keys(summaries.modules);
  const moduleAi = moduleIds.filter((id) => summaries.modules[id].provider === "ai").length;
  const routeIds = Object.keys(summaries.routes ?? {});
  const routeAi = routeIds.filter((id) => summaries.routes?.[id].provider === "ai").length;

  const total = projectTotal + areaIds.length + moduleIds.length + routeIds.length;
  const ai = projectAi + areaAi + moduleAi + routeAi;

  console.error("");
  console.error(
    `AI summaries: ${ai}/${total} (project: ${projectAi}/${projectTotal}, areas: ${areaAi}/${areaIds.length}, modules: ${moduleAi}/${moduleIds.length}, routes: ${routeAi}/${routeIds.length})`
  );

  if (ai < total) {
    const fallbackCounts = {
      project: projectTotal - projectAi,
      area: areaIds.length - areaAi,
      module: moduleIds.length - moduleAi,
      route: routeIds.length - routeAi
    };
    const parts = Object.entries(fallbackCounts)
      .filter(([, count]) => count > 0)
      .map(([scope, count]) => `${count} ${scope}${count === 1 ? "" : "s"}`);
    console.error(`Deterministic fallbacks: ${parts.join(", ")}`);
  }
}

function logSynthesisProgress(scope: string, title: string, current: number, total: number): void {
  console.error(`Synthesizing ${scope} ${current}/${total}: ${title}`);
}
