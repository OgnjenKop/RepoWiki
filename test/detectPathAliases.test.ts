import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { detectPathAliases } from "../src/scanner/detectPathAliases.js";

describe("detectPathAliases", () => {
  it("reads tsconfig compilerOptions paths", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-alias-"));
    await fs.writeFile(path.join(root, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@app/*": ["src/app/*"]
        }
      }
    }));
    expect(await detectPathAliases(root)).toEqual([{ pattern: "@app/*", targets: ["src/app/*"] }]);
  });

  it("handles comments in tsconfig", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-alias-"));
    await fs.writeFile(path.join(root, "tsconfig.json"), `{
      // TypeScript allows comments in config files.
      "compilerOptions": {
        "baseUrl": ".",
        "paths": { "@core/*": ["src/core/*"] }
      }
    }`);
    expect(await detectPathAliases(root)).toEqual([{ pattern: "@core/*", targets: ["src/core/*"] }]);
  });
});
