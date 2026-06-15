import type { RepoScan, RepoSummaries, SummaryRecord } from "../types/index.js";
import { buildDeterministicSummaries } from "../knowledge/buildSummaries.js";
import { buildAreaContextPack, buildModuleContextPack, buildProjectContextPack, buildRouteContextPack } from "./contextPacks.js";
import { OpenAICompatibleSummaryProvider } from "./openaiCompatibleProvider.js";
import type { AiRuntimeOptions, ContextPack, SummaryProvider, SummaryBuildInput } from "./types.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";

export async function buildRepoSummaries(input: SummaryBuildInput): Promise<RepoSummaries> {
  const { scan, options } = input;
  const knowledge = scan.knowledge ?? { items: [] };
  const deterministic = buildDeterministicSummaries(scan, knowledge);
  const provider = createSummaryProvider(options);
  if (!provider) {
    if (options?.required) {
      throw new Error("AI synthesis requires --ai-model and --ai-api-key, or REPOWIKI_AI_MODEL and REPOWIKI_AI_API_KEY.");
    }
    return deterministic;
  }

  try {
    const projectPack = await buildProjectContextPack(scan);
    logSynthesisProgress("project", projectPack.title, 1, 1);
    const project = await summarizePackOrFallback(provider, projectPack, options, deterministic.project);
    const areas: Record<string, SummaryRecord> = {};
    const ordered = orderedAreas(scan);
    for (const [index, area] of ordered.entries()) {
      const pack = await buildAreaContextPack({ scan, area });
      logSynthesisProgress("area", pack.title, index + 1, ordered.length);
      areas[area.id] = await summarizePackOrFallback(provider, pack, options, deterministic.areas?.[area.id]);
    }
    const modules: Record<string, SummaryRecord> = {};
    for (const [index, module] of scan.graph.modules.entries()) {
      const pack = await buildModuleContextPack({ scan, module });
      logSynthesisProgress("module", pack.title, index + 1, scan.graph.modules.length);
      modules[module.id] = await summarizePackOrFallback(provider, pack, options, deterministic.modules[module.id]);
    }
    const routes: Record<string, SummaryRecord> = {};
    for (const [index, route] of scan.graph.routes.entries()) {
      const pack = await buildRouteContextPack({ scan, route });
      logSynthesisProgress("route", pack.title, index + 1, scan.graph.routes.length);
      routes[routeSummaryKey(route)] = await summarizePackOrFallback(provider, pack, options, deterministic.routes?.[routeSummaryKey(route)]);
    }
    return { project, areas: Object.keys(areas).length ? areas : undefined, modules, routes: Object.keys(routes).length ? routes : undefined };
  } catch (error) {
    if (options?.required) {
      throw error;
    }
    return deterministic;
  }
}

function createSummaryProvider(options?: AiRuntimeOptions): SummaryProvider | undefined {
  if (!options?.enabled) return undefined;
  const baseUrl = options.baseUrl ?? process.env.REPOWIKI_AI_BASE_URL ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = options.model ?? process.env.REPOWIKI_AI_MODEL ?? process.env.OPENAI_MODEL ?? "";
  const apiKey = options.apiKey ?? process.env.REPOWIKI_AI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
  if (!model || !apiKey) return undefined;
  return new OpenAICompatibleSummaryProvider({ baseUrl, model, apiKey });
}

async function summarizePack(provider: SummaryProvider, pack: ContextPack, options?: AiRuntimeOptions): Promise<SummaryRecord> {
  const content = await summarizePackWithRetry(provider, pack, options?.required ? 2 : 1);
  return {
    provider: "ai",
    model: options?.model ?? process.env.REPOWIKI_AI_MODEL ?? process.env.OPENAI_MODEL,
    content,
    sources: pack.files.map((file) => file.path),
    updatedAt: new Date().toISOString()
  };
}

async function summarizePackWithRetry(provider: SummaryProvider, pack: ContextPack, attempts: number): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await provider.summarize(pack);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.error(`Retrying ${pack.scope} "${pack.title}" after AI summary failure: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function summarizePackOrFallback(
  provider: SummaryProvider,
  pack: ContextPack,
  options: AiRuntimeOptions | undefined,
  fallback: SummaryRecord | undefined
): Promise<SummaryRecord> {
  try {
    return await summarizePack(provider, pack, options);
  } catch (error) {
    if (options?.required) {
      throw error;
    }
    if (!fallback) throw new Error(`No fallback summary available for ${pack.scope}:${pack.title}`);
    return fallback;
  }
}

function routeSummaryKey(route: import("../types/index.js").RouteRecord): string {
  return `${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}`;
}

function logSynthesisProgress(scope: string, title: string, current: number, total: number): void {
  console.error(`Synthesizing ${scope} ${current}/${total}: ${title}`);
}
