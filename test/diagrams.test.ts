import { describe, expect, it } from "vitest";
import { generateModuleDiagram, generateRouteDiagram } from "../src/diagrams/generateDiagrams.js";
import type { RepoScan } from "../src/types/index.js";

const scan: RepoScan = {
  rootDir: "/tmp/project",
  project: {
    name: "fixture",
    type: "Node/TypeScript",
    packageManager: "npm",
    scripts: {},
    dependencies: [],
    devDependencies: [],
    configFiles: []
  },
  graph: {
    files: [
      { path: "src/a.ts", language: "TypeScript", size: 1, hash: "a", imports: ["./b"], exports: [], symbols: [] },
      { path: "src/b.ts", language: "TypeScript", size: 1, hash: "b", imports: [], exports: [], symbols: [] }
    ],
    imports: [{ from: "src/a.ts", to: "src/b.ts", type: "import" }],
    modules: [
      { id: "src-a", name: "a", rootPath: "src/a", files: ["src/a.ts"] },
      { id: "src-b", name: "b", rootPath: "src/b", files: ["src/b.ts"] }
    ],
    areas: [],
    routes: [{ method: "GET", path: "/health", file: "src/a.ts", handler: "handler" }],
    envVars: [],
    tests: []
  }
};

describe("diagrams", () => {
  it("generates a module diagram", () => {
    const diagram = generateModuleDiagram(scan);
    expect(diagram).toContain("flowchart TD");
    expect(diagram).toContain("src_a --> src_b");
    expect(diagram).toContain("a (src/a)");
  });

  it("generates a route diagram", () => {
    const diagram = generateRouteDiagram(scan);
    expect(diagram).toContain("/health");
    expect(diagram).toContain("flowchart TD");
  });
});
