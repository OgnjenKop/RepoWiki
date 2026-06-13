import { describe, expect, it } from "vitest";
import { buildSummaryMessages } from "../src/ai/prompt.js";
import type { ContextPack } from "../src/ai/types.js";

const pack: ContextPack = {
  scope: "module",
  title: "auth",
  summaryHint: "Explain the auth module.",
  knowledge: [
    {
      id: "module:auth",
      kind: "module",
      title: "auth",
      files: ["src/auth/service.ts"],
      summary: "Auth handles login.",
      evidence: [
        {
          file: "src/auth/service.ts",
          reason: "exports login",
          lines: [1, 12]
        }
      ]
    }
  ],
  relations: [
    {
      title: "Importers",
      files: ["src/auth/controller.ts"],
      note: "Files outside the module that import from it."
    }
  ],
  flows: [
    {
      title: "Request handling path",
      files: ["src/auth/controller.ts", "src/auth/service.ts"],
      note: "Auth request path.",
      steps: ["Start at the controller.", "Continue into the service."]
    }
  ],
  verificationHints: [
    {
      task: "Inspect related tests",
      files: ["test/auth.test.ts"],
      note: "These tests show the expected module behavior.",
      evidence: ["test/auth.test.ts"]
    },
    {
      task: "Run the repository test command",
      files: ["package.json"],
      note: "Use the project test script after editing the module.",
      evidence: ["package.json"],
      command: "npm run test"
    }
  ],
  changePaths: [
    {
      task: "Change auth behavior",
      files: ["src/auth/controller.ts", "src/auth/service.ts"],
      note: "Start in the controller and service.",
      evidence: ["src/auth/controller.ts", "src/auth/service.ts"]
    }
  ],
  changeTargets: [
    {
      path: "src/auth/controller.ts",
      reason: "Route entry file.",
      caution: "This is part of the route's owning module."
    }
  ],
  files: [
    {
      path: "src/auth/service.ts",
      language: "TypeScript",
      imports: ["./tokens"],
      exports: ["login"],
      symbols: [{ name: "login", kind: "function", exported: true, line: 1 }],
      snippet: "export function login() {\n  return true;\n}"
    }
  ]
};

describe("ai prompt", () => {
  it("builds a grounded evidence prompt for summaries", () => {
    const messages = buildSummaryMessages(pack);
    expect(messages).toHaveLength(2);
    expect(messages[0]?.content).toContain("Qoder-style repository wiki content");
    expect(messages[0]?.content).toContain("safe first change");
    expect(messages[0]?.content).toContain("Prefer specific architecture");
    expect(messages[0]?.content).toContain("Do not say a module \"likely\"");
    expect(messages[0]?.content).toContain("Return a single JSON object");
    expect(messages[1]?.content).toContain("Documentation Goal");
    expect(messages[1]?.content).toContain("high-quality Qoder RepoWiki page");
    expect(messages[1]?.content).toContain("Scope-Specific Instructions");
    expect(messages[1]?.content).toContain("public surface");
    expect(messages[1]?.content).toContain("Field Quality Requirements");
    expect(messages[1]?.content).toContain("summary: 2-4 sentences");
    expect(messages[1]?.content).toContain("Required Output Shape");
    expect(messages[1]?.content).toContain("Knowledge Items");
    expect(messages[1]?.content).toContain("Relations");
    expect(messages[1]?.content).toContain("Flows");
    expect(messages[1]?.content).toContain("Verification Hints");
    expect(messages[1]?.content).toContain("Common Change Paths");
    expect(messages[1]?.content).toContain("Change Targets");
    expect(messages[1]?.content).toContain('"commonChangePaths"');
    expect(messages[1]?.content).toContain('"task": "string"');
    expect(messages[1]?.content).toContain("(evidence: `src/auth/controller.ts`, `src/auth/service.ts`)");
    expect(messages[1]?.content).toContain("verificationSteps");
    expect(messages[1]?.content).toContain("decisionPoints");
    expect(messages[1]?.content).toContain('"evidence": ["string"]');
    expect(messages[1]?.content).toContain("Use exact file paths from the evidence pack");
    expect(messages[1]?.content).toContain("verificationSteps must reference provided commands");
    expect(messages[1]?.content).toContain("src/auth/service.ts");
    expect(messages[1]?.content).toContain("function:login (exported) @ src/auth/service.ts:1");
    expect(messages[1]?.content).toContain("exports login");
    expect(messages[1]?.content).toContain("Summary: Auth handles login.");
    expect(messages[1]?.content).toContain('"importantFiles"');
    expect(messages[1]?.content).toContain("Run the repository test command");
  });
});
