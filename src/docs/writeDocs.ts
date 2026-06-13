import fs from "node:fs/promises";
import path from "node:path";
import type { RepoScan } from "../types/index.js";
import { pathExists, writeText } from "../utils/fs.js";
import { generateAgentContextDoc } from "./generateAgentContextDoc.js";
import { generateAgentsSection, mergeAgentsMd } from "./generateAgentsMd.js";
import { generateArchitectureDoc } from "./generateArchitectureDoc.js";
import { generateAreaDoc } from "./generateAreaDoc.js";
import { generateAreasIndexDoc } from "./generateAreasIndexDoc.js";
import { generateCodexReviewDoc } from "./generateCodexReviewDoc.js";
import { generateFlowsIndexDoc, generateModuleFlowDoc } from "./generateFlowDocs.js";
import { generateModuleDiagram, generateRouteDiagram } from "../diagrams/generateDiagrams.js";
import { generateIndexDoc } from "./generateIndexDoc.js";
import { generateModuleDoc } from "./generateModuleDoc.js";
import { generateQualityDoc } from "./generateQualityDoc.js";
import { generateSetupDoc } from "./generateSetupDoc.js";
import { areaDocFileName } from "../utils/docPaths.js";

type WriteDocsOptions = {
  areas?: "all" | string[];
  modules?: "all" | string[];
  includeSetup?: boolean;
  cleanAreas?: boolean;
  cleanModules?: boolean;
  previousIndex?: import("../types/index.js").RepoWikiIndex;
};

export async function writeDocs(scan: RepoScan, options: WriteDocsOptions = {}): Promise<string[]> {
  const docsRoot = path.join(scan.rootDir, "docs/repo-wiki");
  const selectedAreas = options.areas ?? "all";
  const modulesToWrite = options.modules ?? "all";
  const written: string[] = [];
  if (options.cleanAreas ?? selectedAreas === "all") {
    await fs.rm(path.join(docsRoot, "areas"), { recursive: true, force: true });
  }
  if (options.cleanModules ?? modulesToWrite === "all") {
    await fs.rm(path.join(docsRoot, "modules"), { recursive: true, force: true });
  }
  if (options.cleanModules ?? modulesToWrite === "all") {
    await fs.rm(path.join(docsRoot, "flows"), { recursive: true, force: true });
  }
  await fs.rm(path.join(docsRoot, "diagrams"), { recursive: true, force: true });
  await writeText(path.join(docsRoot, "index.md"), generateIndexDoc(scan));
  written.push("docs/repo-wiki/index.md");
  await writeText(path.join(docsRoot, "architecture.md"), generateArchitectureDoc(scan));
  written.push("docs/repo-wiki/architecture.md");
  await writeText(path.join(docsRoot, "codex-review.md"), generateCodexReviewDoc(scan));
  written.push("docs/repo-wiki/codex-review.md");
  await writeText(path.join(docsRoot, "quality.md"), generateQualityDoc(scan));
  written.push("docs/repo-wiki/quality.md");
  await writeText(path.join(docsRoot, "areas", "index.md"), generateAreasIndexDoc(scan));
  written.push("docs/repo-wiki/areas/index.md");
  const areasToWrite = selectedAreas === "all"
    ? scan.graph.areas
    : scan.graph.areas.filter((area) => selectedAreas.includes(area.id));
  for (const area of areasToWrite) {
    await writeText(path.join(docsRoot, "areas", areaDocFileName(area.id)), generateAreaDoc(scan, area));
    written.push(`docs/repo-wiki/areas/${areaDocFileName(area.id)}`);
  }
  if (options.includeSetup ?? true) {
    await writeText(path.join(docsRoot, "setup.md"), generateSetupDoc(scan));
    written.push("docs/repo-wiki/setup.md");
  }
  await writeText(path.join(docsRoot, "agent-context.md"), generateAgentContextDoc(scan));
  written.push("docs/repo-wiki/agent-context.md");
  await writeText(path.join(docsRoot, "flows", "index.md"), generateFlowsIndexDoc(scan));
  written.push("docs/repo-wiki/flows/index.md");
  const selectedModules = modulesToWrite === "all"
    ? scan.graph.modules
    : scan.graph.modules.filter((module) => modulesToWrite.includes(module.id));
  for (const module of selectedModules) {
    await writeText(path.join(docsRoot, "modules", `${module.id}.md`), generateModuleDoc(scan, module));
    written.push(`docs/repo-wiki/modules/${module.id}.md`);
    await writeText(path.join(docsRoot, "flows", "modules", `${module.id}.md`), generateModuleFlowDoc(scan, module));
    written.push(`docs/repo-wiki/flows/modules/${module.id}.md`);
  }
  const diagramsRoot = path.join(docsRoot, "diagrams");
  await writeText(path.join(diagramsRoot, "modules.mmd"), generateModuleDiagram(scan));
  written.push("docs/repo-wiki/diagrams/modules.mmd");
  await writeText(path.join(diagramsRoot, "routes.mmd"), generateRouteDiagram(scan));
  written.push("docs/repo-wiki/diagrams/routes.mmd");
  const agentsPath = path.join(scan.rootDir, "AGENTS.md");
  const existing = (await pathExists(agentsPath)) ? await fs.readFile(agentsPath, "utf8") : undefined;
  await writeText(agentsPath, mergeAgentsMd(existing, generateAgentsSection(scan)));
  written.push("AGENTS.md");
  if (options.previousIndex) {
    const currentAreas = new Set(scan.graph.areas.map((area) => area.id));
    for (const [areaId, areaFile] of Object.entries(options.previousIndex.areaContextFiles ?? {})) {
      if (!currentAreas.has(areaId)) {
        await fs.rm(path.join(docsRoot, "areas", path.basename(areaFile)), { force: true });
      }
    }
  }
  return written;
}
