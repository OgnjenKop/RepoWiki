import { scanRepo } from "../scanner/scanRepo.js";
import { writeDocs } from "../docs/writeDocs.js";
import { writeMetadata } from "../storage/metadataStore.js";
import { buildRepoSummaries } from "../ai/buildSummaries.js";
import type { AiRuntimeOptions } from "../ai/types.js";

export async function generateCommand(rootDir = process.cwd(), aiOptions?: AiRuntimeOptions): Promise<void> {
  const scan = await scanRepo(rootDir);
  const summaries = await buildRepoSummaries({ scan, options: aiOptions });
  const analyzed = { ...scan, summaries };
  const docs = await writeDocs(analyzed);
  await writeMetadata(analyzed);
  console.log("RepoWiki generated.");
  console.log("");
  console.log("Generated docs:");
  for (const doc of docs) console.log(`- ${doc}`);
}
