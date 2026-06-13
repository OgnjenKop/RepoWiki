import { describe, expect, it } from "vitest";
import { buildDeterministicSummaries } from "../src/knowledge/buildSummaries.js";
import type { RepoScan } from "../src/types/index.js";

const scan: RepoScan = {
  rootDir: "/tmp/project",
  project: {
    name: "fixture",
    type: "Node/TypeScript",
    packageManager: "npm",
    scripts: { build: "tsc", test: "vitest run" },
    dependencies: [],
    devDependencies: [],
    configFiles: ["package.json"]
  },
  graph: {
    files: [
      { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "a", imports: [], exports: ["login"], symbols: [] }
    ],
    imports: [],
    modules: [{ id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/service.ts"], purpose: "Auth service logic." }],
    areas: [{ id: "area-auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/service.ts"], purpose: "Authentication flow." }],
    routes: [],
    envVars: [],
    tests: []
  }
};

describe("summaries", () => {
  it("builds deterministic project and module summaries", () => {
    const knowledge = {
      items: [
        {
          id: "project",
          kind: "project" as const,
          title: "fixture",
          files: ["package.json"],
          summary: "Fixture repository.",
          evidence: [{ file: "package.json", reason: "metadata" }]
        }
      ]
    };
    const summaries = buildDeterministicSummaries(scan, knowledge);
    expect(summaries.project?.content).toContain("Fixture repository.");
    expect(summaries.areas?.["area-auth"].content).toContain("Authentication flow.");
    expect(summaries.modules["src-auth"].content).toContain("Auth service logic.");
    expect(summaries.modules["src-auth"].content).toContain("login");
    expect(summaries.modules["src-auth"].content).toContain("Verification:");
    expect(summaries.modules["src-auth"].content).toContain("Run the repository build command");
    expect(summaries.project?.updatedAt).toBeUndefined();
    expect(summaries.modules["src-auth"].updatedAt).toBeUndefined();
  });

  it("builds deterministic route summaries", () => {
    const knowledge = {
      items: [
        {
          id: "route:src/auth/service.ts:GET:/health",
          kind: "route" as const,
          title: "GET /health",
          files: ["src/auth/service.ts"],
          summary: "GET /health is detected in src/auth/service.ts.",
          evidence: [{ file: "src/auth/service.ts", reason: "route" }]
        }
      ]
    };
  const routeScan = {
    ...scan,
    graph: {
      ...scan.graph,
      routes: [{ method: "GET" as const, path: "/health", file: "src/auth/service.ts", handler: "handler", confidence: "direct" }]
    }
  };
  const summaries = buildDeterministicSummaries(routeScan, knowledge);
    expect(summaries.routes?.["src/auth/service.ts:GET:/health"].content).toContain("Direct route GET /health");
    expect(summaries.routes?.["src/auth/service.ts:GET:/health"].content).toContain("Common change paths:");
    expect(summaries.routes?.["src/auth/service.ts:GET:/health"].content).toContain("Verification:");
    expect(summaries.routes?.["src/auth/service.ts:GET:/health"].content).toContain("Run the repository build command");
  });

  it("includes route and importer flow hints in module and project summaries", () => {
    const flowScan = {
      ...scan,
      graph: {
        ...scan.graph,
        files: [
          ...scan.graph.files,
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [] },
          { path: "src/auth/spec.ts", language: "TypeScript", size: 1, hash: "spec", imports: ["./controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/auth/spec.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] },
          { id: "src-auth-specs", name: "specs", rootPath: "src/auth/specs", files: ["src/auth/spec.ts"] }
        ],
        areas: [],
        routes: [{ method: "GET" as const, path: "/auth", file: "src/auth/controller.ts", handler: "getAuth", confidence: "direct" }],
        tests: [{ path: "src/auth/spec.ts", testedFile: "src/auth/controller.ts" }]
      }
    };
    const summaries = buildDeterministicSummaries(flowScan, {
      items: [
        {
          id: "project",
          kind: "project" as const,
          title: "fixture",
          files: ["package.json"],
          summary: "Fixture repository.",
          evidence: [{ file: "package.json", reason: "metadata" }]
        }
      ]
    });
    expect(summaries.project?.content).toContain("Key module flows");
    expect(summaries.modules["src-auth"].content).toContain("Entry points: GET /auth");
    expect(summaries.modules["src-auth"].content).toContain("Used by: src/auth/spec.ts");
    expect(summaries.modules["src-auth"].content).toContain("Internal flow: src/auth/controller.ts -> src/auth/service.ts");
    expect(summaries.modules["src-auth"].content).toContain("Common change paths:");
  });

  it("keeps area summaries in the ranked area order", () => {
    const areaScan: RepoScan = {
      ...scan,
      graph: {
        ...scan.graph,
        modules: [
          { id: "src-cli", name: "cli", rootPath: "src/cli.ts", files: ["src/cli.ts"] },
          { id: "src-docs", name: "docs", rootPath: "src/docs", files: ["src/docs/writeDocs.ts"] },
          { id: "src-docs2", name: "docs2", rootPath: "src/docs2", files: ["src/docs/buildDocs.ts"] }
        ],
        areas: [
          { id: "area-cli", name: "Operations and entry points: cli", modules: ["src-cli"], rootPaths: ["src/cli.ts"], files: ["src/cli.ts"], purpose: "CLI entry points." },
          { id: "area-docs", name: "Operations and entry points: docs", modules: ["src-docs", "src-docs2"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts", "src/docs/buildDocs.ts"], purpose: "Docs writers." }
        ]
      }
    };
    const summaries = buildDeterministicSummaries(areaScan, {
      items: [
        {
          id: "project",
          kind: "project" as const,
          title: "fixture",
          files: ["package.json"],
          summary: "Fixture repository.",
          evidence: [{ file: "package.json", reason: "metadata" }]
        }
      ]
    });

    expect(Object.keys(summaries.areas ?? {})).toEqual(["area-docs", "area-cli"]);
  });
});
