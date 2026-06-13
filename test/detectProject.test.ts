import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { detectPackageManager, detectProject, detectProjectType } from "../src/scanner/detectProject.js";

describe("detectProjectType", () => {
  it("detects Next.js", () => {
    expect(detectProjectType(new Set(["next", "react"]), ["app/page.tsx"])).toBe("Next.js");
  });

  it("detects TypeScript fallback", () => {
    expect(detectProjectType(new Set(), ["src/index.ts"])).toBe("Node/TypeScript");
  });

  it("detects package managers from lockfiles", () => {
    expect(detectPackageManager(["package.json", "pnpm-lock.yaml"])).toBe("pnpm");
    expect(detectPackageManager(["package.json", "yarn.lock"])).toBe("yarn");
    expect(detectPackageManager(["package.json", "package-lock.json"])).toBe("npm");
  });

  it("does not crash on malformed package.json", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-package-"));
    await fs.writeFile(path.join(root, "package.json"), "{");
    const project = await detectProject(root, ["package.json"]);
    expect(project.name).toBe(path.basename(root));
    expect(project.type).toBe("Node.js");
  });

  it("detects RepoWiki CLI flags and commands from src/cli.ts", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-cli-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ name: "cli-fixture" }));
    await fs.writeFile(path.join(root, "src/cli.ts"), `
      import { Command } from "commander";
      const program = new Command();
      program.option("-r, --root <path>", "repository root to scan");
      program.option("--verbose", "print verbose output");
      program.option("--ai", "enable AI-generated summaries");
      program.command("generate");
      program.command("synthesize");
      program.command("update");
      program.command("check");
      program.command("review");
    `);

    const project = await detectProject(root, ["package.json", "src/cli.ts"]);
    expect(project.cliOptions).toEqual(["--ai", "--root", "--verbose"]);
    expect(project.cliCommands).toEqual(["check", "generate", "review", "synthesize", "update"]);
  });
});
