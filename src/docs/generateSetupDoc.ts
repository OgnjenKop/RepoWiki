import type { RepoScan } from "../types/index.js";
import { code, list } from "../utils/markdown.js";
import { installCommand, scriptCommand } from "../utils/packageManager.js";

export function generateSetupDoc(scan: RepoScan): string {
  const scripts = scan.project.scripts;
  const envVars = [...new Set(scan.graph.envVars.map((env) => env.name))].sort();
  const dockerFiles = scan.graph.files.map((file) => file.path).filter((file) => /docker|compose/i.test(file));

  return `# Setup

## Install

${code(installCommand(scan.project.packageManager))}

## Development

${scripts.dev ? code(scriptCommand(scan.project.packageManager, "dev")) : "_No dev script detected._"}

## Build

${scripts.build ? code(scriptCommand(scan.project.packageManager, "build")) : "_No build script detected._"}

## Test

${scripts.test ? code(scriptCommand(scan.project.packageManager, "test")) : "_No test script detected._"}

## Environment Variables

${list(envVars.map(code))}

## Docker Notes

${list(dockerFiles.map(code), "_No Docker files detected._")}
`;
}
