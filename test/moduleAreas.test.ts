import { describe, expect, it } from "vitest";
import { detectModuleAreas } from "../src/knowledge/moduleAreas.js";
import type { GraphEdge, ModuleRecord } from "../src/types/index.js";

function module(id: string, rootPath: string, files: string[]): ModuleRecord {
  return { id, name: id.split("-").pop() ?? id, rootPath, files };
}

describe("detectModuleAreas", () => {
  it("groups obvious repo areas by functional role", () => {
    const modules = [
      module("src-cli", "src/cli.ts", ["src/cli.ts"]),
      module("src-commands", "src/commands", ["src/commands/generate.ts", "src/commands/update.ts"]),
      module("src-scanner", "src/scanner", ["src/scanner/scanRepo.ts", "src/scanner/detectRoutes.ts"]),
      module("src-graph", "src/graph", ["src/graph/buildGraph.ts"]),
      module("src-docs", "src/docs", ["src/docs/writeDocs.ts", "src/docs/generateIndexDoc.ts"]),
      module("src-knowledge", "src/knowledge", ["src/knowledge/buildKnowledge.ts", "src/knowledge/buildSummaries.ts"]),
      module("src-ai", "src/ai", ["src/ai/contextPacks.ts", "src/ai/buildSummaries.ts"]),
      module("src-storage", "src/storage", ["src/storage/metadataStore.ts"]),
      module("src-types", "src/types", ["src/types/index.ts"]),
      module("src-utils", "src/utils", ["src/utils/markdown.ts", "src/utils/fs.ts"])
    ];
    const imports: GraphEdge[] = [
      { from: "src/cli.ts", to: "src/commands/generate.ts", type: "import" },
      { from: "src/commands/generate.ts", to: "src/scanner/scanRepo.ts", type: "import" },
      { from: "src/commands/update.ts", to: "src/docs/writeDocs.ts", type: "import" },
      { from: "src/scanner/scanRepo.ts", to: "src/graph/buildGraph.ts", type: "import" },
      { from: "src/docs/writeDocs.ts", to: "src/knowledge/buildKnowledge.ts", type: "import" },
      { from: "src/knowledge/buildKnowledge.ts", to: "src/ai/contextPacks.ts", type: "import" },
      { from: "src/ai/buildSummaries.ts", to: "src/types/index.ts", type: "import" },
      { from: "src/storage/metadataStore.ts", to: "src/utils/fs.ts", type: "import" },
      { from: "src/utils/fs.ts", to: "src/types/index.ts", type: "import" }
    ];

    const areas = detectModuleAreas(modules, imports);
    expect(areas.some((area) => area.name.startsWith("Operations and entry points") && area.modules.includes("src-cli") && area.modules.includes("src-commands"))).toBe(true);
    expect(areas.some((area) => area.name.startsWith("Core application logic") && area.modules.includes("src-scanner") && area.modules.includes("src-graph"))).toBe(true);
    expect(areas.some((area) => area.name.startsWith("Presentation and output") && area.modules.includes("src-docs") && area.modules.includes("src-knowledge") && area.modules.includes("src-ai"))).toBe(true);
    expect(areas.some((area) => area.name.startsWith("Shared support") && area.modules.includes("src-storage") && area.modules.includes("src-types") && area.modules.includes("src-utils"))).toBe(true);
  });

  it("splits dense module clusters even when a weak bridge exists between them", () => {
    const modules = [
      module("src-auth", "src/auth", ["src/auth/controller.ts", "src/auth/service.ts"]),
      module("src-auth-tests", "src/auth/tests", ["src/auth/tests/auth.test.ts"]),
      module("src-billing", "src/billing", ["src/billing/controller.ts", "src/billing/service.ts"]),
      module("src-billing-tests", "src/billing/tests", ["src/billing/tests/billing.test.ts"])
    ];
    const imports: GraphEdge[] = [
      { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
      { from: "src/auth/service.ts", to: "src/auth/controller.ts", type: "import" },
      { from: "src/auth/tests/auth.test.ts", to: "src/auth/controller.ts", type: "import" },
      { from: "src/billing/controller.ts", to: "src/billing/service.ts", type: "import" },
      { from: "src/billing/service.ts", to: "src/billing/controller.ts", type: "import" },
      { from: "src/billing/tests/billing.test.ts", to: "src/billing/controller.ts", type: "import" },
      { from: "src/auth/controller.ts", to: "src/billing/controller.ts", type: "import" }
    ];

    const areas = detectModuleAreas(modules, imports);
    expect(areas.length).toBeGreaterThanOrEqual(2);
    expect(areas.some((area) => area.modules.includes("src-auth") && area.modules.includes("src-auth-tests"))).toBe(true);
    expect(areas.some((area) => area.modules.includes("src-billing") && area.modules.includes("src-billing-tests"))).toBe(true);
  });
});
