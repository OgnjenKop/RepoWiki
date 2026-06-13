import { scanRepo } from "../scanner/scanRepo.js";
import { diffHashes, hasChanges, hasStoredHashes, hashesFromScan, loadHashes } from "../storage/metadataStore.js";

export async function checkCommand(rootDir = process.cwd()): Promise<void> {
  const hasMetadata = await hasStoredHashes(rootDir);
  const previous = await loadHashes(rootDir);
  const scan = await scanRepo(rootDir);
  const changes = diffHashes(previous, hashesFromScan(scan));
  if (!hasChanges(changes)) {
    console.log("RepoWiki is fresh.");
    return;
  }
  if (!hasMetadata) {
    console.log("RepoWiki metadata is missing.");
    console.log("");
    console.log("Run:");
    console.log("  repowiki generate");
    process.exitCode = 1;
    return;
  }
  console.log("RepoWiki is stale.");
  console.log("");
  printChanges(changes);
  console.log("");
  console.log("Run:");
  console.log("  repowiki update");
  process.exitCode = 1;
}

function printChanges(changes: { changed: string[]; added: string[]; deleted: string[] }): void {
  if (changes.changed.length) {
    console.log("Changed files:");
    for (const file of changes.changed) console.log(`- ${file}`);
  }
  if (changes.added.length) {
    console.log("Added files:");
    for (const file of changes.added) console.log(`- ${file}`);
  }
  if (changes.deleted.length) {
    console.log("Deleted files:");
    for (const file of changes.deleted) console.log(`- ${file}`);
  }
}
