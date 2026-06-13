import { describe, expect, it, vi } from "vitest";
import { buildRepoSummaries } from "../src/ai/buildSummaries.js";
import type { RepoScan } from "../src/types/index.js";

describe("buildRepoSummaries", () => {
  it("builds ai summaries for the project, modules, and routes when a provider is available", async () => {
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
          { path: "package.json", language: "JSON", size: 1, hash: "pkg", imports: [], exports: [], symbols: [] },
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [] },
          { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
          { path: "src/server.ts", language: "TypeScript", size: 1, hash: "server", imports: ["./auth/controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/server.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] }
        ],
        areas: [{ id: "area-auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/controller.ts", "src/auth/service.ts"], purpose: "Authentication flow." }],
        routes: [{ method: "GET", path: "/auth", file: "src/server.ts", handler: "getAuth" }],
        envVars: [],
        tests: [{ path: "test/auth.test.ts", testedFile: "src/auth/controller.ts", testedFiles: ["src/auth/controller.ts"] }]
      }
    };

    const projectResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Repo summary.",
  "responsibilities": ["Keep the repo understandable."],
  "importantFiles": [{"path": "package.json", "reason": "package metadata", "evidence": ["package.json"]}],
  "executionFlow": ["Source files feed the docs generator."],
  "decisionPoints": ["Update the wiki when behavior changes."],
  "commonChangePaths": [{"task":"Change UI, docs, or generated output","files":["src/docs/writeDocs.ts","src/ai/contextPacks.ts"],"note":"Start in user-facing presentation, docs, or output-generation modules.","evidence":["docs/repo-wiki/index.md","src/docs/writeDocs.ts","src/ai/contextPacks.ts"]}],
  "changeTargets": [{"path": "src/ai/contextPacks.ts", "reason": "Context selection.", "evidence": ["src/ai/contextPacks.ts"]}],
  "changeRisks": ["Changing tests can change module guidance."],
  "verificationSteps": ["Run the test suite."],
  "notesForAiAgents": ["Read the generated docs first."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const areaResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Area summary.",
  "responsibilities": ["Coordinate authentication files."],
  "importantFiles": [{"path": "src/auth/controller.ts", "reason": "area entry", "evidence": ["src/auth/controller.ts"]}],
  "executionFlow": ["Requests enter the controller and use the service."],
  "decisionPoints": ["Change the area when auth behavior changes."],
  "commonChangePaths": [{"task":"Change auth behavior","files":["src/auth/controller.ts","src/auth/service.ts"],"note":"Start in the controller and service.","evidence":["src/auth/controller.ts","src/auth/service.ts"]}],
  "changeTargets": [{"path": "src/auth/controller.ts", "reason": "Area entry.", "evidence": ["src/auth/controller.ts"]}],
  "changeRisks": ["Changing auth behavior can affect requests."],
  "verificationSteps": ["Run the project build.", "Run the area tests."],
  "notesForAiAgents": ["Read the area docs first."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const moduleResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Module summary.",
  "responsibilities": ["Expose auth behavior."],
  "importantFiles": [{"path": "src/auth/controller.ts", "reason": "module entry", "evidence": ["src/auth/controller.ts"]}],
  "executionFlow": ["Requests enter the controller and use the service."],
  "decisionPoints": ["Update the module when auth behavior changes."],
  "commonChangePaths": [{"task":"Change auth behavior","files":["src/auth/controller.ts","src/auth/service.ts"],"note":"Start in the controller and service.","evidence":["src/auth/controller.ts","src/auth/service.ts"]}],
  "changeTargets": [{"path": "src/auth/controller.ts", "reason": "Module entry.", "evidence": ["src/auth/controller.ts"]}],
  "changeRisks": ["Changing auth behavior can affect requests."],
  "verificationSteps": ["Inspect related tests."],
  "notesForAiAgents": ["Read the module docs first."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const routeResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Route summary.",
  "responsibilities": ["Handle incoming requests."],
  "importantFiles": [{"path": "src/server.ts", "reason": "route entry", "evidence": ["src/server.ts"]}],
  "executionFlow": ["Requests enter the server and reach the handler."],
  "decisionPoints": ["Change the route when the HTTP contract changes."],
  "commonChangePaths": [{"task":"Change route behavior","files":["src/server.ts"],"note":"Start in the route file and handler.","evidence":["src/server.ts"]}],
  "changeTargets": [{"path": "src/server.ts", "reason": "route handler.", "evidence": ["src/server.ts"]}],
  "changeRisks": ["Changing the route path is breaking."],
  "verificationSteps": ["Exercise the route."],
  "notesForAiAgents": ["Update route docs together with the handler."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(projectResponse)
      .mockResolvedValueOnce(areaResponse)
      .mockResolvedValueOnce(moduleResponse)
      .mockResolvedValueOnce(routeResponse);

    try {
      const summaries = await buildRepoSummaries({
        scan,
        options: {
          enabled: true,
          baseUrl: "https://example.invalid/v1",
          model: "gpt-5-mini",
          apiKey: "secret"
        }
      });

      expect(summaries.project?.provider).toBe("ai");
      expect(summaries.project?.content).toContain("# Summary");
      expect(summaries.project?.sources).toContain("package.json");
      expect(summaries.areas?.["area-auth"].provider).toBe("ai");
      expect(summaries.areas?.["area-auth"].content).toContain("Area summary.");
      expect(summaries.areas?.["area-auth"].content).toContain("Run the project build.");
      expect(summaries.modules["src-auth"].provider).toBe("ai");
      expect(summaries.modules["src-auth"].content).toContain("Module summary.");
      expect(summaries.modules["src-auth"].sources).toContain("src/auth/controller.ts");
      expect(summaries.routes?.["src/server.ts:GET:/auth"].provider).toBe("ai");
      expect(summaries.routes?.["src/server.ts:GET:/auth"].content).toContain("Route summary.");
      expect(fetchSpy).toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("falls back to deterministic summaries for only the packs that fail", async () => {
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
          { path: "package.json", language: "JSON", size: 1, hash: "pkg", imports: [], exports: [], symbols: [] },
          { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [] },
          { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
          { path: "src/server.ts", language: "TypeScript", size: 1, hash: "server", imports: ["./auth/controller"], exports: [], symbols: [] }
        ],
        imports: [
          { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
          { from: "src/server.ts", to: "src/auth/controller.ts", type: "import" }
        ],
        modules: [
          { id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] }
        ],
        areas: [{ id: "area-auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/controller.ts", "src/auth/service.ts"], purpose: "Authentication flow." }],
        routes: [{ method: "GET", path: "/auth", file: "src/server.ts", handler: "getAuth" }],
        envVars: [],
        tests: [{ path: "test/auth.test.ts", testedFile: "src/auth/controller.ts", testedFiles: ["src/auth/controller.ts"] }]
      }
    };

    const projectResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Repo summary.",
  "responsibilities": ["Keep the repo understandable."],
  "importantFiles": [{"path": "package.json", "reason": "package metadata", "evidence": ["package.json"]}],
  "executionFlow": ["Source files feed the docs generator."],
  "decisionPoints": ["Update the wiki when behavior changes."],
  "commonChangePaths": [{"task":"Change UI, docs, or generated output","files":["src/docs/writeDocs.ts","src/ai/contextPacks.ts"],"note":"Start in user-facing presentation, docs, or output-generation modules.","evidence":["docs/repo-wiki/index.md","src/docs/writeDocs.ts","src/ai/contextPacks.ts"]}],
  "changeTargets": [{"path": "src/ai/contextPacks.ts", "reason": "Context selection.", "evidence": ["src/ai/contextPacks.ts"]}],
  "changeRisks": ["Changing tests can change module guidance."],
  "verificationSteps": ["Run the test suite."],
  "notesForAiAgents": ["Read the generated docs first."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const areaResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Area summary.",
  "responsibilities": ["Coordinate authentication files."],
  "importantFiles": [{"path": "src/auth/controller.ts", "reason": "area entry", "evidence": ["src/auth/controller.ts"]}],
  "executionFlow": ["Requests enter the controller and use the service."],
  "decisionPoints": ["Change the area when auth behavior changes."],
  "commonChangePaths": [{"task":"Change auth behavior","files":["src/auth/controller.ts","src/auth/service.ts"],"note":"Start in the controller and service.","evidence":["src/auth/controller.ts","src/auth/service.ts"]}],
  "changeTargets": [{"path": "src/auth/controller.ts", "reason": "Area entry.", "evidence": ["src/auth/controller.ts"]}],
  "changeRisks": ["Changing auth behavior can affect requests."],
  "verificationSteps": ["Run the project build.", "Run the area tests."],
  "notesForAiAgents": ["Read the area docs first."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const routeResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Route summary.",
  "responsibilities": ["Handle incoming requests."],
  "importantFiles": [{"path": "src/server.ts", "reason": "route entry", "evidence": ["src/server.ts"]}],
  "executionFlow": ["Requests enter the server and reach the handler."],
  "decisionPoints": ["Change the route when the HTTP contract changes."],
  "commonChangePaths": [{"task":"Change route behavior","files":["src/server.ts"],"note":"Start in the route file and handler.","evidence":["src/server.ts"]}],
  "changeTargets": [{"path": "src/server.ts", "reason": "route handler.", "evidence": ["src/server.ts"]}],
  "changeRisks": ["Changing the route path is breaking."],
  "verificationSteps": ["Exercise the route."],
  "notesForAiAgents": ["Update route docs together with the handler."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response;
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(projectResponse)
      .mockResolvedValueOnce(areaResponse)
      .mockRejectedValueOnce(new Error("module pack failed"))
      .mockResolvedValueOnce(routeResponse);

    try {
      const summaries = await buildRepoSummaries({
        scan,
        options: {
          enabled: true,
          baseUrl: "https://example.invalid/v1",
          model: "gpt-5-mini",
          apiKey: "secret"
        }
      });

      expect(summaries.project?.provider).toBe("ai");
      expect(summaries.project?.content).toContain("Repo summary.");
      expect(summaries.areas?.["area-auth"].provider).toBe("ai");
      expect(summaries.areas?.["area-auth"].content).toContain("Area summary.");
      expect(summaries.areas?.["area-auth"].content).toContain("Verification Steps");
      expect(summaries.areas?.["area-auth"].content).toContain("Run the project build");
      expect(summaries.modules["src-auth"].provider).toBe("deterministic");
      expect(summaries.modules["src-auth"].content).toContain("Module rooted at src/auth");
      expect(summaries.routes?.["src/server.ts:GET:/auth"].provider).toBe("ai");
      expect(summaries.routes?.["src/server.ts:GET:/auth"].content).toContain("Route summary.");
      expect(fetchSpy).toHaveBeenCalledTimes(4);
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
