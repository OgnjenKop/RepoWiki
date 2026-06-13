import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { routeContextFileName } from "../src/ai/contextPacks.js";
import { scanRepo } from "../src/scanner/scanRepo.js";
import { writeMetadata } from "../src/storage/metadataStore.js";

describe("metadata artifacts", () => {
  it("writes knowledge and summaries metadata", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-meta-"));
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ name: "artifact-fixture" }));
    await fs.mkdir(path.join(root, "src/auth"), { recursive: true });
    await fs.writeFile(path.join(root, "src/auth/index.ts"), "export const value = 1;");
    await fs.writeFile(path.join(root, "src/server.ts"), "server.get('/health', handler);\n");
    const scan = await scanRepo(root);
    await writeMetadata(scan);

    const knowledge = JSON.parse(await fs.readFile(path.join(root, ".repowiki/knowledge.json"), "utf8")) as { items: unknown[] };
    const summaries = JSON.parse(await fs.readFile(path.join(root, ".repowiki/summaries.json"), "utf8")) as { project?: unknown; modules?: object; routes?: object };
    const index = JSON.parse(await fs.readFile(path.join(root, ".repowiki/index.json"), "utf8")) as {
      docs?: string[];
      areaFiles?: Record<string, string[]>;
      areaContextFiles?: Record<string, string>;
      moduleContextFiles?: Record<string, string>;
      routeContextFiles?: Record<string, string>;
    };
    const contextProject = JSON.parse(await fs.readFile(path.join(root, ".repowiki/context/project.json"), "utf8")) as { scope: string };
    const contextModule = JSON.parse(await fs.readFile(path.join(root, ".repowiki/context/modules/src-auth.json"), "utf8")) as { scope: string };
    const contextRoute = JSON.parse(await fs.readFile(path.join(root, ".repowiki/context/routes", routeContextFileName({ file: "src/server.ts", method: "GET", path: "/health" })), "utf8")) as { scope: string };
    expect(knowledge.items.length).toBeGreaterThan(0);
    expect(summaries.project).toBeDefined();
    expect(summaries.routes).toBeDefined();
    expect(index.docs?.some((entry) => entry === "docs/repo-wiki/codex-review.md")).toBe(true);
    expect(index.docs?.some((entry) => entry === "docs/repo-wiki/quality.md")).toBe(true);
    expect(index.docs?.some((entry) => entry === "docs/repo-wiki/areas/index.md")).toBe(true);
    expect(index.docs?.some((entry) => entry.includes("/areas/"))).toBe(true);
    expect(index.areaFiles).toBeDefined();
    expect(index.areaContextFiles).toBeDefined();
    expect(index.moduleContextFiles?.["src-auth"]).toBe("modules/src-auth.json");
    expect(index.routeContextFiles?.["src/server.ts:GET:/health"]).toContain("routes/");
    expect(contextProject.scope).toBe("project");
    expect(contextModule.scope).toBe("module");
    expect(contextRoute.scope).toBe("route");
  });
});
