import type { RepoScan } from "../types/index.js";
import { code, list, pluralize } from "../utils/markdown.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";

export function generateAreasIndexDoc(scan: RepoScan): string {
  const areas = orderedAreas(scan);
  const areaFlows = buildAreaFlows(scan).slice(0, 10).map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`);
  const whereToStart = buildWhereToStart(scan, areas);
  const areaSummaries = areas.map((area) => {
    const summary = summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.");
    return `[${area.name}](./${areaDocFileName(area.id)}) - ${summary}`;
  });

  return `# Areas

## What This Shows

Area docs group modules into higher-level functional clusters. They are the best place to understand how the repo is organized beyond module boundaries.

## Where To Start

${list(whereToStart, "_No task-oriented start guide available._")}

## Area List

${list(areas.map((area) => `[${area.name}](./${areaDocFileName(area.id)}) - ${pluralize(area.modules.length, "module")}${area.purpose ? ` - ${area.purpose}` : ""}`), "_No area docs generated._")}

## Area Summaries

${list(areaSummaries, "_No area summaries available._")}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Navigation

- [Repo wiki index](../index.md)
- [Architecture](../architecture.md)
- [Flow overview](../flows/index.md)

## Suggested Reading Order

- Start with the area that matches the change you plan to make.
- Open its module pages for file-level detail.
- Use the flow overview for cross-area movement.
`;
}

function buildWhereToStart(scan: RepoScan, areas: ReturnType<typeof orderedAreas>): string[] {
  const entries = [
    ["Change operations, scripts, or entry behavior", (name: string) => name.startsWith("Operations and entry points")],
    ["Change core application behavior", (name: string) => name.startsWith("Core application logic")],
    ["Change UI, docs, or generated output", (name: string) => name.startsWith("Presentation and output")],
    ["Change shared types, configuration, persistence, or helpers", (name: string) => name.startsWith("Shared support")]
  ] as const;

  return entries
    .map(([task, predicate]) => {
      const area = areas.find((candidate) => predicate(candidate.name));
      if (!area) return undefined;
      const summary = summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.");
      return `[${task}](./${areaDocFileName(area.id)}) -> ${code(area.name)}${summary ? ` - ${summary}` : ""}`;
    })
    .filter((value): value is string => Boolean(value));
}
