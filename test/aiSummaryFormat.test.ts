import { describe, expect, it } from "vitest";
import { parseSummaryDraft, renderSummaryMarkdown, repairJson } from "../src/ai/summaryFormat.js";

describe("ai summary format", () => {
  it("parses fenced json drafts", () => {
    const draft = parseSummaryDraft(`\`\`\`json
{
  "summary": "Auth handles login.",
  "responsibilities": ["Authenticate users."],
  "importantFiles": [{"path": "src/auth/service.ts", "reason": "login entrypoint", "evidence": ["src/auth/service.ts"]}],
  "executionFlow": ["Request enters the auth service."],
  "decisionPoints": ["Confirm controller vs service ownership."],
  "commonChangePaths": [{"task":"Change auth behavior","files":["src/auth/controller.ts","src/auth/service.ts"],"note":"Start in the controller and service.","evidence":["src/auth/controller.ts","src/auth/service.ts"]}],
  "changeTargets": [{"path": "src/auth/controller.ts", "reason": "Route entry file.", "evidence": ["src/auth/controller.ts"]}],
  "changeRisks": ["Changing login touches token issuance."],
  "verificationSteps": ["Run the auth tests."],
  "notesForAiAgents": ["Read the auth service before editing."],
  "unknowns": ["External token format is not documented."]
}
\`\`\``);

    expect(draft.summary).toContain("Auth handles login");
    expect(draft.importantFiles[0]?.path).toBe("src/auth/service.ts");
    expect(draft.importantFiles[0]?.evidence).toEqual(["src/auth/service.ts"]);
    expect(draft.decisionPoints).toEqual(["Confirm controller vs service ownership."]);
    expect(draft.commonChangePaths).toEqual([{
      task: "Change auth behavior",
      files: ["src/auth/controller.ts", "src/auth/service.ts"],
      note: "Start in the controller and service.",
      evidence: ["src/auth/controller.ts", "src/auth/service.ts"]
    }]);
    expect(draft.changeTargets[0]?.path).toBe("src/auth/controller.ts");
    expect(draft.changeTargets[0]?.evidence).toEqual(["src/auth/controller.ts"]);
    expect(draft.verificationSteps).toEqual(["Run the auth tests."]);
    expect(draft.unknowns).toEqual(["External token format is not documented."]);
  });

  it("repairs unquoted object keys", () => {
    const repaired = repairJson('{ enabled: false, count: 1 }');
    expect(JSON.parse(repaired)).toEqual({ enabled: false, count: 1 });
  });

  it("repairs trailing commas", () => {
    const repaired = repairJson('{ "a": 1, "b": [1, 2,], }');
    expect(JSON.parse(repaired)).toEqual({ a: 1, b: [1, 2] });
  });

  it("repairs bare object keys by using the key as the value", () => {
    const repaired = repairJson('{ "path", "reason", "evidence" }');
    expect(JSON.parse(repaired)).toEqual({ path: "path", reason: "reason", evidence: "evidence" });
  });

  it("repairs single-quoted strings", () => {
    const repaired = repairJson("{ 'ok': true }");
    expect(JSON.parse(repaired)).toEqual({ ok: true });
  });

  it("repairs combined JSON malformations", () => {
    const repaired = repairJson('{ enabled: false, list: [1, 2,], }');
    expect(JSON.parse(repaired)).toEqual({ enabled: false, list: [1, 2] });
  });

  it("parses drafts with malformed JSON when repairable", () => {
    const draft = parseSummaryDraft(`\`\`\`json
{
  summary: "Auth handles login.",
  responsibilities: ["Authenticate users.",],
  importantFiles: [{path: "src/auth/service.ts", reason: "login entrypoint", evidence: ["src/auth/service.ts"]}],
  executionFlow: ["Request enters the auth service."],
  decisionPoints: ["Confirm controller vs service ownership."],
  commonChangePaths: [{task:"Change auth behavior","files":["src/auth/controller.ts"],note:"Start here.",evidence:["src/auth/controller.ts"]}],
  changeTargets: [{path: "src/auth/controller.ts", reason: "Route entry file.", evidence: ["src/auth/controller.ts"]}],
  changeRisks: ["Changing login touches token issuance."],
  verificationSteps: ["Run the auth tests."],
  notesForAiAgents: ["Read the auth service before editing."],
  unknowns: []
}
\`\`\``);

    expect(draft.summary).toContain("Auth handles login");
    expect(draft.importantFiles[0]?.path).toBe("src/auth/service.ts");
    expect(draft.changeTargets[0]?.path).toBe("src/auth/controller.ts");
    expect(draft.changeTargets[0]?.evidence).toEqual(["src/auth/controller.ts"]);
  });

  it("renders markdown from a parsed draft", () => {
    const markdown = renderSummaryMarkdown({
      summary: "Auth handles login.",
      responsibilities: ["Authenticate users."],
      importantFiles: [{ path: "src/auth/service.ts", reason: "login entrypoint", evidence: ["src/auth/service.ts"] }],
      executionFlow: ["Request enters the auth service."],
      decisionPoints: ["Confirm controller vs service ownership."],
      commonChangePaths: [{
        task: "Change auth behavior",
        files: ["src/auth/controller.ts", "src/auth/service.ts"],
        note: "Start in the controller and service.",
        evidence: ["src/auth/controller.ts", "src/auth/service.ts"]
      }],
      changeTargets: [{ path: "src/auth/controller.ts", reason: "Route entry file.", evidence: ["src/auth/controller.ts"] }],
      changeRisks: ["Changing login touches token issuance."],
      verificationSteps: ["Run the auth tests."],
      notesForAiAgents: ["Read the auth service before editing."]
    });

    expect(markdown).toContain("# Summary");
    expect(markdown).toContain("## Important Files");
    expect(markdown).toContain("src/auth/service.ts - login entrypoint");
    expect(markdown).toContain("(evidence: src/auth/service.ts)");
    expect(markdown).toContain("## Decision Points");
    expect(markdown).toContain("## Common Change Paths");
    expect(markdown).toContain("(evidence: `src/auth/controller.ts`, `src/auth/service.ts`)");
    expect(markdown).toContain("## Where To Change");
    expect(markdown).toContain("src/auth/controller.ts - Route entry file.");
    expect(markdown).toContain("(evidence: src/auth/controller.ts)");
    expect(markdown).toContain("## Verification Steps");
  });
});
