import { describe, expect, it } from "vitest";
import { getAffectedAreas, getAffectedModules, hasGlobalWikiImpact } from "../src/commands/update.js";
import type { RepoScan } from "../src/types/index.js";

const scan: RepoScan = {
  rootDir: "/tmp/project",
  project: {
    name: "project",
    type: "Node/TypeScript",
    packageManager: "npm",
    scripts: {},
    dependencies: [],
    devDependencies: [],
    configFiles: []
  },
  graph: {
    files: [],
    imports: [],
    modules: [{ id: "src-auth", name: "auth", rootPath: "src/auth", files: [] }],
    areas: [],
    routes: [],
    envVars: [],
    tests: []
  }
};

describe("getAffectedModules", () => {
  it("uses previous module ownership for deleted files", () => {
    expect(getAffectedModules(scan, { changed: [], added: [], deleted: ["src/auth/service.ts"] }, {
      "src/auth/service.ts": "src-auth"
    })).toEqual(["src-auth"]);
  });

  it("refreshes modules when related tests change", () => {
    const testedScan: RepoScan = {
      ...scan,
      graph: {
        ...scan.graph,
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/service.ts"] }
        ],
        areas: [],
        tests: [
          { path: "test/auth.test.ts", testedFile: "src/auth/service.ts", testedFiles: ["src/auth/service.ts"] }
        ]
      }
    };

    expect(getAffectedModules(testedScan, { changed: [], added: ["test/auth.test.ts"], deleted: [] }, {})).toEqual(["src-auth"]);
  });
});

describe("getAffectedAreas", () => {
  it("uses previous area ownership for deleted files", () => {
    const areaScan: RepoScan = {
      ...scan,
      graph: {
        ...scan.graph,
        areas: [
          { id: "area-auth", name: "auth area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/service.ts"] }
        ]
      }
    };

    expect(getAffectedAreas(areaScan, { changed: [], added: [], deleted: ["src/auth/service.ts"] }, {
      "area-auth": ["src/auth/service.ts"]
    })).toEqual(["area-auth"]);
  });
});

describe("hasGlobalWikiImpact", () => {
  it("treats scanner and docs pipeline changes as global", () => {
    expect(hasGlobalWikiImpact({ changed: ["src/scanner/detectTests.ts"], added: [], deleted: [] })).toBe(true);
    expect(hasGlobalWikiImpact({ changed: ["src/features/auth.ts"], added: [], deleted: [] })).toBe(false);
  });
});
