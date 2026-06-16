import { buildRepoSummaries, logSynthesisCoverage } from "../ai/buildSummaries.js";
import { buildRepoInsights } from "../ai/buildInsights.js";
import type { AiRuntimeOptions } from "../ai/types.js";
import { resolveAiModel } from "../ai/config.js";
import { loadSummaryCache, writeSummaryCache } from "../ai/summaryCache.js";
import { loadInsightCache, writeInsightCache } from "../ai/insightCache.js";
import { writeDocs } from "../docs/writeDocs.js";
import { scanRepo } from "../scanner/scanRepo.js";
import { writeMetadata } from "../storage/metadataStore.js";

export async function synthesizeCommand(rootDir = process.cwd(), aiOptions?: AiRuntimeOptions): Promise<void> {
  const scan = await scanRepo(rootDir);
  const noCache = aiOptions?.noCache ?? false;
  const cache = noCache ? undefined : await loadSummaryCache(rootDir);
  const aiRuntime = { ...aiOptions, enabled: true, required: true };
  const insightModel = resolveAiModel(aiRuntime);
  const insightCache = noCache ? undefined : await loadInsightCache(rootDir, insightModel);
  const summaries = await buildRepoSummaries({ scan, options: aiRuntime, cache });
  const insights = await buildRepoInsights({ scan, options: aiRuntime, cache: insightCache });
  const analyzed = { ...scan, summaries, insights };
  const docs = await writeDocs(analyzed);
  await writeMetadata(analyzed);
  if (cache) await writeSummaryCache(rootDir, cache);
  if (insightCache) await writeInsightCache(rootDir, insightCache);
  logSynthesisCoverage(summaries);
  console.log("");
  console.log("RepoWiki synthesized with AI.");
  console.log("");
  console.log("Generated docs:");
  for (const doc of docs) console.log(`- ${doc}`);
}
