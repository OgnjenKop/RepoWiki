import { execFile } from "node:child_process";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { routeContextFileName } from "../src/ai/contextPacks.js";
import { areaDocFileName } from "../src/utils/docPaths.js";

const execFileAsync = promisify(execFile);
const cliPath = path.resolve("dist/cli.js");

describe("CLI end-to-end", () => {
  it("reports missing metadata before generation", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "src/index.ts"), "export const value = 1;\n");

    const result = spawnSync("node", [cliPath, "--root", root, "check"], { encoding: "utf8" });
    expect(result.status).toBe(1);
  });

  it("runs generate check update check", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-"));
    await fs.mkdir(path.join(root, "src/auth"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "fixture",
      scripts: { test: "vitest run" },
      devDependencies: { typescript: "latest" }
    }));
    await fs.writeFile(path.join(root, "src/auth/service.ts"), "export const token = 'a';\n");

    await execFileAsync("node", [cliPath, "--root", root, "generate"]);
    await execFileAsync("node", [cliPath, "--root", root, "check"]);

    await fs.appendFile(path.join(root, "src/auth/service.ts"), "export const changed = true;\n");

    await expect(execFileAsync("node", [cliPath, "--root", root, "check"])).rejects.toMatchObject({
      code: 1
    });

    await execFileAsync("node", [cliPath, "--root", root, "update"]);
    await execFileAsync("node", [cliPath, "--root", root, "check"]);
  }, 15000);

  it("generates a Codex model review prompt", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-review-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "review-fixture",
      scripts: { test: "vitest run" }
    }));
    await fs.writeFile(path.join(root, "src/index.ts"), "export const value = 1;\n");

    await execFileAsync("node", [cliPath, "--root", root, "review"]);

    const reviewPrompt = await fs.readFile(path.join(root, "docs/repo-wiki/codex-review.md"), "utf8");
    expect(reviewPrompt).toContain("Use this prompt with Codex or ChatGPT");
    expect(reviewPrompt).toContain(".repowiki/context/project.json");
    expect(reviewPrompt).toContain("Qoder-style documentation quality");
    expect(reviewPrompt).toContain("subscription-backed model review path");
  }, 15000);

  it("removes stale route context packs when route files are deleted", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-route-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "route-fixture",
      scripts: { test: "vitest run" }
    }));
    const routeFile = path.join(root, "src/server.ts");
    await fs.writeFile(routeFile, "server.get('/health', handler);\n");

    await execFileAsync("node", [cliPath, "--root", root, "generate"]);
    const routePack = path.join(root, ".repowiki/context/routes", routeContextFileName({ file: "src/server.ts", method: "GET", path: "/health" }));
    await fs.access(routePack);

    await fs.unlink(routeFile);
    await execFileAsync("node", [cliPath, "--root", root, "update"]);

    await expect(fs.access(routePack)).rejects.toMatchObject({ code: "ENOENT" });
    const index = JSON.parse(await fs.readFile(path.join(root, ".repowiki/index.json"), "utf8")) as { routeContextFiles?: Record<string, string> };
    expect(Object.keys(index.routeContextFiles ?? {})).toHaveLength(0);
  });

  it("refreshes module docs when a related test file is added", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-test-"));
    await fs.mkdir(path.join(root, "src/auth"), { recursive: true });
    await fs.mkdir(path.join(root, "test"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "test-fixture",
      scripts: { test: "vitest run" }
    }));
    await fs.writeFile(path.join(root, "src/auth/service.ts"), "export const login = () => true;\n");

    await execFileAsync("node", [cliPath, "--root", root, "generate"]);

    await fs.writeFile(path.join(root, "test/auth.test.ts"), "import { login } from '../src/auth/service.js';\n");
    await execFileAsync("node", [cliPath, "--root", root, "update"]);

    const moduleDoc = await fs.readFile(path.join(root, "docs/repo-wiki/modules/src-auth.md"), "utf8");
    expect(moduleDoc).toContain("## Related Tests");
    expect(moduleDoc).toContain("test/auth.test.ts");
  });

  it("removes stale area docs and context packs when an area is deleted", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-area-"));
    await fs.mkdir(path.join(root, "src/auth"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({
      name: "area-fixture",
      scripts: { test: "vitest run" }
    }));
    const areaFile = path.join(root, "src/auth/service.ts");
    await fs.writeFile(areaFile, "export const login = () => true;\n");

    await execFileAsync("node", [cliPath, "--root", root, "generate"]);

    const indexBefore = JSON.parse(await fs.readFile(path.join(root, ".repowiki/index.json"), "utf8")) as {
      areaContextFiles?: Record<string, string>;
    };
    const [areaId, areaContextRelPath] = Object.entries(indexBefore.areaContextFiles ?? {}).find(([candidate]) => candidate !== "orchestration:project") ?? [];
    expect(areaId).toBeDefined();
    expect(areaContextRelPath).toBeDefined();

    const areaDocPath = path.join(root, "docs/repo-wiki/areas", areaDocFileName(areaId!));
    await fs.access(areaDocPath);
    const areaContextPath = path.join(root, ".repowiki/context", areaContextRelPath!);
    await fs.access(areaContextPath);

    await fs.unlink(areaFile);
    await execFileAsync("node", [cliPath, "--root", root, "update"]);

    await expect(fs.access(areaDocPath)).rejects.toMatchObject({ code: "ENOENT" });
    await expect(fs.access(areaContextPath)).rejects.toMatchObject({ code: "ENOENT" });
    const indexAfter = JSON.parse(await fs.readFile(path.join(root, ".repowiki/index.json"), "utf8")) as {
      areaContextFiles?: Record<string, string>;
      areaFiles?: Record<string, string[]>;
    };
    expect(indexAfter.areaContextFiles?.[areaId!]).toBeUndefined();
    expect(indexAfter.areaFiles?.[areaId!]).toBeUndefined();
  });
});
