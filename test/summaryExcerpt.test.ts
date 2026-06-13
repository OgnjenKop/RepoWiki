import { describe, expect, it } from "vitest";
import { summaryExcerpt } from "../src/utils/summaryExcerpt.js";

describe("summaryExcerpt", () => {
  it("extracts the first readable paragraph from sectioned markdown", () => {
    const value = `# Summary

Area summary.

## Responsibilities
- Keep auth behavior together.`;

    expect(summaryExcerpt(value)).toBe("Area summary.");
  });

  it("truncates long excerpts without leaving markdown headings", () => {
    const value = `This area coordinates several modules and handles command dispatch, repository scanning, and doc generation for the wiki experience. It also tracks verification and change guidance.`;

    expect(summaryExcerpt(value, 80)).toContain("This area coordinates several modules");
    expect(summaryExcerpt(value, 80)).toMatch(/…$/);
  });
});
