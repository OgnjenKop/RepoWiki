import type { RepoScan } from "../types/index.js";
import { code, list, callout, breadcrumbs, tableOfContents, statCards } from "../utils/markdown.js";
import { installCommand, scriptCommand } from "../utils/packageManager.js";

function firstModuleId(scan: RepoScan): string {
  return scan.graph.modules[0]?.id ?? "src-cli";
}

export function generateSetupDoc(scan: RepoScan): string {
  const scripts = scan.project.scripts;
  const envVars = [...new Set(scan.graph.envVars.map((env) => env.name))].sort();
  const dockerFiles = scan.graph.files.map((file) => file.path).filter((file) => /docker|compose/i.test(file));
  const packageManager = scan.project.packageManager;

  return `# Setup

${breadcrumbs([{ label: "Wiki", href: "index.md" }, { label: "Setup" }])}

## At a Glance

${statCards([
  { label: "Package Manager", value: packageManager, hint: "for installs and scripts" },
  { label: "Scripts", value: Object.keys(scripts).length, hint: "available" },
  { label: "Env Vars", value: envVars.length, hint: "configured" },
  { label: "Docker", value: dockerFiles.length, hint: "files" }
])}

${tableOfContents([
  { anchor: "requirements", label: "Requirements" },
  { anchor: "install", label: "Install" },
  { anchor: "quick-start", label: "Quick Start" },
  { anchor: "common-commands", label: "Common Commands" },
  { anchor: "environment-variables", label: "Environment Variables" },
  { anchor: "docker", label: "Docker" },
  { anchor: "contributor-checklist", label: "Contributor Checklist" }
])}

## Requirements

- **Node.js 20 or newer** — required to build and run the project.
- **Package manager:** ${code(packageManager)} — the repository's detected package manager.

${callout("note", "Don't have the right Node version?", `Use ${code("nvm install 20")} or your preferred version manager to install Node 20+. The project uses modern ESM and TypeScript features that require a recent runtime.`)}

## Install

Clone the repository and install dependencies:

${code(installCommand(scan.project.packageManager))}

## Quick Start

Get the project running in under a minute:

${(() => {
  const startScript = scripts.start ?? scripts["start:dev"] ?? scripts.serve;
  if (startScript) {
    const scriptName = scripts.start ? "start" : scripts["start:dev"] ? "start:dev" : "serve";
    return code(`${scriptCommand(scan.project.packageManager, scriptName)}`);
  }
    return callout("note", "No start script detected", "Check the Common Commands section below for available scripts, or run the project manually per its README.");
})()}

${callout("tip", "Refreshing the wiki", `After making changes, regenerate this wiki with ${code("repowiki update")} from a checkout of RepoWiki.`)}

## Common Commands

${callout("note", "Script reference", `These are the npm scripts defined in ${code("package.json")}. Run them with ${code(`${packageManager} run <name>`)}.`)}

${list(Object.entries(scripts).map(([name, value]) => `${code(`${packageManager} run ${name}`)} — runs ${code(value)}`), "_No scripts defined._")}

### Most Common Tasks

${list([
  scripts.build ? `**Build:** ${code(scriptCommand(packageManager, "build"))} — type-check and compile the project.` : undefined,
  scripts.test ? `**Test:** ${code(scriptCommand(packageManager, "test"))} — run the test suite.` : undefined,
  scripts.dev ? `**Dev:** ${code(scriptCommand(packageManager, "dev"))} — run the project in development mode.` : undefined,
  scripts.dev ? `**Check docs:** ${code(`${scriptCommand(packageManager, "dev")} check`)} — verify the wiki is up to date.` : undefined
].filter(Boolean) as string[], "_No common commands detected._")}

## Environment Variables

${callout("note", "Where to set these", `Put these in a ${code(".env")} file at the project root, or export them in your shell. The application reads them at startup.`)}

${list(envVars.map((env) => `${code(env)}`), "_No environment variables detected._")}

## Docker

${list(dockerFiles.map((file) => `${code(file)} — Docker-related file detected`), "_No Docker files detected._")}

## Contributor Checklist

Before opening a pull request:

${list([
  `${code(scriptCommand(packageManager, "build"))} — confirm the project type-checks and builds.`,
  scripts.test ? `${code(scriptCommand(packageManager, "test"))} — run the test suite.` : undefined,
  "Regenerate the wiki if you changed scanner, docs, CLI, or public-output code.",
  "Add a test for any new behavior.",
  `Update the relevant [module doc](modules/${firstModuleId(scan)}.md) if you changed a module's public API.`
].filter(Boolean) as string[], "_No contributor checklist items._")}

${callout("important", "Keep the wiki fresh", `This wiki is generated from the codebase. After making changes, run ${code(`${scriptCommand(packageManager, "dev")} --root . update`)} to refresh it. The ${code("check")} command will tell you if the wiki is stale.`)}

## What's Next?

- [Architecture](architecture.md) — understand the system shape
- [Agent Context](agent-context.md) — what to read first as a coding agent
- [Areas](areas/index.md) — high-level functional groups
`;
}
