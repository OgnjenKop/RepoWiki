import { describe, expect, it } from "vitest";
import { buildAreaFlows } from "../src/knowledge/areaFlows.js";
import { detectModuleAreas } from "../src/knowledge/moduleAreas.js";
import type { GraphEdge, ModuleRecord } from "../src/types/index.js";

function module(id: string, rootPath: string, files: string[]): ModuleRecord {
  return { id, name: id.split("-").pop() ?? id, rootPath, files };
}

describe("buildAreaFlows", () => {
  it("derives area-to-area flows from module imports", () => {
    const modules = [
      module("src-cli", "src/cli.ts", ["src/cli.ts"]),
      module("src-commands", "src/commands", ["src/commands/generate.ts", "src/commands/update.ts"]),
      module("src-scanner", "src/scanner", ["src/scanner/scanRepo.ts"]),
      module("src-docs", "src/docs", ["src/docs/writeDocs.ts"]),
      module("src-knowledge", "src/knowledge", ["src/knowledge/buildKnowledge.ts"]),
      module("src-storage", "src/storage", ["src/storage/metadataStore.ts"]),
      module("src-utils", "src/utils", ["src/utils/fs.ts"]),
      module("src-types", "src/types", ["src/types/index.ts"])
    ];
    const imports: GraphEdge[] = [
      { from: "src/cli.ts", to: "src/commands/generate.ts", type: "import" },
      { from: "src/commands/generate.ts", to: "src/scanner/scanRepo.ts", type: "import" },
      { from: "src/docs/writeDocs.ts", to: "src/knowledge/buildKnowledge.ts", type: "import" },
      { from: "src/knowledge/buildKnowledge.ts", to: "src/types/index.ts", type: "import" },
      { from: "src/storage/metadataStore.ts", to: "src/utils/fs.ts", type: "import" }
    ];

    const areas = detectModuleAreas(modules, imports);
    const flows = buildAreaFlows({ rootDir: ".", project: { name: "x", type: "Node/TypeScript", packageManager: "npm", scripts: {}, dependencies: [], devDependencies: [], configFiles: [] }, graph: { files: [], imports, modules, areas, routes: [], envVars: [], tests: [] } });

    expect(flows.some((flow) => flow.fromName.startsWith("Operations and entry points") && flow.toName.startsWith("Core application logic"))).toBe(true);
    expect(flows.some((flow) => flow.fromName.startsWith("Presentation and output") && flow.toName.startsWith("Shared support"))).toBe(true);
  });
});
