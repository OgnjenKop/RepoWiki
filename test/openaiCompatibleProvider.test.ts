import { describe, expect, it, vi } from "vitest";
import { OpenAICompatibleSummaryProvider } from "../src/ai/openaiCompatibleProvider.js";
import type { ContextPack } from "../src/ai/types.js";

const pack: ContextPack = {
  scope: "module",
  title: "auth",
  summaryHint: "Explain the auth module.",
  knowledge: [],
  relations: [],
  flows: [],
  verificationHints: [
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
  changeTargets: [],
  files: [
    {
      path: "src/auth/service.ts",
      language: "TypeScript",
      imports: [],
      exports: ["login"],
      symbols: [{ name: "login", kind: "function", exported: true, line: 1 }],
      snippet: "export function login() { return true; }"
    }
  ]
};

describe("OpenAICompatibleSummaryProvider", () => {
  it("extracts JSON from reasoning when content is empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "",
              reasoning: `{ "summary": "Auth handles login.", "responsibilities": ["Authenticate users."], "importantFiles": [{"path": "src/auth/service.ts", "reason": "login entrypoint", "evidence": ["src/auth/service.ts"]}], "executionFlow": ["Request enters."], "decisionPoints": ["Confirm ownership."], "commonChangePaths": [], "changeTargets": [], "changeRisks": [], "verificationSteps": [], "notesForAiAgents": [], "unknowns": [] }`
            }
          }
        ]
      })
    } as Response);

    try {
      const provider = new OpenAICompatibleSummaryProvider({
        baseUrl: "https://example.invalid/v1/",
        model: "gpt-5-mini",
        apiKey: "secret"
      });

      const markdown = await provider.summarize(pack);
      expect(markdown).toContain("Auth handles login.");
      expect(fetchSpy).toHaveBeenCalledOnce();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("extracts reasoning from arrays, objects, and alternative fields", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: ""
            },
            reasoning: [
              { text: `{ "summary": "Auth handles login.", "responsibilities": ["Authenticate users."],` },
              { text: `"importantFiles": [{"path": "src/auth/service.ts", "reason": "login entrypoint", "evidence": ["src/auth/service.ts"]}], "executionFlow": ["Request enters."], "decisionPoints": ["Confirm ownership."], "commonChangePaths": [], "changeTargets": [], "changeRisks": [], "verificationSteps": [], "notesForAiAgents": [], "unknowns": [] }` }
            ]
          }
        ]
      })
    } as Response);

    try {
      const provider = new OpenAICompatibleSummaryProvider({
        baseUrl: "https://example.invalid/v1/",
        model: "gpt-5-mini",
        apiKey: "secret"
      });

      const markdown = await provider.summarize(pack);
      expect(markdown).toContain("Auth handles login.");
      expect(fetchSpy).toHaveBeenCalledOnce();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("renders markdown from a valid response payload", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json
{
  "summary": "Auth handles login.",
  "responsibilities": ["Authenticate users."],
  "importantFiles": [{"path": "src/auth/service.ts", "reason": "login entrypoint", "evidence": ["src/auth/service.ts"]}],
  "executionFlow": ["Request enters the auth service."],
  "decisionPoints": ["Confirm controller vs service ownership."],
  "commonChangePaths": [{"task":"Change auth behavior","files":["src/auth/controller.ts","src/auth/service.ts"],"note":"Start in the controller and service.","evidence":["src/auth/controller.ts","src/auth/service.ts"]}],
  "changeTargets": [{"path": "src/auth/service.ts", "reason": "Core login logic.", "evidence": ["src/auth/service.ts"]}],
  "changeRisks": ["Changing login touches token issuance."],
  "verificationSteps": ["Run the auth tests."],
  "notesForAiAgents": ["Read the auth service before editing."]
}
\`\`\``
            }
          }
        ]
      })
    } as Response);

    try {
      const provider = new OpenAICompatibleSummaryProvider({
        baseUrl: "https://example.invalid/v1/",
        model: "gpt-5-mini",
        apiKey: "secret"
      });

      const markdown = await provider.summarize(pack);
      expect(markdown).toContain("# Summary");
      expect(markdown).toContain("Auth handles login.");
      expect(markdown).toContain("(evidence: src/auth/service.ts)");
      expect(markdown).toContain("Change auth behavior");
      expect(markdown).toContain("(evidence: `src/auth/controller.ts`, `src/auth/service.ts`)");
      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(fetchSpy.mock.calls[0]?.[0]).toBe("https://example.invalid/v1/chat/completions");
      const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1] && "body" in fetchSpy.mock.calls[0][1] ? (fetchSpy.mock.calls[0][1] as RequestInit).body : ""));
      expect(body.model).toBe("gpt-5-mini");
      expect(body.messages[0].content).toContain("evidence-grounded");
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
