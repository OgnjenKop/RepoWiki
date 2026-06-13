import { describe, expect, it } from "vitest";
import { stripComments, stripCommentsAndStrings } from "../src/utils/sourceText.js";

describe("sourceText", () => {
  it("strips comments while preserving strings", () => {
    const source = "const url = 'http://example.com'; // import x from 'x'";
    expect(stripComments(source)).toContain("'http://example.com'");
    expect(stripComments(source)).not.toContain("import x");
  });

  it("does not treat regex slashes as comments", () => {
    const source = "const pattern = /https?:\\/\\//;\nexport const real = true;";
    expect(stripComments(source)).toContain("export const real");
  });

  it("strips comments and strings for structural parsing", () => {
    const source = "const text = 'export const fake = true';\nexport const real = true;";
    expect(stripCommentsAndStrings(source)).not.toContain("fake");
    expect(stripCommentsAndStrings(source)).toContain("export const real");
  });
});
