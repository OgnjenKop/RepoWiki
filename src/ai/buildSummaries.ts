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
    const project = await summarizePackOrFallback(provider, projectPack, options, deterministic.project);
    const areas: Record<string, SummaryRecord> = {};
    for (const area of orderedAreas(scan)) {
      const pack = await buildAreaContextPack({ scan, area });
      areas[area.id] = await summarizePackOrFallback(provider, pack, options, deterministic.areas?.[area.id]);
    }
    const modules: Record<string, SummaryRecord> = {};
    for (const module of scan.graph.modules) {
      const pack = await buildModuleContextPack({ scan, module });
      modules[module.id] = await summarizePackOrFallback(provider, pack, options, deterministic.modules[module.id]);
    }
    const routes: Record<string, SummaryRecord> = {};
    for (const route of scan.graph.routes) {
      const pack = await buildRouteContextPack({ scan, route });
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
  const content = await provider.summarize(pack);
  return {
    provider: "ai",
    model: options?.model ?? process.env.REPOWIKI_AI_MODEL ?? process.env.OPENAI_MODEL,
    content,
    sources: pack.files.map((file) => file.path),
    updatedAt: new Date().toISOString()
  };
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
