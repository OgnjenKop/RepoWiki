import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { diffHashes, fileModulesFromScan, hasChanges, hashesFromScan, loadHashes, loadIndex } from "../src/storage/metadataStore.js";

describe("metadataStore", () => {
  it("detects changed added and deleted files", () => {
    const changes = diffHashes({ "a.ts": "1", "b.ts": "2" }, { "a.ts": "3", "c.ts": "4" });
    expect(changes).toEqual({ changed: ["a.ts"], added: ["c.ts"], deleted: ["b.ts"] });
    expect(hasChanges(changes)).toBe(true);
  });

  it("reports no changes for matching hashes", () => {
    expect(hasChanges(diffHashes({ "a.ts": "1" }, { "a.ts": "1" }))).toBe(false);
  });

  it("creates hashes from scan records only", () => {
    const scan = {
      rootDir: "/tmp/project",
      project: {
        name: "project",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: {},
        dependencies: [],
        devDependencies: [],
        configFiles: []
      },
      graph: {
        files: [{ path: "src/index.ts", language: "TypeScript", size: 1, hash: "abc", imports: [], exports: [], symbols: [] }],
        imports: [],
        modules: [],
        areas: [],
        routes: [],
        envVars: [],
        tests: []
      }
    };
    expect(hashesFromScan(scan)).toEqual({ "src/index.ts": "abc" });
    expect(fileModulesFromScan({
      ...scan,
      graph: {
        ...scan.graph,
        modules: [{ id: "src", name: "core", rootPath: "src", files: ["src/index.ts"] }]
      }
    })).toEqual({ "src/index.ts": "src" });
  });

  it("treats corrupt metadata as missing instead of crashing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-metadata-"));
    await fs.mkdir(path.join(root, ".repowiki"), { recursive: true });
    await fs.writeFile(path.join(root, ".repowiki/file-hashes.json"), "{");
    await fs.writeFile(path.join(root, ".repowiki/index.json"), "{");

    expect(await loadHashes(root)).toEqual({});
    expect(await loadIndex(root)).toBeUndefined();
  });
});
