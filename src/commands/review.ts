import path from "node:path";
import { scanRepo } from "../scanner/scanRepo.js";
import { writeDocs } from "../docs/writeDocs.js";
import { writeMetadata } from "../storage/metadataStore.js";
import { buildRepoSummaries } from "../ai/buildSummaries.js";

export async function reviewCommand(rootDir = process.cwd()): Promise<void> {
  const scan = await scanRepo(rootDir);
  const summaries = await buildRepoSummaries({ scan, options: { enabled: false } });
  const analyzed = { ...scan, summaries };
  await writeDocs(analyzed);
  await writeMetadata(analyzed);
  const reviewPath = path.join(rootDir, "docs/repo-wiki/codex-review.md");
  console.log("RepoWiki review prompt generated.");
  console.log("");
  console.log(`Open ${reviewPath} and use the prompt with Codex or ChatGPT.`);
}
