import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildKnowledge } from "../src/knowledge/buildKnowledge.js";
import { selectProjectChangePaths } from "../src/knowledge/moduleFocus.js";
import { orderedAreas } from "../src/knowledge/areaOrdering.js";
import { scanRepo } from "../src/scanner/scanRepo.js";

describe("knowledge", () => {
  it("derives evidence-backed knowledge items from the scan", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-knowledge-"));
    await fs.mkdir(path.join(root, "src/auth"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "knowledge-fixture",
      dependencies: { express: "^4.0.0" }
    }));
    await fs.writeFile(path.join(root, "src/auth/service.ts"), "export const login = () => true;\n");
    await fs.writeFile(path.join(root, "src/server.ts"), "server.get('/auth', handler); process.env.AUTH_URL;\n");
    await fs.writeFile(path.join(root, "src/auth/spec.test.ts"), "import '../auth/service';\n");
    await fs.writeFile(path.join(root, ".env.example"), "AUTH_URL=http://localhost\n");

    const scan = await scanRepo(root);

    expect(scan.knowledge?.items.some((item) => item.kind === "project" && item.title === "knowledge-fixture")).toBe(true);
    expect(scan.knowledge?.items.some((item) => item.kind === "module" && item.title === "auth")).toBe(true);
    const testItem = scan.knowledge?.items.find((item) => item.kind === "test" && item.title.includes("spec.test"));
    const routeItem = scan.knowledge?.items.find((item) => item.kind === "route" && item.title.includes("/auth"));
    const envItem = scan.knowledge?.items.find((item) => item.kind === "env" && item.title === "AUTH_URL");
    expect(testItem?.summary).toContain("src/auth/spec.test.ts");
    expect(routeItem?.summary).toContain("src/server.ts:1");
    expect(routeItem?.evidence[0]?.lines).toEqual([1, 1]);
    expect(envItem?.summary).toContain(".env.example:1");
    expect(envItem?.evidence[0]?.lines).toEqual([1, 1]);
  });

  it("keeps long project summaries from truncating module names silently", () => {
    const knowledge = buildKnowledge({
      rootDir: "/tmp/project",
      project: {
        name: "big-fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: ["package.json"]
      },
      graph: {
        files: [],
        imports: [],
        modules: [
          { id: "src-ai", name: "ai", rootPath: "src/ai", files: [] },
          { id: "src-commands", name: "commands", rootPath: "src/commands", files: [] },
          { id: "src-diagrams", name: "diagrams", rootPath: "src/diagrams", files: [] },
          { id: "src-docs", name: "docs", rootPath: "src/docs", files: [] },
          { id: "src-graph", name: "graph", rootPath: "src/graph", files: [] },
          { id: "src-knowledge", name: "knowledge", rootPath: "src/knowledge", files: [] },
          { id: "src-scanner", name: "scanner", rootPath: "src/scanner", files: [] },
          { id: "src-storage", name: "storage", rootPath: "src/storage", files: [] },
          { id: "src-types", name: "types", rootPath: "src/types", files: [] },
          { id: "src-utils", name: "utils", rootPath: "src/utils", files: [] },
          { id: "src-extra", name: "extra", rootPath: "src/extra", files: [] }
        ],
        areas: [],
        routes: [],
        envVars: [],
        tests: []
      }
    });

    const project = knowledge.items.find((item) => item.kind === "project");
    expect(project?.summary).toContain("ai (src/ai), commands (src/commands), diagrams (src/diagrams), docs (src/docs), extra (src/extra), graph (src/graph), knowledge (src/knowledge), scanner (src/scanner), storage (src/storage), types (src/types), utils (src/utils)");
  });

  it("keeps project knowledge summaries concise", () => {
    const knowledge = buildKnowledge({
      rootDir: "/tmp/project",
      project: {
        name: "entry-fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: ["package.json"]
      },
      graph: {
        files: [
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "a", imports: [], exports: ["getAuth"], symbols: [{ name: "getAuth", kind: "function", exported: true, line: 4 }] },
          { path: "test/auth.integration.ts", language: "TypeScript", size: 1, hash: "b", imports: ["../src/auth/controller"], exports: [], symbols: [] }
        ],
        imports: [{ from: "test/auth.integration.ts", to: "src/auth/controller.ts", type: "import" }],
        modules: [{ id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts"] }],
        areas: [],
        routes: [],
        envVars: [],
        tests: []
      }
    });

    const project = knowledge.items.find((item) => item.kind === "project");
    expect(project?.summary).toContain("entry-fixture is a Node/TypeScript repository.");
    expect(project?.summary).toContain("Detected modules: auth (src/auth).");
    expect(project?.summary).toContain("Important config files: package.json.");
    expect(project?.summary).not.toContain("Common change paths:");
    expect(project?.summary).not.toContain("Test consumers:");
  });

  it("keeps knowledge items in the natural evidence order", () => {
    const knowledge = buildKnowledge({
      rootDir: "/tmp/project",
      project: {
        name: "ordered-knowledge",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: {},
        dependencies: [],
        devDependencies: [],
        configFiles: ["package.json"]
      },
      graph: {
        files: [],
        imports: [],
        modules: [
          { id: "src-cli", name: "cli", rootPath: "src/cli.ts", files: ["src/cli.ts"] },
          { id: "src-docs", name: "docs", rootPath: "src/docs", files: ["src/docs/writeDocs.ts"] }
        ],
        areas: [
          { id: "area-cli", name: "Operations and entry points: cli", modules: ["src-cli"], rootPaths: ["src/cli.ts"], files: ["src/cli.ts"], purpose: "CLI entry points." },
          { id: "area-docs", name: "Operations and entry points: docs", modules: ["src-docs"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts"], purpose: "Docs writers." }
        ],
        routes: [],
        envVars: [],
        tests: []
      }
    });

    expect(knowledge.items.slice(0, 3).map((item) => item.id)).toEqual(["project", "area:area-cli", "area:area-docs"]);
  });

  it("prefers higher-ranked areas when selecting project change paths", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "change-path-fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: {},
        dependencies: [],
        devDependencies: [],
        configFiles: ["package.json"]
      },
      graph: {
        files: [
          { path: "src/cli.ts", language: "TypeScript", size: 1, hash: "cli", imports: [], exports: [], symbols: [] },
          { path: "src/docs/writeDocs.ts", language: "TypeScript", size: 1, hash: "docs", imports: [], exports: [], symbols: [] },
          { path: "src/docs/buildDocs.ts", language: "TypeScript", size: 1, hash: "docs2", imports: [], exports: [], symbols: [] }
        ],
        imports: [],
        modules: [
          { id: "src-cli", name: "cli", rootPath: "src/cli.ts", files: ["src/cli.ts"] },
          { id: "src-docs", name: "docs", rootPath: "src/docs", files: ["src/docs/writeDocs.ts"] },
          { id: "src-docs2", name: "docs2", rootPath: "src/docs2", files: ["src/docs/buildDocs.ts"] }
        ],
        areas: [
          { id: "area-cli", name: "Operations and entry points: cli", modules: ["src-cli"], rootPaths: ["src/cli.ts"], files: ["src/cli.ts"], purpose: "CLI entry points." },
          { id: "area-docs", name: "Operations and entry points: docs", modules: ["src-docs", "src-docs2"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts", "src/docs/buildDocs.ts"], purpose: "Docs writers." }
        ],
        routes: [],
        envVars: [],
        tests: []
      }
    };

    expect(orderedAreas(scan).map((area) => area.id)).toEqual(["area-docs", "area-cli"]);
    const changePaths = selectProjectChangePaths(scan);
    expect(changePaths.find((path) => path.task === "Change operations, scripts, or entry behavior")?.files).toContain("src/docs/writeDocs.ts");
    expect(changePaths.find((path) => path.task === "Change operations, scripts, or entry behavior")?.files).not.toContain("src/cli.ts");
  });
});
