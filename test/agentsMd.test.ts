import { describe, expect, it } from "vitest";
import { mergeAgentsMd } from "../src/docs/generateAgentsMd.js";

describe("mergeAgentsMd", () => {
  it("replaces only content between markers", () => {
    const existing = `# Existing

Keep this.

<!-- REPOWIKI:START -->
old
<!-- REPOWIKI:END -->
`;
    const next = mergeAgentsMd(existing, `<!-- REPOWIKI:START -->
new
<!-- REPOWIKI:END -->`);
    expect(next).toContain("Keep this.");
    expect(next).toContain("new");
    expect(next).not.toContain("old");
  });
});

describe("generateAgentsSection", () => {
  it("includes the flow overview in the reading order", async () => {
    const { generateAgentsSection } = await import("../src/docs/generateAgentsMd.js");
    const section = generateAgentsSection({
      rootDir: "/tmp/project",
      project: {
        name: "fixture",
        type: "Node/TypeScript",
        packageManager: "npm",
        scripts: {},
        dependencies: [],
        devDependencies: [],
        configFiles: [],
        cliOptions: ["--root", "--verbose", "--ai"],
        cliCommands: ["generate", "synthesize", "update", "check", "review"]
      },
      graph: {
        files: [],
        imports: [],
        modules: [],
        areas: [
          { id: "docs", name: "Presentation and output: docs", modules: ["src-docs"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts"], purpose: "Wiki writers." },
          { id: "cli", name: "Operations and entry points: cli", modules: ["src-cli"], rootPaths: ["src/cli.ts"], files: ["src/cli.ts"], purpose: "CLI entry points." }
        ],
        routes: [],
        envVars: [],
        tests: []
      },
      summaries: {
        areas: {
          docs: { provider: "ai", content: "Docs area summary. This area writes the wiki and supporting docs.", sources: ["src/docs/writeDocs.ts"] },
          cli: { provider: "ai", content: "CLI area summary. This area handles entry points and command dispatch.", sources: ["src/cli.ts"] }
        }
      }
    });
    expect(section).toContain("docs/repo-wiki/flows/index.md");
    expect(section).toContain("docs/repo-wiki/areas/index.md");
    expect(section).toContain("docs/repo-wiki/quality.md");
    expect(section).toContain("docs/repo-wiki/codex-review.md");
    expect(section).toContain("## Area Docs");
    expect(section).toContain("## Area Summaries");
    expect(section.indexOf("CLI area summary.")).toBeLessThan(section.indexOf("Docs area summary."));
    expect(section.indexOf("Operations and entry points: cli")).toBeLessThan(section.indexOf("Presentation and output: docs"));
    expect(section).toContain("`npm install`");
    expect(section).toContain("## RepoWiki Commands");
    expect(section).toContain("`repowiki generate`");
    expect(section).toContain("`repowiki synthesize`");
    expect(section).toContain("`repowiki update`");
    expect(section).toContain("`repowiki check`");
    expect(section).toContain("`repowiki review`");
    expect(section).toContain("## RepoWiki Flags");
    expect(section).toContain("`--root`");
    expect(section).toContain("`--verbose`");
    expect(section).toContain("`--ai`");
  });
});
