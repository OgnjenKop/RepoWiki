import fs from "node:fs/promises";
import path from "node:path";
import type { ProjectInfo } from "../types/index.js";
import { pathExists } from "../utils/fs.js";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function detectProject(rootDir: string, files: string[]): Promise<ProjectInfo> {
  const packagePath = path.join(rootDir, "package.json");
  const packageJson = await readPackageJson(packagePath);
  const deps = Object.keys(packageJson.dependencies ?? {});
  const devDeps = Object.keys(packageJson.devDependencies ?? {});
  const allDeps = new Set([...deps, ...devDeps]);

  const normalizedFiles = files.map((file) => file.split("\\").join("/"));
  const type = detectProjectType(allDeps, normalizedFiles);
  const cliMetadata = await detectCliMetadata(rootDir);
  return {
    name: packageJson.name ?? path.basename(rootDir),
    type,
    packageManager: detectPackageManager(normalizedFiles),
    scripts: packageJson.scripts ?? {},
    dependencies: deps.sort(),
    devDependencies: devDeps.sort(),
    configFiles: normalizedFiles.filter(isConfigFile).sort(),
    cliOptions: cliMetadata.options,
    cliCommands: cliMetadata.commands
  };
}

async function readPackageJson(packagePath: string): Promise<PackageJson> {
  if (!(await pathExists(packagePath))) return {};
  try {
    return JSON.parse(await fs.readFile(packagePath, "utf8")) as PackageJson;
  } catch {
    return {};
  }
}

export function detectProjectType(deps: Set<string>, files: string[]): string {
  if (deps.has("next") || files.some((file) => file.startsWith("app/") || file.startsWith("pages/"))) return "Next.js";
  if (deps.has("@nestjs/core")) return "NestJS";
  if (deps.has("express")) return "Express";
  if (deps.has("vite") && deps.has("react")) return "Vite React";
  if (deps.has("react")) return "React";
  if (deps.has("typescript") || files.some((file) => file.endsWith(".ts") || file.endsWith(".tsx"))) return "Node/TypeScript";
  if (files.includes("package.json")) return "Node.js";
  return "generic";
}

export function detectPackageManager(files: string[]): string {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("bun.lockb") || files.includes("bun.lock")) return "bun";
  if (files.includes("package-lock.json")) return "npm";
  return files.includes("package.json") ? "npm" : "unknown";
}

function isConfigFile(file: string): boolean {
  const base = path.posix.basename(file);
  return /(^\.env|config|tsconfig|vite|next|eslint|prettier|docker|compose|package\.json|prisma|drizzle)/i.test(base);
}

async function detectCliMetadata(rootDir: string): Promise<{ options: string[]; commands: string[] }> {
  const cliPath = path.join(rootDir, "src/cli.ts");
  if (!(await pathExists(cliPath))) return { options: [], commands: [] };
  try {
    const content = await fs.readFile(cliPath, "utf8");
    const options = [...new Set((content.match(/\.option\((["'`])([^"'`]+)\1/g) ?? [])
      .flatMap((match) => {
        const raw = match.match(/\.option\((["'`])([^"'`]+)\1/)?.[2] ?? "";
        return extractFlagNames(raw);
      }))].sort();
    const commands = [...new Set((content.match(/\.command\((["'`])([^"'`]+)\1/g) ?? [])
      .map((match) => match.match(/\.command\((["'`])([^"'`]+)\1/)?.[2] ?? "")
      .map((raw) => raw.trim().split(/\s+/)[0])
      .filter((value): value is string => Boolean(value)))].sort();
    return { options, commands };
  } catch {
    return { options: [], commands: [] };
  }
}

function extractFlagNames(option: string): string[] {
  const flags = [...new Set(option.match(/--?[A-Za-z][\w-]*/g) ?? [])];
  const longFlags = flags.filter((flag) => flag.startsWith("--"));
  return (longFlags.length ? longFlags : flags).sort();
}
