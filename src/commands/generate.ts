import { scanRepo } from "../scanner/scanRepo.js";
import { writeDocs } from "../docs/writeDocs.js";
import { writeMetadata } from "../storage/metadataStore.js";
import { buildRepoSummaries } from "../ai/buildSummaries.js";
import { buildRepoInsights } from "../ai/buildInsights.js";
import type { AiRuntimeOptions } from "../ai/types.js";
import { resolveAiModel } from "../ai/config.js";
import { loadSummaryCache, writeSummaryCache } from "../ai/summaryCache.js";
import { loadInsightCache, writeInsightCache } from "../ai/insightCache.js";

export async function generateCommand(rootDir = process.cwd(), aiOptions?: AiRuntimeOptions): Promise<void> {
  const scan = await scanRepo(rootDir);
  const noCache = aiOptions?.noCache ?? false;
  const cache = noCache ? undefined : await loadSummaryCache(rootDir);
  const insightModel = resolveAiModel(aiOptions);
  const insightCache = noCache ? undefined : await loadInsightCache(rootDir, insightModel);
  const summaries = await buildRepoSummaries({ scan, options: aiOptions, cache });
  const insights = await buildRepoInsights({ scan, options: aiOptions, cache: insightCache });
  const analyzed = { ...scan, summaries, insights };
  const docs = await writeDocs(analyzed);
  await writeMetadata(analyzed);
  if (cache) await writeSummaryCache(rootDir, cache);
  if (insightCache) await writeInsightCache(rootDir, insightCache);
  console.log("RepoWiki generated.");
  console.log("");
  console.log("Generated docs:");
  for (const doc of docs) console.log(`- ${doc}`);
}
