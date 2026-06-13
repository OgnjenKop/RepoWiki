import { describe, expect, it } from "vitest";
import type { FileRecord } from "../src/types/index.js";
import { detectTests } from "../src/scanner/detectTests.js";

const file = (path: string, imports: string[] = []): FileRecord => ({
  path,
  language: "TypeScript",
  size: 1,
  hash: path,
  imports,
  exports: [],
  symbols: []
});

describe("detectTests", () => {
  it("infers tested files from relative imports", () => {
    const tests = detectTests([
      file("src/docs/generateAgentsMd.ts"),
      file("test/agentsMd.test.ts", ["../src/docs/generateAgentsMd.js"])
    ], {
      "test/agentsMd.test.ts": "import '../src/docs/generateAgentsMd.js';\nexpect(true).toBe(true);"
    });

    expect(tests).toEqual([
      { path: "test/agentsMd.test.ts", line: 1, testedFile: "src/docs/generateAgentsMd.ts", testedFiles: ["src/docs/generateAgentsMd.ts"], coverageConfidence: "direct" }
    ]);
  });

  it("falls back to path heuristics when imports do not resolve", () => {
    const tests = detectTests([
      file("src/docs/generateAgentsMd.ts"),
      file("test/agentsMd.test.ts", ["vitest"])
    ]);

    expect(tests).toEqual([
      { path: "test/agentsMd.test.ts", testedFile: "src/agentsMd.ts", testedFiles: ["src/agentsMd.ts"], coverageConfidence: "fallback" }
    ]);
  });

  it("links cli end-to-end tests to the cli entrypoint", () => {
    const tests = detectTests([
      file("src/cli.ts"),
      file("test/cli.e2e.test.ts", ["node:child_process"])
    ], {
      "test/cli.e2e.test.ts": "const cliPath = path.resolve('dist/cli.js');\nawait execFileAsync('node', [cliPath, '--root', root, 'generate']);"
    });

    expect(tests).toEqual([
      { path: "test/cli.e2e.test.ts", line: undefined, testedFile: "src/cli.ts", testedFiles: ["src/cli.ts"], coverageConfidence: "inferred" }
    ]);
  });
});
