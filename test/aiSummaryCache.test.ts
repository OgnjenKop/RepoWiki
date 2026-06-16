import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cacheKey,
  computePackHash,
  getCachedSummary,
  loadSummaryCache,
  setCachedSummary,
  writeSummaryCache
} from "../src/ai/summaryCache.js";
import type { ContextPack } from "../src/ai/types.js";

const pack: ContextPack = {
  scope: "module",
  title: "auth",
  summaryHint: "Explain auth.",
  files: [
    {
      path: "src/auth/service.ts",
      language: "TypeScript",
      imports: [],
      exports: ["login"],
      symbols: [{ name: "login", kind: "function", exported: true, line: 1 }],
      snippet: "export function login() { return true; }"
    }
  ],
  knowledge: [],
  relations: [],
  flows: [],
  verificationHints: [],
  changePaths: [],
  changeTargets: []
};

describe("ai summary cache", () => {
  it("computes cache keys from model and pack scope", () => {
    expect(cacheKey("gpt-4", pack)).toBe("gpt-4:module:auth");
    const routePack: ContextPack = { ...pack, scope: "route", title: "GET /auth", files: [{ ...pack.files[0]!, path: "src/server.ts" }] };
    expect(cacheKey("gpt-4", routePack)).toBe("gpt-4:route:GET /auth:src/server.ts");
  });

  it("computes pack hashes from prompt messages", () => {
    const hash = computePackHash(pack);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("invalidates cache entries when the pack changes", () => {
    const cache = { version: 1 as const, entries: {} };
    setCachedSummary(cache, "gpt-4", pack, {
      provider: "ai",
      model: "gpt-4",
      content: "summary",
      sources: ["src/auth/service.ts"],
      updatedAt: "2024-01-01T00:00:00Z"
    });

    expect(getCachedSummary(cache, "gpt-4", pack)).toBeDefined();

    const changedPack = { ...pack, files: [...pack.files, { ...pack.files[0]!, snippet: "different" }] };
    expect(getCachedSummary(cache, "gpt-4", changedPack)).toBeUndefined();
  });

  it("persists and loads the cache from disk", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cache-"));
    const cache = await loadSummaryCache(root);
    setCachedSummary(cache, "gpt-4", pack, {
      provider: "ai",
      model: "gpt-4",
      content: "summary",
      sources: ["src/auth/service.ts"],
      updatedAt: "2024-01-01T00:00:00Z"
    });
    await writeSummaryCache(root, cache);

    const loaded = await loadSummaryCache(root);
    expect(loaded.entries["gpt-4:module:auth"]).toEqual({
      content: "summary",
      model: "gpt-4",
      sources: ["src/auth/service.ts"],
      packHash: computePackHash(pack),
      updatedAt: "2024-01-01T00:00:00Z"
    });
  });
});
