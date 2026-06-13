import { describe, expect, it } from "vitest";
import { selectCentralFiles, selectProjectFocusFiles } from "../src/knowledge/fileImportance.js";
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
    configFiles: ["tsconfig.json"]
  },
    graph: {
      files: [
      { path: "README.md", language: "Markdown", size: 1, hash: "readme", imports: [], exports: [], symbols: [] },
      { path: "package.json", language: "JSON", size: 1, hash: "pkg", imports: [], exports: [], symbols: [] },
      { path: "tsconfig.json", language: "JSON", size: 1, hash: "ts", imports: [], exports: [], symbols: [] },
      { path: "src/cli.ts", language: "TypeScript", size: 1, hash: "cli", imports: ["./commands/check"], exports: ["main"], symbols: [] },
      { path: "src/core.ts", language: "TypeScript", size: 1, hash: "core", imports: [], exports: ["core"], symbols: [] },
      { path: "src/feature.ts", language: "TypeScript", size: 1, hash: "feature", imports: ["./core"], exports: [], symbols: [] }
    ],
    imports: [
      { from: "src/cli.ts", to: "src/core.ts", type: "import" },
      { from: "src/feature.ts", to: "src/core.ts", type: "import" }
    ],
    modules: [{ id: "src", name: "src", rootPath: "src", files: ["src/core.ts", "src/feature.ts"] }],
    areas: [],
    routes: [],
    envVars: [],
    tests: []
  }
};

describe("fileImportance", () => {
  it("ranks config and central files before ordinary code", () => {
    expect(selectProjectFocusFiles(scan, 5)).toEqual([
      "README.md",
      "tsconfig.json",
      "package.json",
      "src/cli.ts",
      "src/core.ts",
    ]);
  });

  it("ranks the most imported files as central files", () => {
    expect(selectCentralFiles(scan, 1)).toEqual([
      "src/core.ts"
    ]);
  });
});
