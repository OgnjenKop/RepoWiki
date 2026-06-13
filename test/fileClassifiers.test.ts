import { describe, expect, it } from "vitest";
import { isTestFile, shouldDetectEnvVars, shouldDetectRuntimeSignals } from "../src/scanner/fileClassifiers.js";

describe("fileClassifiers", () => {
  it("classifies test files", () => {
    expect(isTestFile("test/routes.test.ts")).toBe(true);
    expect(isTestFile("src/__tests__/routes.ts")).toBe(true);
    expect(isTestFile("src/routes.ts")).toBe(false);
  });

  it("allows runtime signals only from non-test code", () => {
    expect(shouldDetectRuntimeSignals("src/server.ts")).toBe(true);
    expect(shouldDetectRuntimeSignals("test/server.test.ts")).toBe(false);
    expect(shouldDetectRuntimeSignals("README.md")).toBe(false);
  });

  it("allows env vars from code and env files", () => {
    expect(shouldDetectEnvVars("src/config.ts")).toBe(true);
    expect(shouldDetectEnvVars(".env.example")).toBe(true);
    expect(shouldDetectEnvVars("test/config.test.ts")).toBe(false);
    expect(shouldDetectEnvVars("README.md")).toBe(false);
  });
});
