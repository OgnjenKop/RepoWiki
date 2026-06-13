import path from "node:path";
import type { FileRecord, ModuleRecord } from "../types/index.js";
import { slugify } from "../utils/paths.js";

const moduleRoots = new Set(["src", "app", "pages", "server", "packages"]);
const workspaceRoots = new Set(["mobile", "website", "web", "frontend", "backend", "api"]);
const topLevelModuleRoots = new Set(["shared", "scripts"]);
const nestedModuleSegments = new Set([
  "components",
  "component",
  "domains",
  "domain",
  "features",
  "feature",
  "lib",
  "libs",
  "modules",
  "module",
  "routes",
  "route",
  "screens",
  "screen",
  "services",
  "service",
  "views",
  "view"
]);
const rootEntryFiles = new Set([
  "index.ts",
  "index.tsx",
  "index.js",
  "index.jsx",
  "page.ts",
  "page.tsx",
  "page.js",
  "page.jsx",
  "layout.ts",
  "layout.tsx",
  "layout.js",
  "layout.jsx",
  "route.ts",
  "route.js",
  "middleware.ts",
  "main.ts",
  "main.tsx",
  "main.js",
  "main.jsx",
  "App.ts",
  "App.tsx",
  "App.js",
  "App.jsx"
]);

export function detectModules(files: FileRecord[]): ModuleRecord[] {
  const grouped = new Map<string, ModuleRecord>();
  for (const file of files) {
    const parts = file.path.split("/");
    const root = selectModuleRoot(parts);
    if (root) {
      const record = grouped.get(root.rootPath) ?? {
        id: moduleId(root.rootPath),
        name: root.name,
        rootPath: root.rootPath,
        files: [],
        purpose: inferPurpose(root.name, [])
      };
      record.files.push(file.path);
      grouped.set(root.rootPath, record);
    }
  }
  if (grouped.size === 0) {
    const fallbackFiles = files.filter((file) => /\.(ts|tsx|js|jsx|mjs|cjs|json|md)$/.test(file.path));
    return [{ id: "project", name: "project", rootPath: ".", files: fallbackFiles.map((file) => file.path).sort(), purpose: inferPurpose("project", fallbackFiles) }];
  }
  return [...grouped.values()].map((module) => ({
    ...module,
    purpose: inferPurpose(module.name, files.filter((file) => module.files.includes(file.path))),
    files: module.files.sort()
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function selectModuleRoot(parts: string[]): { rootPath: string; name: string } | undefined {
  if (parts[0] === "packages" && parts[1] && parts.length >= 3) {
    return { rootPath: `packages/${parts[1]}`, name: slugify(parts[1]) };
  }

  const workspaceModule = selectWorkspaceModuleRoot(parts);
  if (workspaceModule) return workspaceModule;

  const topLevelModule = selectTopLevelModuleRoot(parts);
  if (topLevelModule) return topLevelModule;

  if (!moduleRoots.has(parts[0] ?? "")) return undefined;
  if (parts.length < 2) return undefined;

  if (parts.length === 2 && !rootEntryFiles.has(parts[1] ?? "")) {
    const fileName = parts[1] ?? parts[0];
    return { rootPath: `${parts[0]}/${fileName}`, name: slugify(stripExtension(fileName)) };
  }

  if (parts.length === 2 || rootEntryFiles.has(parts[1] ?? "")) {
    return { rootPath: parts[0], name: slugify(parts[0]) };
  }

  const second = parts[1];
  if (nestedModuleSegments.has(second) && parts.length >= 4) {
    return { rootPath: `${parts[0]}/${second}/${parts[2]}`, name: slugify(parts[2]) };
  }

  return { rootPath: `${parts[0]}/${second}`, name: slugify(second) };
}

function selectWorkspaceModuleRoot(parts: string[]): { rootPath: string; name: string } | undefined {
  const workspace = parts[0];
  if (!workspaceRoots.has(workspace ?? "")) return undefined;
  if (parts.length < 2) return undefined;

  if (parts[1] === "src") {
    if (parts.length === 2 || rootEntryFiles.has(parts[2] ?? "")) {
      return { rootPath: `${workspace}/src`, name: slugify(workspace) };
    }

    const third = parts[2];
    if (nestedModuleSegments.has(third ?? "") && parts.length >= 5) {
      return {
        rootPath: `${workspace}/src/${third}/${parts[3]}`,
        name: slugify(`${workspace}-${parts[3]}`)
      };
    }

    return {
      rootPath: `${workspace}/src/${third}`,
      name: slugify(`${workspace}-${third}`)
    };
  }

  if (rootEntryFiles.has(parts[1] ?? "") || /^app\.(ts|tsx|js|jsx)$/.test(parts[1] ?? "")) {
    return { rootPath: workspace, name: slugify(workspace) };
  }

  return undefined;
}

function selectTopLevelModuleRoot(parts: string[]): { rootPath: string; name: string } | undefined {
  const root = parts[0];
  if (!topLevelModuleRoots.has(root ?? "")) return undefined;
  if (parts.length < 2) return undefined;

  if (parts.length === 2 || rootEntryFiles.has(parts[1] ?? "")) {
    return { rootPath: root, name: slugify(root) };
  }

  const second = parts[1];
  if (nestedModuleSegments.has(second ?? "") && parts.length >= 4) {
    return { rootPath: `${root}/${second}/${parts[2]}`, name: slugify(`${root}-${parts[2]}`) };
  }

  return { rootPath: `${root}/${second}`, name: slugify(`${root}-${second}`) };
}

function inferPurpose(name: string, files: FileRecord[]): string {
  const normalized = name.toLowerCase();
  const basenames = files.map((file) => path.posix.basename(file.path).toLowerCase());
  const exportsText = files.flatMap((file) => file.exports.map((value) => value.toLowerCase())).join(" ");
  const symbolsText = files.flatMap((file) => file.symbols.filter((symbol) => symbol.exported).map((symbol) => symbol.name.toLowerCase())).join(" ");
  const signalText = [normalized, ...basenames, exportsText, symbolsText].join(" ");

  if (/\bproject\b/.test(normalized)) {
    return "Likely contains the repository entry points, shared configuration, and root-level orchestration.";
  }
  if (normalized === "src") {
    return "Likely contains the main application source tree and shared entry points.";
  }
  if (normalized === "app") {
    return "Likely contains route segments, layout files, and application entry points.";
  }
  if (normalized === "pages") {
    return "Likely contains page routes and API route entry points.";
  }
  if (normalized === "server") {
    return "Likely contains server entry points, handlers, and runtime wiring.";
  }
  if (normalized === "utils") {
    if (/\b(pathexists|readjson|writejson|writetext|hashcontent|stripcomments|stripcommentsandstrings|slugify|toposixpath|normalizerelative|linenumberatindex|code|heading|list|pluralize|installcommand|scriptcommand)\b/.test(signalText)) {
      return "Likely provides shared filesystem, hashing, markdown, and path helpers.";
    }
    return "Likely provides shared helper functions.";
  }
  if (normalized === "types") {
    if (/\b(filerecord|routeRecord|envvarrecord|testrecord|knowledgeitem|summaryrecord|changetarget|codegraph|reposcan|repoknowledge|reposummaries|repowikiindex)\b/.test(signalText)) {
      return "Likely defines shared records for files, graphs, summaries, tests, and change targets.";
    }
    return "Likely defines shared repository data models.";
  }
  if (normalized === "storage") {
    return "Likely handles persistence, metadata, cached state, or storage-backed records.";
  }
  if (normalized === "knowledge") {
    return "Likely derives evidence-backed repository knowledge, summaries, and change guidance.";
  }
  if (normalized === "graph") {
    return "Likely builds the repository import graph and route relationships.";
  }
  if (normalized === "docs") {
    return "Likely generates repository wiki pages, flow docs, and AGENTS.md instructions.";
  }
  if (normalized === "ai") {
    return "Likely orchestrates AI summaries and context packs for the wiki.";
  }
  if (/\b(ai|prompt|contextpacks?|summaryformat|openai|llm)\b/.test(signalText)) {
    return "Likely orchestrates AI-assisted repository summaries and context packing.";
  }
  if (/\b(scanner|detect|parse|scanrepo)\b/.test(signalText)) {
    return "Likely scans files and builds repository graph metadata.";
  }
  if (/\b(docs?|generate.*doc|writedocs|markdown|agents?md)\b/.test(signalText)) {
    return "Likely generates and writes repository documentation.";
  }
  if (/\b(knowledge|summary|changetargets|change-targets|rankimportantfiles|focusfiles)\b/.test(signalText)) {
    return "Likely derives evidence-backed repository knowledge, summaries, and change guidance.";
  }
  if (/\b(commands?|cli|update|generate|check)\b/.test(signalText)) {
    return "Likely implements CLI command entry points and orchestration.";
  }
  if (/\b(graph|route|routes)\b/.test(signalText)) {
    return "Likely resolves import and routing relationships.";
  }
  if (/\b(storage|metadata|hash|state)\b/.test(signalText)) {
    return "Likely handles persistence, metadata, state, or storage-backed records.";
  }
  if (/\b(diagrams?|mermaid)\b/.test(signalText)) {
    return "Likely generates repository diagrams and flow visuals.";
  }
  if (/\b(auth)\b/.test(signalText)) return "Likely handles authentication or authorization concerns.";
  if (/\b(api)\b/.test(signalText)) return "Likely contains API-facing code.";
  if (/\b(components?)\b/.test(signalText)) return "Likely contains reusable UI components.";
  if (/\b(db|database|schema|migration)\b/.test(signalText)) return "Likely contains database access or schema code.";
  return `Detected from the ${path.posix.basename(name)} folder.`;
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.(mjs|cjs|js|jsx|ts|tsx)$/, "");
}

function moduleId(rootPath: string): string {
  return rootPath
    .split("/")
    .map((segment) => stripExtension(segment))
    .filter(Boolean)
    .join("-") || "module";
}
