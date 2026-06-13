import { buildRepoSummaries } from "../ai/buildSummaries.js";
import type { AiRuntimeOptions } from "../ai/types.js";
import { writeDocs } from "../docs/writeDocs.js";
import { scanRepo } from "../scanner/scanRepo.js";
import { writeMetadata } from "../storage/metadataStore.js";

export async function synthesizeCommand(rootDir = process.cwd(), aiOptions?: AiRuntimeOptions): Promise<void> {
  const scan = await scanRepo(rootDir);
  const summaries = await buildRepoSummaries({
    scan,
    options: {
      ...aiOptions,
      enabled: true,
      required: true
    }
  });
  const analyzed = { ...scan, summaries };
  const docs = await writeDocs(analyzed);
  await writeMetadata(analyzed);
  console.log("RepoWiki synthesized with AI.");
  console.log("");
  console.log("Generated docs:");
  for (const doc of docs) console.log(`- ${doc}`);
}
