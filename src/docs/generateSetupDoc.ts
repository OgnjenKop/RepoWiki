import type { RepoScan } from "../types/index.js";
import { code, list } from "../utils/markdown.js";
import { installCommand, scriptCommand } from "../utils/packageManager.js";

export function generateSetupDoc(scan: RepoScan): string {
  const scripts = scan.project.scripts;
  const envVars = [...new Set(scan.graph.envVars.map((env) => env.name))].sort();
  const dockerFiles = scan.graph.files.map((file) => file.path).filter((file) => /docker|compose/i.test(file));
  const packageManager = scan.project.packageManager;

  return `# Setup

## Requirements

- Node.js 20 or newer.
- ${packageManager === "unknown" ? "The repository package manager." : `Package manager: ${packageManager}.`}

## Install

${code(installCommand(scan.project.packageManager))}

## Quick Start

${scripts.dev ? code(`${scriptCommand(scan.project.packageManager, "dev")} -- --root . update`) : "_No dev script detected._"}

## Development

${scripts.dev ? code(scriptCommand(scan.project.packageManager, "dev")) : "_No dev script detected._"}

## Build

${scripts.build ? code(scriptCommand(scan.project.packageManager, "build")) : "_No build script detected._"}

## Test

${scripts.test ? code(scriptCommand(scan.project.packageManager, "test")) : "_No test script detected._"}

## Freshness Check

${scripts.dev ? code(`${scriptCommand(scan.project.packageManager, "dev")} -- check`) : "_No dev script detected._"}

## Environment Variables

${list(envVars.map(code), "_No environment variables detected._")}

## Docker Notes

${list(dockerFiles.map(code), "_No Docker files detected._")}

## Contributor Notes

- Run the build and test commands before publishing changes.
- Regenerate RepoWiki docs after scanner, docs, CLI, or public-output changes.
- Commit generated docs when they are part of the repository contract.
`;
}
