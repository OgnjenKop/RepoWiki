import { describe, expect, it } from "vitest";
import { buildGraph } from "../src/graph/buildGraph.js";
import type { FileRecord } from "../src/types/index.js";

const file = (path: string, imports: string[] = []): FileRecord => ({
  path,
  language: "TypeScript",
  size: 1,
  hash: path,
  imports,
  exports: [],
  symbols: []
});

describe("buildGraph", () => {
  it("resolves tsconfig-style path aliases", () => {
    expect(buildGraph([
      file("src/app.ts", ["@lib/math"]),
      file("src/lib/math.ts")
    ], [{ pattern: "@lib/*", targets: ["src/lib/*"] }])).toEqual([
      { from: "src/app.ts", to: "src/lib/math.ts", type: "import" }
    ]);
  });

  it("resolves transpiled .js import specifiers back to source files", () => {
    expect(buildGraph([
      file("src/app.ts", ["./lib/math.js"]),
      file("src/lib/math.ts")
    ])).toEqual([
      { from: "src/app.ts", to: "src/lib/math.ts", type: "import" }
    ]);
  });
});
