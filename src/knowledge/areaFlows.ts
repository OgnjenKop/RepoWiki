import type { RepoScan } from "../types/index.js";

export type AreaFlowRecord = {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  count: number;
};

export function buildAreaFlows(scan: RepoScan): AreaFlowRecord[] {
  const fileToModule = new Map<string, string>();
  const moduleToArea = new Map<string, { id: string; name: string }>();

  for (const area of scan.graph.areas) {
    for (const moduleId of area.modules) {
      moduleToArea.set(moduleId, { id: area.id, name: area.name });
    }
  }

  for (const module of scan.graph.modules) {
    for (const file of module.files) fileToModule.set(file, module.id);
  }

  const counts = new Map<string, AreaFlowRecord>();
  for (const edge of scan.graph.imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    const fromArea = moduleToArea.get(fromModule);
    const toArea = moduleToArea.get(toModule);
    if (!fromArea || !toArea || fromArea.id === toArea.id) continue;
    const key = `${fromArea.id}::${toArea.id}`;
    const current = counts.get(key);
    if (current) {
      current.count += 1;
      continue;
    }
    counts.set(key, {
      fromId: fromArea.id,
      toId: toArea.id,
      fromName: fromArea.name,
      toName: toArea.name,
      count: 1
    });
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || `${a.fromName}:${a.toName}`.localeCompare(`${b.fromName}:${b.toName}`));
}
