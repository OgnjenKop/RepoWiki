import { describe, expect, it } from "vitest";
import type { FileRecord } from "../src/types/index.js";
import { detectModules } from "../src/scanner/detectModules.js";

const file = (path: string): FileRecord => ({
  path,
  language: "TypeScript",
  size: 10,
  hash: path,
  imports: [],
  exports: [],
  symbols: []
});

describe("detectModules", () => {
  it("detects top-level src modules", () => {
    const modules = detectModules([file("src/auth/service.ts"), file("src/billing/index.ts")]);
    expect(modules.map((module) => module.name)).toEqual(["auth", "billing"]);
    expect(modules.map((module) => module.id)).toEqual(["src-auth", "src-billing"]);
  });

  it("infers module purpose from repository files", () => {
    const modules = detectModules([
      file("src/ai/contextPacks.ts"),
      file("src/docs/generateFlowDocs.ts"),
      file("src/scanner/scanRepo.ts")
    ]);
    expect(modules.find((module) => module.name === "ai")?.purpose).toContain("AI summaries and context packs");
    expect(modules.find((module) => module.name === "docs")?.purpose).toContain("wiki pages, flow docs, and AGENTS.md instructions");
    expect(modules.find((module) => module.name === "scanner")?.purpose).toContain("scans files");
  });

  it("prefers module names over file names for shared utility folders", () => {
    const modules = detectModules([
      {
        ...file("src/utils/markdown.ts"),
        exports: ["code", "heading", "list", "pluralize"],
        symbols: [
          { name: "code", kind: "function", exported: true },
          { name: "heading", kind: "function", exported: true },
          { name: "list", kind: "function", exported: true },
          { name: "pluralize", kind: "function", exported: true }
        ]
      },
      {
        ...file("src/utils/fs.ts"),
        exports: ["pathExists", "readJson", "writeJson", "writeText"],
        symbols: [
          { name: "pathExists", kind: "function", exported: true },
          { name: "readJson", kind: "function", exported: true },
          { name: "writeJson", kind: "function", exported: true },
          { name: "writeText", kind: "function", exported: true }
        ]
      },
      {
        ...file("src/utils/hashing.ts"),
        exports: ["hashContent"],
        symbols: [{ name: "hashContent", kind: "function", exported: true }]
      }
    ]);
    expect(modules).toHaveLength(1);
    expect(modules[0]?.name).toBe("utils");
    expect(modules[0]?.purpose).toContain("filesystem, hashing, markdown, and path helpers");
  });

  it("uses exported symbols to infer shared module purpose", () => {
    const modules = detectModules([
      {
        ...file("src/storage/metadataStore.ts"),
        exports: ["loadHashes", "writeMetadata", "diffHashes"],
        symbols: [
          { name: "loadHashes", kind: "function", exported: true },
          { name: "writeMetadata", kind: "function", exported: true },
          { name: "diffHashes", kind: "function", exported: true }
        ]
      },
      {
        ...file("src/types/index.ts"),
        exports: ["FileRecord", "CodeGraph", "RepoKnowledge"],
        symbols: [
          { name: "FileRecord", kind: "type", exported: true },
          { name: "CodeGraph", kind: "type", exported: true },
          { name: "RepoKnowledge", kind: "type", exported: true }
        ]
      }
    ]);
    expect(modules.find((module) => module.name === "storage")?.purpose).toContain("persistence, metadata, cached state, or storage-backed records");
    expect(modules.find((module) => module.name === "types")?.purpose).toContain("records for files, graphs, summaries, tests, and change targets");
  });

  it("ignores non-exported local symbols when inferring module purpose", () => {
    const modules = detectModules([
      {
        ...file("src/commands/generate.ts"),
        exports: ["generateCommand"],
        symbols: [
          { name: "generateCommand", kind: "function", exported: true },
          { name: "docs", kind: "constant", exported: false }
        ]
      },
      {
        ...file("src/commands/update.ts"),
        exports: ["updateCommand"],
        symbols: [
          { name: "updateCommand", kind: "function", exported: true },
          { name: "docs", kind: "constant", exported: false }
        ]
      }
    ]);
    expect(modules.find((module) => module.name === "commands")?.purpose).toContain("CLI command entry points");
    expect(modules.find((module) => module.name === "commands")?.purpose).not.toContain("documentation");
  });

  it("creates project fallback", () => {
    const modules = detectModules([file("index.ts")]);
    expect(modules[0].name).toBe("project");
    expect(modules[0].id).toBe("project");
  });

  it("detects root-level app, pages, and standalone source modules", () => {
    const modules = detectModules([file("app/page.tsx"), file("pages/index.tsx"), file("src/cli.ts")]);
    expect(modules.map((module) => module.name)).toEqual(["app", "cli", "pages"]);
    expect(modules.map((module) => module.id)).toEqual(["app", "src-cli", "pages"]);
    expect(modules.find((module) => module.name === "app")?.purpose).toContain("route segments, layout files, and application entry points");
    expect(modules.find((module) => module.name === "pages")?.purpose).toContain("page routes and API route entry points");
    expect(modules.find((module) => module.name === "cli")?.rootPath).toBe("src/cli.ts");
  });

  it("detects nested feature modules under common namespace folders", () => {
    const modules = detectModules([
      file("src/features/auth/index.ts"),
      file("src/features/auth/service.ts"),
      file("src/components/button/Button.tsx"),
      file("src/components/button/index.ts")
    ]);
    expect(modules.map((module) => module.rootPath).sort()).toEqual(["src/components/button", "src/features/auth"]);
    expect(modules.find((module) => module.rootPath === "src/features/auth")?.name).toBe("auth");
    expect(modules.find((module) => module.rootPath === "src/components/button")?.name).toBe("button");
    expect(modules.find((module) => module.rootPath === "src/features/auth")?.id).toBe("src-features-auth");
    expect(modules.find((module) => module.rootPath === "src/components/button")?.id).toBe("src-components-button");
  });

  it("keeps module ids unique when names collide across roots", () => {
    const modules = detectModules([
      file("src/features/auth/index.ts"),
      file("src/components/auth/index.ts")
    ]);
    expect(modules.map((module) => module.name)).toEqual(["auth", "auth"]);
    expect(modules.map((module) => module.id)).toEqual(["src-features-auth", "src-components-auth"]);
  });

  it("detects workspace app roots and shared modules", () => {
    const modules = detectModules([
      file("mobile/App.tsx"),
      file("mobile/index.ts"),
      file("mobile/src/services/auth.ts"),
      file("mobile/src/ui/theme.ts"),
      file("shared/index.ts"),
      file("shared/services/scoring/calculate.ts"),
      file("website/src/main.tsx"),
      file("website/src/App.tsx")
    ]);

    expect(modules.map((module) => module.rootPath).sort()).toEqual([
      "mobile",
      "mobile/src/services",
      "mobile/src/ui",
      "shared",
      "shared/services/scoring",
      "website/src"
    ]);
    expect(modules.find((module) => module.rootPath === "mobile/src/services")?.name).toBe("mobile-services");
    expect(modules.find((module) => module.rootPath === "shared/services/scoring")?.name).toBe("shared-scoring");
    expect(modules.find((module) => module.rootPath === "website/src")?.name).toBe("website");
  });
});
