import { describe, expect, it } from "vitest";
import { detectEnvVars } from "../src/scanner/detectEnvVars.js";
import type { FileRecord } from "../src/types/index.js";

const file: FileRecord = {
  path: "src/config.ts",
  language: "TypeScript",
  size: 1,
  hash: "hash",
  imports: [],
  exports: [],
  symbols: []
};

describe("detectEnvVars", () => {
  it("detects dot and bracket process.env usage", () => {
    expect(detectEnvVars(file, "process.env.API_URL; process.env['SECRET_KEY'];")).toEqual([
      { name: "API_URL", sourceFile: "src/config.ts", line: 1 },
      { name: "SECRET_KEY", sourceFile: "src/config.ts", line: 1 }
    ]);
  });

  it("ignores env vars in comments", () => {
    expect(detectEnvVars(file, "// process.env.SECRET\nprocess.env.PUBLIC_VALUE;")).toEqual([
      { name: "PUBLIC_VALUE", sourceFile: "src/config.ts", line: 2 }
    ]);
  });
});
