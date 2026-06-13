import type { RepoScan, ModuleAreaRecord } from "../types/index.js";
import { buildAreaFlows } from "./areaFlows.js";

const roleOrder = [
  "Operations and entry points",
  "Core application logic",
  "Presentation and output",
  "Shared support"
] as const;

export function orderedAreas(scan: RepoScan): ModuleAreaRecord[] {
  const flowDegree = buildAreaFlowDegree(scan);
  return [...scan.graph.areas].sort((a, b) => {
    const roleDiff = areaRoleRank(a.name) - areaRoleRank(b.name);
    if (roleDiff !== 0) return roleDiff;
    const degreeDiff = (flowDegree.get(b.id) ?? 0) - (flowDegree.get(a.id) ?? 0);
    if (degreeDiff !== 0) return degreeDiff;
    const moduleDiff = b.modules.length - a.modules.length;
    if (moduleDiff !== 0) return moduleDiff;
    return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });
}

export function areaRoleRank(areaName: string): number {
  const index = roleOrder.findIndex((role) => areaName.startsWith(role));
  return index === -1 ? roleOrder.length : index;
}

function buildAreaFlowDegree(scan: RepoScan): Map<string, number> {
  const degree = new Map<string, number>();
  for (const flow of buildAreaFlows(scan)) {
    degree.set(flow.fromId, (degree.get(flow.fromId) ?? 0) + flow.count);
    degree.set(flow.toId, (degree.get(flow.toId) ?? 0) + flow.count);
  }
  return degree;
}
