import type { GraphEdge, ModuleAreaRecord, ModuleRecord } from "../types/index.js";
import { moduleLabel } from "../utils/moduleLabel.js";

const testSuffixes = new Set(["test", "tests", "__tests__", "spec", "specs", "__mocks__"]);
type AreaRole = "orchestration" | "analysis" | "generation" | "support" | "general";

const roleDisplayNames: Record<AreaRole, string> = {
  orchestration: "Operations and entry points",
  analysis: "Core application logic",
  generation: "Presentation and output",
  support: "Shared support",
  general: "General"
};

const rolePurposes: Record<AreaRole, string> = {
  orchestration: "Coordinates runnable entry points, scripts, commands, and top-level execution flow.",
  analysis: "Contains domain behavior, application state, services, routing, and data flow.",
  generation: "Contains UI, presentation, docs, generated output, or user-facing surfaces.",
  support: "Provides shared persistence, configuration, types, and utility helpers.",
  general: "Connected implementation area."
};

const roleKeywords: Record<Exclude<AreaRole, "general">, string[]> = {
  orchestration: ["cli", "command", "commands", "entry", "orchestr", "runner", "task", "action"],
  analysis: ["scanner", "graph", "parse", "parser", "detect", "resolver", "route", "routes", "env", "analysis", "service", "services", "state", "store", "navigation", "screens", "hooks", "data", "scoring"],
  generation: ["docs", "doc", "knowledge", "ai", "diagram", "summary", "prompt", "context", "wiki", "render", "write", "component", "components", "ui", "styles", "style", "pages", "views"],
  support: ["storage", "types", "type", "utils", "util", "helper", "helpers", "hash", "path", "fs", "markdown", "package", "config", "constants", "shared", "shims"]
};

export function detectModuleAreas(modules: ModuleRecord[], imports: GraphEdge[]): ModuleAreaRecord[] {
  if (!modules.length) return [];

  const fileToModule = new Map<string, string>();
  const moduleToSignature = new Map<string, string>();
  const signatureToModules = new Map<string, ModuleRecord[]>();
  const signatureWeights = new Map<string, Map<string, number>>();
  const moduleWeights = new Map<string, Map<string, number>>();
  const roleBuckets = new Map<AreaRole, ModuleRecord[]>();

  for (const module of modules) {
    const signature = moduleSignature(module.rootPath);
    const role = classifyModuleRole(module);
    moduleToSignature.set(module.id, signature);
    const bucket = signatureToModules.get(signature) ?? [];
    bucket.push(module);
    signatureToModules.set(signature, bucket);
    signatureWeights.set(signature, new Map());
    moduleWeights.set(module.id, new Map());
    const roleBucket = roleBuckets.get(role) ?? [];
    roleBucket.push(module);
    roleBuckets.set(role, roleBucket);
    for (const file of module.files) fileToModule.set(file, module.id);
  }

  for (const edge of imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    const fromSignature = moduleToSignature.get(fromModule);
    const toSignature = moduleToSignature.get(toModule);
    if (!fromSignature || !toSignature || fromSignature === toSignature) continue;
    incrementWeight(signatureWeights, fromSignature, toSignature);
    incrementWeight(signatureWeights, toSignature, fromSignature);

    incrementModuleWeight(moduleWeights, fromModule, toModule);
    incrementModuleWeight(moduleWeights, toModule, fromModule);
  }

  const threshold = determineStrongThreshold(signatureWeights);
  const visited = new Set<string>();
  const areas: ModuleAreaRecord[] = [];

  for (const role of ["orchestration", "analysis", "generation", "support"] as const) {
    const roleModules = roleBuckets.get(role) ?? [];
    for (const componentModules of splitByConnectivity(roleModules, moduleWeights)) {
      if (!componentModules.length) continue;
      areas.push(buildArea(role, componentModules));
    }
  }

  const generalModules = roleBuckets.get("general") ?? [];
  const generalAreas = buildGeneralAreas(generalModules, signatureToModules, signatureWeights, threshold, visited);
  areas.push(...generalAreas);

  return areas.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

function buildArea(role: AreaRole, componentModules: ModuleRecord[]): ModuleAreaRecord {
  const rootPaths = [...new Set(componentModules.map((entry) => entry.rootPath))].sort();
  const files = [...new Set(componentModules.flatMap((entry) => entry.files))].sort();
  const labels = componentModules.map((entry) => moduleLabel(entry));
  return {
    id: `${role}:${componentModules.map((entry) => entry.id).sort().join("+") || "area"}`,
    name: buildAreaName(role, labels),
    modules: componentModules.map((entry) => entry.id).sort(),
    rootPaths,
    files,
    purpose: buildAreaPurpose(role, componentModules, labels)
  };
}

function buildGeneralAreas(
  modules: ModuleRecord[],
  signatureToModules: Map<string, ModuleRecord[]>,
  signatureWeights: Map<string, Map<string, number>>,
  threshold: number,
  visited: Set<string>
): ModuleAreaRecord[] {
  if (!modules.length) return [];
  const signatureBuckets = new Map<string, ModuleRecord[]>();

  for (const module of modules) {
    const signature = moduleSignature(module.rootPath);
    const bucket = signatureBuckets.get(signature) ?? [];
    bucket.push(module);
    signatureBuckets.set(signature, bucket);
  }

  const localWeights = new Map<string, Map<string, number>>();
  for (const signature of signatureBuckets.keys()) localWeights.set(signature, new Map());

  for (const signature of signatureBuckets.keys()) {
    const neighbors = signatureWeights.get(signature);
    if (!neighbors) continue;
    localWeights.set(signature, new Map([...neighbors].filter(([neighbor]) => signatureBuckets.has(neighbor))));
  }

  const areas: ModuleAreaRecord[] = [];
  for (const signature of [...signatureToModules.keys()].sort()) {
    if (!signatureBuckets.has(signature) || visited.has(signature)) continue;
    const component = collectComponent(signature, localWeights, threshold, visited);
    const componentModules = component
      .flatMap((componentSignature) => signatureToModules.get(componentSignature) ?? [])
      .sort((a, b) => moduleLabel(a).localeCompare(moduleLabel(b)) || a.id.localeCompare(b.id));
    if (!componentModules.length) continue;
    areas.push(buildGeneralArea(componentModules));
  }
  return areas;
}

function moduleSignature(rootPath: string): string {
  const clean = stripExtension(rootPath);
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return "module";
  const last = parts[parts.length - 1];
  if (testSuffixes.has(last)) {
    return parts.slice(0, -1).join("/") || clean;
  }
  return clean;
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.(mjs|cjs|js|jsx|ts|tsx)$/, "");
}

function incrementWeight(adjacency: Map<string, Map<string, number>>, from: string, to: string): void {
  const neighbors = adjacency.get(from);
  if (!neighbors) return;
  neighbors.set(to, (neighbors.get(to) ?? 0) + 1);
}

function incrementModuleWeight(adjacency: Map<string, Map<string, number>>, from: string, to: string): void {
  const neighbors = adjacency.get(from);
  if (!neighbors) return;
  neighbors.set(to, (neighbors.get(to) ?? 0) + 1);
}

function determineStrongThreshold(weights: Map<string, Map<string, number>>): number {
  return 2;
}

function collectComponent(
  start: string,
  weights: Map<string, Map<string, number>>,
  threshold: number,
  visited: Set<string>
): string[] {
  const component: string[] = [];
  const stack = [start];
  visited.add(start);
  while (stack.length) {
    const current = stack.pop()!;
    component.push(current);
    const neighbors = [...(weights.get(current) ?? [])]
      .filter(([, weight]) => weight >= threshold)
      .map(([neighbor]) => neighbor)
      .sort();
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      stack.push(neighbor);
    }
  }
  return component;
}

function splitByConnectivity(modules: ModuleRecord[], weights: Map<string, Map<string, number>>): ModuleRecord[][] {
  if (!modules.length) return [];
  const moduleIds = new Set(modules.map((module) => module.id));
  const visited = new Set<string>();
  const components: ModuleRecord[][] = [];
  for (const module of [...modules].sort((a, b) => moduleLabel(a).localeCompare(moduleLabel(b)) || a.id.localeCompare(b.id))) {
    if (visited.has(module.id)) continue;
    const stack = [module.id];
    const componentIds: string[] = [];
    visited.add(module.id);
    while (stack.length) {
      const current = stack.pop()!;
      componentIds.push(current);
      const neighbors = [...(weights.get(current) ?? [])]
        .filter(([neighbor, weight]) => weight > 0 && moduleIds.has(neighbor))
        .map(([neighbor]) => neighbor)
        .sort();
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
    components.push(componentIds.map((id) => modules.find((module) => module.id === id)!).sort((a, b) => moduleLabel(a).localeCompare(moduleLabel(b)) || a.id.localeCompare(b.id)));
  }
  return components;
}

function buildGeneralArea(componentModules: ModuleRecord[]): ModuleAreaRecord {
  const rootPaths = [...new Set(componentModules.map((entry) => entry.rootPath))].sort();
  const files = [...new Set(componentModules.flatMap((entry) => entry.files))].sort();
  const labels = componentModules.map((entry) => moduleLabel(entry));
  return {
    id: componentModules.map((entry) => entry.id).sort().join("+") || "area",
    name: buildGeneralAreaName(labels),
    modules: componentModules.map((entry) => entry.id).sort(),
    rootPaths,
    files,
    purpose: buildGeneralAreaPurpose(componentModules)
  };
}

function buildGeneralAreaName(labels: string[]): string {
  if (!labels.length) return "area";
  if (labels.length === 1) return labels[0];
  const head = labels.slice(0, 2).join(" + ");
  return labels.length > 2 ? `${head} + ${labels.length - 2} more` : head;
}

function buildAreaName(role: AreaRole, labels: string[]): string {
  const base = roleDisplayNames[role];
  const areaLabel = labels.length === 1 ? labels[0] : buildGeneralAreaName(labels);
  return `${base}: ${areaLabel}`;
}

function buildAreaPurpose(role: AreaRole, modules: ModuleRecord[], labels: string[]): string {
  const base = rolePurposes[role];
  if (role === "general") return buildGeneralAreaPurpose(modules);
  if (modules.length === 1) return `${base} Rooted at ${modules[0]!.rootPath}.`;
  const listed = labels.slice(0, 4).join(", ");
  return `${base} Covers ${listed}${modules.length > 4 ? ` and ${modules.length - 4} more` : ""}.`;
}

function buildGeneralAreaPurpose(modules: ModuleRecord[]): string {
  if (!modules.length) return "Connected implementation area.";
  if (modules.length === 1) {
    const module = modules[0]!;
    return module.purpose ?? `Module area rooted at ${module.rootPath}.`;
  }
  const labels = modules.map((module) => moduleLabel(module)).slice(0, 4);
  return `Connected implementation area spanning ${labels.join(", ")}${modules.length > 4 ? ` and ${modules.length - 4} more` : ""}.`;
}

function classifyModuleRole(module: ModuleRecord): AreaRole {
  const text = [module.name, module.rootPath, module.purpose ?? ""].join(" ").toLowerCase();
  const scored = (role: Exclude<AreaRole, "general">): number =>
    roleKeywords[role].reduce((score, keyword) => score + (matchesToken(text, keyword) ? 1 : 0), 0);
  const scores = {
    orchestration: scored("orchestration"),
    analysis: scored("analysis"),
    generation: scored("generation"),
    support: scored("support")
  } satisfies Record<Exclude<AreaRole, "general">, number>;
  const entries = Object.entries(scores) as Array<[Exclude<AreaRole, "general">, number]>;
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const [winner, score] = entries[0] ?? ["general", 0];
  if (score <= 0) return "general";
  return winner;
}

function matchesToken(text: string, keyword: string): boolean {
  return text.includes(keyword);
}
