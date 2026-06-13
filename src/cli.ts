#!/usr/bin/env node
import path from "node:path";
import { Command } from "commander";
import { simpleGit } from "simple-git";
import { checkCommand } from "./commands/check.js";
import { generateCommand } from "./commands/generate.js";
import { reviewCommand } from "./commands/review.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
  .name("repowiki")
  .description("Generate and maintain a deterministic Markdown wiki for a repository.")
  .version("0.1.0")
  .option("-r, --root <path>", "repository root to scan")
  .option("--verbose", "print verbose output")
  .option("--ai", "enable AI-generated summaries")
  .option("--ai-base-url <url>", "OpenAI-compatible API base URL")
  .option("--ai-model <model>", "AI model name")
  .option("--ai-api-key <key>", "AI API key");

program.command("generate").description("Generate the full wiki from scratch.").action(run(generateCommand));
program.command("update").description("Update stale wiki docs and metadata.").action(run(updateCommand));
program.command("check").description("Check whether the wiki is stale.").action(run(checkCommand));
program.command("review").description("Generate a Codex-ready no-API review prompt.").action(run(reviewCommand));

program.parseAsync(process.argv);

function run(handler: (rootDir: string, aiOptions?: { enabled?: boolean; baseUrl?: string; model?: string; apiKey?: string }) => Promise<void>) {
  return async () => {
    try {
      const options = program.opts<{ root?: string; verbose?: boolean }>();
      const aiOptions = program.opts<{ ai?: boolean; aiBaseUrl?: string; aiModel?: string; aiApiKey?: string }>();
      const rootDir = options.root ? path.resolve(options.root) : await resolveDefaultRoot();
      if (options.verbose) console.log(`RepoWiki root: ${rootDir}`);
      await handler(rootDir, {
        enabled: aiOptions.ai,
        baseUrl: aiOptions.aiBaseUrl,
        model: aiOptions.aiModel,
        apiKey: aiOptions.aiApiKey
      });
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  };
}

async function resolveDefaultRoot(): Promise<string> {
  const cwd = process.cwd();
  try {
    return await simpleGit(cwd).revparse(["--show-toplevel"]);
  } catch {
    return cwd;
  }
}
