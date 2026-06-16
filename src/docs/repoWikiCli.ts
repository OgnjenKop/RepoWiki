import { code } from "../utils/markdown.js";
import { installCommand } from "../utils/packageManager.js";
import type { RepoScan } from "../types/index.js";

export function renderRepoWikiCommands(scan: RepoScan): string[] {
  const commands = [...new Set(scan.project.cliCommands ?? [])].sort();
  const rendered = commands.map((command) => {
    if (command === "synthesize") return `${code("repowiki synthesize")} - Generate the full wiki with required AI synthesis.`;
    if (command === "generate") return `${code("repowiki generate")} - Generate the deterministic baseline wiki.`;
    if (command === "update") return `${code("repowiki update")} - Refresh stale docs and metadata.`;
    if (command === "check") return `${code("repowiki check")} - Verify whether the wiki is stale.`;
    if (command === "review") return `${code("repowiki review")} - Generate a Codex-ready model review prompt.`;
    return code(`repowiki ${command}`);
  });
  return [`${code("repowiki --help")} - Show CLI help.`, ...rendered];
}

const repoWikiFlags: Array<{ flag: string; description: string }> = [
  { flag: "--root <path>", description: "repository root to scan" },
  { flag: "--verbose", description: "print verbose output" },
  { flag: "--ai", description: "enable AI-generated summaries" },
  { flag: "--ai-base-url <url>", description: "OpenAI-compatible API base URL" },
  { flag: "--ai-model <model>", description: "AI model name" },
  { flag: "--ai-api-key <key>", description: "AI API key" }
];

export function renderRepoWikiFlags(_scan: RepoScan): string[] {
  return repoWikiFlags.map(({ flag, description }) => `${code(flag)} - ${description}`);
}

export function renderInstallCommand(scan: RepoScan): string {
  return code(installCommand(scan.project.packageManager));
}
