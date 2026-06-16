import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cacheKeyFor,
  computePackHash,
  getCachedInsight,
  loadInsightCache,
  setCachedInsight,
  writeInsightCache
} from "../src/ai/insightCache.js";

const projectMessages = [
  { role: "system" as const, content: "system prompt" },
  { role: "user" as const, content: "user prompt" }
];

const archMessages = [
  { role: "system" as const, content: "arch system" },
  { role: "user" as const, content: "arch user" }
];

const moduleMessages = [
  { role: "system" as const, content: "module system" },
  { role: "user" as const, content: "module user" }
];

describe("ai insight cache", () => {
  it("computes cache keys from model and scope", () => {
    expect(cacheKeyFor("gpt-4", "project")).toBe("gpt-4::project");
    expect(cacheKeyFor("gpt-4", "architecture")).toBe("gpt-4::architecture");
    expect(cacheKeyFor("gpt-4", "module:src-auth")).toBe("gpt-4::module:src-auth");
  });

  it("computes pack hashes from prompt messages", () => {
    const projectHash = computePackHash(projectMessages);
    const archHash = computePackHash(archMessages);
    expect(typeof projectHash).toBe("string");
    expect(projectHash.length).toBeGreaterThan(0);
    expect(projectHash).not.toBe(archHash);
  });

  it("invalidates cache entries when the prompt messages change", () => {
    const cache = { version: 1 as const, model: "gpt-4", entries: {} };
    const hash = computePackHash(projectMessages);
    setCachedInsight(cache, "project", hash, "project content");

    expect(getCachedInsight(cache, "project", hash)).toBe("project content");

    const differentHash = computePackHash([...projectMessages, { role: "user" as const, content: "extra" }]);
    expect(getCachedInsight(cache, "project", differentHash)).toBeUndefined();
  });

  it("isolates entries by scope under the same model", () => {
    const cache = { version: 1 as const, model: "gpt-4", entries: {} };
    const projectHash = computePackHash(projectMessages);
    const archHash = computePackHash(archMessages);
    setCachedInsight(cache, "project", projectHash, "project content");
    setCachedInsight(cache, "architecture", archHash, "arch content");

    expect(getCachedInsight(cache, "project", projectHash)).toBe("project content");
    expect(getCachedInsight(cache, "architecture", archHash)).toBe("arch content");
    expect(getCachedInsight(cache, "module:src-app", projectHash)).toBeUndefined();
  });

  it("returns an empty cache when the loaded model differs", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-insight-"));
    const cache = await loadInsightCache(root, "gpt-4");
    setCachedInsight(cache, "project", computePackHash(projectMessages), "content");
    await writeInsightCache(root, cache);

    const sameModel = await loadInsightCache(root, "gpt-4");
    expect(sameModel.entries["gpt-4::project"]).toBeDefined();

    const differentModel = await loadInsightCache(root, "claude-3");
    expect(differentModel.entries).toEqual({});
    expect(differentModel.model).toBe("claude-3");
  });

  it("persists and loads the cache from disk", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-insight-"));
    const cache = await loadInsightCache(root, "gpt-4");
    const hash = computePackHash(moduleMessages);
    setCachedInsight(cache, "module:src-auth", hash, "module content");
    await writeInsightCache(root, cache);

    const loaded = await loadInsightCache(root, "gpt-4");
    expect(loaded.entries["gpt-4::module:src-auth"]).toEqual({
      content: "module content",
      packHash: hash,
      updatedAt: expect.any(String)
    });
  });
});
