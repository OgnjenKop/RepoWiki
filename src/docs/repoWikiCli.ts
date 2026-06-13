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

export function renderRepoWikiFlags(scan: RepoScan): string[] {
  return [...new Set(scan.project.cliOptions ?? [])].sort().map((flag) => {
    if (flag === "--root") return `${code(flag)} - repository root to scan`;
    if (flag === "--verbose") return `${code(flag)} - print verbose output`;
    if (flag === "--ai") return `${code(flag)} - enable AI-generated summaries`;
    if (flag === "--ai-base-url") return `${code(flag)} - OpenAI-compatible API base URL`;
    if (flag === "--ai-model") return `${code(flag)} - AI model name`;
    if (flag === "--ai-api-key") return `${code(flag)} - AI API key`;
    return code(flag);
  });
}

export function renderInstallCommand(scan: RepoScan): string {
  return code(installCommand(scan.project.packageManager));
}
