import { describe, expect, it } from "vitest";
import { generateAreaDoc } from "../src/docs/generateAreaDoc.js";
import { generateAreasIndexDoc } from "../src/docs/generateAreasIndexDoc.js";
import { generateAgentContextDoc } from "../src/docs/generateAgentContextDoc.js";
import { generateArchitectureDoc } from "../src/docs/generateArchitectureDoc.js";
import { generateFlowsIndexDoc, generateModuleFlowDoc } from "../src/docs/generateFlowDocs.js";
import { generateIndexDoc } from "../src/docs/generateIndexDoc.js";
import { generateModuleDoc } from "../src/docs/generateModuleDoc.js";
import { generateQualityDoc } from "../src/docs/generateQualityDoc.js";
import type { RepoScan } from "../src/types/index.js";

describe("generateIndexDoc", () => {
  it("generates deterministic module links and pluralization", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: [],
        cliOptions: ["--root", "--verbose", "--ai"],
        cliCommands: ["generate", "synthesize", "update", "check", "review"]
      },
        graph: {
          files: [
          { path: "src/auth/index.ts", language: "TypeScript", size: 1, hash: "a", imports: [], exports: [], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "b", imports: [], exports: [], symbols: [] }
          ],
        imports: [],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/index.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/index.ts"], purpose: "Authentication flow." },
          { id: "db", name: "Database area", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [],
        envVars: [],
        tests: [
          { path: "test/auth.test.ts", line: 3, testedFile: "src/auth/index.ts" },
          { path: "test/db.test.ts", line: 4, testedFile: "src/db/index.ts" }
        ]
      },
      summaries: {
        areas: {
          auth: { provider: "ai", content: "Area summary. This area keeps auth behavior together.", sources: ["src/auth/index.ts"] },
          db: { provider: "ai", content: "Database area summary. This area keeps db behavior together.", sources: ["src/db/index.ts"] }
        }
      }
    };

    const doc = generateIndexDoc(scan);
    expect(doc).toContain("- [auth (src/auth)](modules/src-auth.md) — 1 file");
    expect(doc).toContain("[Flow Overview](flows/index.md)");
    expect(doc).toContain("[Areas](areas/index.md)");
    expect(doc).toContain("[Quality Bar](quality.md)");
    expect(doc).toContain("## Test Coverage");
    expect(doc).toContain("`auth (src/auth)` — 1 test");
    expect(doc).toContain("`db (src/db)` — 1 test");
    expect(doc).toContain("Area summary.");
    expect(doc).toContain("## Important Entry Files");
    expect(doc).toContain("src/auth/index.ts");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("Read the main entry files first");
    expect(doc).toContain("evidence:");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run the project build");
    expect(doc).toContain("## RepoWiki Commands");
    expect(doc).toContain("`repowiki generate`");
    expect(doc).toContain("`repowiki synthesize`");
    expect(doc).toContain("`repowiki update`");
    expect(doc).toContain("`repowiki check`");
    expect(doc).toContain("`repowiki review`");
    expect(doc).toContain("## RepoWiki Flags");
    expect(doc).toContain("`--root`");
    expect(doc).toContain("`--verbose`");
    expect(doc).toContain("`--ai`");
  });
});

describe("generateQualityDoc", () => {
  it("renders the Qoder-style quality contract", () => {
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
        files: [],
        imports: [],
        modules: [],
        areas: [{ id: "area-core", name: "Core application logic: core", modules: [], rootPaths: [], files: [], purpose: "Core behavior." }],
        routes: [],
        envVars: [],
        tests: []
      }
    };

    const doc = generateQualityDoc(scan);
    expect(doc).toContain("# Documentation Quality Bar");
    expect(doc).toContain("Qoder-style repository documentation");
    expect(doc).toContain("## Model Review Loop");
    expect(doc).toContain("`repowiki review`");
    expect(doc).toContain("Core application logic: core");
  });
});

describe("generateFlowsIndexDoc", () => {
  it("renders flow overview links and module flow docs", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: [],
        cliOptions: ["--root", "--verbose", "--ai"],
        cliCommands: ["generate", "synthesize", "update", "check", "review"]
      },
      graph: {
        files: [
          { path: "src/auth/index.ts", language: "TypeScript", size: 1, hash: "a", imports: [], exports: [], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "b", imports: [], exports: [], symbols: [] }
        ],
        imports: [{ from: "src/auth/index.ts", to: "src/db/index.ts", type: "import" }],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/index.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/index.ts"], purpose: "Authentication flow." },
          { id: "db", name: "Database area", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [{ method: "GET", path: "/auth", file: "src/auth/index.ts", controller: "AuthController", line: 7 }],
        envVars: [],
        tests: [
          { path: "test/auth.test.ts", line: 3, testedFile: "src/auth/index.ts" },
          { path: "test/db.test.ts", line: 4, testedFile: "src/db/index.ts" }
        ]
      },
      summaries: {
        areas: {
          auth: { provider: "ai", content: "Area summary. This area keeps auth behavior together.", sources: ["src/auth/index.ts"] },
          db: { provider: "ai", content: "Database area summary. This area keeps db behavior together.", sources: ["src/db/index.ts"] }
        }
      }
    };

    const doc = generateFlowsIndexDoc(scan);
    expect(doc).toContain("# Flows");
    expect(doc).toContain("src/auth/index.ts:7");
    expect(doc).toContain("AuthController");
    expect(doc).toContain("[direct]");
    expect(doc).toContain("[auth (src/auth)](modules/src-auth.md)");
    expect(doc).toContain("## Test Coverage Map");
    expect(doc).toContain("`auth (src/auth)` — 1 test");
    expect(doc).toContain("`db (src/db)` — 1 test");
    expect(doc).toContain("Area summary.");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run the project build");
  });
});

describe("generateArchitectureDoc", () => {
  it("renders module flow summaries", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [
          { path: "src/auth/index.ts", language: "TypeScript", size: 1, hash: "a", imports: ["../db"], exports: [], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "b", imports: [], exports: [], symbols: [] }
        ],
        imports: [{ from: "src/auth/index.ts", to: "src/db/index.ts", type: "import" }],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/index.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/index.ts"], purpose: "Authentication flow." },
          { id: "db", name: "Database area", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [{ method: "GET", path: "/auth", file: "src/auth/index.ts", controller: "AuthController", line: 7, confidence: "direct" }],
        envVars: [],
        tests: [
          { path: "test/auth.test.ts", line: 3, testedFile: "src/auth/index.ts" },
          { path: "test/db.test.ts", line: 4, testedFile: "src/db/index.ts" }
        ]
      },
      summaries: {
        areas: {
          auth: { provider: "ai", content: "Area summary. This area keeps auth behavior together.", sources: ["src/auth/index.ts"] },
          db: { provider: "ai", content: "Database area summary. This area keeps db behavior together.", sources: ["src/db/index.ts"] }
        }
      }
    };

    const doc = generateArchitectureDoc(scan);
    expect(doc).toContain("## Key Module Flows");
    expect(doc).toContain("auth");
    expect(doc).toContain("db");
    expect(doc).toContain("[direct]");
    expect(doc).toContain("`auth (src/auth)` — 1 test");
    expect(doc).toContain("`db (src/db)` — 1 test");
    expect(doc).toContain("Area summary.");
    expect(doc).toContain("## Important Entry Files");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run the project build");
  });
});

describe("generateModuleDoc", () => {
  it("renders change guidance", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [{ name: "getAuth", kind: "function", exported: true, line: 4 }] },
          { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "db", imports: [], exports: ["db"], symbols: [{ name: "db", kind: "constant", exported: true, line: 2 }] },
          { path: "test/auth.integration.ts", language: "TypeScript", size: 1, hash: "integration", imports: ["../src/auth/controller"], exports: [], symbols: [] },
          { path: "src/auth/spec.ts", language: "TypeScript", size: 1, hash: "spec", imports: ["./controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/auth/controller.ts", to: "src/db/index.ts", type: "import" },
          { from: "test/auth.integration.ts", to: "src/auth/controller.ts", type: "import" },
          { from: "src/auth/spec.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/index.ts"], purpose: "Authentication flow." },
          { id: "db", name: "Database area", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [{ method: "GET", path: "/auth", file: "src/auth/controller.ts", handler: "getAuth", controller: "AuthController", line: 3 }],
        envVars: [],
        tests: [{ path: "src/auth/spec.ts", line: 2, testedFile: "src/auth/controller.ts" }]
      },
      summaries: {
        modules: {
          "src-auth": { provider: "ai", content: "Module summary. This module exposes auth behavior.", sources: ["src/auth/controller.ts"] }
        },
        areas: {
          auth: { provider: "ai", content: "Area summary. This area keeps auth behavior together.", sources: ["src/auth/controller.ts"] },
          db: { provider: "ai", content: "Database area summary. This area keeps db behavior together.", sources: ["src/db/index.ts"] }
        }
      }
    };

    const doc = generateModuleDoc(scan, scan.graph.modules[0]!);
    expect(doc).toContain("## Change Guidance");
    expect(doc).toContain("## Entry Files");
    expect(doc).toContain("src/auth/controller.ts:4");
    expect(doc).toContain("Symbols: getAuth@4");
    expect(doc).toContain("Direct route entry point for AuthController.");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("test/auth.integration.ts");
    expect(doc).toContain("## Area Summaries");
    expect(doc).toContain("Authentication flow.");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("evidence:");
    expect(doc).toContain("## Decision Points");
    expect(doc).toContain("Start with `src/auth/controller.ts:3` if you are changing public behavior.");
    expect(doc).toContain("Check `src/auth/spec.ts:2` before changing implementation details.");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run: `npm run test`");
  });
});

describe("generateModuleFlowDoc", () => {
  it("renders module entry points and verification", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [] },
          { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "db", imports: [], exports: ["db"], symbols: [] },
          { path: "test/auth.integration.ts", language: "TypeScript", size: 1, hash: "integration", imports: ["../src/auth/controller"], exports: [], symbols: [] },
          { path: "src/auth/spec.ts", language: "TypeScript", size: 1, hash: "spec", imports: ["./controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/auth/controller.ts", to: "src/db/index.ts", type: "import" },
          { from: "test/auth.integration.ts", to: "src/auth/controller.ts", type: "import" },
          { from: "src/auth/spec.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/controller.ts", "src/auth/service.ts"], purpose: "Authentication flow." },
          { id: "db", name: "Database area", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [{ method: "GET", path: "/auth", file: "src/auth/controller.ts", handler: "getAuth", controller: "AuthController", line: 3 }],
        envVars: [],
        tests: [{ path: "src/auth/spec.ts", line: 2, testedFile: "src/auth/controller.ts" }]
      },
      summaries: {
        modules: {
          "src-auth": { provider: "ai", content: "Module summary. This module exposes auth behavior.", sources: ["src/auth/controller.ts"] }
        },
        areas: {
          auth: { provider: "ai", content: "Area summary. This area keeps auth behavior together.", sources: ["src/auth/controller.ts"] },
          db: { provider: "ai", content: "Database area summary. This area keeps db behavior together.", sources: ["src/db/index.ts"] }
        }
      }
    };

    const doc = generateModuleFlowDoc(scan, scan.graph.modules[0]!);
    expect(doc).toContain("# auth Flow");
    expect(doc).toContain("## Entry Points");
    expect(doc).toContain("## Entry Files");
    expect(doc).toContain("src/auth/controller.ts:3");
    expect(doc).toContain("AuthController");
    expect(doc).toContain("## Module Connections");
    expect(doc).toContain("auth (src/auth) → db (src/db)");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("test/auth.integration.ts");
    expect(doc).toContain("Authentication flow.");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("## Related Tests");
    expect(doc).toContain("src/auth/spec.ts:2");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run: `npm run build`");
    expect(doc).toContain("Run: `npm run test`");
  });
});

describe("generateAreaDoc", () => {
  it("renders area-level modules and flows", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["../db"], exports: ["getAuth"], symbols: [{ name: "getAuth", kind: "function", exported: true, line: 4 }] },
          { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
          { path: "src/db/index.ts", language: "TypeScript", size: 1, hash: "db", imports: [], exports: ["db"], symbols: [] },
          { path: "test/auth.test.ts", language: "TypeScript", size: 1, hash: "test", imports: ["../src/auth/controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/auth/controller.ts", to: "src/db/index.ts", type: "import" },
          { from: "test/auth.test.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] },
          { id: "src-db", name: "db", rootPath: "src/db", files: ["src/db/index.ts"] }
        ],
        areas: [
          { id: "orchestration:src-auth", name: "Operations and entry points: auth", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/controller.ts", "src/auth/service.ts"], purpose: "Authentication flow." },
          { id: "support:src-db", name: "Shared support: db", modules: ["src-db"], rootPaths: ["src/db"], files: ["src/db/index.ts"], purpose: "Database layer." }
        ],
        routes: [{ method: "GET", path: "/auth", file: "src/auth/controller.ts", handler: "getAuth", controller: "AuthController", line: 3 }],
        envVars: [],
        tests: [{ path: "test/auth.test.ts", line: 2, testedFile: "src/auth/controller.ts" }]
      },
      summaries: {
        areas: {
          "orchestration:src-auth": {
            provider: "ai",
            content: "Area summary.",
            sources: ["src/auth/controller.ts"]
          }
        }
      }
    };

    const area = scan.graph.areas[0]!;
    const doc = generateAreaDoc(scan, area);
    expect(doc).toContain("# Operations and entry points: auth");
    expect(doc).toContain("Area summary.");
    expect(doc).toContain("## Modules");
    expect(doc).toContain("[auth (src/auth)](../modules/src-auth.md)");
    expect(doc).toContain("## Module Connections");
    expect(doc).toContain("## Entry Files");
    expect(doc).toContain("src/auth/controller.ts:4");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("test/auth.test.ts");
    expect(doc).toContain("src/auth/controller.ts");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("evidence:");
    expect(doc).toContain("## Flows In");
    expect(doc).toContain("## Flows Out");
    expect(doc).toContain("## Change Guidance");
    expect(doc).toContain("## Verification");
    expect(doc).toContain("Run the project build");
    expect(doc).toContain("## Related Tests");
    expect(doc).toContain("test/auth.test.ts:2");
    expect(doc).toContain("## Related Routes");
    expect(doc).toContain("GET /auth");
  });
});

describe("generateAreasIndexDoc", () => {
  it("renders an area overview and flow map", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [],
        imports: [],
        modules: [],
        areas: [
          { id: "docs", name: "Presentation and output: docs", modules: ["src-docs"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts"], purpose: "Wiki writers." },
          { id: "cli", name: "Operations and entry points: cli", modules: ["src-cli"], rootPaths: ["src/cli.ts"], files: ["src/cli.ts"], purpose: "CLI entry points." },
        ],
        routes: [],
        envVars: [],
        tests: []
      },
      summaries: {
        areas: {
          cli: { provider: "ai", content: "CLI area summary. This area handles entry points and command dispatch.", sources: ["src/cli.ts"] },
          docs: { provider: "ai", content: "Docs area summary. This area writes the wiki and supporting docs.", sources: ["src/docs/writeDocs.ts"] }
        }
      }
    };

    const doc = generateAreasIndexDoc(scan);
    expect(doc).toContain("# Areas");
    expect(doc).toContain("## Where To Start");
    expect(doc).toContain("[Change operations, scripts, or entry behavior](./cli.md)");
    expect(doc).toContain("CLI entry points.");
    expect(doc).toContain("[Repo wiki index](../index.md)");
    expect(doc).toContain("[Flow overview](../flows/index.md)");
    expect(doc).toContain("## Area Summaries");
    expect(doc.indexOf("CLI area summary.")).toBeLessThan(doc.indexOf("Docs area summary."));
    expect(doc.indexOf("[Operations and entry points: cli](./cli.md)")).toBeLessThan(doc.indexOf("[Presentation and output: docs](./docs.md)"));
    expect(doc).toContain("[Operations and entry points: cli](./cli.md)");
    expect(doc).toContain("[Presentation and output: docs](./docs.md)");
    expect(doc).toContain("## Area Flows");
  });
});

describe("generateAgentContextDoc", () => {
  it("renders change targets for the project", () => {
    const scan: RepoScan = {
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: { build: "tsc", dev: "tsx src/cli.ts", test: "vitest run" },
        dependencies: [],
        devDependencies: [],
        configFiles: ["package.json"],
        cliOptions: ["--root", "--verbose", "--ai"],
        cliCommands: ["generate", "synthesize", "update", "check", "review"]
      },
      graph: {
        files: [
          { path: "package.json", language: "JSON", size: 1, hash: "pkg", imports: [], exports: [], symbols: [] },
          { path: "src/index.ts", language: "TypeScript", size: 1, hash: "src", imports: [], exports: [], symbols: [] }
        ],
        imports: [],
        modules: [{ id: "src", name: "src", rootPath: "src", files: ["src/index.ts"] }],
        areas: [{ id: "cli", name: "Operations and entry points: cli", modules: ["src"], rootPaths: ["src"], files: ["src/index.ts"], purpose: "CLI entry points." }],
        routes: [],
        envVars: [],
        tests: []
      },
      summaries: {
        areas: {
          cli: { provider: "ai", content: "CLI area summary. This area handles entry points and command dispatch.", sources: ["src/index.ts"] }
        }
      }
    };

    const doc = generateAgentContextDoc(scan);
    expect(doc).toContain("## Change Targets");
    expect(doc).toContain("package.json");
    expect(doc).toContain("docs/repo-wiki/flows/index.md");
    expect(doc).toContain("docs/repo-wiki/areas/index.md");
    expect(doc).toContain("## Area Summaries");
    expect(doc).toContain("## Useful Commands");
    expect(doc).toContain("`npm install`");
    expect(doc).toContain("`npm run build`");
    expect(doc).toContain("`npm run dev`");
    expect(doc).toContain("`npm run test`");
    expect(doc).toContain("## Important Entry Files");
    expect(doc).toContain("## Runtime Consumers");
    expect(doc).toContain("## Test Consumers");
    expect(doc).toContain("## Common Change Paths");
    expect(doc).toContain("## Area Summaries");
    expect(doc).toContain("CLI area summary.");
    expect(doc).toContain("## RepoWiki Commands");
    expect(doc).toContain("`repowiki generate`");
    expect(doc).toContain("`repowiki synthesize`");
    expect(doc).toContain("`repowiki update`");
    expect(doc).toContain("`repowiki check`");
    expect(doc).toContain("## RepoWiki Flags");
    expect(doc).toContain("`--root`");
    expect(doc).toContain("`--verbose`");
    expect(doc).toContain("`--ai`");
  });
});
