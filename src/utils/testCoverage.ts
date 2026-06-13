import type { TestRecord } from "../types/index.js";

export type TestCoverageConfidence = "direct" | "inferred" | "fallback";

export type CoverageLike = Pick<TestRecord, "coverageConfidence">;

export function testCoveragePrefix(test: CoverageLike): string {
  switch (test.coverageConfidence) {
    case "direct":
      return "covers";
    case "inferred":
      return "likely covers";
    case "fallback":
      return "may cover";
    default:
      return "covers";
  }
}

export function testCoverageLabel(test: CoverageLike): string {
  switch (test.coverageConfidence) {
    case "direct":
      return "direct";
    case "inferred":
      return "inferred";
    case "fallback":
      return "fallback";
    default:
      return "direct";
  }
}
